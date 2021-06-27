const Pets = require('../models/pet');

module.exports = (app) => {
    app.post('/pets', (req, res) => {
        Pets.adiciona(req.body, res);
    });
};
