import { Mesh, Program, Plane } from "ogl";
import { useFrame, createPortal, useOGL } from "react-ogl";
import { useMemo, useRef } from "react";
import { RenderTarget } from "ogl";

import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/basic.frag";

export function RTTScene({ target }: { target: RenderTarget }) {
  const { gl } = useOGL();
  const program = useMemo(
    () =>
      new Program(gl, {
        vertex: basicVert,
        fragment: basicFrag,
        uniforms: {
          uTime: { value: 0 },
        },
      }),
    []
  );

  useFrame((_, time) => {
    program.uniforms.uTime.value = time * 0.001;
  });

  //   return createPortal(
  //     <mesh program={program}>
  //       <triangle />
  //     </mesh>,
  //     target
  //   );
  return (
    <mesh program={program}>
      <triangle />
    </mesh>
  );
}
