/* Connexion à la base de données MongoDB */
const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur connexion MongoDB :', error.message);
        process.exit(1);
    }
};

module.exports = connectMongo;