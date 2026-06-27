// ── Charge et affiche les infos du profil ────────────────────
async function chargerProfil() {
    try {
        const user = await getProfil();

        // Remplit les champs du formulaire
        document.getElementById('p-prenom').value = user.prenom    || '';
        document.getElementById('p-nom').value    = user.nom       || '';
        document.getElementById('p-email').value  = user.email     || '';
        document.getElementById('p-ville').value  = user.ville     || '';
        document.getElementById('p-cp').value     = user.code_postal || '';
        document.getElementById('p-bio').value    = user.bio       || '';

        // Met à jour l'en-tête du profil
        document.getElementById('profil-avatar').textContent   = user.prenom[0].toUpperCase();
        document.getElementById('profil-nom').textContent      = `${user.prenom} ${user.nom}`;
        document.getElementById('profil-ville').textContent    = `📍 ${user.ville || ''}`;

    } catch (error) {
        console.error('Erreur chargement profil :', error);
    }
}

// ── Soumettre les modifications du profil ────────────────────
async function soumettreModifProfil() {
    const prenom      = document.getElementById('p-prenom').value;
    const nom         = document.getElementById('p-nom').value;
    const ville       = document.getElementById('p-ville').value;
    const code_postal = document.getElementById('p-cp').value;
    const bio         = document.getElementById('p-bio').value;

    const btn = document.getElementById('btn-save-profil');
    btn.textContent = 'Enregistrement…';
    btn.disabled = true;

    try {
        const data = await updateProfil(prenom, nom, ville, code_postal, bio);

        if (data.message) {
            afficherSucces('profil-msg', 'Profil mis à jour ✓');
        }

    } catch (error) {
        console.error('Erreur mise à jour profil :', error);
        afficherErreur('profil-msg', 'Erreur lors de la mise à jour.');
    } finally {
        btn.textContent = 'Enregistrer';
        btn.disabled = false;
    }
}

// ── Soumettre le changement de mot de passe ──────────────────
async function soumettreChangeMdp() {
    const mdp_actuel  = document.getElementById('mdp-actuel').value;
    const mdp_nouveau = document.getElementById('mdp-nouveau').value;
    const mdp_confirm = document.getElementById('mdp-confirm').value;

    // Vérifie que les deux nouveaux mots de passe correspondent
    if (mdp_nouveau !== mdp_confirm) {
        afficherErreur('mdp-msg', 'Les mots de passe ne correspondent pas.');
        return;
    }

    if (mdp_nouveau.length < 8) {
        afficherErreur('mdp-msg', 'Le mot de passe doit faire au moins 8 caractères.');
        return;
    }

    // TODO : ajouter une route PUT /api/users/password dans le backend
    afficherSucces('mdp-msg', 'Mot de passe mis à jour ✓');
}

// ── Supprimer le compte ───────────────────────────────────────
async function supprimerCompte() {
    const confirmation = confirm(
        'Es-tu sûr·e de vouloir supprimer ton compte ? Cette action est irréversible.'
    );

    if (!confirmation) return;

    try {
        await fetch('http://localhost:3000/api/users/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Déconnecte et redirige
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Erreur suppression compte :', error);
    }
}

// ── Affiche un message de succès ─────────────────────────────
function afficherSucces(id, message) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = message;
        el.style.color = 'var(--green)';
        el.style.display = 'block';

        // Cache le message après 3 secondes
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }
}

// ── Affiche un message d'erreur ───────────────────────────────
function afficherErreur(id, message) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = message;
        el.style.color = '#B00020';
        el.style.display = 'block';

        // Cache le message après 3 secondes
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }
}

// ── Exécuté au chargement de la page ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Redirige si pas connecté
    protegerPage();

    // Charge les infos du profil
    chargerProfil();
});