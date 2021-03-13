var mongoose=require("mongoose");
const comment = require("./comment");

var plantSchema = new mongoose.Schema({
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
    ],
    file: { 
        type: Object
    },
    city: String
});

module.exports=mongoose.model("plants",plantSchema);