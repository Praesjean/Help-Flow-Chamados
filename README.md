
# Help Flow | Microserviço de Chamados

Microserviço responsável pelo gerenciamento de chamados do sistema Help Flow, desenvolvido como parte do projeto de arquitetura de soluções cloud.

A aplicação disponibiliza uma API REST para criação, consulta, atualização e exclusão de chamados, utilizando autenticação JWT, controle de acesso por perfil e persistência no MongoDB Atlas.

## 1. Tecnologias utilizadas

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Helmet e CORS
- Jest e Supertest
- Docker

## 2. Arquitetura

O projeto utiliza os princípios de Clean Architecture e Vertical Slice Architecture.

A estrutura está organizada em quatro camadas principais:

- API: recebe requisições HTTP, aplica autenticação e encaminha operações.
- Application: contém os casos de uso organizados por funcionalidade.
- Domain: concentra as regras de negócio independentes de frameworks.
- Infrastructure: implementa a persistência e a comunicação com o MongoDB.

Estrutura simplificada:

```text
src/
├── api/
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── application/
│   └── features/
│       ├── createChamado/
│       ├── deleteChamado/
│       ├── getChamado/
│       ├── listChamados/
│       └── updateChamado/
├── domain/
│   └── entities/
│       └── Chamado.js
├── infrastructure/
│   ├── database/
│   └── repositories/
├── app.js
└── server.js
```

### Clean Architecture

A camada de domínio centraliza as validações de título, descrição, prioridade e status dos chamados.

Os casos de uso coordenam as operações e utilizam o repositório para persistir ou consultar os dados.

A infraestrutura utiliza Mongoose para acessar o MongoDB Atlas.

### Vertical Slice Architecture

As funcionalidades são organizadas em casos de uso independentes:

- CreateChamado
- GetChamado
- ListChamados
- UpdateChamado
- DeleteChamado

Essa organização separa as responsabilidades de cada operação.

## 3. Banco de dados

O microserviço utiliza MongoDB Atlas para armazenar os chamados.

Cada chamado contém os seguintes campos:

| Campo | Descrição |
|---|---|
| titulo | Título do chamado |
| descricao | Descrição do problema |
| status | Situação atual do chamado |
| prioridade | Nível de prioridade |
| usuarioId | Identificador do usuário responsável pela abertura |
| createdAt | Data de criação |
| updatedAt | Data da última atualização |

### Status permitidos

- ABERTO
- EM_ANDAMENTO
- RESOLVIDO
- FECHADO

### Prioridades permitidas

- BAIXA
- MEDIA
- ALTA
- CRITICA

## 4. Autenticação e autorização

A API utiliza JWT para autenticar as requisições.

O token é validado pelo middleware de autenticação antes de permitir o acesso aos endpoints protegidos.

Perfis utilizados:

- ADMIN
- ATENDENTE
- CLIENTE

### Regras de acesso

- ADMIN: pode consultar, criar, atualizar e excluir chamados.
- ATENDENTE: pode consultar e atualizar chamados, conforme as regras da API.
- CLIENTE: pode consultar seus próprios chamados e realizar operações permitidas sobre eles.
- CLIENTE não pode alterar o status dos chamados.
- A exclusão de chamados é restrita ao ADMIN.

O microserviço de Usuários é responsável pelo login e pela emissão dos tokens JWT.

## 5. Endpoints

Prefixo principal:

`/api/chamados`

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /health | Verificar a disponibilidade da API |
| POST | /api/chamados | Criar chamado |
| GET | /api/chamados | Listar chamados |
| GET | /api/chamados/:id | Consultar chamado |
| PUT | /api/chamados/:id | Atualizar chamado |
| DELETE | /api/chamados/:id | Excluir chamado |

As operações protegidas exigem um token JWT válido.

Exemplo de cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Exemplo de criação

```json
{
  "titulo": "Erro ao acessar o sistema",
  "descricao": "O usuário não consegue acessar a aplicação.",
  "prioridade": "ALTA",
  "usuarioId": "2"
}
```

O status inicial do chamado é definido automaticamente como `ABERTO`.

## 6. Configuração do ambiente

### Pré-requisitos

- Node.js 22
- npm
- Acesso a um cluster MongoDB Atlas
- Variáveis de ambiente configuradas

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` de acordo com as variáveis utilizadas pelo projeto.

A configuração deve incluir a conexão com o MongoDB Atlas, a porta da aplicação e o segredo JWT.

O segredo JWT deve ser compatível com o utilizado pelo microserviço de Usuários.

**Nunca publique o arquivo `.env`, senhas ou chaves de autenticação no GitHub.**

## 7. Execução local

Iniciar o servidor:

```bash
npm start
```

Executar em modo de desenvolvimento:

```bash
npm run dev
```

Porta padrão utilizada no desenvolvimento:

`3001`

Verificar a API:

```text
http://localhost:3001/health
```

No Windows PowerShell, caso a execução de scripts esteja bloqueada, utilize `npm.cmd` no lugar de `npm`.

## 8. Testes automatizados

O projeto utiliza Jest e Supertest para testar os casos de uso, as regras de domínio, a arquitetura e os endpoints HTTP.

Executar todos os testes:

```bash
npm test
```

Executar testes com relatório de cobertura:

```bash
npm run test:coverage
```

Resultado validado em 06/11/2026:

- 6 suítes de testes aprovadas.
- 87 testes aprovados.
- Nenhuma falha.

## 9. Docker

O projeto possui um Dockerfile para a criação de uma imagem de contêiner.

Exemplo de build local:

```bash
docker build -t help-flow-chamados .
```

A imagem permite executar o microserviço em ambiente conteinerizado, desde que as variáveis de ambiente necessárias sejam fornecidas.

As credenciais do MongoDB e o segredo JWT não devem ser incluídos diretamente na imagem.

## 10. Integração com o Help Flow

Este microserviço integra a arquitetura distribuída do Help Flow.

Fluxo principal:

```text
Microfrontend (React)
        |
        v
API Gateway
        |
        v
BFF (Node.js)
        |
        v
Microserviço de Chamados
        |
        v
MongoDB Atlas
```

O BFF é responsável por intermediar as requisições do frontend e integrar os dados dos diferentes microserviços.

O microserviço de Chamados possui banco próprio, seguindo o padrão Database per Service.

## 11. Documentação da API

A aplicação possui configuração de documentação Swagger para facilitar a consulta e o teste dos endpoints.

## 12. Contexto acadêmico

Projeto desenvolvido para a disciplina de Arquitetura e Soluções Cloud, como parte da implementação de uma aplicação distribuída utilizando:

- Clean Architecture
- Vertical Slice Architecture
- Microservices
- Backend for Frontend (BFF)
- API Gateway
- Database per Service
- Serverless
- Event-Driven Architecture

O microserviço de Chamados representa o componente responsável pelo gerenciamento dos atendimentos do Help Flow.