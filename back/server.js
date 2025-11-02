const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const examRoutes = require("./routes/examen.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares básicos ---
app.use(express.json());

// --- Configuración de CORS ---
const ALLOWED_ORIGINS = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

// --- Rutas principales ---
app.use("/api", authRoutes);          // Login / Logout / Profile
app.use("/api/examen", examRoutes);   // Examen: start / submit
app.use("/api", contactRoutes);       // Contacto

// --- Servir certificados PDF estáticamente ---
app.use("/certificados", express.static(path.join(__dirname, "certificados")));

// --- Ruta de salud opcional ---
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
console.log("Angel Daniel García De Lara");