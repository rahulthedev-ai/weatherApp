import React from "react";
import { Canvas } from "@react-three/fiber";
import Model from "../model/Cloud.jsx";

function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model />
    </Canvas>
  );
}

export default App;
