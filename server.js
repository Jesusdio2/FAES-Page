const express = require("express");
const app = express();

app.get("/api/ritual", (req, res) => {
  res.json({ message: "Anubis activo en el altar FAES" });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Servidor FAES escuchando en puerto ${PORT}`);
});
