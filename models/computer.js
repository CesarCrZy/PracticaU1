var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var compuSchema = mongoose.Schema({
    nameArtist: { type: String, unique: false},
    song: { type: String},
    user: {type: String},
    link: {type: String}
    //description: { type: String, required: true },
    //defense: { type: Number, required: true },
    //category: { type: String, },
    //weight: { type: Number, },
},{ _id: 1});






var donothing = () => {

}

compuSchema.pre("save", function(done) {
    var compu = this;

    if (!compu.isModified("password")) {
        return done();
    }
    
});


compuSchema.methods.name = function() {
    return this.nameArtist || this.song;
    //return this.description || this.defense;
}

var Compu = mongoose.model("Computers", compuSchema);

module.exports = Compu;