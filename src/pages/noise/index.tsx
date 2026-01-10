import metaballs from "@/components/Practice/Noise/metaballs.frag";
import halftone from "@/components/Practice/Noise/halftone.frag";
import vertex from "@/components/Practice/Noise/oglV.vert";
import { useFrame, useOGL } from "react-ogl";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { RenderTarget, Texture } from "ogl";
import { OGLCanvas, OGLCanvasContext } from "@/components/OGLCanvas/OGLCanvas";
import { useLenis } from "lenis/react";
import { Vec2, Vec3 } from "ogl";
import { output, u } from "motion/react-client";

export const Page = () => {
  //   useFrame(({ time }, program) => {
  //     programRef.current
  //   });
  return (
    // <motion.main className="fixed top-0 left-0 z-10 h-full w-full items-center justify-center bg-black">
    <Fragment>
      <div className="ml-auto relative h-screen w-screen">
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
  const { canvas } = useContext(OGLCanvasContext);
  const { gl } = useOGL();

  const lenis = useLenis((lenis) => {
    mousePositionN.current = [
      (mousePosition.current[0] - bounds.current.left) / bounds.current.width,
      1 -
        (mousePosition.current[1] + lenis.animatedScroll - bounds.current.top) /
          bounds.current.height,
    ];
  });
  const metablobs = useRef(
    Array.from(
      { length: 50 },
      () =>
        new Vec3(
          2 * Math.random() - 1.0,
          2 * Math.random() - 1.0,
          Math.random() * 0.6 + 0.4
          // 1.2
        )
    )
  );
  useEffect(() => {
    console.log(targetRef);
    console.log(gl);
  }, []);

  const meshRef = useRef<any>(null);
  const targetRef = useRef<RenderTarget>(null);

  const outputRef = useRef<any>(null);
  const mousePosition = useRef([0.0, 0.0]);
  const mousePositionN = useRef([0.0, 0.0]);

  const renderTarget = new RenderTarget(gl, {
    width: gl.canvas.width / 2,
    height: gl.canvas.height / 2,
  });

  //   const windowSize = useRef([
  //     canvas?.current?.clientWidth || 0,
  //     canvas?.current?.clientHeight || 0,
  //   ]);

  const bounds = useRef<
    | DOMRect
    | {
        top: number;
        left: number;
        width: number;
        height: number;
      }
  >(
    canvas && canvas.current
      ? canvas.current.getBoundingClientRect()
      : {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }
  );

  const updateBounds = () => {
    bounds.current =
      canvas && canvas.current
        ? canvas.current.getBoundingClientRect()
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
    if (canvas && canvas.current && lenis) {
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
      uMetablobs: {
        value: Array(50).fill(new Vec3(0.5, 0.5, 100)),
      },
    }),
    []
  );

  const uniforms2 = useMemo(
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
      uTexture: { value: new Texture(gl) },
    }),
    []
  );
  useFrame((_, time) => {
    meshRef.current.program.uniforms.uTime.value = time * 0.001;
    outputRef.current.uniforms.uTime.value = time * 0.001;

    meshRef.current.program.uniforms.uMouse.value = [
      mousePositionN.current[0],
      mousePositionN.current[1],
    ];
    outputRef.current.uniforms.uMouse.value = [
      mousePositionN.current[0],
      mousePositionN.current[1],
    ];

    meshRef.current.program.uniforms.uResolution.value = [
      bounds.current.width,
      bounds.current.height,
    ];

    outputRef.current.uniforms.uResolution.value = [
      bounds.current.width,
      bounds.current.height,
    ];
    meshRef.current.program.uniforms.uMetablobs.value = metablobs.current;
    // outputRef.current.uniforms.uMetablobs.value = metablobs.current;
    // outputRef.current.uniforms.uTexture.value = targetRef.texture;
    if (targetRef.current) {
      outputRef.current.uniforms.uTexture.value = targetRef.current.texture;
    }
    // outputRef.current.uniforms.uTexture.value =
    //   meshRef.current.program.renderTarget.texture;
  });

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  return (
    <Fragment>
      {/* <renderTarget ref={meshRef}> */}
      <renderTarget ref={targetRef}>
        <mesh ref={meshRef}>
          <geometry
            position={{
              size: 2,
              data: new Float32Array([-1, -1, 3, -1, -1, 3]),
            }}
            uv={{ size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }}
          />
          <program vertex={vertex} fragment={metaballs} uniforms={uniforms} />
        </mesh>
      </renderTarget>
      <mesh>
        <geometry
          position={{
            size: 2,
            data: new Float32Array([-1, -1, 3, -1, -1, 3]),
          }}
          uv={{ size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }}
        />
        <program
          ref={outputRef}
          vertex={vertex}
          fragment={halftone}
          uniforms={uniforms2}
        />
      </mesh>
    </Fragment>
  );
};
