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

// ── Badges genre ──────────────────────────────────────────────
const GENRE_TAGS = {
    roman:    '<span class="tag tag-roman">Roman</span>',
    sf:       '<span class="tag tag-sf">SF</span>',
    jeunesse: '<span class="tag tag-jeunesse">Jeunesse</span>',
    manga:    '<span class="tag tag-manga">Manga</span>',
    bd:       '<span class="tag tag-bd">BD</span>',
    essai:    '<span class="tag tag-essai">Essai</span>',
    autre:    '<span class="tag">Autre</span>',
};

// ── Génère le HTML d'une carte livre ─────────────────────────
function creerCarteLivre(livre) {
    const couleur = GENRE_COULEURS[livre.genre] || '#5A4A3A';
    const tag     = GENRE_TAGS[livre.genre]     || '<span class="tag">Autre</span>';

    return `
        <div class="card book-card"
             onclick="window.location='pages/fiche-livre.html?id=${livre.id}'">

            <!-- Couverture -->
            <div class="book-cover" style="background: ${couleur};">
                <span class="cover-title">${livre.titre}</span>
            </div>

            <!-- Informations -->
            <div class="book-info">
                <p class="book-author">${livre.auteur}</p>
                <div class="book-foot">
                    ${tag}
                    <span class="book-city">📍 ${livre.ville || ''}</span>
                </div>
                <button class="btn-swap"
                        onclick="event.stopPropagation(); window.location='pages/catalogue.html'">
                    Proposer un échange
                </button>
            </div>

        </div>
    `;
}

// ── Charge les 4 premiers livres depuis l'API ─────────────────
async function chargerLivresAccueil() {
    try {
        const livres = await getLivres();

        const grille = document.getElementById('books-grid');

        // Affiche seulement les 4 premiers
        const livresAffiches = livres.slice(0, 4);
        grille.innerHTML = livresAffiches.map(creerCarteLivre).join('');

    } catch (error) {
        console.error('Erreur chargement livres accueil :', error);
    }
}

async function chargerStats() {
    try {
        const livres = await getLivres();
        const stats  = document.querySelectorAll('.stat-n');

        // Nombre de livres disponibles
        stats[0].textContent = livres.length;

        // Nombre de villes uniques
        const villes = new Set(livres.map(l => l.ville).filter(Boolean));
        stats[2].textContent = villes.size;

    } catch (error) {
        console.error('Erreur chargement stats :', error);
    }
}

// ── Exécuté au chargement de la page ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    chargerLivresAccueil();
    chargerStats();
});