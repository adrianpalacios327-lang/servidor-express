//agrupa las rutas de mi app
const {Router} = require("express")
const enrutador = Router()
const prueba = require("./pruebaRouter")

enrutador.use("/rutaPrueba",prueba)
//ejemplo
//enrutador.use("/usuarios", usuariosRouter)

module.exports = enrutador