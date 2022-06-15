import express from 'express';
import { categoriesRoutes } from './routes/categories.routes';
import { specificationsRoutes } from './routes/specifications.routes';

const app = express();
const port = 3333;

app.use(express.json());

app.use('/categories', categoriesRoutes);

app.use('/specifications', specificationsRoutes);

app.listen(port, () => console.log('Server is now running on port ' + port));