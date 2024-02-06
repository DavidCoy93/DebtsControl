const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const debtsRoutes = require("./routes/debts.routes")


app.use(cors( { origin: "*" }))
app.use(express.json({limit: '10mb'}))
app.use('/debts', debtsRoutes)

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto no 3000");
})


// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "public", "index.html"), (err) => {
//         if (err) {
//             console.log(err);
//         }
//     })
// })