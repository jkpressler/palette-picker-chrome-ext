document.getElementById("pickColor").addEventListener("click", async () => {
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    const color = result.sRGBHex;

    // Save to storage
    chrome.storage.local.get(["palette"], (result) => {
      const palette = result.palette || [];
      palette.push(color);
      chrome.storage.local.set({ palette }, () => {
        renderPalette(palette);
      });
    });
  } catch (err) {
    console.error(err);
  }
});

// 🆕 Clear button handler
document.getElementById("clearColors").addEventListener("click", () => {
  chrome.storage.local.set({ palette: [] }, () => {
    renderPalette([]);
  });
});

function renderPalette(palette) {
  const container = document.getElementById("palette");
  container.innerHTML = "";
  palette.forEach((color) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;

    const label = document.createElement("div");
    label.textContent = color;
    label.style.textAlign = "center";
    label.style.fontSize = "12px";
    label.style.marginTop = "4px";

    wrapper.appendChild(swatch);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

// Load saved palette on open
chrome.storage.local.get(["palette"], (result) => {
  renderPalette(result.palette || []);
});
