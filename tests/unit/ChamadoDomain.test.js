const Chamado = require('../../src/domain/entities/Chamado');

describe('Domain - Entidade Chamado', () => {
    const dadosValidos = {
        titulo: 'Erro no sistema',
        descricao: 'O sistema não está funcionando.',
        usuarioId: '123'
    };

    describe('Criação de chamado', () => {
        test('deve criar chamado com valores padrão', () => {
            const chamado = Chamado.criar(dadosValidos);

            expect(chamado).toEqual({
                titulo: 'Erro no sistema',
                descricao: 'O sistema não está funcionando.',
                usuarioId: '123',
                prioridade: 'MEDIA',
                status: 'ABERTO'
            });
        });

        test('deve aceitar prioridade válida', () => {
            const chamado = Chamado.criar({
                ...dadosValidos,
                prioridade: 'ALTA'
            });

            expect(chamado.prioridade).toBe('ALTA');
        });

        test('deve remover espaços dos campos de texto', () => {
            const chamado = Chamado.criar({
                titulo: '  Erro no sistema  ',
                descricao: '  Problema identificado  ',
                usuarioId: '  123  '
            });

            expect(chamado.titulo).toBe('Erro no sistema');
            expect(chamado.descricao).toBe('Problema identificado');
            expect(chamado.usuarioId).toBe('123');
        });

        test('deve rejeitar título vazio', () => {
            expect(() => Chamado.criar({
                ...dadosValidos,
                titulo: ''
            })).toThrow();
        });

        test('deve rejeitar descrição vazia', () => {
            expect(() => Chamado.criar({
                ...dadosValidos,
                descricao: ''
            })).toThrow();
        });

        test('deve rejeitar usuário vazio', () => {
            expect(() => Chamado.criar({
                ...dadosValidos,
                usuarioId: ''
            })).toThrow();
        });

        test('deve rejeitar prioridade inválida', () => {
            expect(() => Chamado.criar({
                ...dadosValidos,
                prioridade: 'URGENTE'
            })).toThrow('Prioridade inválida.');
        });
    });

    describe('Atualização de chamado', () => {
        test('deve aceitar atualização de título', () => {
            const resultado = Chamado.prepararAtualizacao({
                titulo: 'Novo título'
            });

            expect(resultado).toEqual({
                titulo: 'Novo título'
            });
        });

        test('deve aceitar status válido', () => {
            const resultado = Chamado.prepararAtualizacao({
                status: 'EM_ANDAMENTO'
            });

            expect(resultado.status).toBe('EM_ANDAMENTO');
        });

        test('deve rejeitar status inválido', () => {
            expect(() => Chamado.prepararAtualizacao({
                status: 'CANCELADO'
            })).toThrow('Status inválido.');
        });

        test('deve rejeitar prioridade inválida', () => {
            expect(() => Chamado.prepararAtualizacao({
                prioridade: 'URGENTE'
            })).toThrow('Prioridade inválida.');
        });

        test('deve impedir alteração de usuarioId', () => {
            expect(() => Chamado.prepararAtualizacao({
                usuarioId: '999'
            })).toThrow('Campos de atualização inválidos.');
        });

        test('deve rejeitar atualização vazia', () => {
            expect(() => Chamado.prepararAtualizacao({}))
                .toThrow('Campos de atualização inválidos.');
        });

        test('deve aceitar atualização de múltiplos campos', () => {
            const resultado = Chamado.prepararAtualizacao({
                titulo: 'Título atualizado',
                prioridade: 'CRITICA',
                status: 'RESOLVIDO'
            });

            expect(resultado).toEqual({
                titulo: 'Título atualizado',
                prioridade: 'CRITICA',
                status: 'RESOLVIDO'
            });
        });
    });
});