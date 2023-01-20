const fs = require('fs');
const dir = './saved-images';


renderGallery();

const onUploadCarrotClick = () => {

};

const renderGallery = () => {
    fs.readdir(dir, (err, files) => {
    console.log(files.length);
    });
}