precision highp float;

uniform float uTime;
// uniform vec2 uMouse;
// uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // vec3 color = texture2D(uTexture, uv).rgb;
    vec3 color = vec3(1.0, 1.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
}