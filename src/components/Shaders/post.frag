precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  vec3 tex = texture2D(uTexture, vUv).rgb;
  gl_FragColor = vec4(tex.rgb * vec3(1.0, 0.0, 0.0), 1.0);
}
