var express = require("express");
var router = express.Router();
var Plant=require("../models/plant");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Plant.find({}, function(err, allplants){
        if(err) {
            console.log(err);
        } else {
            res.render("plants/index", {plants: allplants, currentUser: req.user});        
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    //res.send("POST");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPlant = {name:name, image:image, description: desc, author: author}
    Plant.create(newPlant, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/plants");
        }
    });
});

router.get("/add/new",middleware.isLoggedIn, function(req,res){
    res.render("plants/new");
});

router.get("/:id", function(req, res) {
    Plant.findById(req.params.id).populate("comments").exec(function(err, foundPlant) {
        if(err) {
            console.log(err);
        } else {
            res.render("plants/show",{plant: foundPlant});
        }
    });
});

router.get("/:id/edit", middleware.checkPlantOwnership, function(req, res) {
    Plant.findById(req.params.id, function(err, foundPlant) {
        res.render("plants/edit", {plant: foundPlant});
    });
});

router.put("/:id", middleware.checkPlantOwnership, function(req, res) {
    Plant.findByIdAndUpdate(req.params.id, req.body.plant, function(err, updatedPlant) {
        if(err) {
            res.redirect("/plants");
        } else {
            res.redirect("/plants/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkPlantOwnership, function(req, res) {
    Plant.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/plants");
        } else {
            res.redirect("/plants");
        }
    });
});

module.exports = router;
