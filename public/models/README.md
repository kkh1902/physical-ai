# Unitree G1 visual model

Source: https://github.com/google-deepmind/mujoco_menagerie/tree/cda5236f98383f6fbaa4820c6b18dba892cd087f/unitree_g1

Copyright Unitree Robotics. See `unitree-g1.LICENSE` for the complete BSD license.

Converted from the source visual STL meshes and their MuJoCo body transforms to GLB using `scripts/build-robot-glb.py` (Python, trimesh, numpy). Collision geometry is excluded. Coordinates are converted to Y-up, X-left, Z-forward. Mesh names are preserved for system selection and exploded views. Silver/graphite PBR materials are assigned for the studio viewer.

The viewer illustrates the source model in its zero joint configuration. Exploded offsets are educational, not assembly instructions. The model has rigid rubber hands, not articulated fingers.
