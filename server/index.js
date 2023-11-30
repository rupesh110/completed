import express from 'express';
import bodyParser from 'body-parser';
import morgan  from 'morgan';
import cors from 'cors';

import db from './database/db.js';
import notFoundMiddleware from './middleware/nopage.js';
import client from './route/client.js';

const app = express();
app.use(morgan('combined'))
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
  res.send({ hi: 'there hhaha' });
});

app.use('/api', client);

// Move this route to the end or change its path to avoid overriding other routes
app.use(notFoundMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
