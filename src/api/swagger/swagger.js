const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Help Flow - API de Chamados',
        version: '1.0.0',
        description: 'Microserviço responsável pelo gerenciamento de chamados do Help Flow.'
    },
    servers: [
        {
            url: '/',
            description: 'Servidor atual'
        }
    ],
    tags: [
        {
            name: 'Chamados',
            description: 'Operações de gerenciamento de chamados'
        }
    ],
    paths: {
        '/api/chamados': {
            get: {
                tags: ['Chamados'],
                summary: 'Listar todos os chamados',
                responses: {
                    200: {
                        description: 'Lista de chamados',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Chamado' }
                                }
                            }
                        }
                    }
                }
            },
        post: {
            tags: ['Chamados'],
            summary: 'Criar um chamado',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CriarChamado' }
                    }
                }
            },
            responses: {
                201: { description: 'Chamado criado com sucesso' },
                400: { description: 'Dados inválidos' },
                500: { description: 'Erro interno' }
            }
        }
        },
        '/api/chamados/{id}': {
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID do chamado no MongoDB',
                    schema: { type: 'string' }
                }
            ],
            get: {
                tags: ['Chamados'],
                summary: 'Buscar chamado por ID',
                responses: {
                    200: { description: 'Chamado encontrado' },
                    400: { description: 'ID inválido' },
                    404: { description: 'Chamado não encontrado' }
                }
            },
            put: {
                tags: ['Chamados'],
                summary: 'Atualizar chamado',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AtualizarChamado' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Chamado atualizado' },
                    400: { description: 'Dados inválidos' },
                    404: { description: 'Chamado não encontrado' }
                }
            },
            delete: {
                tags: ['Chamados'],
                summary: 'Excluir chamado',
                responses: {
                    200: { description: 'Chamado excluído' },
                    400: { description: 'ID inválido' },
                    404: { description: 'Chamado não encontrado' }
                }
            }
        }
    },
    components: {
        schemas: {
            Chamado: {
                type: 'object',
                properties: {
                    _id: { type: 'string', readOnly: true },
                    titulo: { type: 'string' },
                    descricao: { type: 'string' },
                    status: {
                        type: 'string',
                        enum: ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO']
                    },
                    prioridade: {
                        type: 'string',
                        enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']
                    },
                    usuarioId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time', readOnly: true },
                    updatedAt: { type: 'string', format: 'date-time', readOnly: true }
                }
            },
            CriarChamado: {
                type: 'object',
                required: ['titulo', 'descricao', 'usuarioId'],
                properties: {
                    titulo: {
                        type: 'string',
                        maxLength: 150,
                        example: 'Erro ao acessar o sistema'
                    },
                    descricao: {
                        type: 'string',
                        example: 'O usuário não consegue realizar login.'
                    },
                    prioridade: {
                        type: 'string',
                        enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'],
                        default: 'MEDIA'
                    },
                    usuarioId: {
                        type: 'string',
                        example: 'usuario-teste-001'
                    }
                }
            },
            AtualizarChamado: {
                type: 'object',
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    titulo: { type: 'string', maxLength: 150 },
                    descricao: { type: 'string' },
                    status: {
                        type: 'string',
                        enum: ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO']
                    },
                    prioridade: {
                        type: 'string',
                        enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']
                    }
                }
            }
        }
    }
};

module.exports = swaggerDocument;