precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    float ratio = uResolution.x / uResolution.y;
    vec2 newCoords = vec2(ratio, 1.0);
    vec2 toMouse = (uMouse * newCoords - vUv * newCoords);
    float dist = length(toMouse);
    float valid = step(0.1, dist);

    vec3 color = vec3(1., 1. - valid, 1. - valid);
    gl_FragColor = vec4(color, 1.0);
}