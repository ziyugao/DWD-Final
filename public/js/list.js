const container = document.getElementById("list-container");

async function getImages() {
    const res = await fetch("/api/v1/images", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    const images = await res.json();
    return images;
}

function addImagesToHTML(images) {
    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        const div = document.createElement("div");
        div.id = image._id;
        div.className = "image-element"
        div.innerHTML = `
            <img src="${image.data}" />
            <button onclick="deleteSingle('${image._id}')" class="delete-button">x</button>
        `
        container.appendChild(div)
    }
}

async function deleteSingle(id) {
    await fetch("/api/v1/images/id", {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    })

    const div = document.getElementById(id);
    container.removeChild(div);
}

async function deleteAll() {
    await fetch("/api/v1/images/*", {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    })

    container.innerHTML = '';
}

async function process() {
    // Get images
    const images = await getImages();

    // Put images into the container
    addImagesToHTML(images)
}

process()