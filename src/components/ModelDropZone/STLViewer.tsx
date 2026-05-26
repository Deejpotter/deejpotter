"use client";

/**
 * STLViewer — Three.js STL model renderer using react-three-fiber
 *
 * Shows a rotatable, zoomable 3D preview of an STL file.
 * Uses OrbitControls for camera, with basic lighting and a grid.
 */

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";

interface STLViewerProps {
  url: string;
}

function STLMesh({ url }: { url: string }) {
  const geometry = useMemo(() => {
    const loader = new STLLoader();
    // We need to load synchronously for useMemo — use a pre-fetched buffer
    // Actually, let's use useGLTF or a simple fetch approach
    return null;
  }, [url]);

  // We'll use Suspense + useLoader instead
  return null;
}

// Actually using a simpler approach with useLoader
import { useLoader } from "@react-three/fiber";

function Model({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);

  // Center and compute bounds
  const centered = useMemo(() => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);
    return geometry;
  }, [geometry]);

  return (
    <Center>
      <mesh geometry={centered}>
        <meshStandardMaterial
          color="#4ade80"
          roughness={0.3}
          metalness={0.1}
          flatShading={false}
        />
      </mesh>
    </Center>
  );
}

export default function STLViewer({ url }: STLViewerProps) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <Model url={url} />
      <OrbitControls enableDamping dampingFactor={0.1} />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={30}
        infiniteGrid
      />
    </Canvas>
  );
}
