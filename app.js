const express = require('express');  
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3030;

// Importación de middleware propios
const registroMiddleware = require('./src/middleware/registroMiddleware');
const manejadorErrores = require('./src/middleware/manejadordeErrores');
const autenticacion = require('./src/middleware/autenticacion');
const jwt = require("jsonwebtoken");

// Middlewares para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares propios
app.use((req, res, next) => {
    console.log(`tiempo milisegundos: ${Date.now()}`);
    console.log(`fecha: ${new Date().toISOString()}`);
    next();
});
app.use(registroMiddleware);

// Módulos para manejo de archivos
const sistemaArchivo = require('fs');
const ruta = require('path');
const rutaArchivo = ruta.join(__dirname, 'datos.json');

const multer = require('multer');

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'misImagenes/');  
  },
  filename: (req, file, cb) => {
    const extension = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  }
});

const cargar = multer({ storage: almacenamiento });

app.get("/", (req, res) => {
  res.send('Aprendices ficha 3407186');
});

// Endpoint para listar aprendices
app.get("/api/aprendices", (req, res) => {
  sistemaArchivo.readFile(rutaArchivo, 'utf-8', (error, datos) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error al leer el archivo" });
    }
    const listaAprendices = JSON.parse(datos);    
    res.status(200).json({ "mensaje": listaAprendices });
  });
});

// Endpoint para listar un aprendiz por ID
app.get("/api/aprendices/:id", (req, res) => {      
  res.status(200).json({
    "mensaje": "Lista de un aprendiz"
  });
});  

// Endpoint para crear un aprendiz con imagen
app.post("/api/aprendices", cargar.single('imagen'), (req, res) => {
  const nuevoAprendiz = req.body;
  nuevoAprendiz.imagen = req.file ? `/misImagenes/${req.file.filename}` : "sin imagen";

  sistemaArchivo.readFile(rutaArchivo, 'utf-8', (error, datos) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error al leer el archivo" });
    }
    const listaAprendices = JSON.parse(datos);
    
    listaAprendices.push(nuevoAprendiz);

    sistemaArchivo.writeFile(rutaArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ mensaje: "No se puede escribir en el archivo, o BD" });
      }
      res.status(201).json({ "mensaje": "Aprendiz creado", "datos aprendiz": nuevoAprendiz });
    });
  });
});

// Endpoint para actualizar un aprendiz
app.put("/api/aprendices/:id", (req, res) => {
  res.status(200).json({
    "mensaje": "Actualizar aprendiz"
  });
});

// Endpoint para eliminar aprendiz
app.delete("/api/aprendices/:id", (req, res) => {
  res.status(200).json({
    "mensaje": "Eliminar aprendiz"
  });
});            

app.post("/rutaJson", (req, res) => {
  const todosDatos = req.body;
  const edad = req.body.edad2;
  if (edad >= 18) {
    res.json({ mensaje: "Es mayor de edad" });
  } else {
    res.json({ datosJson: todosDatos });
  }
});

app.post("/rutaFormulario", (req, res) => {
  const todosDatos = req.body;
  const programa = req.body.programa;
  res.json({ todosDatos: todosDatos, Miprograma: programa });
});

// Error provocado
app.get("/error", (req, res, next) => {
  next(new Error("Error intencional de mi app"));
});

// Ruta protegida
app.get("/api/rutaprotegida", autenticacion, (req, res) => {
    res.status(200).json({ mensaje: "esta es mi ruta protegida !!!" });
});

// Login, inicio de sesion (Corregido: agregado return y arreglo de req.usuario)
app.post("/api/login", (req, res) => {
    const usuarioBD = {
        "usuario": "laura",
        "clave": "abc123"
    };

    const { usuario, clave } = req.body;

    if (usuario !== usuarioBD.usuario || clave !== usuarioBD.clave) {
        return res.status(400).json({ mensaje: "credenciales no validas, usuario y contraseña incorrectos" });
    }
    
    const token = jwt.sign(
        { usuario: usuario },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

app.use(manejadorErrores);

app.listen(port, () => {
  console.log(`SERVIDOR: http://localhost:${port}`);
});