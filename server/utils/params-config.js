const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-9a38b03d-fcb3-4588-9da1-121b80dc8d0a',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer,
    };

    return imageParams;
};

module.exports = params;