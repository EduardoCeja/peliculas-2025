// server.js
const express = require('express');
const path    = require('path');
const app     = express();
const port    = process.env.PORT || 5000;

// Carpeta donde están index.html, catalog.html, etc.
app.use(express.static(path.join(__dirname, '/')));

// Si quisieras fallback tipo SPA, descomenta esto:
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(port, () =>
  console.log(`🌐 Server estático corriendo en el puerto ${port}`)
);
