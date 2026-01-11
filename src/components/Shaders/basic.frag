precision highp float;
varying vec2 vUv;
uniform float uTime;

void main() {
  vec3 color = vec3(
    vUv.x,
    vUv.y,
    (sin(uTime) + 1.0) / 2.0
  );
  gl_FragColor = vec4(color, 1.0);
}
