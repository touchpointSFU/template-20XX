precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
#define MAX_METABLOBS 50
uniform vec3 uMetablobs[MAX_METABLOBS];

#include "lygia/math/const.glsl"
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
    float mult = 10.0;
    float timeBounce = (0.5 + sin(uTime - PI / 2.0) / 2.);
    vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
    uv *= ratio * mult;

    vec2 toMetablob[MAX_METABLOBS];
    vec2 movingCoord[MAX_METABLOBS];
    float valid = 1.0;
    vec3 color[MAX_METABLOBS];
    vec3 colorFinal = vec3(1.0);
    for (int i = 0; i < MAX_METABLOBS; i++) {
        toMetablob[i] = (uMetablobs[i].xy * ratio * mult) - (vec2(0.5) * ratio * mult);
        movingCoord[i] = (vec2(0.5) * ratio * mult) + (uMetablobs[i].z* normalize(toMetablob[i]) * timeBounce);
        vec2 toCoord = movingCoord[i] - uv;
        float dist = length(toCoord);
        // valid *= clamp(dist, 0.0, 1.0);
        float size = (uMetablobs[i].z * mult) / 10.;
        float blob = smoothstep(size, 0.0, dist);
        valid *= 1.0 - blob;
    }
        colorFinal *= valid;
    // colorFinal *=  distance(uv, vec2(0.5) * ratio * mult);

    vec3 targetColor = vec3(0.827, 1.0, 0.490);

    colorFinal *= targetColor;
    //Get the gray value for noise based on current XY
    float d3 = snoise(vec3(floor(uv), uTime / 2.0));
    float d2 = snoise(vec3(uv, uTime / 2.0));

    vec2 cellUV = fract(uv);
    
    // vec3 color = vec3(1.0) * (distance(movingCoord[3], uv));

    // vec3 color = (cell25(cellUV) * targetColor * validA) + (targetColor * cell50(cellUV) * validB) + (targetColor * cell75(cellUV) * validC) + validD * targetColor;
    // color *= d2;
    gl_FragColor = vec4(colorFinal, 1.0);
}