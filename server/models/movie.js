const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    title: {type:String, required: true},
    description: {type:String, required: true},
    director: {type:String, required: true},
    cover_image: {type: String, default: 'uploads/default.jpg'},
    movie: {type:String, required: true},
    date: { type: Date, required: true}
}, {versionKey:false, timestamps:true})

MovieSchema.set('collection', 'movies')

module.exports = mongoose.model('Movie', MovieSchema)