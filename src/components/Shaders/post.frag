precision highp float;
varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec3 uTargetColor;
uniform vec3 uSecondColor;
uniform vec3 uBackground;

#define pixelSize 48.0

vec3 cell10(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    // vec2 uv = fragCoord/iResolution.xy;
    
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float outer = 1.0 - step(remap.x + 0.4, abs(remap.y));
    outer *= 1.0 - step(-remap.x + 0.4, abs(remap.y));
    
    float cut = 1.0 - step(remap.x + 0.3, abs(remap.y));
    cut *= 1.0 - step(-remap.x + 0.3, abs(remap.y));
    // vec2 buckets = floor(cellUV * 3.0);
    return uTargetColor * (outer - cut);
} 

vec3 cell20(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float valid = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.x, 0.));
    valid *= 1. - step(0.5, distance(remap.y, 0.));
    
    float valid2 = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.y, 0.));
    valid2 *= 1. - step(0.5, distance(remap.x, 0.));
    
    float diagonal = step(remap.x, remap.y + 0.05 );
    diagonal *= 1.0 - step(remap.x, remap.y - 0.05 );
    diagonal *= 1.0 - step(-remap.x + 0.5 * pow(2.0, 1./2.), remap.y);
    diagonal *= 1.0 - step(remap.x + 0.5 * pow(2.0, 1./2.), -remap.y);
    
    float diagonal2 = step(-remap.x, remap.y + 0.05 );
    diagonal2 *= 1.0 - step(-remap.x, remap.y - 0.05 );
    diagonal2 *= 1.0 - step(remap.x + 0.5 * pow(2.0, 1./2.), remap.y);
    diagonal2 *= 1.0 - step(-remap.x + 0.5 * pow(2.0, 1./2.), -remap.y);

    return uTargetColor * min(valid + valid2 + diagonal + diagonal2, 1.0);
} 

vec3 cell30(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
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
    
    float all = clamp((valid3 - bar - bar2 - core), 0.0, 1.0);
    float rimAndCore = clamp((valid - valid2 + core), 0.0, 1.0);

    return all * uTargetColor + rimAndCore * uSecondColor;
} 

vec3 cell40(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float valid = 1.0 - step(remap.x + 0.4, abs(remap.y));
    valid *= 1.0 - step(-remap.x + 0.4, abs(remap.y));
    
    float valid2 = 1.0 - step(remap.x + 0.3, abs(remap.y));
    valid2 *= 1.0 - step(-remap.x + 0.3, abs(remap.y));
   
    float square = valid - valid2;

    
    float star = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.x, 0.));
    star *= 1. - step(0.6, distance(remap.y, 0.));
    
    float star2 = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.y, 0.));
    star2 *= 1. - step(0.6, distance(remap.x, 0.));
    
    float star3 = step(remap.x, remap.y + 0.05 );
    star3 *= 1.0 - step(remap.x, remap.y - 0.05 );
    star3 *= 1.0 - step(-remap.x + 0.6 * pow(2.0, 1./2.), remap.y);
    star3 *= 1.0 - step(remap.x + 0.6 * pow(2.0, 1./2.), -remap.y);
    
    float star4 = step(-remap.x, remap.y + 0.05 );
    star4 *= 1.0 - step(-remap.x, remap.y - 0.05 );
    star4 *= 1.0 - step(remap.x + 0.6 * pow(2.0, 1./2.), remap.y);
    star4 *= 1.0 - step(-remap.x + 0.6 * pow(2.0, 1./2.), -remap.y);

    return uTargetColor * clamp(clamp(star + star2 + star3 + star4, 0., 1.0) - (square), 0.0, 1.0);
} 


vec3 cell50(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float valid = 1.0 - step(remap.x + 0.5, abs(remap.y));
    valid *= 1.0 - step(-remap.x + 0.5, abs(remap.y));
    
    float valid2 = 1.0 - step(remap.x + 0.4, abs(remap.y));
    valid2 *= 1.0 - step(-remap.x + 0.4, abs(remap.y));
   
    float square = valid - valid2;

    
    float star = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.x, 0.));
    star *= 1. - step(0.7, distance(remap.y, 0.));
    
    float star2 = 1. - step(0.025 * pow(2.0, 1./2.), distance(remap.y, 0.));
    star2 *= 1. - step(0.7, distance(remap.x, 0.));
    
    float star3 = step(remap.x, remap.y + 0.05 );
    star3 *= 1.0 - step(remap.x, remap.y - 0.05 );
    star3 *= 1.0 - step(-remap.x + 0.7 * pow(2.0, 1./2.), remap.y);
    star3 *= 1.0 - step(remap.x + 0.7 * pow(2.0, 1./2.), -remap.y);
    
    float star4 = step(-remap.x, remap.y + 0.05 );
    star4 *= 1.0 - step(-remap.x, remap.y - 0.05 );
    star4 *= 1.0 - step(remap.x + 0.7 * pow(2.0, 1./2.), remap.y);
    star4 *= 1.0 - step(-remap.x + 0.7 * pow(2.0, 1./2.), -remap.y);

    float starSum = clamp(star + star2 + star3 + star4, 0.0, 1.0);

    return uSecondColor * clamp(square - (starSum),0.0, 1.0) + starSum * uTargetColor;
} 

vec3 cell60(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor  ){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float petal = step(distance(remap, vec2(0.7,0.0)), 0.7);
    petal *= step(distance(remap, vec2(0.0,0.7)), 0.7);
    
    float petal2 = step(distance(remap, vec2(-0.7,0.0)), 0.7);
    petal2 *= step(distance(remap, vec2(0.0,-0.7)), 0.7);
 
    float petal3 = step(distance(remap, vec2(0.0,-0.7)), 0.7);
    petal3 *= step(distance(remap, vec2(0.7,0.0)), 0.7);
    
    float petal4 = step(distance(remap, vec2(0.0,0.7)), 0.7);
    petal4 *= step(distance(remap, vec2(-0.7,0.0)), 0.7);

    float ipetal = step(distance(remap, vec2(0.6,0.0)), 0.6);
    ipetal *= step(distance(remap, vec2(0.0,0.6)), 0.6);
    
    float ipetal2 = step(distance(remap, vec2(-0.6,0.0)), 0.6);
    ipetal2 *= step(distance(remap, vec2(0.0,-0.6)), 0.6);
 
    float ipetal3 = step(distance(remap, vec2(0.0,-0.6)), 0.6);
    ipetal3 *= step(distance(remap, vec2(0.6,0.0)), 0.6);
    
    float ipetal4 = step(distance(remap, vec2(0.0,0.6)), 0.6);
    ipetal4 *= step(distance(remap, vec2(-0.6,0.0)), 0.6);
    
    float all = clamp(petal + petal2 + petal3 + petal4, 0.0, 1.0);
    float inner = clamp(ipetal + ipetal2 + ipetal3 + ipetal4, 0.0, 1.0);
    return uTargetColor * (all - inner) + uSecondColor * inner;
} 

vec3 cell70(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    
    float petal = step(distance(remap, vec2(0.7,0.0)), 0.7);
    petal *= step(distance(remap, vec2(0.0,0.7)), 0.7);
    
    float petal2 = step(distance(remap, vec2(-0.7,0.0)), 0.7);
    petal2 *= step(distance(remap, vec2(0.0,-0.7)), 0.7);
 
    float petal3 = step(distance(remap, vec2(0.0,-0.7)), 0.7);
    petal3 *= step(distance(remap, vec2(0.7,0.0)), 0.7);
    
    float petal4 = step(distance(remap, vec2(0.0,0.7)), 0.7);
    petal4 *= step(distance(remap, vec2(-0.7,0.0)), 0.7);
    
    float petals = clamp(petal + petal2 + petal3 + petal4, 0.0, 1.0);
    
    float hbar = 1.0 - step(remap.y, 0.3);
    hbar *= step(remap.y, 0.5);
    hbar *= step(distance(0.0, remap.x), 0.9);
    
    float hbar2 = step(remap.y, -0.3);
    hbar2 *= 1.0 - step(remap.y, -0.5);
    hbar2 *= step(distance(0.0, remap.x), 0.9);
    
    float vbar = 1.0 - step(remap.x, 0.3);
    vbar *= step(remap.x, 0.5);
    vbar *= step(distance(0.0, remap.y), 0.9);
    
    float vbar2 = step(remap.x, -0.3);
    vbar2 *= 1.0 - step(remap.x, -0.5);
    vbar2 *= step(distance(0.0, remap.y), 0.9);
    
    return petals * uSecondColor + clamp(clamp(hbar + hbar2 + vbar + vbar2, 0.0, 1.0) - petals, 0.0, 1.0) * uTargetColor;
} 

vec3 cell80(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    vec2 center = vec2(0.0, 0.0);
    
    float quad = step(remap.x, 0.8);
    quad *= 1.0 - step(remap.x, 0.2);
    quad *= step(remap.y, 0.8);
    quad *= 1.0 - step(remap.y, 0.2);
    
    float quad2 = 1.0 - step(remap.x, -0.8);
    quad2 *= step(remap.x, -0.2);
    quad2 *= step(remap.y, 0.8);
    quad2 *= 1.0 - step(remap.y, 0.2);
    
    float quad3 = 1.0 - step(remap.y, -0.8);
    quad3 *= step(remap.y, -0.2);
    quad3 *= step(remap.x, 0.8);
    quad3 *= 1.0 - step(remap.x, 0.2);
   
    float quad4 = 1.0 - step(remap.y, -0.8);
    quad4 *= step(remap.y, -0.2);
    quad4 *= 1.0 - step(remap.x, -0.8);
    quad4 *= step(remap.x, -0.2);
    
    float outerRim = step(distance(remap, center), 0.7);
    outerRim -= step(distance(remap, center), 0.54);
    
    float innerRim = step(distance(remap, center), 0.4);
    innerRim -= step(distance(remap, center), 0.24);

    float core = step(distance(remap, center), 0.24);
    
    float quads = clamp(clamp(quad + quad2 + quad3 + quad4, 0.0, 1.0) - (outerRim + innerRim),0.0, 1.0);
    
    return uTargetColor * clamp(core + quads - innerRim - outerRim, 0.0, 1.0) + (innerRim + outerRim) * uSecondColor;
}

vec3 cell90(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    vec2 center = vec2(0.0, 0.0);
    
    float quad = 1.0 - step(remap.x + 0.5, remap.y);
    quad *= step(remap.x - 0.5, remap.y);
     quad *= 1.0 - step(-remap.x + 1.5, remap.y);
    quad *= step(-remap.x - 1.5, remap.y);
    
    float quad2 = 1.0 - step(remap.x + 0.5, -remap.y);
    quad2 *= step(remap.x - 0.5, -remap.y);
     quad2 *= 1.0 - step(-remap.x + 1.5, -remap.y);
    quad2 *= step(-remap.x - 1.5, -remap.y);
    
    float rim = step(distance(remap, center), 0.8);
    rim -= step(distance(remap, center), 0.6);
    
    float core = step(distance(remap, center), 0.3);
    return uTargetColor * clamp(clamp(quad + quad2, 0., 1.0) - (rim + core), 0.0, 1.0) + uSecondColor * (rim + core);// + rim - core;
}

vec3 cell100(vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
    vec2 remap = cellUV * 2.0 - 1.0;
    vec2 center = vec2(0.0, 0.0);
  float quad = 1.0 - step(remap.x + 1.0, remap.y);
    quad *= step(remap.x - 1.0, remap.y);
     quad *= 1.0 - step(-remap.x + 1.0, remap.y);
    quad *= step(-remap.x - 1.0, remap.y);
    
    float quad2 = step(distance(remap.x, 0.), 0.7);
    quad2 *= step(distance(remap.y, 0.), 0.7);
    quad2 = clamp(quad2 - step(distance(remap, center), 0.8), 0., 1.0);

    float cquad = step(remap.x, 0.9);
    cquad *= 1.0 - step(remap.x, 0.7);
    cquad *= step(remap.y, 0.9);
    cquad *= 1.0 - step(remap.y, 0.7);
    
    float cquad2 = 1.0 - step(remap.x, -0.9);
    cquad2 *= step(remap.x, -0.7);
    cquad2 *= step(remap.y, 0.9);
    cquad2 *= 1.0 - step(remap.y, 0.7);
    
    float cquad3 = 1.0 - step(remap.y, -0.9);
    cquad3 *= step(remap.y, -0.7);
    cquad3 *= step(remap.x, 0.9);
    cquad3 *= 1.0 - step(remap.x, 0.7);
   
    float cquad4 = 1.0 - step(remap.y, -0.9);
    cquad4 *= step(remap.y, -0.7);
    cquad4 *= 1.0 - step(remap.x, -0.9);
    cquad4 *= step(remap.x, -0.7);
    
    float circ = step(distance(remap, vec2(0.7,0.7)), 0.1);
    float circ2 = step(distance(remap, vec2(-0.7,0.7)), 0.1);
    float circ3 = step(distance(remap, vec2(0.7,-0.7)), 0.1);
    float circ4 = step(distance(remap, vec2(-0.7,-0.7)), 0.1);
    
    float outerRim = step(distance(remap, center), 0.8);
    outerRim -= step(distance(remap, center), 0.56);
    
    float rim = step(distance(remap, center), 0.4);
    rim -= step(distance(remap, center), 0.2);
    
    float core = step(distance(remap, center), 0.3);
    float quads = clamp(cquad + cquad2 + cquad3 + cquad4, 0., 1.0);
    float circs = clamp(circ + circ2 + circ3 + circ4, 0., 1.);
    
    return outerRim * mix(uSecondColor, uBackground, 0.5) + uSecondColor * clamp(quads + quad2 - circs + rim, 0., 1.0) + (clamp(quad - outerRim - rim, 0., 1.0) + circs) * uTargetColor;// - (outerRim + rim);
}

vec3 cellVal(float uvGray, vec2 cellUV, vec3 uTargetColor, vec3 uSecondColor){
  return uvGray > 0.9 ? cell100(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.81 ? cell90(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.72 ? cell80(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.63 ? cell70(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.54 ? cell60(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.45 ? cell50(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.36 ? cell40(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.27 ? cell30(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.18 ? cell20(cellUV, uTargetColor, uSecondColor) : 
      uvGray > 0.09 ? cell10(cellUV, uTargetColor, uSecondColor) : vec3(0.0);
}


void main() {
  
  vec2 uv = vUv;
  vec2 pix = gl_FragCoord.xy;
  vec2 pixelmap = fract(pix / pixelSize);
  // vec2 grouping = mod(floor(pix / pixelSize), 2.0);
  vec3 col = texture2D(uTexture, floor(pix / pixelSize) * pixelSize / uResolution.xy).rgb;
//  vec3 tex = col;
  vec3 final = cellVal(col.r, pixelmap, uTargetColor, uSecondColor);
  // vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
  // vec2 roundedUV = floor(vUv * 40.0) / 40.0;
  // roundedUV *= ratio;
  // vec3 col = texture2D(uTexture, roundedUV).rgb;
  // vec3 grid = vec3(fract(uv * 40.0 * ratio), 0.0);
  // vec3 col = texture2D(uTexture, floor(pix / 16.0) * 16.0 / uResolution.xy).rgb;
//   gl_FragColor = vec4(final, 1.0);

  gl_FragColor = vec4(final.r == 0. && final.g == 0. && final.b == 0. ? uBackground : final, 1.0);
}
