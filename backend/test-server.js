import express from 'express';
const app = express();
const PORT = 9000;
app.get('/', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`Test server on ${PORT}`));
