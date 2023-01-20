// carrot types

const clickRealisticCarrot = () => {
    document.getElementById("carrotImg").src = "images/realistic_carrot.png";
}

const clickRealisticCarrots = () => {
    document.getElementById("carrotImg").src = "images/realistic_carrots.png";
}

const clickCartoonCarrot = () => {
    document.getElementById("carrotImg").src = "images/cartoon_carrot.png";
}

const clickCheese = () => {
    document.getElementById("carrotImg").src = "images/cheese.png";
}


// carrot colors

const clickOrangeCarrot = () => {
    document.getElementById("carrotImg").style.filter = "none";
}

const clickGreenCarrot = () => {
    document.getElementById("carrotImg").style.filter = "hue-rotate(90deg)";
}

const clickBlueCarrot = () => {
    document.getElementById("carrotImg").style.filter = "hue-rotate(200deg)";
}

const clickHotPinkCarrot = () => {
    document.getElementById("carrotImg").style.filter = "hue-rotate(300deg)";
}


// carrot accessories

const addRabbit = () => {
    let existingRabbit = document.getElementById("rabbitImg");

    if (!existingRabbit) {
        let rabbitImg = document.createElement("img");
        rabbitImg.setAttribute('src', 'images/rabbit.png');
        rabbitImg.setAttribute('alt', 'rabbit');
        rabbitImg.setAttribute('width', '10%');
        rabbitImg.setAttribute('id', 'rabbitImg');
        document.getElementById("carrotGame").appendChild(rabbitImg);
    } else {
        existingRabbit.remove();
    }
}

const addSunflower = () => {
    let existingSunflower = document.getElementById("sunflowerImg");

    if (!existingSunflower) {
        let sunflowerImg = document.createElement("img");
        sunflowerImg.setAttribute('src', 'images/sunflower.png');
        sunflowerImg.setAttribute('alt', 'sunflower');
        sunflowerImg.setAttribute('width', '10%');
        sunflowerImg.setAttribute('id', 'sunflowerImg');
        document.getElementById("carrotGame").appendChild(sunflowerImg);
    } else {
        existingSunflower.remove();
    }
}

const addKale = () => {
    let existingKale = document.getElementById("kaleImg");

    if (!existingKale) {
        let kaleImg = document.createElement("img");
        kaleImg.setAttribute('src', 'images/kale.png');
        kaleImg.setAttribute('alt', 'kale');
        kaleImg.setAttribute('width', '10%');
        kaleImg.setAttribute('id', 'kaleImg');
        document.getElementById("carrotGame").appendChild(kaleImg);
    } else {
        existingKale.remove();
    }
}

const addDog = () => {
    let existingDog = document.getElementById("dogImg");

    if (!existingDog) {
        let dogImg = document.createElement("img");
        dogImg.setAttribute('src', 'images/dog.png');
        dogImg.setAttribute('alt', 'dog');
        dogImg.setAttribute('width', '10%');
        dogImg.setAttribute('id', 'dogImg');
        document.getElementById("carrotGame").appendChild(dogImg);
    } else {
        existingDog.remove();
    }
}

const removeAllCompanions = () => {
    let rabbitElement = document.getElementById("rabbitImg");
    let sunflowerElement = document.getElementById("sunflowerImg");
    let kaleElement = document.getElementById("kaleImg");
    let dogElement = document.getElementById("dogImg");

    if (rabbitElement) {
        document.getElementById("rabbitImg").remove();
    }

    if (sunflowerElement) {
        document.getElementById("sunflowerImg").remove();
    }

    if (kaleElement) {
        document.getElementById("kaleImg").remove();
    }

    if (dogElement) {
        document.getElementById("dogImg").remove();
    }
}


// background colors

const clickCloudBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "url(images/clouds.jpg)";
}

const clickSpaceBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "url(images/space.jpg)";
}

const clickAnimeBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "url(images/anime.jpg)";
}

const clickNYCBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "url(images/nyc.jpg)";
}

const clickWhiteBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "none";
    document.getElementById("carrotGame").style.backgroundColor = "#fff";
}

const clickNoBackground = () => {
    document.getElementById("carrotGame").style.backgroundImage = "none";
    document.getElementById("carrotGame").style.backgroundColor = "rgb(227, 205, 176)";
}


// text

const onAddText = () => {
    let textValue = document.getElementById("textInput").value;
    let textElement = document.getElementById("textBox");
    if (textElement.innerHTML = "" || !textElement.innerHTML) {
        textElement.style.backgroundColor = "white";
        textElement.style.padding = "0.5rem";
        textElement.style.border = "01.rem solid green";
        textElement.style.boxShadow = "8px 8px green";
        textElement.style.borderRadius = "0.5rem";
        textElement.style.margin = "1rem";

        textElement.innerHTML = textValue;
    } else {
        textElement.innerHTML = textValue;
    }
}

const onRemoveText = () => {
    let textElement = document.getElementById("textBox");

    textElement.innerHTML = "";
    textElement.style.backgroundColor = "";
    textElement.style.padding = "";
    textElement.style.border = "";
    textElement.style.boxShadow = "";
    textElement.style.borderRadius = "";
    textElement.style.margin = "";
}


// download 

// const onDownloadClick = () => {
//         let element = $("#carrotGame"); // global variable
//         let getCanvas; // global variable

//         console.log("element: ", element);
//         html2canvas(element, {
//             onrendered: function(canvas) {
//                 getCanvas = canvas;
//                 var imageData = getCanvas.toDataURL("image/png");
//                 var a = document.createElement("a");
//                 a.href = imageData; //Image Base64 Goes here
//                 a.download = "Image.png"; //File name Here
//                 a.click(); //Downloaded file
//             }
//         });

// }

$(document).ready(function() {
    let element = $("#carrotGame"); // global variable
    let getCanvas; // global variable

    $("#downloadCarrot").on('click', function() {
        html2canvas(element, {
            onrendered: function(canvas) {
                getCanvas = canvas;
                var imgageData = getCanvas.toDataURL("image/png");
                var a = document.createElement("a");
                a.href = imgageData; //Image Base64 Goes here
                a.download = "Image.png"; //File name Here
                a.click(); //Downloaded file
            }
        });
    });
});
