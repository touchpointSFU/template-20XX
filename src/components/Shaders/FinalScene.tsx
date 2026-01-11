import { Mesh, Program, Plane } from "ogl";
// import { Mesh, Program, Plane } from "react-ogl";
import { useLayoutEffect, useMemo } from "react";

import postVert from "@/components/Shaders/post.vert";
import postFrag from "@/components/Shaders/post.frag";
import { useOGL } from "react-ogl";
import { u } from "motion/react-client";

export function FinalScene({ texture }: { texture: any }) {
  const { gl, size } = useOGL();
  const program = useMemo(
    () =>
      new Program(gl, {
        vertex: postVert,
        fragment: postFrag,
        uniforms: {
          uResolution: { value: [size.width, size.height] },
          uTexture: { value: texture },
        },
      }),
    [texture]
  );
  const updateBounds = () => {
    console.log("resize detected");
    console.log(size, gl);
    const newInfo = gl.canvas.getBoundingClientRect();
    program.uniforms.uResolution.value = [newInfo.width, newInfo.height];
  };
  useLayoutEffect(() => {
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  return (
    <mesh program={program}>
      <triangle />
    </mesh>
  );
}
