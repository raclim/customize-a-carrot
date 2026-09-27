const canvas = document.getElementById("carrotGame");
const emptyMessage = document.getElementById("emptyMessage");
const selectionMessage = document.getElementById("selectionMessage");
const sizeControl = document.getElementById("sizeControl");
const sizeValue = document.getElementById("sizeValue");
const rotateControl = document.getElementById("rotateControl");
const rotateValue = document.getElementById("rotateValue");
const textInput = document.getElementById("textInput");

let selectedObject = null;
let highestZIndex = 1;

function getCanvasObjects() {
  return canvas.querySelectorAll(".canvas-object, .canvas-text");
}

function updateEmptyMessage() {
  const objects = getCanvasObjects();

  emptyMessage.style.display = objects.length === 0 ? "block" : "none";
}

function deselectObject() {
  if (selectedObject) {
    selectedObject.classList.remove("selected");
  }

  selectedObject = null;
  selectionMessage.textContent = "Select an object first.";
}

function selectObject(element) {
  if (selectedObject && selectedObject !== element) {
    selectedObject.classList.remove("selected");
  }

  selectedObject = element;
  selectedObject.classList.add("selected");
  selectionMessage.textContent = "Object selected!";

  updateControls();
}

// create img object
function createCanvasObject(src, x = null, y = null) {
  const img = document.createElement("img");

  img.src = src;
  img.classList.add("canvas-object");
  img.draggable = false;
  img.dataset.rotation = "0";
  img.style.width = "150px";
  img.style.zIndex = ++highestZIndex;

  // default to center of canvas
  if (x === null) {
    x = canvas.clientWidth / 2 - 75;
  }

  if (y === null) {
    y = canvas.clientHeight / 2 - 75;
  }

  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  canvas.appendChild(img);

  makeDraggable(img);
  selectObject(img);
  updateEmptyMessage();
}

function createTextObject(text) {
  const element = document.createElement("div");

  element.classList.add("canvas-text");
  element.textContent = text;
  element.dataset.rotation = "0";
  element.dataset.fontSize = "24";
  element.style.fontSize = "24px";
  element.style.left = `${canvas.clientWidth / 2 - 75}px`;
  element.style.top = `${canvas.clientHeight / 2 - 30}px`;
  element.style.zIndex = ++highestZIndex;
  canvas.appendChild(element);

  makeDraggable(element);
  selectObject(element);
  updateEmptyMessage();
}

function makeDraggable(element) {
  element.addEventListener("pointerdown", function (event) {
    event.preventDefault();

    selectObject(element);
    element.setPointerCapture(event.pointerId);

    const canvasRect = canvas.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const offsetX = event.clientX - elementRect.left;
    const offsetY = event.clientY - elementRect.top;

    function move(event) {
      let x = event.clientX - canvasRect.left - offsetX;
      let y = event.clientY - canvasRect.top - offsetY;

      // keep most of the object inside the canvas.
      const maxX = canvas.clientWidth - element.offsetWidth;
      const maxY = canvas.clientHeight - element.offsetHeight;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }

    function stop(event) {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", stop);
      element.removeEventListener("pointercancel", stop);

      try {
        element.releasePointerCapture(event.pointerId);
      } catch {
        // pointer might already be released
      }
    }

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", stop);
    element.addEventListener("pointercancel", stop);
  });
}

const assetButtons = document.querySelectorAll(".asset-button");

assetButtons.forEach((button) => {
  const img = button.querySelector("img");

  // add by click
  button.addEventListener("click", function () {
    createCanvasObject(button.dataset.src);
  });

  // add by drag
  button.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", button.dataset.src);
    event.dataTransfer.effectAllowed = "copy";
  });

  img.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", button.dataset.src);
    event.dataTransfer.effectAllowed = "copy";
  });
});

canvas.addEventListener("dragover", function (event) {
  event.preventDefault();
  canvas.classList.add("drag-over");
  event.dataTransfer.dropEffect = "copy";
});

canvas.addEventListener("dragleave", function () {
  canvas.classList.remove("drag-over");
});

canvas.addEventListener("drop", function (event) {
  event.preventDefault();
  canvas.classList.remove("drag-over");

  const src = event.dataTransfer.getData("text/plain");

  if (!src) {
    return;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const x = event.clientX - canvasRect.left - 75;
  const y = event.clientY - canvasRect.top - 75;

  createCanvasObject(src, x, y);
});

// click canvas to deselect
canvas.addEventListener("pointerdown", function (event) {
  if (event.target === canvas || event.target === emptyMessage) {
    deselectObject();
  }
});

// input controls
sizeControl.addEventListener("input", function (event) {
  if (!selectedObject) {
    return;
  }

  const size = Number(event.target.value);

  if (selectedObject.classList.contains("canvas-text")) {
    const fontSize = Math.max(12, Math.round(size / 5));

    selectedObject.style.fontSize = `${fontSize}px`;
    selectedObject.dataset.fontSize = fontSize;
    sizeValue.textContent = `${fontSize}px`;
  } else {
    selectedObject.style.width = `${size}px`;
    sizeValue.textContent = `${size}px`;
  }
});

rotateControl.addEventListener("input", function (event) {
  if (!selectedObject) {
    return;
  }

  const rotation = Number(event.target.value);

  selectedObject.dataset.rotation = rotation;
  selectedObject.style.transform = `rotate(${rotation}deg)`;
  rotateValue.textContent = `${rotation}°`;
});

function updateControls() {
  if (!selectedObject) {
    return;
  }

  const rotation = Number(selectedObject.dataset.rotation) || 0;

  rotateControl.value = rotation;
  rotateValue.textContent = `${rotation}°`;

  if (selectedObject.classList.contains("canvas-text")) {
    const fontSize = parseInt(getComputedStyle(selectedObject).fontSize);

    sizeControl.value = Math.min(500, Math.max(30, fontSize * 5));
    sizeValue.textContent = `${fontSize}px`;
  } else {
    const width = parseInt(getComputedStyle(selectedObject).width);

    sizeControl.value = Math.min(500, Math.max(30, width));
    sizeValue.textContent = `${width}px`;
  }
}

const colorButtons = document.querySelectorAll(".color-button");

colorButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (!selectedObject) {
      return;
    }

    // Filters only make sense for images.
    if (selectedObject.classList.contains("canvas-object")) {
      selectedObject.style.filter = button.dataset.filter;
    }
  });
});

function deleteSelectedObject() {
  if (!selectedObject) {
    return;
  }

  selectedObject.remove();
  selectedObject = null;
  selectionMessage.textContent = "Select an object first.";

  updateEmptyMessage();
}

document
  .getElementById("deleteButton")
  .addEventListener("click", deleteSelectedObject);

// keyboard delete
document.addEventListener("keydown", function (event) {
  const activeElement = document.activeElement;

  const userIsTyping = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

  if (userIsTyping) {
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();

    deleteSelectedObject();
  }
});

document.getElementById("duplicateButton")
  .addEventListener("click", function () {
    if (!selectedObject) {
      return;
    }

    const clone = selectedObject.cloneNode(true);
    clone.classList.remove("selected");

    const currentLeft = parseFloat(selectedObject.style.left) || 0;
    const currentTop = parseFloat(selectedObject.style.top) || 0;

    clone.style.left = `${currentLeft + 25}px`;
    clone.style.top = `${currentTop + 25}px`;
    clone.style.zIndex = ++highestZIndex;
    canvas.appendChild(clone);

    makeDraggable(clone);
    selectObject(clone);
    updateEmptyMessage();
  });

document.getElementById("bringForwardButton")
  .addEventListener("click", function () {
    if (!selectedObject) {
      return;
    }

    selectedObject.style.zIndex = ++highestZIndex;
  });

document.getElementById("sendBackwardButton")
  .addEventListener("click", function () {
    if (!selectedObject) {
      return;
    }

    const currentZ = Number(selectedObject.style.zIndex) || 1;
    selectedObject.style.zIndex = Math.max(1, currentZ - 1);
  });

document.getElementById("addTextButton").addEventListener("click", function () {
  const text = textInput.value.trim();

  if (!text) {
    return;
  }

  createTextObject(text);
  textInput.value = "";
});

textInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("addTextButton").click();
  }
});

const backgroundButtons = document.querySelectorAll("[data-background]");

backgroundButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const background = button.dataset.background;

    canvas.style.backgroundImage = "none";

    switch (background) {
      case "white":
        canvas.style.backgroundColor = "#ffffff";
        break;

      case "clouds":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage = "url('images/clouds.jpg')";
        break;

      case "space":
        canvas.style.backgroundColor = "#000000";
        canvas.style.backgroundImage = "url('images/space.jpg')";
        break;

      case "anime":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage = "url('images/anime.jpg')";
        break;

      case "nyc":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage = "url('images/nyc.jpg')";
        break;

      case "none":
        canvas.style.backgroundColor = "rgb(227, 205, 176)";
        break;
    }
  });
});

document.getElementById("resetButton").addEventListener("click", function () {
  const objects = getCanvasObjects();

  objects.forEach((object) => object.remove());
  selectedObject = null;
  highestZIndex = 1;
  canvas.style.backgroundImage = "none";
  canvas.style.backgroundColor = "#ffffff";
  selectionMessage.textContent = "Select an object first.";

  updateEmptyMessage();
});

document.getElementById("downloadCarrot")
  .addEventListener("click", async function () {
    const previousSelection = selectedObject;

    if (previousSelection) {
      previousSelection.classList.remove("selected");
    }

    // Hide empty canvas message from download.
    const previousEmptyDisplay = emptyMessage.style.display;
    emptyMessage.style.display = "none";

    try {
      const renderedCanvas = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const downloadLink = document.createElement("a");

      downloadLink.download = "custom-carrot.png";
      downloadLink.href = renderedCanvas.toDataURL("image/png");
      downloadLink.click();
    } catch (error) {
      console.error("Could not download carrot:", error);
      alert("Something went wrong while creating the image.");
    } finally {
      // Restore UI after download.
      if (previousSelection) {
        previousSelection.classList.add("selected");
      }

      emptyMessage.style.display = previousEmptyDisplay;
      updateEmptyMessage();
    }
  });

updateEmptyMessage();
