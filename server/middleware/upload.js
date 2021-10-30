const multer = require("multer");
const mimeType = require("mime-types");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
         cb(null,"uploads")
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + "-"+ Date.now()+ "."+ mimeType.extension(file.mimetype))
    },
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"||
        file.mimetype === "image/gif" ||
        file.mimetype === "video/mp4"
    ) {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file), false); // if validation failed then generate error
    }
};

module.exports = multer({storage:storage, fileFilter: fileFilter })