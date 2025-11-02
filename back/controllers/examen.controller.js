const preguntas = require("../modelo/preguntas.json");
const { createCertificate } = require("../utils/pdfGenerator");

// Memoria temporal de intentos
const examAttempts = new Map(); // userId → { preguntas, hecho: false }

exports.startExam = (req, res) => {
  const userId = req.userId;

  // Si el usuario ya hizo examen
  if (examAttempts.has(userId) && examAttempts.get(userId).hecho) {
    return res.status(400).json({ error: "El examen solo se puede aplicar una vez." });
  }

  // Selecciona 8 preguntas aleatorias
  const seleccionadas = [];
  const usadas = new Set();

  while (seleccionadas.length < 8) {
    const idx = Math.floor(Math.random() * preguntas.length);
    if (!usadas.has(idx)) {
      usadas.add(idx);
      const p = { ...preguntas[idx] };
      p.opciones = [...p.opciones].sort(() => Math.random() - 0.5);
      delete p.correcta;
      seleccionadas.push(p);
    }
  }

  examAttempts.set(userId, { preguntas: seleccionadas, hecho: false });
  res.status(200).json({ examen: seleccionadas });
};

exports.submitExam = (req, res) => {
  const userId = req.userId;
  const intento = examAttempts.get(userId);

  if (!intento) {
    return res.status(400).json({ error: "No hay examen iniciado para este usuario." });
  }
  if (intento.hecho) {
    return res.status(400).json({ error: "El examen solo se puede aplicar una vez." });
  }

  const { respuestas } = req.body;
  let correctas = 0;

  for (const r of respuestas) {
    const preg = preguntas.find(p => p.id === r.id);
    if (preg && preg.correcta === r.respuesta) correctas++;
  }

  const calificacion = (correctas / 8) * 100;
  const aprobado = calificacion >= 70;

  examAttempts.set(userId, { ...intento, hecho: true, calificacion, aprobado });

  if (aprobado) {
    const pdfPath = createCertificate(userId);
    return res.status(200).json({ calificacion, aprobado, certificado: pdfPath });
  }

  return res.status(200).json({ calificacion, aprobado });
};
