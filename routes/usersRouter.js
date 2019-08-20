// Require express and Routers
const
    express = require('express'),
    usersRouter = new express.Router(),
    usersCtrl = require('../controllers/users'),
    authenticate = require('../middleware/authenticate'),
    User = require('../models/User');

// Render non-Authenticated views: Home page, Sign Up, Log In
    // Login View
    usersRouter.get('/login', ( req, res) => {
        res.render('./pages/login')
    })
    // SignUp View
    usersRouter.get('/signup', ( req, res) => {
        res.render('./pages/signup')
    })


// User CRUD functions:
    // Authenticate Sign up / CREATE User:
    usersRouter.post('/signup', usersCtrl.create);
    // Show all profiles (Must be logged in [INDEX All Users]):
    usersRouter.get('/', usersCtrl.index);
    // Show 1 profile (Must be logged in):
    usersRouter.get('/:id', authenticate, usersCtrl.show);
    // Update profile [UPDATE User]:
    usersRouter.patch('/:id/edit', authenticate, usersCtrl.update);
    // Delete User Profile [DESTROY USER]
    usersRouter.delete('/:id/edit', authenticate, usersCtrl.destroy);

// User login / logout functions and authenticate with token:
    // User login and give auth token
    usersRouter.post('/login', usersCtrl.login);

// Render Authenticated USER Views:
    
// Authenticate Login

// Render Sign up View

// Render form to Edit profile



// Log Out






// Make exportable
module.exports = usersRouter;

// const
//     express = require('express'),
//     usersRouter = new express.Router(),
//     usersCtrl = require('../controllers/users.js'),
//     verifyToken = require('../serverAuth').verifyToken;

// usersRouter.get('/', usersCtrl.index); DONE
// usersRouter.post('/', usersCtrl.create); DONE
// usersRouter.post('/authenticate', usersCtrl.authenticate);

// usersRouter.use(verifyToken);
// usersRouter.get('/:id', usersCtrl.show); DONE
// usersRouter.patch('/:id', usersCtrl.update); DONE
// usersRouter.delete('/:id', usersCtrl.destroy); DONE

// module.exports = usersRouter;