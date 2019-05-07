const Serie = require('../models/serie');
const Temporada = require('../models/temporada');
const Episodio = require('../models/episodio');

class SerieController{
    
    // Create and Save a new Serie
    async create(req, res){
        const { serie } = req.body
        if(!serie) {
            return res.status(400).send({
                message: "As informacoes da série não pode ser vazio"
            })
        }
        
        // Create a Serie
        const serie = new Serie(serie)
        await serie.save()
        res.json(serie)
    };

    // Retrieve and return all series from the database.
    async findAll(req, res){
        const serie = await Serie.find({}, {_id:1, titulo:1, uriPage:1, path:1, posterStart:1, status:1, temporadas:1})
        res.json(serie)
    };

    // Find a single serie with a serieId
    async findOne(req, res){
        const { serieId } = req.params
        const serie = await Serie.findById(serieId)
        
        if(!serie) {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });            
        }
        res.json(serie);
        
    };

    // Update a serie identified by the serieId in the request
    async update(req, res){
        const { serie } = req.body
        if(!serie) {
            return res.status(400).send({
                message: "Serie content can not be empty"
            });
        }

        // Find serie and update it with the request body
        const updated = await Serie.findByIdAndUpdate(req.params.serieId, {
            title: req.body.title || "Untitled Serie",
            content: req.body.content
        }, {new: true})
        
        if(!updated) {
            return res.status(404).send({
                message: "Serie not found with id " + req.params.serieId
            });
        }
        res.json({serie: updated, message: "Serie deleted successfully!"});
       
    };

    // Delete a serie with the specified serieId in the request
    async delete(req, res){
        const { serieId } = req.params
        const serieDeleted = await Serie.findByIdAndRemove(serieId).populate('Temporada')
        const seaseonDeleted = await Temporada.findByIdAndRemove(serieDeleted.temporada)       
        if(!serieDeleted) {
            return res.status(404).send({
                message: "Serie not found with id " + serieId
            });
        }
        res.json({serie: serieDeleted, message: "Serie deleted successfully!"});
        
    };

}