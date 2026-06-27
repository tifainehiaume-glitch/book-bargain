// URL de base de l'API
const API_URL = 'http://localhost:3000/api';

// ── Récupère le token JWT stocké dans le localStorage ────────
function getToken() {
    return localStorage.getItem('token');
}

// ── Headers de base pour toutes les requêtes ─────────────────
function getHeaders(avecToken = false) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Ajoute le token si l'utilisateur est connecté
    if (avecToken) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }

    return headers;
}



// Inscription
async function inscription(prenom, nom, email, mot_de_passe, ville, code_postal) {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ prenom, nom, email, mot_de_passe, ville, code_postal }),
    });
    return response.json();
}

// Connexion
async function connexion(email, mot_de_passe) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, mot_de_passe }),
    });
    return response.json();
}

// Voir son profil
async function getProfil() {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: getHeaders(true),
    });
    return response.json();
}

// Modifier son profil
async function updateProfil(prenom, nom, ville, code_postal, bio) {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ prenom, nom, ville, code_postal, bio }),
    });
    return response.json();
}



// Tous les livres (avec filtres optionnels)
async function getLivres(genre = '', search = '') {
    let url = `${API_URL}/livres`;

    // Ajoute les paramètres de filtre si présents
    if (genre)  url += `?genre=${genre}`;
    if (search) url += `?search=${search}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
    });
    return response.json();
}

// Un livre par son id
async function getLivre(id) {
    const response = await fetch(`${API_URL}/livres/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return response.json();
}

// Mes livres
async function getMesLivres() {
    const response = await fetch(`${API_URL}/livres/mes-livres`, {
        method: 'GET',
        headers: getHeaders(true),
    });
    return response.json();
}

// Proposer un livre
async function proposerLivre(titre, auteur, genre, langue, etat, ville, photo_url) {
    const response = await fetch(`${API_URL}/livres`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ titre, auteur, genre, langue, etat, ville, photo_url }),
    });
    return response.json();
}

// Supprimer un livre
async function supprimerLivre(id) {
    const response = await fetch(`${API_URL}/livres/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    return response.json();
}



// Mes échanges
async function getMesEchanges() {
    const response = await fetch(`${API_URL}/echanges`, {
        method: 'GET',
        headers: getHeaders(true),
    });
    return response.json();
}

// Créer une demande d'échange
async function demanderEchange(livre_demande_id, livre_propose_id) {
    const response = await fetch(`${API_URL}/echanges`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ livre_demande_id, livre_propose_id }),
    });
    return response.json();
}

// Accepter un échange
async function accepterEchange(id, lieu_rencontre, date_rencontre) {
    const response = await fetch(`${API_URL}/echanges/${id}/accept`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ lieu_rencontre, date_rencontre }),
    });
    return response.json();
}

// Refuser un échange
async function refuserEchange(id) {
    const response = await fetch(`${API_URL}/echanges/${id}/refuse`, {
        method: 'PUT',
        headers: getHeaders(true),
    });
    return response.json();
}



// Laisser un avis
async function laisserAvis(echange_id, note, commentaire) {
    const response = await fetch(`${API_URL}/avis`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ echange_id, note, commentaire }),
    });
    return response.json();
}

// Avis d'un utilisateur
async function getAvisUser(userId) {
    const response = await fetch(`${API_URL}/avis/user/${userId}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return response.json();
}