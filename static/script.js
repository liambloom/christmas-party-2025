"use script";

function setCssDevicePixelRatio() {
    document.documentElement.style.setProperty("--device-pixel-ratio", devicePixelRatio);
    const media = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    media.addEventListener("change", setCssDevicePixelRatio);
    this.remove = () => media.removeEventListener("change", setCssDevicePixelRatio);
}
setCssDevicePixelRatio()



const ticketDiv = document.getElementById("ticket");

let initialRotationString, initialRotationNumber, initialMouseX, touchId;
let grabbing = false;
function grabStart(x) {
    grabbing = true;
    document.body.dataset.grabbing = "true";
    initialRotationString = getComputedStyle(document.getElementById("front")).rotate.split(" ")[1];
    initialRotationNumber = parseFloat(initialRotationString);
    initialMouseX = x;

    if (document.body.dataset.rotate === "auto") {
        document.body.dataset.rotate = "manual";

        ticketDiv.style.setProperty("--ticket-rotation", initialRotationString);
    }
}
function grabMove(x) {
    if (grabbing) {
        const dx = (x - initialMouseX) / ticketDiv.clientWidth * 180;
        ticketDiv.style.setProperty("--ticket-rotation", initialRotationNumber + dx + "deg");
    }
}
function grabEnd() {
    grabbing = false;
    document.body.dataset.grabbing = "false";
}

function getLongAxis(x, y) {
    return window.matchMedia(`(orientation: portrait)`).matches ? y : x
}
function mouseWrapper(callback) {
    return e => callback(getLongAxis(e.screenX, e.screenY));
}
function touchWrapper(callback) {
    return e => {
        let touch;
        if (grabbing) {
            e.preventDefault();
            touch = Array.from(e.touches).find(t => t.identifier === touchId);
        }
        else {
            touch = e.changedTouches[0]
            touchId = touch.identifier;
        }
        if (touch === undefined) {
            return;
        }
        callback(getLongAxis(touch.pageX, touch.pageY));
    }
}

window.addEventListener("mousemove", mouseWrapper(grabMove));
window.addEventListener("touchmove", touchWrapper(grabMove), {passive: false});

document.addEventListener("scroll", e => {
    if (grabbing) {
        e.preventDefault();
    }
}, {passive: false})

window.addEventListener("mouseup", grabEnd);
window.addEventListener("mouseleave", grabEnd);
window.addEventListener("touchend", grabEnd);
window.addEventListener("touchcancel", grabEnd);

function addStartListeners(element) {
    element.addEventListener("mousedown", mouseWrapper(grabStart));
    element.addEventListener("touchstart", touchWrapper(grabStart), {passive: false});
}

if (matchMedia("(pointer: fine)").matches) {
    for (let img of ticketDiv.getElementsByTagName("img")) {
        addStartListeners(img)
    }
}
else {
    addStartListeners(ticketDiv);
}


// document.getElementById("debug").innerHTML = `
// width: ${window.screen.width}
// <br>
// height: ${window.screen.height}
// <br>
// devicePixelRation: ${devicePixelRatio}
// `