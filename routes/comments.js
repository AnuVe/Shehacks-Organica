var express = require("express");
var router = express.Router({mergeParams: true});
var Plant = require("../models/plant")
var Comment= require("../models/comment")
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req,res){
    Plant.findById(req.params.id, function(err,plant){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{plant:plant});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req,res){
    Plant.findById(req.params.id,function(err,plant){
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    plant.comments.push(comment);
                    plant.save();
                    res.redirect('/plants/'+plant._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {plant_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        }else {
            res.redirect("/plants/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect(back);
        } else {
            res.redirect("/plants/" + req.params.id);
        }
    });
});


module.exports = router;