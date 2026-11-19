// CC0-1.0. Original synthetic controls by objekts; no supplied artwork or model.
// Run: node premultiplied_alpha_warp_control_v1.js
// Numeric reference, not an optimized animation renderer or a Canvas runtime test.
"use strict";

const assert = require("node:assert/strict");

// Contract: RGBA components 0..255, encoded sRGB numbers; integer coordinates
// name texel centers. This isolates alpha handling, not linear-light filtering.
function sample(image, x, y, {premultiply=true, border="transparent"}={}) {
  const {width, height, data} = image;
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw Error("non-finite coordinate");
  if (border!=="transparent" && border!=="clamp") throw Error("unknown border policy");
  const ix=Math.floor(x), iy=Math.floor(y), fx=x-ix, fy=y-iy;
  const taps=[[ix,iy,(1-fx)*(1-fy)], [ix+1,iy,fx*(1-fy)],
    [ix,iy+1,(1-fx)*fy], [ix+1,iy+1,fx*fy]];
  let alpha=0, r=0, g=0, b=0;
  for (let [px,py,weight] of taps) {
    if (weight===0) continue;
    if (border==="clamp") {
      px=Math.max(0,Math.min(width-1,px));
      py=Math.max(0,Math.min(height-1,py));
    } else if (px<0 || py<0 || px>=width || py>=height) {
      continue; // A transparent-black tap contributes zero, without renormalization.
    }
    const offset=4*(py*width+px), a=data[offset+3]/255;
    alpha+=weight*a;
    const colorWeight=weight*(premultiply?a:1);
    r+=colorWeight*data[offset];
    g+=colorWeight*data[offset+1];
    b+=colorWeight*data[offset+2];
  }
  if (premultiply) return alpha>0?[r/alpha,g/alpha,b/alpha,255*alpha]:[0,0,0,0];
  return [r,g,b,255*alpha]; // Deliberately flawed straight-alpha interpolation.
}

function inverseWarp(image, map) {
  const out=new Uint8ClampedArray(image.data.length);
  for (let y=0;y<image.height;y++) for (let x=0;x<image.width;x++) {
    const [sx,sy]=map(x,y);
    out.set(sample(image,sx,sy),4*(y*image.width+x));
  }
  return out;
}

// Source-over in the same declared numerical color space.
function over(foreground, background) {
  const a=foreground[3]/255, ba=background[3]/255;
  const outAlpha=a+ba*(1-a);
  if (outAlpha===0) return [0,0,0,0];
  return [0,1,2].map(c=>(foreground[c]*a+background[c]*ba*(1-a))/outAlpha)
    .concat(255*outAlpha);
}

function near(actual, expected, name) {
  assert.equal(actual.length,expected.length,name+" component count");
  actual.forEach((value,i)=>assert.ok(Number.isFinite(value)&&Math.abs(value-expected[i])<1e-9,
    `${name}: component ${i}, got ${value}, expected ${expected[i]}`));
}

function runFixture() {
  const red=[255,0,0,255], invisibleBlue=[0,0,255,0], invisibleBlack=[0,0,0,0];
  const pair=hidden=>({width:2,height:2,
    data:new Uint8ClampedArray([...red,...hidden,...red,...hidden])});
  const premult=sample(pair(invisibleBlue),0.5,0.5);
  const straight=sample(pair(invisibleBlue),0.5,0.5,{premultiply:false});
  const straightBlack=sample(pair(invisibleBlack),0.5,0.5,{premultiply:false});
  near(premult,[255,0,0,127.5],"opaque red / invisible blue midpoint");
  near(straight,[127.5,0,127.5,127.5],"straight-alpha negative control");
  near(straightBlack,[127.5,0,0,127.5],"straight-alpha with canonical invisible black");
  near(sample(pair(invisibleBlack),0.5,0.5),[255,0,0,127.5],
    "changing alpha-zero RGB must not change the filtered result");
  const white=[255,255,255,255], black=[0,0,0,255];
  near(over(premult,white),[255,127.5,127.5,255],"premultiplied result over white");
  near(over(straight,white),[191.25,127.5,191.25,255],"negative control over white");
  near(over(straightBlack,white),[191.25,127.5,127.5,255],"dark-edge negative control over white");
  near(over(premult,black),[127.5,0,0,255],"premultiplied result over black");
  near(over(straight,black),[63.75,0,63.75,255],"negative control over black");
  const partial=pair([0,0,255,85]);
  near(sample(partial,0.5,0.5),[191.25,0,63.75,170],
    "two nonzero alphas give red:blue contribution ratio 3:1");

  const single={width:1,height:1,data:new Uint8ClampedArray(red)};
  const halfEdges=[[-0.5,0],[0.5,0],[0,-0.5],[0,0.5]];
  for (const [x,y] of halfEdges) {
    near(sample(single,x,y),[255,0,0,127.5],"half-texel transparent border");
    near(sample(single,x,y,{border:"clamp"}),red,"clamp policy retains edge opacity");
  }
  for (const [x,y] of [[-1,0],[1,0],[0,-1],[0,1]])
    near(sample(single,x,y),[0,0,0,0],"entire sample outside support");
  near(sample(single,0,0),red,"identity at last and first texel");

  // A full-sized numerical buffer checks inclusive last row/column and center
  // convention. This is not a timing benchmark and contains no character art.
  const width=640,height=212,data=new Uint8ClampedArray(4*width*height);
  for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
    const edge=x===0||x===width-1||y===0||y===height-1;
    data.set([(17*x+y)%256,(x+19*y)%256,(x+7*y)%256,
      edge?255:[0,64,128,255][(x+3*y)%4]],4*(y*width+x));
  }
  const expected=data.slice();
  for(let i=0;i<expected.length;i+=4) if(expected[i+3]===0) expected.fill(0,i,i+3);
  const warped=inverseWarp({width,height,data},(x,y)=>[x,y]);
  let changedPixels=0;
  for(let i=0;i<warped.length;i+=4)
    if([0,1,2,3].some(c=>warped[i+c]!==expected[i+c])) changedPixels++;
  assert.equal(changedPixels,0,"identity warp preserves all visible RGBA and alpha; alpha-zero RGB canonicalized");

  // Two distinct hidden texels give the same flattened rest pixel under a fully
  // opaque cover, but different revealed pixels. Rest equality is insufficient.
  const blue=[0,0,255,255], cover=[80,80,80,255];
  const restA=over(cover,red),restB=over(cover,blue);
  near(restA,[80,80,80,255],"covered hidden candidate A");
  near(restB,[80,80,80,255],"covered hidden candidate B");
  const revealedA=over(invisibleBlack,red),revealedB=over(invisibleBlack,blue);
  near(revealedA,red,"revealed hidden candidate A");
  near(revealedB,blue,"revealed hidden candidate B");
  assert.notDeepEqual(revealedA,revealedB,"identical rest pixels cannot determine the hidden value");

  return {
    scope:"synthetic encoded-sRGB numerical sampling and compositing; no artwork, browser runtime, animation, CPU or cleanup validation",
    alphaControl:{premultipliedMidpoint:premult,straightMidpoint:straight,
      premultipliedOverWhite:over(premult,white),straightOverWhite:over(straight,white),
      straightBlackMidpoint:straightBlack,straightBlackOverWhite:over(straightBlack,white),
      alphaZeroRgbInvariant:true,unequalAlphaMidpoint:sample(partial,0.5,0.5)},
    borderControl:{policy:"transparent outside individual taps, no renormalization",
      halfTexelRgba:[255,0,0,127.5],clampComparisonRgba:red,edgesChecked:4,
      fullyOutsideRgba:[0,0,0,0]},
    identityControl:{width,height,pixels:width*height,edgePixels:2*width+2*(height-2),
      changedPixels,alphaZeroRgb:"canonical zero; hidden RGB bytes are not a visual identity criterion"},
    hiddenFeatureControl:{restA,restB,revealedA,revealedB,
      conclusion:"UNKNOWN: identical flattened rest pixels do not identify the covered texel"},
    result:"all numerical controls passed"
  };
}

module.exports={sample,inverseWarp,over,runFixture};
if(require.main===module) process.stdout.write(JSON.stringify(runFixture(),null,2)+"\n");
