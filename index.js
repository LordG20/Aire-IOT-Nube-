const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");
const cors = require("cors");

const db_init = {
    host: "test.cp7vgq2ndihw.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "root1234",
    database: "iot_aire"
}

const qualityair = express()
qualityair.set("port", 5000)
qualityair.use(bodyparser.urlencoded({ extended: false }))
qualityair.use(cors())
qualityair.use(express.json())

qualityair.post("/send_datos", (request, response) => {
    console.log(request.body);
    var today = new Date();
    // obtener la fecha y la hora
    var now = today.toLocaleString();
    const { data } = request.body;
    const conection = mysql.createConnection(db_init)
    conection.query("INSERT INTO sensor (data,fechaActual) VALUES (?,?)", [data, now], (err, res) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.status(200).send(res);
        }
    })
    conection.end();
})


qualityair.get("/all", (request, response) => {
    const conection = mysql.createConnection(db_init)
    conection.query("SELECT * FROM sensor", (err, res) => {
        if (err) response.status(500).send(err)
        if (res.length > 0) response.json(res)
        else response.send('No hay resultados')
    })
    conection.end();
})

qualityair.listen(qualityair.get("port"), () => {
    console.log("Corriendo en el puerto", qualityair.get("port"));
})