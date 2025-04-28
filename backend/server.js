const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentUUIDRoutes = require('./routes/paymentUUIDRoutes');
const accountRoutes = require('./routes/accountRoutes');
const loansRoutes = require('./routes/loansRoutes');
const optRoutes = require('./routes/otpRoutes');
const ccRoutes = require('./routes/ccRoutes');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes); 
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes, paymentUUIDRoutes);
app.use('/bank', accountRoutes, loansRoutes, ccRoutes)
app.use('/otp', optRoutes)

// Puerto
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
