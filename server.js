const express = require("express");
const app = express();

// Endpoint dinámico
app.get("/api/ritual", (req, res) => {
  res.json({ message: "Anubis activo en el altar FAES" });
});

// Servir archivos estáticos (ej. FAES.html)
app.use(express.static(__dirname));

// Puerto interno fijo (no usar process.env.PORT)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor FAES escuchando en puerto ${PORT}`);
});
