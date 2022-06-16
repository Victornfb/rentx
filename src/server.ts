import express from 'express';
import SwaggerUi from 'swagger-ui-express';
import { router } from './routes';
import swaggerFile from './swagger.json';

const app = express();

app.use(express.json());

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerFile));

app.use(router);

const port = 3333;
app.listen(port, () => console.log('Server is now running on port ' + port));