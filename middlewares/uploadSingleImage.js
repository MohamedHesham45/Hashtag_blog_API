const imagekit = require('../utils/ImageKit');
const sharp = require('sharp');
const CustomError = require('../utils/customError');

const singleImageUpload = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    try {
        

        const response = await imagekit.upload({
            file: req.file.buffer, 
            fileName: `image` + Date.now(),
            folder: 'test'
        });
        if(req.user)req.user.image = response.url; 
        else req.user=response.url
        next();
    } catch (err) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports = singleImageUpload;