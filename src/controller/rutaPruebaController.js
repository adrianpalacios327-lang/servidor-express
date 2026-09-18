const { json } = require("express")

const mostarRuta = (req, res )=>{
res,json({mensaje: "Esta rutaPrueba y personal con controller."})
}

module.exports = mostarRuta