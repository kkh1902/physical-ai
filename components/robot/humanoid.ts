import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type PartId = "head" | "torso" | "arms" | "pelvis" | "legs";
type Point = [number, number, number];
type Finish = "shell" | "frame" | "steel" | "orange" | "glass" | "light";

/** An original study model. Shapes illustrate assemblies, not manufacturing CAD. */
export function createHumanoid() {
  const root = new THREE.Group();
  const selectable: THREE.Mesh[] = [];
  const assemblies: { group: THREE.Group; offset: THREE.Vector3 }[] = [];
  const finishes: Record<PartId, Record<Finish, THREE.MeshStandardMaterial>> = {} as Record<PartId, Record<Finish, THREE.MeshStandardMaterial>>;
  const geometries = new Map<string, THREE.BufferGeometry>();
  const ids: PartId[] = ["head", "torso", "arms", "pelvis", "legs"];
  for (const id of ids) {
    finishes[id] = {
      shell: new THREE.MeshStandardMaterial({ color: 0xc9c8c3, metalness: .12, roughness: .62 }),
      frame: new THREE.MeshStandardMaterial({ color: 0x303238, metalness: .05, roughness: .78 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x809398, metalness: .9, roughness: .22 }),
      orange: new THREE.MeshStandardMaterial({ color: 0x555b65, metalness: .45, roughness: .32 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x101216, metalness: .28, roughness: .16 }),
      light: new THREE.MeshStandardMaterial({ color: 0x9edfe8, emissive: 0x49b7d0, emissiveIntensity: 1.3, metalness: .3, roughness: .19 }),
    };
  }
  const cached = (key: string, build: () => THREE.BufferGeometry) => {
    if (!geometries.has(key)) geometries.set(key, build());
    return geometries.get(key)!;
  };
  function assembly(id: PartId, offset: Point) {
    const group = new THREE.Group();
    group.userData.part = id;
    root.add(group);
    assemblies.push({ group, offset: new THREE.Vector3(...offset) });
    return group;
  }
  function mesh(group: THREE.Group, geometry: THREE.BufferGeometry, point: Point, finish: Finish) {
    const part = group.userData.part as PartId;
    const object = new THREE.Mesh(geometry, finishes[part][finish]);
    object.position.set(...point);
    object.userData.part = part;
    group.add(object);
    selectable.push(object);
    return object;
  }
  function oval(group: THREE.Group, size: Point, point: Point, finish: Finish = "shell") {
    const object = mesh(group, cached("smooth-sphere", () => new THREE.SphereGeometry(1, 32, 24)), point, finish);
    object.scale.set(...size);
    return object;
  }
  function contour(group: THREE.Group, profile: Point[], point: Point, depth: number, finish: Finish = "shell") {
    const curve = new THREE.CatmullRomCurve3(profile.map(p => new THREE.Vector3(...p)));
    const points = curve.getPoints(36).map(p => new THREE.Vector2(Math.max(0, p.x), p.y));
    const object = mesh(group, new THREE.LatheGeometry(points, 40), point, finish);
    object.scale.z = depth;
    return object;
  }
  function finger(group: THREE.Group, a: Point, b: Point, radius: number) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const object = mesh(group, new THREE.CapsuleGeometry(radius, start.distanceTo(end), 4, 10), start.clone().add(end).multiplyScalar(.5).toArray() as Point, "frame");
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), end.sub(start).normalize());
  }
  const head = assembly("head", [0,.8,0]);
  oval(head, [.13,.22,.13], [0,1.77,0], "frame");
  oval(head, [.285,.37,.255], [0,2.13,0]);
  oval(head, [.254,.285,.135], [0,2.14,.173], "glass");
  oval(head, [.04,.009,.008], [0,1.965,.285], "steel");
  const torso = assembly("torso", [0,.2,0]);
  contour(torso, [[0,.54,0],[.29,.57,0],[.34,.78,0],[.44,1.1,0],[.49,1.4,0],[.43,1.6,0],[.25,1.73,0],[0,1.75,0]], [0,0,0], .62);
  oval(torso, [.19,.035,.16], [0,1.74,0], "frame");
  contour(torso, [[0,.34,0],[.26,.35,0],[.30,.45,0],[.29,.64,0],[0,.66,0]], [0,0,0], .7, "frame");
  oval(torso, [.045,.045,.008], [0,1.4,.295], "steel");
  const pelvis = assembly("pelvis", [0,-.13,0]);
  contour(pelvis, [[0,-.14,0],[.27,-.1,0],[.37,.09,0],[.36,.29,0],[.28,.42,0],[0,.43,0]], [0,0,-.01], .68);
  for (const side of [-1,1]) {
    const arm = assembly("arms", [side*.7,.12,.1]);
    oval(arm, [.22,.245,.22], [side*.57,1.46,0]);
    const upper = contour(arm, [[0,-.36,0],[.12,-.33,0],[.15,-.1,0],[.18,.19,0],[.14,.34,0],[0,.36,0]], [side*.65,1.05,0], .92);
    upper.rotation.z = side*.13;
    oval(arm, [.12,.12,.13], [side*.70,.66,.01], "frame");
    const lower = contour(arm, [[0,-.33,0],[.085,-.31,0],[.11,-.1,0],[.15,.14,0],[.12,.3,0],[0,.33,0]], [side*.72,.29,.035], .9);
    lower.rotation.z = side*.035;
    oval(arm, [.075,.09,.07], [side*.73,-.065,.045], "frame");
    oval(arm, [.105,.15,.065], [side*.73,-.23,.06], "frame");
    for (let i=0;i<4;i++) {
      const x=side*.73+(i-1.5)*.049;
      const length=[.14,.19,.175,.13][i];
      finger(arm,[x,-.34,.065],[x,-.34-length*.6,.08],.023);
      finger(arm,[x,-.34-length*.6,.08],[x,-.34-length,.13],.021);
    }
    finger(arm,[side*.63,-.2,.08],[side*.58,-.31,.13],.03);
    finger(arm,[side*.58,-.31,.13],[side*.61,-.38,.16],.025);
    const leg = assembly("legs", [side*.27,-.58,-.08]);
    const x=side*.245;
    contour(leg, [[0,-.9,0],[.135,-.86,0],[.18,-.64,0],[.205,-.3,0],[.18,-.08,0],[0,-.06,0]], [x,0,0], 1.02);
    oval(leg,[.135,.13,.135],[x,-.96,0],"frame");
    oval(leg,[.14,.15,.08],[x,-.96,.11]);
    contour(leg, [[0,-1.94,0],[.09,-1.91,0],[.115,-1.65,0],[.16,-1.32,0],[.135,-1.1,0],[0,-1.08,0]], [x,0,0], .95);
    oval(leg,[.09,.1,.09],[x,-1.97,0],"frame");
    oval(leg,[.145,.085,.29],[x,-2.13,.10],"frame");
    oval(leg,[.14,.11,.26],[x,-2.06,.11]);
  }
  // Bake static detail into one mesh per finish/assembly, keeping picking and
  // exploded transforms while avoiding hundreds of separate GPU draw calls.
  const sourceGeometries = new Set<THREE.BufferGeometry>();
  selectable.length = 0;
  for (const { group } of assemblies) {
    const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
    for (const child of [...group.children]) {
      if (!(child instanceof THREE.Mesh)) continue;
      child.updateMatrix();
      sourceGeometries.add(child.geometry);
      const geometry = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
      geometry.applyMatrix4(child.matrix);
      const material = child.material as THREE.Material;
      if (!batches.has(material)) batches.set(material, []);
      batches.get(material)!.push(geometry);
      group.remove(child);
    }
    for (const [material, parts] of batches) {
      const geometry = mergeGeometries(parts);
      parts.forEach(part => part.dispose());
      if (!geometry) continue;
      const object = new THREE.Mesh(geometry, material);
      object.userData.part = group.userData.part;
      group.add(object);
      selectable.push(object);
    }
  }
  sourceGeometries.forEach(geometry => geometry.dispose());
  geometries.clear();

  const target = new THREE.Vector3();
  let currentSelection: string | null = null;
  return {
    root,
    selectable,
    materials: Object.values(finishes).flatMap(palette => Object.values(palette)),
    update(explosion: number, selected: string | null, delta: number) {
      const smoothing = 1 - Math.exp(-10 * delta);
      for (const { group, offset } of assemblies) group.position.lerp(target.copy(offset).multiplyScalar(explosion), smoothing);
      if (selected === currentSelection) return;
      currentSelection = selected;
      for (const id of ids) {
        const active = id === selected;
        for (const finish of ["shell", "steel", "frame"] as const) {
          finishes[id][finish].emissive.setHex(active ? 0x315b9d : 0x000000);
          finishes[id][finish].emissiveIntensity = active ? .16 : 0;
        }
      }
    },
  };
}

