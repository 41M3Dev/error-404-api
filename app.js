require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');

const app = express();
app.use(express.json());

const promosRoutes = require("./src/routes/promos.routes");
const usersRoutes = require("./src/routes/users.routes");


app.use("/api/promos", promosRoutes);
app.use("/api/users", usersRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`L'API est lancée sur le port : ${PORT}`);
});