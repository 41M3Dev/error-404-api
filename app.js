require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`L'API est lancée sur le port : ${PORT}`);
});