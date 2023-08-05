const express = require("express")
const mongoose = require("mongoose")
const dotnet = require("dotenv")
const cooieParser = require("cookie-parser")



const app = express();
dotnet.config()
const PORT = process.env.PORT || 6000


app.use(express.json())
app.use(cooieParser())


mongoose.connect(process.env.MDB_CONNECT)


// app.use()

app.listen(PORT,()=> console.log(`app started on port ${PORT} `))


app.use("/auth", require("./Router/authRouter"))
app.use("/post", require("./Router/postRouter"))

