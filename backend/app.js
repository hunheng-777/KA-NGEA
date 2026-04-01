import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { sessionConfig } from './config/sessionConfig.js';
import listingRoutes from './routes/listingRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(sessionConfig);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(expressLayouts);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('layout', 'templates/mains');

app.use('/api/v1', apiRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/', userRoutes);

const PORT = process.env.PORT_APP || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));





