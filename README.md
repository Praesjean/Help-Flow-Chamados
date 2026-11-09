# Help Flow | Microserviço de Chamados

Microserviço responsável pelo gerenciamento de chamados do sistema **Help Flow**, desenvolvido para a disciplina de Arquitetura e Soluções Cloud.

Disponibiliza uma API REST com CRUD de chamados, autenticação JWT, controle de acesso por perfil e persistência no MongoDB Atlas. Também implementa comunicação assíncrona por meio do **Azure Service Bus**, utilizando Event-Driven Architecture (EDA).

### Integrantes

- Erick Misturi Machado
- Jean Inácio Praes Moura
- João Gabriel de Lima Coltre
- Stefany Carlos de Oliveira

O microserviço de Chamados representa o domínio responsável pelo gerenciamento dos atendimentos do Help Flow.

## 1. Tecnologias utilizadas

- Node.js 22
- Express 5
- MongoDB Atlas e Mongoose
- JSON Web Token (JWT)
- Helmet e CORS
- Jest e Supertest
- Swagger UI / OpenAPI 3.0
- Azure Service Bus
- Azure Container Apps
- Docker e Docker Hub
- Git e GitHub

## 2. Arquitetura

O microserviço aplica **Clean Architecture**, **Vertical Slice Architecture**, **Database per Service** e **Event-Driven Architecture**.

### Clean Architecture

A aplicação é dividida em quatro camadas:

| Camada | Responsabilidade |
|---|---|
| API | Receber requisições HTTP, aplicar autenticação e encaminhar operações |
| Application | Executar os casos de uso do sistema |
| Domain | Concentrar entidades, validações e regras de negócio |
| Infrastructure | Implementar acesso ao MongoDB e comunicação com Azure Service Bus |

### Vertical Slice Architecture

Os casos de uso são organizados por funcionalidade:

- `CreateChamado`
- `GetChamado`
- `ListChamados`
- `UpdateChamado`
- `DeleteChamado`

Essa organização permite manter cada operação separada, com responsabilidades específicas.

### Estrutura simplificada

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
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   └── messaging/
│       └── ServiceBusPublisher.js
├── app.js
├── server.js
└── consumer.js
```

## 3. Banco de dados

O microserviço utiliza o **MongoDB Atlas**, seguindo o padrão Database per Service.

Cada chamado possui os seguintes campos:

| Campo | Descrição |
|---|---|
| titulo | Título do chamado |
| descricao | Descrição do problema |
| status | Situação atual |
| prioridade | Nível de prioridade |
| usuarioId | Identificador do usuário |
| createdAt | Data de criação |
| updatedAt | Data da última atualização |

### Status permitidos

- `ABERTO`
- `EM_ANDAMENTO`
- `RESOLVIDO`
- `FECHADO`

### Prioridades permitidas

- `BAIXA`
- `MEDIA`
- `ALTA`
- `CRITICA`

## 4. Autenticação e autorização

A API utiliza tokens JWT para autenticação.

O microserviço de Usuários é responsável pelo login e pela emissão dos tokens. O microserviço de Chamados valida esses tokens antes de permitir operações protegidas.

Perfis utilizados:

- `ADMIN`
- `ATENDENTE`
- `CLIENTE`

### Regras de acesso

- **ADMIN:** pode consultar, criar, atualizar e excluir chamados.
- **ATENDENTE:** pode consultar e atualizar chamados conforme as regras da API.
- **CLIENTE:** pode consultar seus chamados e executar as operações permitidas.
- O perfil CLIENTE não pode alterar o status dos chamados.
- A exclusão é restrita ao perfil ADMIN.

Exemplo de autenticação:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

## 5. Endpoints REST

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verificar disponibilidade |
| POST | `/api/chamados` | Criar chamado |
| GET | `/api/chamados` | Listar chamados |
| GET | `/api/chamados/:id` | Consultar chamado por ID |
| PUT | `/api/chamados/:id` | Atualizar chamado |
| DELETE | `/api/chamados/:id` | Excluir chamado |

### Exemplo de criação

```json
{
  "titulo": "Erro ao acessar o sistema",
  "descricao": "O usuário não consegue acessar a aplicação.",
  "prioridade": "ALTA",
  "usuarioId": "2"
}
```

O status inicial é definido automaticamente como `ABERTO`.

## 6. Documentação Swagger

A API possui documentação interativa com Swagger UI e OpenAPI 3.0.

**Swagger público:**

https://helpflow-chamados.victoriousground-a72b89ca.centralus.azurecontainerapps.io/api-docs

**Swagger local:**

http://localhost:3001/api-docs

A documentação apresenta os endpoints de listagem, criação, consulta por ID, atualização e exclusão de chamados.

## 7. Event-Driven Architecture (EDA)

O microserviço implementa comunicação assíncrona utilizando o **Azure Service Bus**.

Após operações de criação, atualização ou exclusão, o microserviço publica um evento na fila `chamados-eventos`.

### Eventos implementados

| Evento | Operação que o produz |
|---|---|
| `ChamadoCriado` | Criação de chamado |
| `ChamadoAtualizado` | Atualização de chamado |
| `ChamadoExcluido` | Exclusão de chamado |

### Publicador

O arquivo `src/infrastructure/messaging/ServiceBusPublisher.js` é responsável por publicar mensagens no Azure Service Bus.

### Consumidor

O arquivo `src/consumer.js` implementa um processo independente que recebe os eventos e registra seu processamento nos logs.

O consumidor utiliza uma política de acesso com permissão `Listen`, enquanto o produtor utiliza uma política com permissão `Send`.

### Infraestrutura Azure

| Recurso | Identificação |
|---|---|
| Namespace Service Bus | `helpflow-servicebus` |
| Fila | `chamados-eventos` |
| Container App produtor | `helpflow-chamados` |
| Container App consumidor | `helpflow-eventos-consumer` |
| Grupo de recursos | `rg-helpflow` |
| Região | Central US |

### Fluxo assíncrono

```text
Frontend React
      |
      v
AWS API Gateway
      |
      v
BFF Node.js
      |
      v
Microserviço de Chamados
      |
      +----> MongoDB Atlas
      |
      v
Azure Service Bus
Fila: chamados-eventos
      |
      v
Consumer (Azure Container Apps)
      |
      v
Processamento e registro nos logs
```

O consumidor não depende de execução local, pois está implantado no Azure Container Apps.

### Validação dos eventos

Em 09/11/2026, foram testados os eventos de criação, atualização e exclusão de chamados.

Os logs do consumidor confirmaram o recebimento dos três tipos:

```text
[Consumer] Evento recebido: ChamadoCriado
[Consumer] Novo chamado registrado.

[Consumer] Evento recebido: ChamadoAtualizado
[Consumer] Chamado atualizado.

[Consumer] Evento recebido: ChamadoExcluido
[Consumer] Chamado excluído.
```

Os testes demonstraram a comunicação assíncrona entre o microserviço e o consumidor por meio do Azure Service Bus.

## 8. Configuração do ambiente

### Pré-requisitos

- Node.js 22
- npm
- MongoDB Atlas configurado
- Acesso ao Azure Service Bus para utilizar a integração EDA
- Variáveis de ambiente configuradas

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente exigidas pela aplicação, incluindo:

| Variável | Finalidade |
|---|---|
| `PORT` | Porta HTTP do microserviço |
| `SERVICEBUS_CONNECTION_STRING` | Conexão com a fila do Azure Service Bus |
| Variável de conexão MongoDB | Acesso ao MongoDB Atlas |
| Variável de segredo JWT | Validação dos tokens JWT |

Os nomes das variáveis de MongoDB e JWT devem seguir a configuração efetivamente utilizada pelo código.

O produtor deve utilizar uma connection string com permissão `Send`. O consumidor deve utilizar uma connection string com permissão `Listen`.

**Nunca publique arquivos `.env`, senhas, tokens ou connection strings no GitHub.**

## 9. Execução local

### Iniciar a API

```bash
npm start
```

### Executar em desenvolvimento

```bash
npm run dev
```

A API utiliza a porta `3001` no ambiente de desenvolvimento.

### Executar o consumidor

Com `SERVICEBUS_CONNECTION_STRING` configurada no ambiente:

```bash
node src/consumer.js
```

O consumidor inicia e aguarda mensagens da fila.

### Endereços locais

| Recurso | Endereço |
|---|---|
| API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |
| Swagger | http://localhost:3001/api-docs |

No Windows PowerShell, caso exista bloqueio de scripts, utilize `npm.cmd` em vez de `npm`.

## 10. Testes automatizados

O projeto utiliza **Jest e Supertest** para validar:

- Casos de uso
- Regras de domínio
- Endpoints HTTP
- Organização arquitetural

Executar os testes:

```bash
npm test
```

Executar com relatório de cobertura:

```bash
npm run test:coverage
```

### Resultado da execução validada

- 6 suítes de testes aprovadas
- 87 testes aprovados
- Nenhuma falha

A execução dos testes foi validada durante o desenvolvimento da integração.

## 11. Docker e implantação

O microserviço possui Dockerfile e imagens publicadas no Docker Hub.

**Repositório Docker Hub:**

https://hub.docker.com/r/jeanpraes/help-flow-chamados

### Construir imagem local

```bash
docker build -t help-flow-chamados .
```

### Executar API em contêiner

```bash
docker run -d --name help-flow-chamados -p 3001:3001 --env-file .env help-flow-chamados
```

### Imagens utilizadas na Azure

| Componente | Imagem |
|---|---|
| API de Chamados | `jeanpraes/help-flow-chamados:v3` |
| Consumidor de eventos | `jeanpraes/help-flow-chamados:v4` |

A imagem `v4` inclui o consumidor independente, executado com o comando:

```bash
node src/consumer.js
```

### Implantação no Azure Container Apps

**Health Check público da API:**

https://helpflow-chamados.victoriousground-a72b89ca.centralus.azurecontainerapps.io/health

**Swagger público:**

https://helpflow-chamados.victoriousground-a72b89ca.centralus.azurecontainerapps.io/api-docs

O consumidor é executado em um Container App separado, sem exposição HTTP pública.

As credenciais são configuradas como segredos e referenciadas por variáveis de ambiente.

## 12. Integração com o Help Flow

O microserviço faz parte de uma solução distribuída composta por:

- Microfrontend React
- AWS API Gateway
- BFF Node.js
- Microserviço de Chamados com MongoDB Atlas
- Microserviço de Usuários com Azure SQL
- Azure Function HTTP Trigger
- Azure Service Bus
- Consumidor de eventos no Azure Container Apps

O frontend utiliza o BFF como intermediário para acessar os serviços.

O BFF também disponibiliza o endpoint `GET /aggregated-data`, que consolida informações dos dois microserviços e da Azure Function.

Cada microserviço possui seu próprio banco de dados, aplicando o padrão **Database per Service**.

## 13. Contexto acadêmico

Projeto desenvolvido para a disciplina de **Arquitetura e Soluções Cloud**, com o objetivo de demonstrar uma aplicação distribuída utilizando:

- Clean Architecture
- Vertical Slice Architecture
- Microservices
- Backend for Frontend (BFF)
- API Gateway
- Database per Service
- Serverless
- Event-Driven Architecture