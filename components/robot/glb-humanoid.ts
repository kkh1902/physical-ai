import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { PartId } from "./humanoid";

export function createGlbHumanoid() {
  const root = new THREE.Group();
  const selectable: THREE.Mesh[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];
  const assemblies: { group: THREE.Group; origin: THREE.Vector3; offset: THREE.Vector3 }[] = [];
  let disposed = false;
  let selection: string | null | undefined;
  const offsets: Record<PartId, THREE.Vector3> = {
    head: new THREE.Vector3(0, .8, 0),
    torso: new THREE.Vector3(0, .2, 0),
    arms: new THREE.Vector3(.7, .12, .1),
    pelvis: new THREE.Vector3(0, -.13, 0),
    legs: new THREE.Vector3(.27, -.58, -.08),
  };
  const ready = new GLTFLoader().loadAsync("/models/unitree-g1.glb").then(({ scene }) => {
    if (disposed) {
      release(scene);
      return;
    }
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const scale = 4.5 / bounds.getSize(new THREE.Vector3()).y;
    const center = bounds.getCenter(new THREE.Vector3());
    const normalizer = new THREE.Matrix4().makeTranslation(-center.x * scale, -2.225 - bounds.min.y * scale, -center.z * scale);
    normalizer.multiply(new THREE.Matrix4().makeScale(scale, scale, scale));
    const meshes: THREE.Mesh[] = [];
    scene.traverse(object => { if (object instanceof THREE.Mesh) meshes.push(object); });
    for (const object of meshes) {
      const name = object.name.toLowerCase();
      const part: PartId = name.includes("head") ? "head"
        : /shoulder|elbow|wrist|hand/.test(name) ? "arms"
        : /hip|knee|ankle/.test(name) ? "legs"
        : /pelvis|waist/.test(name) ? "pelvis" : "torso";
      const matrix = normalizer.clone().multiply(object.matrixWorld);
      const group = new THREE.Group();
      root.add(group);
      object.removeFromParent();
      object.matrixAutoUpdate = true;
      matrix.decompose(object.position, object.quaternion, object.scale);
      object.userData.part = part;
      const material = (object.material as THREE.MeshStandardMaterial).clone();
      object.material = material;
      materials.push(material);
      group.add(object);
      selectable.push(object);
      const offset = offsets[part].clone();
      if (part === "arms" || part === "legs") offset.x *= name.includes("right") ? -1 : 1;
      assemblies.push({ group, origin: group.position.clone(), offset });
    }
    selection = undefined;
  });
  function release(object: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>();
    const finishes = new Set<THREE.Material>();
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      geometries.add(child.geometry);
      (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => finishes.add(material));
    });
    geometries.forEach(geometry => geometry.dispose());
    finishes.forEach(material => material.dispose());
  }
  const target = new THREE.Vector3();
  return {
    root, selectable, materials, ready,
    update(explosion: number, selected: string | null, delta: number) {
      for (const { group, origin, offset } of assemblies) {
        group.position.lerp(target.copy(offset).multiplyScalar(explosion).add(origin), 1 - Math.exp(-10 * delta));
      }
      if (selection === selected) return;
      selection = selected;
      for (const mesh of selectable) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissive.setHex(mesh.userData.part === selected ? 0x315b9d : 0);
        material.emissiveIntensity = .22;
      }
    },
    dispose() { disposed = true; },
  };
}
