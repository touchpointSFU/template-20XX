precision highp float;

uniform float uTime;

varying vec2 vUv;

void main() {
    float valA = step(vUv.y, 1.0 - pow(abs(vUv.x), sin(uTime -(3.14 / 2.)) * 1.5 + 2.0 ));
    float valB = step(vUv.y, pow(cos((3.14 * vUv.x) / 2.), sin(uTime -(3.14 / 2.)) * 1.5 + 2.0 ));
    float valC = step(vUv.y, 1.0 - pow(abs(sin(((3.14 * vUv.x / 2.)))), sin(uTime -(3.14 / 2.)) * 1.5 + 2.0 ));
    float valD = step(vUv.y, pow(min(cos(3.14 * vUv.x / 2.), 1.0 - abs(vUv.x)), sin(uTime -(3.14 / 2.)) * 1.5 + 2.0 ));
    float valE = step(vUv.y, 1.0 - pow(max(0., abs(vUv.x) * 2. - 1.), sin(uTime -(3.14 / 2.)) * 1.5 + 2.0 ));


    vec3 color = vec3(valD);
    gl_FragColor = vec4(color, 1.0);
}