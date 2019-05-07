const User = require('../models/userModel');

class UserController{
    // Create and Save a new User
    async create(req, res){
        let username = req.body.username;
        let fullname = req.body.fullname;
        let password = req.body.password;
        let email = req.body.email;
        
        console.log(req.body)
        
        if (username && password) {
        User.create({
            username : username,
            fullname: fullname,
            email : email,
            password : password,
            admin: false
        },
        function (err, user) {
            if (err) 
            return res.status(500).send({"error":err, "message":"There was a problem registering the user."})
            // create a token
            /*
            var token = jwt.sign({ id: user._id }, process.env.JWT_WORD, {
            expiresIn: 86400 // expires in 24 hours
            });
            */
            res.status(200).send({ auth: true, token: token });
        });
        }else{
        res.status(400).send({ "message": "campos obrigatorios" });
        }
    };

    // Retrieve and return all users from the database.
    async findAll(req, res){
        User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
    };

    // Find a single user with a userId
    async findOne(req, res){
        User.findById(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        });
    };

    // Update a user identified by the userId in the request
    async update(req, res){
        console.log(req.body)
        // Find user and update it with the request body
        User.findOneAndUpdate({_id: req.params.userId},
            req.body,
            {upsert: true},
            function (err, user) {
            if (err) 
                res.status(404).send({status: 'error', message: err});
            res.send(user);
            }
        )
        .then(/*user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }*/).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
    };

    // Delete a user with the specified userId in the request
    async delete(req, res){
        User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({message: "User deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
    };
}

