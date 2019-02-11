var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{type: String, required: true},
    bio:{type: String}
});






var donothing = () => {

}

userSchema.pre("save", function(done) {
    var user = this;

    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, donothing,
            (err, hashpassword) => {
                if (err) {
                    return done(err);
                }
                user.password = hashpassword;
                done();
            });
    });
});

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

userSchema.methods.name = function() {
    return this.displayName || this.username || this.role || this.bio;
}

var User = mongoose.model("User", userSchema);

module.exports = User;