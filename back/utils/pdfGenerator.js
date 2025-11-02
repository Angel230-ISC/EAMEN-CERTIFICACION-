const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.createCertificate = (userId) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, `../certificados/${userId}_certificado.pdf`);

  if (!fs.existsSync(path.join(__dirname, "../certificados"))) {
    fs.mkdirSync(path.join(__dirname, "../certificados"));
  }

  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  doc.fontSize(24).text("Certificado de Aprobación", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(16).text(`Este certificado se otorga a: ${userId}`, { align: "center" });
  doc.moveDown(1);
  doc.text("Por haber aprobado el examen de certificación en JavaScript.", { align: "center" });
  doc.moveDown(1);
  doc.text("Fecha: " + new Date().toLocaleDateString(), { align: "center" });
  doc.moveDown(2);
  doc.text("Compañía: CertiTech Solutions", { align: "center" });
  doc.text("Instructor: Dra. Georgina Salazar Partida", { align: "center" });

  doc.end();
  return `/certificados/${userId}_certificado.pdf`;
};
