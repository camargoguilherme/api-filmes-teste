const Filme = require('../models/filmeModel');

// Create and Save a new Movie
exports.create = (req, res) => {
    // Validate request
    if(!req.body.filme) {
        return res.status(400).send({
            message: "Informações do filmes nao podem estar vazias"
        });
    }

    // Create a Movie
    const filme = new Filme({
      titulo: '',
      posterStart: '',
      uriPage: '',
      uri: '',
      resumo: '',
      img: '',
    });

    // Save Movie in the database
    filme.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocorreu um erro ao gravar o filme"
        });
    });
};

// Retrieve and return all movies from the database.
exports.findAll = (req, res) => {
    Filme.find()
    .then(filmes => {
        res.send(filmes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocorreu um erro ao recuperar os filmes"
        });
    });
};

// Find a single movie with a filmeId
exports.findOne = (req, res) => {
    Filme.findById(req.params.filmeId)
    .then(filme => {
        if(!filme) {
            return res.status(404).send({
                message: "Nenhum filme encontrada com id " + req.params.filmeId
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
          message: "Informações do filmes nao podem estar vazias"
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
            message: "Error updating movie with id " + req.params.filmeId
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
