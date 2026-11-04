require('dotenv').config();

const dns = require('node:dns');
const app = require('./app');
const connectDatabase = require('./infrastructure/database/mongodb');

if (process.env.NODE_ENV === 'development') {
	dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const PORT = process.env.PORT || 3001;

async function startServer() {
	try {
		await connectDatabase();

		app.listen(PORT, () => {
		console.log(`Microserviço de Chamados executando na porta ${PORT}`);
		console.log(`Health check: http://localhost:${PORT}/health`);
		});
	} catch (error) {
		console.error('Erro ao iniciar o microserviço:', error.message);
		process.exit(1);
	}
}

startServer();