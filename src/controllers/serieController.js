const Serie = require('../models/serieModel');
const Temporada = require('../models/temporadaModel');

// Create and Save a new Serie
exports.create = (req, res) => {
    // Validate request
    
    if(!req.body.serie) {
        return res.status(400).send({
            message: "As informacoes da série não pode ser vazio"
        });
    }
    
    // Create a Serie
    const serie = new Serie({
        titulo: req.body.serie.titulo || "Untitled Serie",
        path: req.body.serie.path,
        posterStart: req.body.serie.posterStart,
        uriPage: req.body.serie.uriPage,
        temporadas:[]
    });

    // Save Serie in the database
    serie.save()
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Serie."
        });
    })
};

// Retrieve and return all series from the database.
exports.findAll = (req, res) => {
    Serie.find()
    .then(series => {
        res.send(series);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving series."
        });
    });
};

// Find a single serie with a serieId
exports.findOne = (req, res) => {
    Serie.findById(req.params.serieId)
    .then(serie => {
        if(!serie) {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });            
        }
        res.send(serie);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving serie with id " + req.params.serieId
        });
    });
};

// Update a serie identified by the serieId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Serie content can not be empty"
        });
    }

    // Find serie and update it with the request body
    Serie.findByIdAndUpdate(req.params.serieId, {
        title: req.body.title || "Untitled Serie",
        content: req.body.content
    }, {new: true})
    .then(serie => {
        if(!serie) {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });
        }
        res.send(serie);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });                
        }
        return res.status(500).send({
            message: "Error updating serie with id " + req.params.serieId
        });
    });
};

// Delete a serie with the specified serieId in the request
exports.delete = (req, res) => {
    Serie.findByIdAndRemove(req.params.serieId)
    .then(serie => {
        if(!serie) {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });
        }
        res.send({message: "Serie deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });                
        }
        return res.status(500).send({
            message: "Could not delete serie with id " + req.params.serieId
        });
    });
};
