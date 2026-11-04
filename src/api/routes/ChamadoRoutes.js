const express = require('express');
const chamadoController = require('../controllers/ChamadoController');

const router = express.Router();

router.post('/', (req, res) => chamadoController.criar(req, res));

router.get('/', (req, res) => chamadoController.listar(req, res));

router.get('/:id', (req, res) => chamadoController.buscarPorId(req, res));

router.put('/:id', (req, res) => chamadoController.atualizar(req, res));

router.delete('/:id', (req, res) => chamadoController.excluir(req, res));

module.exports = router;