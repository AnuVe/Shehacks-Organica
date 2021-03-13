var express = require("express");
var router = express.Router({mergeParams: true});
var Plant = require("../models/plant")
var Comment= require("../models/comment")

router.get("/new", isLoggedIn, function(req,res){
    Plant.findById(req.params.id, function(err,plant){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{plant:plant});
        }
    })
});

router.post("/", isLoggedIn, function(req,res){
    Plant.findById(req.params.id,function(err,plant){
        if(err){
            console.log(err);
            res.redirect("/plants");
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    plant.comments.push(comment);
                    plant.save();
                    res.redirect('/plants/'+plant._id);
                }
            });
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