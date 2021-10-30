const AppError = require('../managers/appError');
const Movie = require('../models/movie')
const fs = require('fs').promises;
const path = require('path');

class MovieController {
    async getAllMovies(req,res) {
        try{
            let images = await Movie.find();
            res.json({
                data: images,
            });
        }catch (e) {
            res.json({
                success: false,
                message: e.message
            });
        }
    }
    async uploadMovie(req,res){
        try {
                const movie ={
                    title: req.body.title,
                    description: req.body.description,
                    director: req.body.director,
                    movie: req.files?.movie[0]?.path,
                    date: req.body.date
                }
                if(req.files?.cover_image){
                    movie.cover_image =  req.files?.cover_image[0]?.path;
                }
            const newMovie = new Movie(movie);

            await newMovie.save();
            res.status(201).json({
                    success: true
                })
        }catch (e) {
            res.status(400).json({
                success: false,
                message: e.message
            });
            if(req.files.cover_image) {
                await fs.unlink(path.join(__homedir, req.files?.cover_image[0]?.path))
            }
            await fs.unlink(path.join(__homedir, req.files?.movie[0]?.path))
        }
    }
    async updateMovie(req, res) {
        try{
            const id = req.params.id;
            const postData = req.body;
            const post = await Movie.findByIdAndUpdate(id, { $set : postData}, {new:true});
            if(post) {
                res.send(post)
            }
            else throw new AppError('Not Found', 400);
        }catch (e) {
            res.status(400).json({
                success: false,
                message: e.message
            });
        }
    }
    async deleteMovie(req,res){
        try {
            const movie = await Movie.findById(req.params.id)
            if (movie) {
                if(movie.cover_image !== 'uploads/default.jpg') {
                    await fs.unlink(path.join(__homedir, movie.cover_image))
                }
                await fs.unlink(path.join(__homedir, movie.movie))
                await movie.remove();
                res.json({
                    success: true,
                });
            } else {
                throw new AppError('No movie found',400);
            }
        } catch (e) {
            res.status(e.httpStatus).json({
                success: false,
                message: e.message
            });
        }
    }
}
module.exports = new MovieController();