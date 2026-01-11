precision highp float;
varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uTexture;

#define pixelSize 16.0

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
  vec2 pix = gl_FragCoord.xy / 2.0;
  vec2 pixelmap = fract(pix / pixelSize);
  // vec2 grouping = mod(floor(pix / pixelSize), 2.0);
  vec3 col = texture2D(uTexture, floor(pix / pixelSize) * pixelSize / uResolution.xy).rgb;

  vec3 targetColor = vec3(0.827, 1.0, 0.490);
  // vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
  // vec2 roundedUV = floor(vUv * 40.0) / 40.0;
  // roundedUV *= ratio;
  // vec3 col = texture2D(uTexture, roundedUV).rgb;
  // vec3 grid = vec3(fract(uv * 40.0 * ratio), 0.0);
  // vec3 col = texture2D(uTexture, floor(pix / 16.0) * 16.0 / uResolution.xy).rgb;
  // gl_FragColor = vec4(tex, 1.0);

  gl_FragColor = vec4(cellVal(col.r, pixelmap) == 1.0 ? targetColor * cellVal(col.r, pixelmap) : vec3(1.0), 1.0);
}
