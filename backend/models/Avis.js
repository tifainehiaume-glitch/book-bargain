/* gère les avis dans MongoDB via Mongoose */
const mongoose = require('mongoose');

/* schéma Mongoose */
const avisSchema = new mongoose.Schema({

    echange_id:      { type: Number, required: true },
    auteur_id:       { type: Number, required: true },
    destinataire_id: { type: Number, required: true },
    note:            { type: Number, required: true, min: 1, max: 5 },
    commentaire:     { type: String, default: '' },
    created_at:      { type: Date,   default: Date.now }

});

/* création du Model Mongoose */
const AvisModel = mongoose.model('Avis', avisSchema);

/* Avis */
class Avis {

    /* créer un avis */
    static async create(echangeId, auteurId, destinataireId, note, commentaire) {

        const avis = new AvisModel({
            echange_id:      echangeId,
            auteur_id:       auteurId,
            destinataire_id: destinataireId,
            note,
            commentaire
        });

        await avis.save();
        return avis;
    }

    /* récupérer les avis reçus par un utilisateur */
    static async findByDestinataire(destinataireId) {

        return await AvisModel
            .find({ destinataire_id: destinataireId })
            .sort({ created_at: -1 }); 
    }

    /* récupérer l'avis d'un échange */
    static async findByEchange(echangeId) {

        return await AvisModel.find({ echange_id: echangeId });
    }

    /* calculer la note moyenne d'un utilisateur */
    static async moyenneNotes(destinataireId) {

        const result = await AvisModel.aggregate([
            { $match: { destinataire_id: destinataireId } },
            { $group: { _id: null, moyenne: { $avg: '$note' } } }
        ]);

        /* retourne la moyenne arrondie à 1 décimale */
        return result.length > 0 ? Math.round(result[0].moyenne * 10) / 10 : 0;
    }
}

module.exports = Avis;