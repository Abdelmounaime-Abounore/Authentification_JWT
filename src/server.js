const express = require("express")
const dotenv = require("dotenv")
const db = require("../config/db.js")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(express.json())

dotenv.config()

//Auth routes

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000
db()
app.listen(PORT, () => console.log(`server is running on port ${PORT}`) )

