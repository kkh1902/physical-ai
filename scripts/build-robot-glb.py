"""Rebuild the G1 visual asset: pip install trimesh numpy; python scripts/build-robot-glb.py."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import io
import urllib.request
import xml.etree.ElementTree as ET
import numpy as np
import trimesh

REV = "cda5236f98383f6fbaa4820c6b18dba892cd087f"
BASE = f"https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/{REV}/unitree_g1/"
OUT = Path(__file__).resolve().parents[1] / "public" / "models"

def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=90) as response:
        return response.read()

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    xml = ET.fromstring(fetch("g1.xml"))
    assets = {m.get("name", Path(m.attrib["file"]).stem): m.attrib["file"] for m in xml.findall("asset/mesh")}
    def load(item):
        name, filename = item
        return name, trimesh.load(io.BytesIO(fetch("assets/" + filename)), file_type="stl")
    with ThreadPoolExecutor(max_workers=6) as pool:
        meshes = dict(pool.map(load, assets.items()))
    scene = trimesh.Scene()
    # MuJoCo is Z-up, X-forward; the viewer is Y-up, Z-forward.
    orientation = np.array([[0,-1,0,0],[0,0,1,0],[1,0,0,0],[0,0,0,1]], dtype=float)
    def transform(element):
        matrix = trimesh.transformations.quaternion_matrix(np.fromstring(element.get("quat", "1 0 0 0"), sep=" "))
        matrix[:3,3] = np.fromstring(element.get("pos", "0 0 0"), sep=" ")
        return matrix
    def visit(body, parent):
        world = parent @ transform(body)
        for index, geom in enumerate(body.findall("geom")):
            if geom.get("class") != "visual":
                continue
            name = geom.attrib["mesh"]
            mesh = meshes[name].copy()
            dark = geom.get("material") == "black"
            mesh.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
                name="graphite" if dark else "silver", baseColorFactor=[45,49,57,255] if dark else [188,195,203,255],
                metallicFactor=0.25 if dark else 0.65, roughnessFactor=0.42 if dark else 0.32))
            scene.add_geometry(mesh, node_name=f"{name}_{index}", transform=world @ transform(geom))
        for child in body.findall("body"):
            visit(child, world)
    visit(xml.find("worldbody/body"), orientation)
    (OUT / "unitree-g1.glb").write_bytes(scene.export(file_type="glb"))
    (OUT / "unitree-g1.LICENSE").write_bytes(fetch("LICENSE"))
    print(f"Exported {len(scene.geometry)} meshes, {sum(len(m.faces) for m in scene.geometry.values())} triangles")

if __name__ == "__main__":
    main()
