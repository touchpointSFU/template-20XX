import { createContext, useRef } from "react";
import { Canvas } from "react-ogl";

export const OGLCanvasContext = createContext<{
  canvas: React.RefObject<any> | null;
}>({
  canvas: null,
});

export const OGLCanvas = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<any>(null);
  return (
    <OGLCanvasContext value={{ canvas: ref }}>
      <Canvas ref={ref}>{children}</Canvas>
    </OGLCanvasContext>
  );
};
