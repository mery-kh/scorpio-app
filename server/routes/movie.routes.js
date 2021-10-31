const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie.controller')
const {body, query, check} = require("express-validator");
const upload = require('../middleware/upload')
const multer = require("multer");
router.post('/upload-movie',
    upload.fields([
        {
            name: 'movie', maxCount: 1
        }, {
            name: 'cover_image', maxCount: 1
        }
        ]),
    function (err, req, res, next) {
        if (err instanceof multer.MulterError) {
            res.json({ error: "Invalid File format. Should be PNG,JPG,JPEG,GIF OR MP4" })
        } else next();
    }, movieController.uploadMovie);
router.delete('/delete-movie/:id', movieController.deleteMovie);
router.get('/get-all-movies', movieController.getAllMovies);
router.patch('/update-movie/:id', upload.single('cover_image'), movieController.updateMovie)
module.exports = router;