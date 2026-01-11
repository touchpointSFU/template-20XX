import { Canvas, useOGL } from "react-ogl";
import fragment from "@/components/Practice/Shapes/oglF.frag";
import vertex from "@/components/Practice/Shapes/oglV.vert";
import { useFrame } from "react-ogl";
import {
  Fragment,
  use,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { u } from "motion/react-client";
import { OGLCanvas, OGLCanvasContext } from "@/components/OGLCanvas/OGLCanvas";
import { useLenis } from "lenis/react";

export const Page = () => {
  //   useFrame(({ time }, program) => {
  //     programRef.current
  //   });
  return (
    // <motion.main className="fixed top-0 left-0 z-10 h-full w-full items-center justify-center bg-black">
    <Fragment>
      <div className="ml-auto relative h-screen w-[50vw] resize my-16">
        <OGLCanvas>
          <Test />
        </OGLCanvas>
      </div>
      <div className="relative h-[200vh] w-screen resize"></div>
      <div className="relative h-screen w-[50vw] resize mb-16">
        <OGLCanvas>
          <Test />
        </OGLCanvas>
      </div>

      {/* <div className="relative h-screen w-screen resize">
        // <OGLCanvas>
        //   <Test />
        // </OGLCanvas>
      </div> */}
    </Fragment>
    // </motion.main>
  );
};

export default Page;

const Test = () => {
  // useEf
  const canvas = useOGL().gl.canvas;
  useEffect(() => {
    console.log(canvas);
  }, []);
  // const { canvas } = useContext(OGLCanvasContext);

  const lenis = useLenis((lenis) => {
    mousePositionN.current = [
      (mousePosition.current[0] - bounds.current.left) / bounds.current.width,
      1 -
        (mousePosition.current[1] + lenis.animatedScroll - bounds.current.top) /
          bounds.current.height,
    ];
  });

  const meshRef = useRef<any>(null);
  const mousePosition = useRef([0.0, 0.0]);
  const mousePositionN = useRef([0.0, 0.0]);

  // const [bounds, setBounds] = useState(
  //   canvas && canvas
  //     ? canvas.getBoundingClientRect()
  //     : {
  //         top: 0,
  //         left: 0,
  //         width: 0,
  //         height: 0,
  //       }
  // );
  const bounds = useRef<
    | DOMRect
    | {
        top: number;
        left: number;
        width: number;
        height: number;
      }
  >(
    canvas && canvas
      ? canvas.getBoundingClientRect()
      : {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }
  );

  const updateBounds = () => {
    bounds.current =
      canvas && canvas
        ? canvas.getBoundingClientRect()
        : {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
          };
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (canvas && canvas && lenis) {
      mousePosition.current = [e.clientX, e.clientY];
      mousePositionN.current = [
        (e.clientX - bounds.current.left) / bounds.current.width,
        1 -
          (e.clientY + lenis.animatedScroll - bounds.current.top) /
            bounds.current.height,
      ];
    }
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uMouse: {
        value: [0.0, 0.0],
      },
      uResolution: {
        value: [0.0, 0.0],
      },
    }),
    []
  );
  useFrame((_, time) => {
    meshRef.current.uniforms.uTime.value = time * 0.001;
    meshRef.current.uniforms.uMouse.value = [
      mousePositionN.current[0],
      mousePositionN.current[1],
    ];
    meshRef.current.uniforms.uResolution.value = [
      bounds.current.width,
      bounds.current.height,
    ];
  });

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  useEffect(() => {}, []);

  return (
    <Fragment>
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
    </Fragment>
  );
};
