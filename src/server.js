const express = require("express")
const dotenv = require("dotenv")
const db = require("../config/db.js")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require("./routes/authRoutes")
const clientRoutes  = require('./routes/clientRoutes')
const deliveryRoutes = require('./routes/deliveryRoutes')


const app = express()

app.use(express.json())
app.use(cookieParser());

dotenv.config()

app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/auth", clientRoutes);
app.use("/api/auth", deliveryRoutes);

const PORT = process.env.PORT
db()
app.listen(PORT, () => console.log(`server is running on port ${PORT}`) )

