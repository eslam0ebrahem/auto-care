import app from './app';
import db from './models';
import { PORT } from './config';

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
    console.error('Fatal Database Connection Failed:', error);
    process.exit(1);
  }
})();
