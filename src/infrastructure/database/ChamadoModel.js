const mongoose = require('mongoose');

const chamadoSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        descricao: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'],
            default: 'ABERTO'
        },

        prioridade: {
            type: String,
            enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'],
            default: 'MEDIA'
        },

        usuarioId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Chamado', chamadoSchema);