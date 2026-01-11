import metaballs from "@/components/Practice/Noise/metaballs.frag";
import halftone from "@/components/Practice/Noise/halftone.frag";
import vertex from "@/components/Practice/Noise/oglV.vert";
import { render, useFrame, useOGL } from "react-ogl";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Box, RenderTarget, Texture } from "ogl";
import { OGLCanvas, OGLCanvasContext } from "@/components/OGLCanvas/OGLCanvas";
import { useLenis } from "lenis/react";
import { Vec2, Vec3 } from "ogl";
import { output, u } from "motion/react-client";

export const Halftoner = () => {
  const { gl, size } = useOGL();

  const renderTarget = useMemo(
    () =>
      new RenderTarget(gl, {
        width: gl.canvas.width,
        height: gl.canvas.height,
      }),
    [gl]
  );

  const lenis = useLenis((lenis) => {
    mousePositionN.current = [
      (mousePosition.current[0] - bounds.current.left) / bounds.current.width,
      1 -
        (mousePosition.current[1] + lenis.animatedScroll - bounds.current.top) /
          bounds.current.height,
    ];
  });

  //   useEffect(() => {
  //     console.log(gl);
  //     console.log(renderTarget);
  //     console.log(uniforms.uTexture.value);
  //   }, [uniforms.uTexture]);
  useEffect(() => {
    console.log(renderTarget);
  }, [renderTarget]);

  const effect = useRef<any>(null);

  const mousePosition = useRef([0.0, 0.0]);
  const mousePositionN = useRef([0.0, 0.0]);

  const bounds = useRef<
    | DOMRect
    | {
        top: number;
        left: number;
        width: number;
        height: number;
      }
  >(
    gl.canvas
      ? gl.canvas.getBoundingClientRect()
      : {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }
  );

  const updateBounds = () => {
    bounds.current = gl.canvas
      ? gl.canvas.getBoundingClientRect()
      : {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        };
  };

  useLayoutEffect(() => {
    // window.addEventListener("resize", updateBounds);
    // return () => {
    //   window.removeEventListener("resize", updateBounds);
    // };
    renderTarget.setSize(size.width, size.height);
  }, []);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (gl.canvas && lenis) {
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
      //   uMouse: {
      //     value: [0.0, 0.0],
      //   },
      //   uResolution: {
      //     value: [0.0, 0.0],
      //   },
      uTexture: { value: renderTarget.texture },
    }),
    []
  );
  useFrame(({ renderer, camera, scene }, time) => {
    renderer.render({ scene, camera, target: renderTarget });

    effect.current.visible = true;

    effect.current.program.uniforms.uTime.value = time * 0.001;

    // effect.current.program.uniforms.uMouse.value = [
    //   mousePositionN.current[0],
    //   mousePositionN.current[1],
    // ];

    // effect.current.program.uniforms.uResolution.value = [
    //   bounds.current.width,
    //   bounds.current.height,
    // ];
    // effect.current.uniforms.uMetablobs.value = metablobs.current;
    // effect.current.uniforms.uTexture.value = targetRef.texture;

    effect.current.program.uniforms.uTexture.value = renderTarget.texture;
    renderer.render({ scene: effect.current, camera });
    effect.current.visible = false;
  });

  //   useEffect(() => {
  //     window.addEventListener("mousemove", updateMousePosition, false);
  //     return () => {
  //       window.removeEventListener("mousemove", updateMousePosition, false);
  //     };
  //   }, [updateMousePosition]);

  return (
    <mesh visible={true} ref={effect}>
      <geometry
        position={{
          size: 2,
          data: new Float32Array([-1, -1, 3, -1, -1, 3]),
        }}
        uv={{ size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }}
      />
      <program
        // ref={outputRef}
        vertex={vertex}
        fragment={halftone}
        uniforms={uniforms}
      />
    </mesh>
  );
};
