import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para que React (puerto 5173 por defecto) pueda conectarse
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Permite leer JSON en las peticiones
app.use(express.json());

// Ruta de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('¡La API de DiagnoHealth está funcionando correctamente! 🚀');
});

// Importar nuestras rutas


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de DiagnoHealth corriendo en http://localhost:${PORT}`);
});

app.use("/api/auth", authRoutes);