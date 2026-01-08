declare module "*.frag" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "resolve-lygia" {
  export function resolveLygia(shader: string): string;
}
