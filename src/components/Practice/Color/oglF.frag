#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 uResolution;
uniform float uTime;

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

void main(){
    float ratio = uResolution.x/uResolution.y;
    vec2 st = vUv;
    vec3 color = vec3(0.0);


    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    toCenter = ratio > 1.0 ? vec2(toCenter.x*ratio, toCenter.y) : vec2(toCenter.x, toCenter.y/ratio);
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI + (uTime / 10.))+0.5,radius,1.0));
    float valid = 1.0 -  step(1.0, radius);
    // color = vec3(sin(uTime / 30.), 1.0, 0.);
    gl_FragColor = vec4(color * valid, 1.0);
}