var mongoose=require("mongoose");
const comment = require("./comment");

var plantSchema = new mongoose.Schema({
    image: String,
    description: String,
    plantType: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String	
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports=mongoose.model("plants",plantSchema);