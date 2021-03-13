var express = require("express");
var router = express.Router();
var Plant=require("../models/plant");

router.get("/",function(req,res){
    Plant.find({}, function(err, allplants){
        if(err) {
            console.log(err);
        } else {
            res.render("plants/index", {plants: allplants});        
        }
    });
});

router.post("/",isLoggedIn,function(req,res){
    //res.send("POST");
    var name = req.body.name;
    var image = req.body.image;
    var newPlant = {name:name, image:image}
    Plant.create(newPlant, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/plants");
        }
    });
});

router.get("/new",isLoggedIn, function(req,res){
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
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
