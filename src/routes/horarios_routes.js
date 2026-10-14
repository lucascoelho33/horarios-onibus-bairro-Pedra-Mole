const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horarios_controller');

// Rotas para o recurso "horarios"
router.post('/', horariosController.criar);
router.get('/', horariosController.listar);
router.get('/:id', horariosController.obterPorId);
router.put('/:id', horariosController.atualizar);
router.delete('/:id', horariosController.remover);

module.exports = router;