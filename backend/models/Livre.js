
/* gère les livres dans MySQL */
const pool = require('../config/mysql');

class Livre {

    /* créer un nouveau livre */
    static async create(utilisateurId, titre, auteur, genre, langue, etat, ville, photoUrl = null) {

        const [result] = await pool.execute(
            `INSERT INTO livres 
             (utilisateur_id, titre, auteur, genre, langue, etat, ville, photo_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [utilisateurId, titre, auteur, genre, langue, etat, ville, photoUrl]
        );

        return result.insertId; // Retourne l'id du nouveau livre
    }

    /* récupérer tous les livres disponibles */
    static async findAll() {

        const [rows] = await pool.execute(
            `SELECT livres.*, utilisateurs.prenom, utilisateurs.ville
             FROM livres
             JOIN utilisateurs ON livres.utilisateur_id = utilisateurs.id
             WHERE livres.statut = 'disponible'
             ORDER BY livres.created_at DESC`
        );

        return rows;
    }

    /* récupérer un livre par son id */
    static async findById(id) {

        const [rows] = await pool.execute(
            `SELECT livres.*, utilisateurs.prenom, utilisateurs.ville
             FROM livres
             JOIN utilisateurs ON livres.utilisateur_id = utilisateurs.id
             WHERE livres.id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    /* récupérer les livres d'un utilisateur */
    static async findByUser(utilisateurId) {

        const [rows] = await pool.execute(
            `SELECT * FROM livres 
             WHERE utilisateur_id = ?
             ORDER BY created_at DESC`,
            [utilisateurId]
        );

        return rows;
    }

    /* filtrer par genre */
    static async findByGenre(genre) {

        const [rows] = await pool.execute(
            `SELECT livres.*, utilisateurs.prenom, utilisateurs.ville
             FROM livres
             JOIN utilisateurs ON livres.utilisateur_id = utilisateurs.id
             WHERE livres.genre = ? AND livres.statut = 'disponible'
             ORDER BY livres.created_at DESC`,
            [genre]
        );

        return rows;
    }

    /* rechercher par titre ou auteur */
    static async search(query) {

        const [rows] = await pool.execute(
            `SELECT livres.*, utilisateurs.prenom, utilisateurs.ville
             FROM livres
             JOIN utilisateurs ON livres.utilisateur_id = utilisateurs.id
             WHERE (livres.titre LIKE ? OR livres.auteur LIKE ?)
             AND livres.statut = 'disponible'`,
            [`%${query}%`, `%${query}%`]
        );

        return rows;
    }

    /* mettre à jour le statut d'un livre */
    /* statuts possibles : 'disponible', 'en_cours', 'echange' */
    static async updateStatut(id, statut) {

        await pool.execute(
            'UPDATE livres SET statut = ? WHERE id = ?',
            [statut, id]
        );
    }

    /* modifier les infos d'un livre */
    static async update(id, titre, auteur, genre, langue, etat, photoUrl) {

        await pool.execute(
            `UPDATE livres 
             SET titre = ?, auteur = ?, genre = ?, langue = ?, etat = ?, photo_url = ?
             WHERE id = ?`,
            [titre, auteur, genre, langue, etat, photoUrl, id]
        );
    }

    /* supprimer un livre */
    static async delete(id) {

        await pool.execute(
            'DELETE FROM livres WHERE id = ?',
            [id]
        );
    }
}

module.exports = Livre;