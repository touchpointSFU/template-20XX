import { Fragment, useEffect, useMemo, useRef } from "react";
import { Mesh, Program, RenderTarget, Triangle, Vec3 } from "ogl";

import { OGLCanvas } from "@/components/OGLCanvas/OGLCanvas";
import { RTTScene } from "@/components/Shaders/RTTScene";
import { FinalScene } from "@/components/Shaders/FinalScene";
import { useFrame, useOGL } from "react-ogl";
import { createPortal } from "react-dom";

import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/metaballs.frag";

export default function Home() {
  return (
    <div className="ml-auto relative h-screen w-screen">
      <OGLCanvas>
        <Test />
      </OGLCanvas>
    </div>
  );
}

const Test = () => {
  const { gl, canvas, renderer } = useOGL();

  useEffect(() => {
    console.log("GL Context:", gl);
    console.log("Canvas", canvas);
  }, [gl]);

  useEffect(() => {
    console.log("Renderer updated:", renderer);
  }, [renderer]);
  const renderTarget = useMemo(() => new RenderTarget(gl), []);

  useEffect(() => {
    console.log("Render Target:", renderTarget);
  }, [renderTarget]);

  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: basicVert,
      fragment: basicFrag,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uMetablobs: { value: [] },
      },
    }),
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

  useFrame((root, time) => {
    // console.log(root.renderer);
    mesh.program.uniforms.uTime.value = time * 0.001;
    // mesh.program.uniforms.uMouse.value = [
    //   mousePositionN.current[0],
    //   mousePositionN.current[1],
    // ];
    mesh.program.uniforms.uResolution.value = [
      root.renderer.width,
      root.renderer.height,
    ];
    mesh.program.uniforms.uMetablobs.value = metablobs.current;
    renderer.render({ scene: mesh, target: renderTarget });
  });

  return (
    <Fragment>
      <FinalScene texture={renderTarget.texture} />
    </Fragment>
  );
};
