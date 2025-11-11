const express = require("express");
const app = express();

// Endpoint dinámico
app.get("/api/ritual", (req, res) => {
  res.json({ message: "Anubis activo en el altar FAES" });
});

// Servir tu FAES.html si lo subes al contenedor
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor FAES escuchando en puerto ${PORT}`);
});
