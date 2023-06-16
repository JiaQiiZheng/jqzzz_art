// improvement of react zmage
export function handleDoubleClickZoom() {
  document.getElementById("zmageControlZoom").click();
}
export function handleEsc() {
  document.getElementById("zmageControlClose").click();
}
export const handleBrowsing = (state) => {
  if (state) {
    document.getElementById("zmageImage").ondblclick = handleDoubleClickZoom;
  }
  return;
};
export const handleZooming = (state) => {
  if (state) {
    // document.getElementById("zmageImage").onclick = handleEsc;
  }
};
