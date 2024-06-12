const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new Schema({
    email: String,
    name: String,
    password: String,
    token: String,
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
}, { timestamps: true });

userSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.password = User.hashPassword(this.password)
    }
    next();
});

userSchema.method('comparePassword', function (password) { // prototype
    return bcrypt.compareSync(password, this.password);
});


userSchema.static('hashPassword', function (password) { // static
    return bcrypt.hashSync(password, saltRounds);
});

const User = model('User', userSchema);
module.exports = User
