precision highp float;
varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uTexture;

#define pixelSize 32.0

float cell10(vec2 cellUV){
    // vec2 uv = fragCoord/iResolution.xy;
    
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float valid = 1.0 - step(remap.x + 0.4, abs(remap.y));
    valid *= 1.0 - step(-remap.x + 0.4, abs(remap.y));
    
    float valid2 = 1.0 - step(remap.x + 0.3, abs(remap.y));
    valid2 *= 1.0 - step(-remap.x + 0.3, abs(remap.y));
    // vec2 buckets = floor(cellUV * 3.0);
    return valid - valid2;
} 

float cell20(vec2 cellUV){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float valid = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.x, 0.));
    valid *= 1. - step(0.5, distance(remap.y, 0.));
    
    float valid2 = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.y, 0.));
    valid2 *= 1. - step(0.5, distance(remap.x, 0.));
    
    float valid3 = step(remap.x, remap.y + 0.05 );
    valid3 *= 1.0 - step(remap.x, remap.y - 0.05 );
    valid3 *= 1.0 - step(-remap.x + 0.5 * pow(2.0, 1./2.), remap.y);
    valid3 *= 1.0 - step(remap.x + 0.5 * pow(2.0, 1./2.), -remap.y);
    
    float valid4 = step(-remap.x, remap.y + 0.05 );
    valid4 *= 1.0 - step(-remap.x, remap.y - 0.05 );
    valid4 *= 1.0 - step(remap.x + 0.5 * pow(2.0, 1./2.), remap.y);
    valid4 *= 1.0 - step(-remap.x + 0.5 * pow(2.0, 1./2.), -remap.y);

    return min(valid + valid2 + valid3 + valid4, 1.0);
} 

float cell30(vec2 cellUV){
    vec2 remap = cellUV * 2.0 - 1.0;
    vec2 center = vec2(0., 0.);
    
    float valid = step(distance(remap, center), 0.55);
    float valid2 = step(distance(remap, center), 0.55 - 0.05 * pow(2.0, 1./2.));
    float valid3 = step(distance(remap, center), 0.3);
    
    float barCenter = 1. - step(0.05, distance(remap.y, 0.));
    barCenter *= 1. - step(0.05, distance(remap.x, 0.));
    
    float bar = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.x, 0.));
    bar *= 1. - step(0.3, distance(remap.y, 0.));
    bar -= barCenter;
    
    float bar2 = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.y, 0.));
    bar2 *= 1. - step(0.3, distance(remap.x, 0.));
    bar2 -= barCenter;
    
    float core = step(distance(remap, center), 0.1);
    
    float all = core + (valid - valid2) + (valid3 - bar - bar2);

    return min(all, 1.0);
} 

float cell50(vec2 cellUV){
    vec2 buckets = floor(cellUV * 3.0);
    return (mod(buckets.x + buckets.y, 2.0) < 1.0 ? 1.0 : 0.0);
} 

float cell70(vec2 cellUV){
    vec2 buckets = floor(cellUV * 3.0);
    return (buckets.x + buckets.y < 4.0 && buckets.x + buckets.y > 0.0) ? 1.0 : 0.0;
} 

float cellVal(float uvGray, vec2 cellUV){
  // return uvGray > 0.9 ? cell90(cellUV) : 
      //  uvGray > 0.8 ? cell80(cellUV) : 
      return  uvGray > 0.7 ? cell70(cellUV) : 
      //  uvGray > 0.6 ? cell60(cellUV) : 
       uvGray > 0.5 ? cell50(cellUV) : 
      //  uvGray > 0.4 ? cell40(cellUV) : 
       uvGray > 0.3 ? cell30(cellUV) : 
       uvGray > 0.2 ? cell20(cellUV) : 
       uvGray > 0.1 ? cell10(cellUV) : 0.0;
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

  gl_FragColor = vec4(targetColor * cellVal(col.r, pixelmap), 1.0);
}
