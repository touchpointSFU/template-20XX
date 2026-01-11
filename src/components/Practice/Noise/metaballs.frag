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

float cellVal(float uvGray, vec2 cellUV){
    return uvGray > 0.8 ? 1. : (uvGray > 0.6 ? cell75(cellUV) : (uvGray > 0.4 ? cell50(cellUV) : uvGray > 0.2 ? cell25(cellUV) : 0.0));
}


void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    float mult = 4.0;
    float timeBounce = (0.5 + sin(uTime - PI / 2.0) / 2.);
    vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
    // vec2 ratio = vec2(1.0);
    uv *= ratio * mult;
    center *= ratio * mult;

    vec2 toMetablob[MAX_METABLOBS];
    vec2 movingCoord[MAX_METABLOBS];
    float valid = 0.0;
    // vec3 color[MAX_METABLOBS];
    vec3 colorFinal = vec3(1.0);

    for (int i = 0; i < MAX_METABLOBS; i++) {
        toMetablob[i] = (uMetablobs[i].xy) * mult * ratio;
        movingCoord[i] = (center) + (normalize(toMetablob[i])*uMetablobs[i].z * timeBounce);
        float dist = distance(movingCoord[i], uv);
        // 
        // dist = dist == 0.0 ? 1.0 : dist * (1.0 - step(uMetablobs[i].z, dist));
        valid += (1. / pow(dist / (uMetablobs[i].z), 4.0)) / float(MAX_METABLOBS);
        // valid += (5.)*exp(-dist / 0.2) / float(MAX_METABLOBS);
        // float size = dist * uMetablobs[i].z;
        // valid += smoothstep(0.1 * uMetablobs[i].z, 0.0, dist);
    }
    valid = min(valid, 1.0);
    // colorFinal *=  distance(uv, vec2(0.5) * ratio * mult);

    //Get the gray value for noise based on current XY
    float d3 = snoise(vec3(floor(uv), uTime / 2.0));

    vec2 cellUV = fract(uv * 8.);
    
    vec3 color = vec3(valid);

    gl_FragColor = vec4(vec3(1., 0., 1.), 1.0);
}