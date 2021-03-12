var mongoose = require("mongoose");
var Plants = require("./models/plant");
var Comment = require("./models/comment");

var data =[
    {
        name: "Tulsi",
        image: "https://tse1.mm.bing.net/th?id=OIP.pS0v-daAdrl7VCEBehbBdwHaD4&pid=Api&P=0&w=333&h=176"
    },
    {
        name: "Neem",
        image: "https://tse1.mm.bing.net/th?id=OIP.bNQLJm0qZ5k4_spFcnElYwHaNL&pid=Api&P=0&w=300&h=300"
    }
]


function seedDB(){
    Plants.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Plants");
        data.forEach(function(seed){
            Plants.create(seed,function(err,plant){
                if(err){
                    console.log(err)
                } else{
                    console.log("added a plant");
                    Comment.create(
                        {
                            text:"Nice",
                            author:"Homer"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            } else{
                                plant.comments.push(comment);
                                plant.save();
                                console.log("created");
                            }
                        });
                }
            });
        });
    }); 
}


module.exports = seedDB; 