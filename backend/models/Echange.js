/* gère les échanges dans MySQL */
const pool = require('../config/mysql');

class Echange {

    /* créer une demande d'échange */
    static async create(livreDemadeId, livreProposerId, demandeurId, proprietaireId) {

        const [result] = await pool.execute(
            `INSERT INTO echanges 
             (livre_demande_id, livre_propose_id, demandeur_id, proprietaire_id) 
             VALUES (?, ?, ?, ?)`,
            [livreDemadeId, livreProposerId, demandeurId, proprietaireId]
        );

        return result.insertId; 
    }

    /* récupérer un échange par son id */
    static async findById(id) {

        const [rows] = await pool.execute(
            `SELECT echanges.*,
                    ld.titre AS titre_demande,
                    lp.titre AS titre_propose,
                    u1.prenom AS prenom_demandeur,
                    u2.prenom AS prenom_proprietaire
             FROM echanges
             JOIN livres ld ON echanges.livre_demande_id  = ld.id
             JOIN livres lp ON echanges.livre_propose_id  = lp.id
             JOIN utilisateurs u1 ON echanges.demandeur_id    = u1.id
             JOIN utilisateurs u2 ON echanges.proprietaire_id = u2.id
             WHERE echanges.id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    /* récupérer les échanges d'un utilisateur */
    static async findByUser(utilisateurId) {

        const [rows] = await pool.execute(
            `SELECT echanges.*,
                    ld.titre AS titre_demande,
                    lp.titre AS titre_propose,
                    u1.prenom AS prenom_demandeur,
                    u2.prenom AS prenom_proprietaire
             FROM echanges
             JOIN livres ld ON echanges.livre_demande_id  = ld.id
             JOIN livres lp ON echanges.livre_propose_id  = lp.id
             JOIN utilisateurs u1 ON echanges.demandeur_id    = u1.id
             JOIN utilisateurs u2 ON echanges.proprietaire_id = u2.id
             WHERE echanges.demandeur_id = ? OR echanges.proprietaire_id = ?
             ORDER BY echanges.created_at DESC`,
            [utilisateurId, utilisateurId]
        );

        return rows;
    }

    /* accepter un échange */
    static async accept(id, lieuRencontre, dateRencontre) {

        await pool.execute(
            `UPDATE echanges 
             SET statut = 'accepte', lieu_rencontre = ?, date_rencontre = ?
             WHERE id = ?`,
            [lieuRencontre, dateRencontre, id]
        );
    }

    /* refuser un échange */
    static async refuse(id) {

        await pool.execute(
            `UPDATE echanges 
             SET statut = 'refuse'
             WHERE id = ?`,
            [id]
        );
    }

    /* supprimer un échange */
    static async delete(id) {

        await pool.execute(
            'DELETE FROM echanges WHERE id = ?',
            [id]
        );
    }
}

module.exports = Echange;