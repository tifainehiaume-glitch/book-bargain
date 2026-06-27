/* gère la logique métier liée aux échanges */
const Echange = require('../models/Echange');
const Livre   = require('../models/Livre');

class EchangeController {

    /* récupérer les échanges de l'utilisateur connecté */
    static async getMesEchanges(req, res) {
        try {
            const echanges = await Echange.findByUser(req.user.id);

            res.json(echanges);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* récupérer un échange par son id */
    static async getOne(req, res) {
        try {
            const echange = await Echange.findById(req.params.id);

            if (!echange) {
                return res.status(404).json({ message: 'Échange introuvable.' });
            }

            const estConcerne =
                echange.demandeur_id    === req.user.id ||
                echange.proprietaire_id === req.user.id;

            if (!estConcerne) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            res.json(echange);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* créer une demande d'échange */
    static async create(req, res) {
        try {
            const { livre_demande_id, livre_propose_id } = req.body;

            const livreDemande = await Livre.findById(livre_demande_id);
            if (!livreDemande) {
                return res.status(404).json({ message: 'Livre demandé introuvable.' });
            }

            if (livreDemande.statut !== 'disponible') {
                return res.status(400).json({ message: 'Ce livre n\'est plus disponible.' });
            }

            if (livreDemande.utilisateur_id === req.user.id) {
                return res.status(400).json({ message: 'Vous ne pouvez pas échanger avec vous-même.' });
            }

            const id = await Echange.create(
                livre_demande_id,
                livre_propose_id,
                req.user.id,                  
                livreDemande.utilisateur_id   
            );

            await Livre.updateStatut(livre_demande_id, 'en_cours');
            await Livre.updateStatut(livre_propose_id, 'en_cours');

            res.status(201).json({ message: 'Demande d\'échange envoyée.', id });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* accepter un échange */
    static async accept(req, res) {
        try {
            const echange = await Echange.findById(req.params.id);

            if (!echange) {
                return res.status(404).json({ message: 'Échange introuvable.' });
            }

            if (echange.proprietaire_id !== req.user.id) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            const { lieu_rencontre, date_rencontre } = req.body;

            await Echange.accept(req.params.id, lieu_rencontre, date_rencontre);

            res.json({ message: 'Échange accepté.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* refuser un échange */
    static async refuse(req, res) {
        try {
            const echange = await Echange.findById(req.params.id);

            if (!echange) {
                return res.status(404).json({ message: 'Échange introuvable.' });
            }

            if (echange.proprietaire_id !== req.user.id) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            await Echange.refuse(req.params.id);

            await Livre.updateStatut(echange.livre_demande_id, 'disponible');

            res.json({ message: 'Échange refusé.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* annuler un échange */
    static async delete(req, res) {
        try {
            const echange = await Echange.findById(req.params.id);

            if (!echange) {
                return res.status(404).json({ message: 'Échange introuvable.' });
            }

            if (echange.demandeur_id !== req.user.id) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            await Echange.delete(req.params.id);

            await Livre.updateStatut(echange.livre_demande_id, 'disponible');

            res.json({ message: 'Échange annulé.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }
}

module.exports = EchangeController;