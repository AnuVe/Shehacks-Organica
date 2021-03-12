var mongoose=require("mongoose");

var plantSchema = new mongoose.Schema({
    name: String,
    image: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


var Plant = mongoose.model("Plant", plantSchema);

module.exports=mongoose.model("plants",plantSchema);