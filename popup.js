const pickBtn = document.getElementById("pickColor");
const clearBtn = document.getElementById("clearColors");
const paletteContainer = document.getElementById("palette");

pickBtn.addEventListener("click", async () => {
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    const color = result.sRGBHex;

    chrome.storage.local.get(["palette"], (data) => {
      const palette = data.palette || [];
      palette.push(color);
      chrome.storage.local.set({ palette }, () => {
        renderPalette(palette);
      });
    });
  } catch (err) {
    console.error(err);
  }
});

clearBtn.addEventListener("click", () => {
  chrome.storage.local.set({ palette: [] }, () => {
    renderPalette([]);
  });
});

function renderPalette(palette) {
  paletteContainer.innerHTML = "";

  if (palette.length === 0) {
    clearBtn.style.display = "none";
    return;
  } else {
    clearBtn.style.display = "block";
  }

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
    paletteContainer.appendChild(wrapper);
  });
}

// Load saved palette on popup open
chrome.storage.local.get(["palette"], (data) => {
  renderPalette(data.palette || []);
});
