// ── Vérifie si l'utilisateur est connecté ────────────────────
function estConnecte() {
    return localStorage.getItem('token') !== null;
}

// ── Redirige vers la connexion si pas connecté ───────────────
function protegerPage() {
    if (!estConnecte()) {
        window.location.href = 'connexion.html';
    }
}

// ── Déconnexion ───────────────────────────────────────────────
function deconnexion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'connexion.html';
}

// ── Formulaire de connexion ───────────────────────────────────
async function handleConnexion(event) {
    event.preventDefault();

    const email       = document.getElementById('login-email').value;
    const mot_de_passe = document.getElementById('login-mdp').value;

    // Désactive le bouton pendant la requête
    const btn = document.getElementById('btn-connexion');
    btn.textContent = 'Connexion en cours…';
    btn.disabled = true;

    try {
        const data = await connexion(email, mot_de_passe);

        if (data.token) {
            // Stocke le token et les infos utilisateur
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirige vers la page profil
            window.location.href = 'profil.html';

        } else {
            // Affiche le message d'erreur
            afficherErreur('form-erreur', data.message || 'Email ou mot de passe incorrect.');
            btn.textContent = 'Se connecter';
            btn.disabled = false;
        }

    } catch (error) {
        afficherErreur('form-erreur', 'Erreur de connexion. Réessaie plus tard.');
        btn.textContent = 'Se connecter';
        btn.disabled = false;
    }
}

// ── Formulaire d'inscription ──────────────────────────────────
async function handleInscription(event) {
    event.preventDefault();

    const prenom       = document.getElementById('reg-prenom').value;
    const nom          = document.getElementById('reg-nom').value;
    const email        = document.getElementById('reg-email').value;
    const ville        = document.getElementById('reg-ville').value;
    const mot_de_passe = document.getElementById('reg-mdp').value;

    // Désactive le bouton pendant la requête
    const btn = document.getElementById('btn-inscription');
    btn.textContent = 'Création en cours…';
    btn.disabled = true;

    try {
        const data = await inscription(prenom, nom, email, mot_de_passe, ville, '');

        if (data.id) {
            // Inscription réussie → connexion automatique
            const loginData = await connexion(email, mot_de_passe);

            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify(loginData.user));

            window.location.href = 'profil.html';

        } else {
            afficherErreur('form-erreur-register', data.message || 'Erreur lors de l\'inscription.');
            btn.textContent = 'Créer mon compte';
            btn.disabled = false;
        }

    } catch (error) {
        afficherErreur('form-erreur-register', 'Erreur serveur. Réessaie plus tard.');
        btn.textContent = 'Créer mon compte';
        btn.disabled = false;
    }
}

// ── Affiche un message d'erreur sous un formulaire ────────────
function afficherErreur(id, message) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

// ── Met à jour la nav selon l'état de connexion ───────────────
function updateNav() {
    const btnNav = document.querySelector('.btn-nav');
    if (!btnNav) return;

    if (estConnecte()) {
        // Utilisateur connecté → affiche "Se déconnecter"
        btnNav.textContent = 'Se déconnecter';
        btnNav.href = '#';
        btnNav.addEventListener('click', (e) => {
            e.preventDefault();
            deconnexion();
        });
    } else {
        // Utilisateur non connecté → affiche "Se connecter"
        btnNav.textContent = 'Se connecter';
        btnNav.href = 'connexion.html';
    }
}

// ── Exécuté au chargement de chaque page ─────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
});