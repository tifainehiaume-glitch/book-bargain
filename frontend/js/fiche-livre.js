// ── Couleurs par genre ────────────────────────────────────────
const GENRE_COULEURS = {
    roman:    '#741D28',
    sf:       '#2E4A38',
    jeunesse: '#F08A59',
    manga:    '#9A2060',
    bd:       '#4A2A7A',
    essai:    '#8A8A2A',
    autre:    '#5A4A3A',
};

// ── Récupère l'id du livre dans l'URL ────────────────────────
// Ex : fiche-livre.html?id=3 → retourne "3"
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ── Affiche les informations du livre ─────────────────────────
function afficherLivre(livre) {
    const couleur = GENRE_COULEURS[livre.genre] || '#5A4A3A';

    // Met à jour le fil d'ariane et le titre de l'onglet
    document.getElementById('breadcrumb-titre').textContent = livre.titre;
    document.title = `Book Bargain — ${livre.titre}`;

    // Remplit la section principale
    document.getElementById('book-hero').innerHTML = `

        <!-- Couverture -->
        <div class="cover-big" style="background: ${couleur};">
            <span class="cover-title">${livre.titre}</span>
        </div>

        <!-- Informations du livre -->
        <div class="detail">

            <span class="tag tag-${livre.genre}" style="width:fit-content;">
                ${livre.genre}
            </span>

            <div>
                <h1 class="book-title">${livre.titre}</h1>
                <p class="book-author">${livre.auteur}</p>
            </div>

            <div class="meta-row">
                <p class="meta-chip">📍 <strong>${livre.ville || ''}</strong></p>
                <p class="meta-chip">🌍 <strong>${livre.langue || 'Français'}</strong></p>
            </div>

            <div>
                <span class="etat-badge">👍 ${livre.etat || ''}</span>
            </div>

            <!-- Carte propriétaire -->
            <div class="owner-row">
                <div class="owner-avatar">
                    ${livre.prenom ? livre.prenom[0].toUpperCase() : '?'}
                </div>
                <div>
                    <p class="owner-name">${livre.prenom || ''}</p>
                    <p class="owner-sub">${livre.ville || ''}</p>
                </div>
            </div>

            <!-- Bouton échange -->
            <button class="btn btn-primary btn-full"
                    onclick="ouvrirModal(${livre.id}, \`${livre.titre}\`, \`${livre.prenom}\`)">
                Proposer un échange
            </button>

            <p class="safety-note">
                🔒 Email transmis uniquement après acceptation mutuelle · Rencontre en lieu public
            </p>

        </div>
    `;
}

// ── Ouvre la modale d'échange ─────────────────────────────────
function ouvrirModal(id, titre, prenom) {

    // Redirige vers la connexion si pas connecté
    if (!estConnecte()) {
        window.location.href = 'connexion.html';
        return;
    }

    document.getElementById('modal-livre-id').value   = id;
    document.getElementById('modal-desc').textContent =
        `Propose un livre à ${prenom} pour obtenir "${titre}".`;
    document.getElementById('modal').classList.add('active');
}

// ── Envoyer la demande d'échange ──────────────────────────────
function envoyerEchange() {
    // TODO : appel API POST /api/echanges
    document.getElementById('modal').classList.remove('active');
    alert('Demande envoyée !');
}

// ── Exécuté au chargement de la page ─────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    const id = getIdFromUrl();

    // Redirige vers le catalogue si pas d'id dans l'URL
    if (!id) {
        window.location.href = 'catalogue.html';
        return;
    }

    try {
        const livre = await getLivre(id);
        afficherLivre(livre);
    } catch (error) {
        console.error('Erreur chargement livre :', error);
    }
});