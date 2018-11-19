const Temporada = require('../models/temporadaModel');

// Create and Save a new Temporada
exports.create = (req, res) => {
    // Validate request
    console.log(req.body)
    if(!req.body.temporada && !req.body.serieId) {
        return res.status(400).send({
            message: "As informacoes da temporada não pode ser vazio"
        });
    }

    // Create a Temporada
    const temporada = new Temporada({
        serieId: req.body.serieId,
        temporadas: req.body.temporadas
    });

    // Save Temporada in the database
    temporada.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Temporada."
        });
    });
};

// Retrieve and return all temporadas from the database.
exports.findAll = (req, res) => {
    Temporada.find({}, {_id:1, serieId:1, temporadas:1 })
    .then(temporadas => {
        res.send(temporadas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving temporadas."
        });
    });
};

// Find a single temporada with a temporadaId
exports.findOne = (req, res) => {
    Temporada.find({serieId: req.params.serieId}, {_id:1, serieId:1, temporadas:1 })
    .then(temporada => {
        if(!temporada) {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.serieId
            });            
        }
        res.send(temporada);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.serieId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving temporada with id " + req.params.temporadaId
        });
    });
};

// Update a temporada identified by the temporadaId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Temporada content can not be empty"
        });
    }

    // Find temporada and update it with the request body
    Temporada.findByIdAndUpdate(req.params.temporadaId, {
        title: req.body.title || "Untitled Temporada",
        content: req.body.content
    }, {new: true})
    .then(temporada => {
        if(!temporada) {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.temporadaId
            });
        }
        res.send(temporada);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.temporadaId
            });                
        }
        return res.status(500).send({
            message: "Error updating temporada with id " + req.params.temporadaId
        });
    });
};

// Delete a temporada with the specified temporadaId in the request
exports.delete = (req, res) => {
    Temporada.findByIdAndRemove(req.params.temporadaId)
    .then(temporada => {
        if(!temporada) {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.temporadaId
            });
        }
        res.send({message: "Temporada deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Temporada not found with id " + req.params.temporadaId
            });                
        }
        return res.status(500).send({
            message: "Could not delete temporada with id " + req.params.temporadaId
        });
    });
};
