const express = require('express');
const cors = require('cors');
require('dotenv').config();

const horarioRoutes = require('./routes/horarios_routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1/horarios', horarioRoutes);

// Rota de health check (opcional)
app.get('/', (req, res) => {
    res.json({status: 'API de Horários de Ônibus rodando!'});
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ${PORT}');
});