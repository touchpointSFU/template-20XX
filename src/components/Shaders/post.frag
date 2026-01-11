precision highp float;
varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uTexture;

void main() {
  vec2 pix = vUv * gl_FragCoord.xy;
  // vec3 col = texture2D(uTexture, vUv).rgb;
  vec3 col = texture2D(uTexture, floor(pix / 16.0) * 16.0 / uResolution.xy).rgb;
  // gl_FragColor = vec4(tex, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
