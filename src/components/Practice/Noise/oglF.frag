precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

#include "lygia/generative/snoise.glsl"

varying vec2 vUv;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float rand( float p ) {
    return fract(sin(p)*43758.5453123);
}

void main() {
    vec2 uv = vUv;
    // uv *= 10.;
    // float ratio = uResolution.x / uResolution.y;
    // vec2 newCoords = vec2(ratio, 1.0);
    // vec2 toMouse = (uMouse * newCoords - vUv * newCoords);
    // float dist = length(toMouse);
    // float valid = step(0.1, dist);

    // vec3 color = vec3(1. - valid, 1. - valid, 1.);
    // float i = floor(uv.x);
    // float f = fract(uv.x);
    float d2 = snoise(vec3(uv * ((0.5 + length(uMouse.x * uMouse.y)) * 3.), uTime / 2.)) * 0.5 + 0.5;
    vec3 color = vec3(d2, 0.0, 0.0);
    gl_FragColor = vec4(color, 1.0);
}