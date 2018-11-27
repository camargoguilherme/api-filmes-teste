const UserProfile = require('../models/userModel');

// Create and Save a new UserProfile
exports.create = (req, res) => {
  // Validate request
  if(!req.body.content) {
    return res.status(400).send({
      message: "UserProfile content can not be empty"
    });
  }

  const userProfile = new UserProfile({
      
  });
  // Save UserProfile in the database
  userProfile.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the UserProfile."
    });
  });

};

// Find a single user with a userId
exports.findOne = (req, res) => {
  UserProfile.findById(req.params.userId)
  .then(user => {
    if(!user) {
      return res.status(404).send({
        message: "UserProfile not found with id " + req.params.userId
      });            
    }
    res.send(user);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "UserProfile not found with id " + req.params.userId
        });                
    }
    return res.status(500).send({
      message: "Error retrieving user with id " + req.params.userId
    });
  });
};

// Find a single user with a userId
exports.update = (req, res) => {
  // Validate Request
  if(!req.body.content) {
    return res.status(400).send({
      message: "User content can not be empty"
    });
  }

  UserProfile.findByIdAndUpdate(req.params.userId,{

  }, {upsert: true})
  .then(userProfile => {
    if(!userProfile) {
        return res.status(404).send({
          message: "UserProfile not found with id " + req.params.userId
        });            
    }
    res.send(userProfile);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "UserProfile not found with id " + req.params.userId
        });                
    }
    return res.status(500).send({
      message: "Error retrieving user with id " + req.params.userId
    });
  });
};


// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  UserProfile.findByIdAndRemove(req.params.userId)
  .then(user => {
    if(!user) {
      return res.status(404).send({
        message: "UserProfile not found with id " + req.params.userId
      });
    }
    res.send({message: "UserProfile deleted successfully!"});
  }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "UserProfile not found with id " + req.params.userId
      });                
    }
    return res.status(500).send({
      message: "Could not delete user with id " + req.params.userId
    });
  });
};
