import React, { Suspense } from 'react'
import {OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber'
import Grass from './components/Grass';

const App = () => {

  return (
      <Suspense fallback={<span>loading...</span>}>
        <Canvas linear dpr={[1, 2]} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 5, 10] }}>
          <color attach="background" args={['#1e2243']} />
          <OrbitControls />
          <Grass/>
        </Canvas>
      </Suspense>
  )
}


export default App;
