const express = require("express")
const dotenv = require("dotenv")
const db = require("../config/db.js")
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser");

const app = express()

app.use(express.json())

dotenv.config()

//Auth routes

app.use("/api/auth", authRoutes);
app.use(cookieParser());

const PORT = process.env.PORT
db()
app.listen(PORT, () => console.log(`server is running on port ${PORT}`) )

