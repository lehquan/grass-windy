import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import * as glsl from 'glslify';

// shaders
// import verShader from '../shaders/verShader.glsl'

const Grass = () => {
  const grassRef = useRef();
  const count = 5000;

  // const src = glsl.file('../shaders/verShader.glsl')

  const leavesMaterial = useMemo(() => {
    const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    
    void main() {
  
      vUv = uv;
      
      // VERTEX POSITION
      vec4 mvPosition = vec4( position, 1.0 );
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
      #endif
      
      // DISPLACEMENT
      // here the displacement is made stronger on the blades tips.
      float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
      
      float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
      mvPosition.z += displacement;
      
      //
      vec4 modelViewPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * modelViewPosition;
  
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    
    void main() {
      vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
      float clarity = ( vUv.y * 0.5 ) + 0.5;
      gl_FragColor = vec4( baseColor * clarity, 1);
    }
  `;
    const uniforms = {
      time: {
        value: 0,
      },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });
    return new THREE.ShaderMaterial().copy(mat);
  }, []);

  const leaveGeo = useMemo(() => {
    const geo = new THREE.PlaneBufferGeometry(0.1, 1, 1, 4);
    // geo.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.
    return new THREE.PlaneBufferGeometry().copy(geo);
  }, []);

  // Position and scale the grass blade instances randomly.
  useEffect(() => {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );

      dummy.scale.setScalar(0.5 + Math.random() * 0.5);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();

      grassRef.current.setMatrixAt(i, dummy.matrix);
    }
  }, []);

  useFrame(({clock}) => {
    // Hand a time variable to vertex shader for wind displacement.
     leavesMaterial.uniforms.time.value = clock.getElapsedTime();
     leavesMaterial.uniformsNeedUpdate = true
  });

  return (
    <instancedMesh
      frustumCulled={true}
      ref={grassRef}
      args={[null, null, count]}
      geometry={leaveGeo}
      material={leavesMaterial}
    />
  );
};

export default Grass;
