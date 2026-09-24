require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter.js');
const vehicleRouter = require('./routers/vehicleRouter.js');
const serviceRouter = require('./routers/serviceRouter.js');
const db = require('./models/index.js');

const PORT = process.env.PORT || 3005;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/vehicles', vehicleRouter);
app.use('/services', serviceRouter);

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Postgres Connected');
    await db.sequelize.sync({ alter: true });
    console.log('Models synced successfully');
    app.listen(PORT, () => {
      console.log(`Server listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('Connection failed', error);
  }
})();
