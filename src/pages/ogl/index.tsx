import { Canvas } from "react-ogl";
import fragment from "@/components/Practice/Shapes/oglF.frag";
import vertex from "@/components/Practice/Shapes/oglV.vert";
import { useFrame } from "react-ogl";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { u } from "motion/react-client";

export const Page = () => {
  //   useFrame(({ time }, program) => {
  //     programRef.current
  //   });
  return (
    // <motion.main className="fixed top-0 left-0 z-10 h-full w-full items-center justify-center bg-black">
    <Fragment>
      <div className="relative z-20 h-screen w-scree mb-16">
        <Canvas>
          <Test />
        </Canvas>
      </div>

      <div className="relative z-20 h-screen w-screen">
        <Canvas>
          <Test />
        </Canvas>
      </div>
    </Fragment>
    // </motion.main>
  );
};

export default Page;

const Test = () => {
  //   const programRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const mousePosition = useRef([0.0, 0.0]);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    mousePosition.current = [
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
    ];
  }, []);

  const updateWindowSize = useCallback(() => {
    windowSize.current = [window.innerWidth, window.innerHeight];
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uMouse: {
        value: [mousePosition.current[0], mousePosition.current[1]],
      },
      uResolution: {
        value: [window.innerWidth, window.innerHeight],
      },
    }),
    []
  );
  useFrame((_, time) => {
    // console.log(time);
    meshRef.current.uniforms.uTime.value = time * 0.001;
    meshRef.current.uniforms.uMouse.value = [
      mousePosition.current[0],
      mousePosition.current[1],
    ];
    meshRef.current.uniforms.uResolution.value = [
      window.innerWidth,
      window.innerHeight,
    ];
  });

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize, false);
    return () => {
      window.removeEventListener("resize", updateWindowSize, false);
    };
  }, [updateWindowSize]);

  return (
    <mesh>
      <geometry
        position={{ size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }}
        uv={{ size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }}
        // position={{ size: 2, data: new Float32Array([-2, -1, 2, -1, 0, 3]) }}
        // uv={{ size: 2, data: new Float32Array([-2, 0, 2, 0, 0, 2]) }}
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
