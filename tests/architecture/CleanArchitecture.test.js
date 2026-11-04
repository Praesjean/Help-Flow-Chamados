const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, '../../src');

function listarArquivosJs(diretorio) {
    if (!fs.existsSync(diretorio)) {
        return [];
    }

    return fs.readdirSync(diretorio, {
        withFileTypes: true
    }).flatMap(item => {
        const caminho = path.join(diretorio, item.name);

        if (item.isDirectory()) {
            return listarArquivosJs(caminho);
        }

        return item.name.endsWith('.js') ? [caminho] : [];
    });
}

function obterDependencias(arquivo) {
    const conteudo = fs.readFileSync(arquivo, 'utf8');

    const regex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    return [...conteudo.matchAll(regex)].map(
        resultado => resultado[1]
    );
}

describe('Clean Architecture', () => {
    test('Domain não deve depender de Application, Infrastructure ou API', () => {
        const arquivos = listarArquivosJs(
            path.join(srcPath, 'domain')
        );

        for (const arquivo of arquivos) {
            const dependencias = obterDependencias(arquivo);

            for (const dependencia of dependencias) {
                expect(dependencia).not.toMatch(
                    /application|infrastructure|api/
                );
            }
        }
    });

    test('Application não deve depender de Infrastructure ou API', () => {
        const arquivos = listarArquivosJs(
            path.join(srcPath, 'application')
        );

        for (const arquivo of arquivos) {
            const dependencias = obterDependencias(arquivo);

            for (const dependencia of dependencias) {
                expect(dependencia).not.toMatch(
                    /infrastructure|api/
                );
            }
        }
    });

    test('Application não deve importar Express ou Mongoose', () => {
        const arquivos = listarArquivosJs(
            path.join(srcPath, 'application')
        );

        for (const arquivo of arquivos) {
            const dependencias = obterDependencias(arquivo);

            expect(dependencias).not.toContain('express');
            expect(dependencias).not.toContain('mongoose');
        }
    });

    test('Infrastructure não deve depender de Controllers ou Routes', () => {
        const arquivos = listarArquivosJs(
            path.join(srcPath, 'infrastructure')
        );

        for (const arquivo of arquivos) {
            const dependencias = obterDependencias(arquivo);

            for (const dependencia of dependencias) {
                expect(dependencia).not.toMatch(
                    /controllers|routes/
                );
            }
        }
    });

    test('Cada operação CRUD deve possuir sua própria Vertical Slice', () => {
        const features = [
            'CreateChamado',
            'GetChamado',
            'ListChamados',
            'UpdateChamado',
            'DeleteChamado'
        ];

        for (const feature of features) {
            const diretorio = path.join(
                srcPath,
                'application',
                'features',
                feature
            );

            expect(fs.existsSync(diretorio)).toBe(true);

            const arquivos = listarArquivosJs(diretorio);

            expect(arquivos.length).toBeGreaterThan(0);
        }
    });
});