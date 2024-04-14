import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials, errors } = useGLTF("/cloud.gltf");

  if (errors) {
    console.error("Error loading GLTF:", errors);
    return null; // Render nothing if there's an error
  }

  const sphereRef = useRef();

  return (
    <group {...props}>
      <mesh
        geometry={nodes.Sphere.geometry}
        material={nodes.Sphere.material}
        rotation={[-Math.PI, 0, 0]}
        scale={[-2.959, -1.535, -1.39]}
        ref={sphereRef}
      />
    </group>
  );
}
