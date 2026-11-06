const ChamadoModel = require('../database/ChamadoModel');

class ChamadoRepository {
    async criar(dados) {
        return await ChamadoModel.create(dados);
    }

    async listar(usuarioId = null) {
        const filtro = usuarioId
            ? { usuarioId: String(usuarioId) }
            : {};

        return await ChamadoModel.find(filtro)
            .sort({ createdAt: -1 });
    }

    async buscarPorId(id) {
        return await ChamadoModel.findById(id);
    }

    async atualizar(id, dados) {
        return await ChamadoModel.findByIdAndUpdate(id, dados, {
            new: true,
            runValidators: true
        });
    }

    async excluir(id) {
        return await ChamadoModel.findByIdAndDelete(id);
    }
}

module.exports = ChamadoRepository;