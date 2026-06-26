const express = require('express');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();

const connectMongo = require('./backend/config/mongodb');
connectMongo();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());            
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));

// ── Routes API ────────────────────────────────────────────────
// app.use('/api/users',   require('./backend/routes/userRoutes'));
// app.use('/api/livres',  require('./backend/routes/livreRoutes'));
// app.use('/api/echanges',require('./backend/routes/echangeRoutes'));
// (décommentées au fur et à mesure qu'on crée les routes)

app.get('/api', (req, res) => {
    res.json({ message: 'API Book Bargain fonctionne !' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});