
export async function renderImages(files, container) {
    var reader = new FileReader();
    files = Array.prototype.slice.call(files);
    for( const file of files)
            await renderImage(reader, file, container);
}

function renderImage(reader, file, container) {
    let promise = new Promise( (resolve, reject) => {
            reader.onload = function(e) {
                    // console.log(e.target.result);
                    const imageContainer = document.createElement("li");
                    const image = document.createElement("img");
                    image.setAttribute('src', e.target.result);
                    image.classList.add("uploaded-image")
                    imageContainer.appendChild(image);
                    container.append(imageContainer);
                    resolve();
                    }
    })
    reader.readAsDataURL(file);
    return promise;
}
