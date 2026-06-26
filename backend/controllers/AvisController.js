/* gère la logique métier liée aux avis */
const Avis    = require('../models/Avis');
const Echange = require('../models/Echange');

class AvisController {

    /* récupérer les avis reçus par un utilisateur */
    static async getAvisUser(req, res) {
        try {
            const avis = await Avis.findByDestinataire(req.params.userId);

            res.json(avis);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* récupérer la note moyenne d'un utilisateur */
    static async getMoyenne(req, res) {
        try {
            const moyenne = await Avis.moyenneNotes(req.params.userId);

            res.json({ moyenne });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* laisser un avis après un échange */
    static async create(req, res) {
        try {
            const { echange_id, note, commentaire } = req.body;

            const echange = await Echange.findById(echange_id);
            if (!echange) {
                return res.status(404).json({ message: 'Échange introuvable.' });
            }

            if (echange.statut !== 'accepte') {
                return res.status(400).json({ message: 'L\'échange n\'est pas encore terminé.' });
            }

            const estConcerne =
                echange.demandeur_id    === req.user.id ||
                echange.proprietaire_id === req.user.id;

            if (!estConcerne) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            const destinataireId = echange.demandeur_id === req.user.id
                ? echange.proprietaire_id   
                : echange.demandeur_id;     

            const avis = await Avis.create(
                echange_id,
                req.user.id,   
                destinataireId,
                note,
                commentaire
            );

            res.status(201).json({ message: 'Avis publié.', avis });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }
}

module.exports = AvisController;