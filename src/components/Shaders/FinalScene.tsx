import { Mesh, Program, Plane } from "ogl";
// import { Mesh, Program, Plane } from "react-ogl";
import { useMemo } from "react";

import postVert from "@/components/Shaders/post.vert";
import postFrag from "@/components/Shaders/post.frag";
import { useOGL } from "react-ogl";

export function FinalScene({ texture }: { texture: any }) {
  const { gl } = useOGL();
  const program = useMemo(
    () =>
      new Program(gl, {
        vertex: postVert,
        fragment: postFrag,
        uniforms: {
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
