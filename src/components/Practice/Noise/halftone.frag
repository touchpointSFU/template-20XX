precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;


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
    // uv *= 10.0;
    vec3 color = texture2D(uTexture, uv).rgb;
    // vec3 color = vec3(uv.x, uv.y, 0.0);
    gl_FragColor = vec4(vec3(1.0, 0., 0.), 1.0);
}