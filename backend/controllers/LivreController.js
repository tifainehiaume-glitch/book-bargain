/* gère la logique métier liée aux livres */
const Livre = require('../models/Livre');

class LivreController {

    /* récupérer tous les livres disponibles */
    static async getAll(req, res) {
        try {
            const { genre, search } = req.query;

            let livres;

            if (search) {
                livres = await Livre.search(search);

            } else if (genre) {
                livres = await Livre.findByGenre(genre);

            } else {
                livres = await Livre.findAll();
            }

            res.json(livres);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* récupérer un livre par son id */
    static async getOne(req, res) {
        try {
            const livre = await Livre.findById(req.params.id);

            if (!livre) {
                return res.status(404).json({ message: 'Livre introuvable.' });
            }

            res.json(livre);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* récupérer les livres de l'utilisateur connecté */
    static async getMesLivres(req, res) {
        try {
            const livres = await Livre.findByUser(req.user.id);

            res.json(livres);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* créer un livre */
    static async create(req, res) {
        try {
            const { titre, auteur, genre, langue, etat, ville } = req.body;

            const photoUrl = req.body.photo_url || null;

            const id = await Livre.create(
                req.user.id,  
                titre, auteur, genre, langue, etat, ville, photoUrl
            );

            res.status(201).json({ message: 'Livre ajouté.', id });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* modifier un livre */
    static async update(req, res) {
        try {
            const livre = await Livre.findById(req.params.id);

            if (!livre) {
                return res.status(404).json({ message: 'Livre introuvable.' });
            }

            if (livre.utilisateur_id !== req.user.id) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            const { titre, auteur, genre, langue, etat, photo_url } = req.body;
            await Livre.update(req.params.id, titre, auteur, genre, langue, etat, photo_url);

            res.json({ message: 'Livre mis à jour.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* supprimer un livre */
    static async delete(req, res) {
        try {
            const livre = await Livre.findById(req.params.id);

            if (!livre) {
                return res.status(404).json({ message: 'Livre introuvable.' });
            }

            if (livre.utilisateur_id !== req.user.id) {
                return res.status(403).json({ message: 'Non autorisé.' });
            }

            await Livre.delete(req.params.id);

            res.json({ message: 'Livre supprimé.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }
}

module.exports = LivreController;