/* gère la logique métier liée aux utilisateurs */
const User = require('../models/User');
const jwt  = require('jsonwebtoken');

class UserController {

    /* inscription */
    static async register(req, res) {
        try {
            const { prenom, nom, email, mot_de_passe, ville, code_postal } = req.body;

            /* vérifier si l'email existe déjà */
            const existant = await User.findByEmail(email);
            if (existant) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }

            /* créer l'utilisateur */
            const id = await User.create(prenom, nom, email, mot_de_passe, ville, code_postal);

            res.status(201).json({ message: 'Compte créé avec succès.', id });

        } catch (error) {
            console.error('Erreur register :', error);
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* connexion */
    static async login(req, res) {
        try {
            const { email, mot_de_passe } = req.body;

            /* vérifier si l'utilisateur existe */
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }

            /* vérifier le mot de passe */
            const valide = await User.verifyPassword(mot_de_passe, user.mot_de_passe);
            if (!valide) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }

            /* créer le token JWT */
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }   // Token valide 7 jours
            );

            res.json({ message: 'Connexion réussie.', token, user: {
                id:     user.id,
                prenom: user.prenom,
                nom:    user.nom,
                email:  user.email,
                ville:  user.ville,
            }});

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* voir son profil */
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur introuvable.' });
            }

            res.json(user);

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* modifier son profil */
    static async updateProfile(req, res) {
        try {
            const { prenom, nom, ville, code_postal, bio } = req.body;

            await User.update(req.user.id, prenom, nom, ville, code_postal, bio);

            res.json({ message: 'Profil mis à jour.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }

    /* supprimer son compte */
    static async deleteAccount(req, res) {
        try {
            await User.delete(req.user.id);

            res.json({ message: 'Compte supprimé.' });

        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur.', error: error.message });
        }
    }
}

module.exports = UserController;