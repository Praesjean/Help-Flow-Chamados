const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const chamadoRoutes = require('./api/routes/ChamadoRoutes');
const swaggerDocument = require('./api/swagger/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'help-flow-chamados',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/chamados', chamadoRoutes);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

module.exports = app;