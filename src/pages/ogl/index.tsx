import { Triangle } from "ogl";
import { Canvas } from "react-ogl";
import fragment from "@/components/Practice/Shaping/oglF.frag";
import vertex from "@/components/Practice/Shaping/oglV.vert";
import { useFrame } from "react-ogl";
import { useMemo, useRef } from "react";
import { motion } from "motion/react";

export const Page = () => {
  //   useFrame(({ time }, program) => {
  //     programRef.current
  //   });
  return (
    <motion.main className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black">
      <motion.div
        className="relative size-full"
        initial={{ scale: 0.95, opacity: 0, y: 0 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 32 }}
      >
        <Canvas>
          <Test />
        </Canvas>
      </motion.div>
    </motion.main>
  );
};

export default Page;

const Test = () => {
  //   const programRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
    }),
    []
  );
  useFrame((_, time) => {
    // console.log(time);
    meshRef.current.uniforms.uTime.value = time * 0.001;
  });
  return (
    <mesh>
      <geometry
        // position={{ size: 2, data: new Float32Array([-1, -1, 3, -1, 1, 3]) }}
        // uv={{ size: 2, data: new Float32Array([-2, 0, 2, 0, 0, 2]) }}
        position={{ size: 2, data: new Float32Array([-2, -1, 2, -1, 0, 3]) }}
        uv={{ size: 2, data: new Float32Array([-2, 0, 2, 0, 0, 2]) }}
      />
      <program
        // ref={programRef}
        ref={meshRef}
        vertex={vertex}
        fragment={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
};
