const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const renderCanvas = document.getElementById("canvas-render");
const renderCtx = renderCanvas.getContext("2d");
let lastTime = 0;

const img = document.getElementById("img");

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

// Force initial resize
window.onresize();

// Colors array
const colors = [
    "#23a6d5",
    "#23d5ab",
    "#ee7752",
    "#e73c7e",
    "#23a6d5"
]

// Loop
function loop(time) {
    lastTime = time;
    draw(time, canvas, ctx);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function draw(time, canvas, ctx) {
    // Draw background
    const i1 = Math.floor(time / 10000) % colors.length;
    const i2 = Math.ceil(time / 10000) % colors.length;
    const t = time / 10000 - Math.floor(time / 10000);
    const color = colorLerp(colors[i1], colors[i2], t)
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    const imageSize = Math.min(canvas.width * 0.5, canvas.height * 0.5)
    ctx.drawImage(
        img, 
        canvas.width / 2 - imageSize / 2,
        canvas.height / 2 - imageSize / 2,
        imageSize, 
        imageSize
    );
}

// Lerping colors
function colorLerp(c1, c2, t) {
    c1 = Number.parseInt(c1.replace("#", ""), 16);
    c2 = Number.parseInt(c2.replace("#", ""), 16);
    
    const r1 = (c1 & 0xFF0000) >> 16;
    const r2 = (c2 & 0xFF0000) >> 16;
    const g1 = (c1 & 0xFF00) >> 8;
    const g2 = (c2 & 0xFF00) >> 8;
    const b1 = c1 & 0xFF;
    const b2 = c2 & 0xFF;
    
    const r = Math.floor((r1 * (1 - t) + r2 * t)) << 16;
    const g = Math.floor((g1 * (1 - t) + g2 * t)) << 8;
    const b = Math.floor((b1 * (1 - t) + b2 * t));
    
    return "#" + (r | g | b).toString(16);
}

function screenshot() {
    // Draw on render canvas
    draw(lastTime, renderCanvas, renderCtx)

    // Get image data
    const imageData = renderCanvas.toDataURL("image/jpeg", 1);

    // Send image data to api
    fetch("/api/v1/images", {
        method: "POST",
        body: JSON.stringify({ data: imageData }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// setInterval(() => {
//     console.log(document.body.style);
// }, 100)

// // function buttonClicked() {
// //     html2canvas(document.body)
// //         .then(canvas => {
// //             const imageData = canvas.toDataURL("image/png")
// //             console.log(imageData)
// //             // document.body.appendChild(canvas)
// //         })
// // }