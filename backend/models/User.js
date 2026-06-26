/* gérer les utilisateurs */
const pool = require('../config/mysql');
const bcrypt = require('bcrypt');

class User {

    /* créer un nouvel utilisateur */
    static async create(prenom, nom, email, motDePasse, ville, codePostal) {

        // On hashe le mot de passe avant de le stocker
        const hash = await bcrypt.hash(motDePasse, 10);

        const [result] = await pool.execute(
            `INSERT INTO utilisateurs 
             (prenom, nom, email, mot_de_passe, ville, code_postal) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [prenom, nom, email, hash, ville, codePostal]
        );

        return result.insertId; 
    }

    /* trouver une utilisateur par email */
    static async findByEmail(email) {

        const [rows] = await pool.execute(
            'SELECT * FROM utilisateurs WHERE email = ?',
            [email]
        );

        return rows[0] || null;
    }

    /* trouver un utilisateur par id */
    static async findById(id) {

        const [rows] = await pool.execute(
            'SELECT id, prenom, nom, email, ville, code_postal FROM utilisateurs WHERE id = ?',
            [id]
        );

        return rows[0] || null;
    }

    /* mise a jour utilisateur */
    static async update(id, prenom, nom, ville, codePostal, bio) {

        await pool.execute(
            `UPDATE utilisateurs 
             SET prenom = ?, nom = ?, ville = ?, code_postal = ?, bio = ?
             WHERE id = ?`,
            [prenom, nom, ville, codePostal, bio, id]
        );
    }

    /* vérification du mot de passe*/
    static async verifyPassword(motDePasse, hash) {
        return await bcrypt.compare(motDePasse, hash);
    }

    /* supprimer l'utilisateur */
    static async delete(id) {

        await pool.execute(
            'DELETE FROM utilisateurs WHERE id = ?',
            [id]
        );
    }
}

module.exports = User;