import { Mesh, Program, Plane } from "ogl";
// import { Mesh, Program, Plane } from "react-ogl";
import { useMemo } from "react";

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

  return (
    <mesh program={program}>
      <triangle />
    </mesh>
  );
}
