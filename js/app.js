const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const grayRamps = 
    [
    " =+*#%@",
    " ~}|{_^]\[@?>=<;:/.-,+*)('&%$#\"!",
    " _.,-=+:;cba!?0123456789$W#@Ñ",
    " .:░▒▓█"
    ];
let grayRamp = grayRamps[0];

const rampLength = grayRamp.length;

const MAXIMUM_WIDTH = 80;
const MAXIMUM_HEIGHT = 50;

const picture_input = document.querySelector("#picture-input");
const picture_input_label = document.querySelector('[for="picture-input"]');

const convert_btn = document.querySelector("#upload");

const comput_btn = document.querySelector("#comput");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const asciiImage = document.querySelector("pre#ascii");

picture_input.onchange = e => {
    picture_input_label.classList.add("frame");
};

convert_btn.addEventListener("click", displayAscii);
comput_btn.addEventListener("click", () => {
    grayRamp = grayRamp.split("").reverse().join("");
    displayAscii();
});

function displayAscii() {
    const file = picture_input.files[0];

    if (file == null) {
        asciiImage.innerHTML = "<p style='font-size:2rem;'>Choose a picture</p>";
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const image = new Image();
        image.onload = () => {
            const [width, height] = clampDimensions(image.width, image.height);

            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);
            const grayScales = convertToGrayScales(context, width, height);

            drawAscii(grayScales, width);
        };

        image.src = event.target.result;
    });
    reader.readAsDataURL(file);
}


const convertToGrayScales = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[
            i + 2
        ] = grayScale;

        grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0, 0);

    return grayScales;
};

const getCharacterForGrayScale = grayScale =>
    grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        if ((index + 1) % width === 0) {
            nextChars += "\n";
        }

        return asciiImage + nextChars;
    }, "");

    asciiImage.textContent = ascii;
};

const clampDimensions = (width, height) => {
    const rectifiedWidth = Math.floor(getFontRatio() * width);

    if (height > MAXIMUM_HEIGHT) {
        const reducedWidth = Math.floor(rectifiedWidth * MAXIMUM_HEIGHT / height);
        return [reducedWidth, MAXIMUM_HEIGHT];
    }

    if (width > MAXIMUM_WIDTH) {
        const reducedHeight = Math.floor(height * MAXIMUM_WIDTH / rectifiedWidth);
        return [MAXIMUM_WIDTH, reducedHeight];
    }

    return [rectifiedWidth, height];
};

const getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";

    document.body.appendChild(pre);
    const { width, height } = pre.getBoundingClientRect();
    document.body.removeChild(pre);

    return height / width;
};

const fontRatio = getFontRatio();

const grayRampChoices = document.getElementsByClassName('ascii-choice');
document.querySelectorAll('.ascii-choice').forEach(item => {
    item.addEventListener('click', event => {
        grayRampId = item.id.slice(-1);
        grayRamp = grayRamps[grayRampId];
        displayAscii();
    })
})