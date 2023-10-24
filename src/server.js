const express = require("express")
const dotenv = require("dotenv")
const db = require("../config/db.js")
const authRoutes = require("./routes/authRoutes")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser());

dotenv.config()

app.use(cors())

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT
db()
app.listen(PORT, () => console.log(`server is running on port ${PORT}`) )

