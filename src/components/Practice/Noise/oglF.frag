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

float cell25(vec2 cellUV){
    vec2 buckets = floor(cellUV * 3.0);
    return (buckets.x == buckets.y ? 1.0 : 0.0);
} 

float cell50(vec2 cellUV){
    vec2 buckets = floor(cellUV * 3.0);
    return (mod(buckets.x + buckets.y, 2.0) < 1.0 ? 1.0 : 0.0);
} 

float cell75(vec2 cellUV){
    vec2 buckets = floor(cellUV * 3.0);
    return (buckets.x + buckets.y < 4.0 && buckets.x + buckets.y > 0.0) ? 1.0 : 0.0;
} 

void main() {
    vec2 uv = vUv;
    uv *= 10.0;
    vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
    uv *= ratio;
    // vec2 toMouse = (uMouse * newCoords - vUv * newCoords);
    // float dist = length(toMouse);
    // float valid = step(0.1, dist);

    // vec3 color = vec3(1. - valid, 1. - valid, 1.);
    // float i = floor(uv.x);
    // float f = fract(uv.x);

    vec3 targetColor = vec3(0.827, 1.0, 0.490);

    //Get the gray value for noise based on current XY
    float d3 = snoise(vec3(floor(uv), uTime / 2.0));
    float d2 = snoise(vec3(uv, uTime / 2.0));

    vec2 cellUV = fract(uv);

    float validA = step(0.2, d3) - step(0.4, d3);
    float validB = step(0.4, d3) - step(0.6, d3);
    float validC = step(0.6, d3) - step(0.8, d3);
    float validD = step(0.8, d3);
    

    vec3 color = (cell25(cellUV) * targetColor * validA) + (targetColor * cell50(cellUV) * validB) + (targetColor * cell75(cellUV) * validC) + validD * targetColor;
    // color *= d2;
    gl_FragColor = vec4(color, 1.0);
}