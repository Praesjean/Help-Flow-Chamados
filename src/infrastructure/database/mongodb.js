const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI não configurada no .env');
  }

  await mongoose.connect(mongoUri);

  console.log('MongoDB Atlas conectado com sucesso!');
}

module.exports = connectDatabase;