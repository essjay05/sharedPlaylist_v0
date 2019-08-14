// Require mongoose, jwt, and bcrypt to create model
const
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs');

// Create new UserSchema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    firstName: {
        type: String,
        minlength: 1
    },
    lastName: {
        type: String,
        minlength: 1
    },
    username: {
        type: String,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }] 
}, { timestamps: true })

// Custom Methods/Statics
    // Generate Auth Token
    UserSchema.methods.signToken = async function() {
        let user = this;
        console.log(`signToken user is: ${user}`)
        let access = 'auth';

        let token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, { expiresIn: '30s' }).toString();
        console.log(`token created from jwt.sign is: ${token}`)
        // Adding access and token variables to our user.tokens array
        user.tokens = user.tokens.concat([{ access, token }]);

        // Await result of user.save function
        const savedToken = await user.save();
        console.log(`savedToken after creation is: ${savedToken}`)
        return token;
    };

    // FindByToken method
    UserSchema.statics.verifyToken = async function(token) {
        let User = this;
        var decoded;

        try {
            decoded = jwt.verify( token, process.env.JWT_SECRET );
        } catch (err) {
            console.log(err);
            return Promise.reject();
        }

        try {
            const foundUser = await User.findOne({ 
                '_id': decoded._id,
                'tokens.token': token,
                'tokens.access': 'auth'
            });

            console.log(foundUser);
            return foundUser;
        } catch (err) {
            console.log(err);
            return Promise.reject();
        }
    };

    // Static method to allow to find user by email or password:
    UserSchema.statics.findByCredentials = async function( email, password ) {
        let User = this;

        try {
            const foundUser = await User.findOne({ email });
            // if NOT found
            if (!foundUser) {
                console.log(`ERROR: User not found`)
                return Promise.reject();
            }
            const matchedPw = await foundUser.comparePassword( password );
                console.log(`FindByCredentials matchedPw is : ${ matchedPw }`);
                console.log(`FindByCredentials foundUser is: ${ foundUser }`)
                return Promise.resolve(foundUser);
        } catch (err) {
            console.log(`ERROR: Invalid credentials`)
            return Promise.reject();
        }
    }
    // Compare hashed user password to allow user to login if matched
    UserSchema.methods.comparePassword = async function( password ) {
        const match = await bcrypt.compare( password, this.password );
        if (!match) {
            console.log(`Password is invalid.`)
            return Promise.reject();
        } console.log(`comparePassword match is: ${match}`)
        console.log(`Success! Password is a match!`);
        return Promise.resolve(match);
    }
    // Bcrypt hash password before creating new user
    UserSchema.pre('save', function(next) {
        let user = this;

        if  (user.isModified('password')) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    next();
                })
            })
        } else {
            next();
        }
    });

// Make Exportable
const User = mongoose.model('User', UserSchema);
module.exports = User;