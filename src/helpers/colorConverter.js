export function hexToRgb(hex){
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
   ].join(",") : "";
}

export function rgbToHex(r, g, b){
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}