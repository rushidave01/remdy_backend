import express, { Application, Request, Response } from 'express';
import { connectDB } from './src/config/database';
import { attachJourneyId } from './src/middleware/attachJourneyId';
import { errorHandler } from './src/middleware/errorHandler';
import { loggingMiddleware } from './src/middleware/loggingMiddleware';
import { responseMiddleware } from './src/middleware/responseMiddleware';
import { handleCors, rateLimiter, setSecurityHeaders } from './src/middleware/securityMiddleware';
import routes from './src/routes';
import logger from './src/utils/logger';
import express_status_monitor from 'express-status-monitor';

import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

// cpu utilization
app.use(express_status_monitor());

// Middleware setup
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded({ extended: true }));
app.use(setSecurityHeaders); // Security headers
app.use(handleCors); // CORS
// app.use(handleCsrfProtection); // CSRF protection
app.use(rateLimiter);
app.use(attachJourneyId);
app.use(loggingMiddleware);
app.use(responseMiddleware as express.RequestHandler);

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to MysqlDB: ${error.message}`);
    process.exit(1);
  });

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Mount API routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(errorHandler);

export default app;
 