// Require User Model and signToken
const 
    User = require('../models/User.js');
    // signToken = require('../serverAuth').signToken;

// Make controllers exportable
module.exports = {
    create: async ( req, res ) => {
        console.log(req.body);
    
        let user = new User ({ 
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        });
    
        try {
            const savedUser = await user.save();
            res.status(200).send(savedUser);
        } catch (err) {
            res.status(404).send(err);
            console.log(err);
        }
    },
    index: async ( req, res ) => {
        console.log(`Finding ALL users in database.`);
        try {
            const users = await User.find({});
            res.status(200).send(users);
            console.log(`Here's the total list of ${users.length} many users: ${users}`);
        } catch(err) {
            res.status(400).send({ errorMsg: error });
            console.log(error);
        }
    },
    show: async ( req, res ) => {
        console.log(`Finding userID: ${req.params.id}`)
    
        try {
            const foundUser = await User.find({ _id: req.params.id });
            res.status(200).send(foundUser);
            console.log(`Found user: ${foundUser}`)
        } catch(err) {
            res.status(400).send({ errorMsg: error });
        }
    
    },
    update: ( req, res ) => {
        console.log(`User to be updated: ${req.params.id}`)
    
        User.findById(req.params.id, ( err, updatedUser) => {
            if (!req.body.password) delete req.body.password
            Object.assign( updatedUser, req.body )
            updatedUser.save(( err, updatedUser ) => {
                if (err) res.json({ message: "ERROR", payload: null, code: err.code })
                res.json({ message: "Successfully updated the user!", payload: updatedUser})
            })
        })
    },
        //         {
        //             email: req.body.email,
        //             firstName: req.body.firstName,
        //             lastName: req.body.lastName,
        //             username: req.body.username,
        //             password: req.body.password
        //         });
        //     const updatedUser = await user.save();
        //     res.status(200).send(`Successfully updated: ${foundUser} to ${updatedUser}`);
        //     console.log(`Successfully updated ${updatedUser}`)
        // } catch (err) {
        //     res.status(400).send(err);
        //     console.log(err);
        // } 
    
    destroy: async ( req, res ) => {
        console.log(`Finding user id# ${req.params.id} to delete`);
        try {
            const foundUser = await User.findOneAndDelete({ _id: req.params.id });
            const deletedUser = await foundUser.save();
            res.status(200).send(`Successfully deleted: ${deletedUser}`);
        } catch (err) {
            res.status(400).send(err);
            console.log(err);
        }   
    },
    // Render Login

    // Login & Sign out
    login: async ( req, res ) => {
        // Changed req.body.mail to req.body.input so it can intake either a username OR password to check
        console.log(`Finding user ${req.body.input} to login`)

        try {
            const user = await User.findByCredentials( req.body.input, req.body.password );
                console.log(`Login... this is my found user: ${user}`);
            const createdToken = await user.signToken();
                console.log(`${user.email} is successfully logged in and given an auth token`)
            
            res.status(200).header('x-auth', createdToken).send(user).redirect(307, '/profile');
        } catch (err) {
            console.log(`ERROR: invalid credentials`);
            res.status(400).send({ errorMsg: err, message: `ERROR: invalid credentials. Access denied.`})
        }
    }
}