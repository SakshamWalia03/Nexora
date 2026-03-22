import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import config from './src/config/config.js';

const PORT = config.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });