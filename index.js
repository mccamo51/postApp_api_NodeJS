const express = require("express")
const mongoose = require("mongoose")
const dotnet = require("dotenv")
const cooieParser = require("cookie-parser")
const path = require("path")


const app = express();
dotnet.config()
const PORT = process.env.PORT || 3000


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cooieParser())
app.use('/uploads', express.static(`${process.cwd()}/uploads`));



mongoose.connect(process.env.MDB_CONNECT)


// app.use()

app.use("/auth", require("./Router/authRouter"))
app.use("/post", require("./Router/postRouter"))

app.listen(PORT,()=> console.log(`app started on port ${PORT} `))


