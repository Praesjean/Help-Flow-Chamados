const mongoose = require('mongoose');
const dns = require('node:dns');

async function connectDatabase() {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		throw new Error('MONGODB_URI não configurada.');
	}

	dns.setServers([
		'8.8.8.8',
		'1.1.1.1'
	]);

	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 15000
		});

		console.log('MongoDB Atlas conectado com sucesso!');
	} catch (error) {
		console.error(
			'Erro ao conectar ao MongoDB Atlas:',
			error.message
		);

		throw error;
	}
}

module.exports = connectDatabase;