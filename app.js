import fs from "fs";
import express from "express";
import FormData from "form-data"
import axios from "axios";
import dotenv from "dotenv"
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser({ extended: false }))
app.set("view engine", "ejs")

dotenv.config()


app.get("/", (req, res) => {
    res.render("index")
})

const formData = new FormData()
formData.append('instructions', JSON.stringify({
    parts: [
        {
            file: "file"
        }
    ]
}))

formData.append('file', fs.createReadStream('testing.ppt'))

app.post("/convert", async (req, res) => {
    try {
        const response = await axios.post('https://api.pspdfkit.com/build', formData, {
            headers: formData.getHeaders({
                'Authorization': `Bearer ${process.env.API_KEY} `
            }),
            responseType: "stream"
        })

        const data = response.data.pipe(fs.createWriteStream("result.pdf"))
        res.send({ message: "Converted Sucessfully", data: data })
    } catch (e) {
        console.log("🚀 ~ app.post ~ e:", e)
        res.send({ message: "Error Occured", data: e })
    }
});

app.listen(3000, () => {
    console.log("Server is Started");
});
