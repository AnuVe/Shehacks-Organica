const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
var middleware = require("../middleware"); 
var Plant=require("../models/plant");

require('dotenv').config();

module.exports = (upload) => {
    const uri = process.env.MONGO_URL;
    const connect = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = Grid(connect.db, mongoose.mongo);
        gfs.collection("uploads");
    });

    imageRouter.get('/files', (req, res) => {
        gfs.files.find().toArray((err, files) => {
            //check if files
            if(!files || files.length===0) {
                return res.status(404).json({
                    err:'No files exist'
                });
            }
            //files exist
            return res.json(files);
        }); 
    });

    imageRouter.get('/image/:filename', (req, res) => {
        gfs.files.findOne({filename: req.params.filename}, (err, file) => {
            if(!file || file.length ===0) {
                return res.status(404).json({
                    err: "No file exists"
                });
            }
            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err:"Not an image"
                });
            }
        });
    });

    imageRouter.post("/plants", upload.single("file"), middleware.isLoggedIn, function (req, res) {
        //console.log(req.file);
        var desc = req.body.description;
        var plantType = req.body.plantType;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newPlant = {description: desc, author: author, plantType:plantType, file:req.file}
        Plant.create(newPlant, function(err, newlyCreated) {
            if(err) {
                console.log(err);
            } else {
                console.log(newlyCreated);
                //res.redirect("/plants");
            }
        });
        res.redirect("/plants");
        //res.json({file: req.file});
    });

    return imageRouter;
}