//Ruta de solo prueba
const {Router} = require("express")
const enrutador = Router()
const mostrarRuta = require("../controller/rutaPruebaController")
//funcion (req, res) debe ir en el controlador 
enrutador.get("/rutaPersona", mostrarRuta)

module.exports=enrutador