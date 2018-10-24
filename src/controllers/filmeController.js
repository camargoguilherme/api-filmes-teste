const Filme = require('../models/filmeModel');

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Create a Note
    const filme = new Filme({
        title: req.body.title || "Untitled Note", 
        content: req.body.content
    });

    // Save Note in the database
    filme.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Filme.find()
    .then(filmes => {
        res.send(filmes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a filmeId
exports.findOne = (req, res) => {
    Filme.findById(req.params.filmeId)
    .then(filme => {
        if(!filme) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.filmeId
            });            
        }
        res.send(filme);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Filme ${req.params.filmeId} não encontrado`
            });                
        }
        return res.status(500).send({
            message: "Error retrieving movie with id " + req.params.filmeId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Filme.findByIdAndUpdate(req.params.filmeId, {
        title: req.body.title || "Untitled Movie",
        content: req.body.content
    }, {new: true})
    .then(filme => {
        if(!filme) {
            return res.status(404).send({
                message: `Filme ${req.params.filmeId} não encontrado`
            });
        }
        res.send(filme);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Filme ${req.params.filmeId} não encontrado`
            });                
        }
        return res.status(500).send({
            message: "Error updating miovie with id " + req.params.filmeId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Filme.findByIdAndRemove(req.params.filmeId)
    .then(filme => {
        if(!filme) {
            return res.status(404).send({
                message: `Filme ${req.params.filmeId} não encontrado`
            });
        }
        res.send({message: "Filme Deletado com sucesso!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: `Filme ${req.params.filmeId} não encontrado`
            });                
        }
        return res.status(500).send({
            message: `Filme ${req.params.filmeId} não encontrado`
        });
    });
};
