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
        <div class="card book-card" onclick="window.location='fiche-livre.html?id=${livre.id}'">

            <!-- Couverture avec couleur du genre -->
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
                        onclick="event.stopPropagation(); ouvrirModalEchange(${livre.id}, '${livre.titre}', '${livre.prenom}')">
                    Proposer un échange
                </button>
            </div>

        </div>
    `;
}

// ── Affiche les livres dans la grille ────────────────────────
function afficherLivres(livres) {
    const grille = document.getElementById('books-grid');

    if (livres.length === 0) {
        grille.innerHTML = '<p style="color:var(--text-mid);padding:2rem;">Aucun livre trouvé.</p>';
        return;
    }

    grille.innerHTML = livres.map(creerCarteLivre).join('');
}

// ── Filtre par genre ──────────────────────────────────────────
async function filtrer(genre, element) {
    // Met à jour les pills actives
    document.querySelectorAll('.gpill').forEach(p => p.classList.remove('active'));
    element.classList.add('active');

    // Appel API
    const livres = await getLivres(genre, '');
    afficherLivres(livres);
}

// ── Recherche par titre ou auteur ─────────────────────────────
async function rechercher() {
    const query = document.getElementById('search-input').value.trim();

    if (!query) {
        chargerLivres();
        return;
    }

    const livres = await getLivres('', query);
    afficherLivres(livres);
}

// ── Modal échange ─────────────────────────────────────────────
async function ouvrirModalEchange(livreId, titre, prenom) {
    document.getElementById('modal-livre-id').value    = livreId;
    document.getElementById('modal-titre').textContent  = titre;
    document.getElementById('modal-prenom').textContent = prenom;

    // Charge les livres disponibles de l'utilisateur dans le select
    const select = document.getElementById('exch-livre');
    select.innerHTML = '<option value="" disabled selected>Choisir un de tes livres…</option>';

    if (estConnecte()) {
        try {
            const mesLivres = await getMesLivres();
            const disponibles = mesLivres.filter(l => l.statut === 'disponible');

            disponibles.forEach(livre => {
                const option = document.createElement('option');
                option.value = livre.id;
                option.textContent = livre.titre;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur chargement mes livres :', error);
        }
    }

    document.getElementById('modal-echange').classList.add('active');
}

// ── Envoyer la demande d'échange ──────────────────────────────
async function envoyerEchange() {
    // Vérifie que l'utilisateur est connecté
    if (!estConnecte()) {
        window.location.href = 'connexion.html';
        return;
    }

    const livreDemandeId  = document.getElementById('modal-livre-id').value;
    const livreProposerId = document.getElementById('exch-livre').value;

    if (!livreProposerId) {
        alert('Choisis un livre à proposer.');
        return;
    }

    try {
        const data = await demanderEchange(livreDemandeId, livreProposerId);

        if (data.id) {
            document.getElementById('modal-echange').classList.remove('active');
            alert('Demande envoyée ! 🎉');
        } else {
            alert(data.message || 'Erreur lors de la demande.');
        }
    } catch (error) {
        console.error('Erreur envoi échange :', error);
    }
}

// ── Chargement initial des livres ─────────────────────────────
async function chargerLivres() {
    try {
        const livres = await getLivres();
        afficherLivres(livres);
    } catch (error) {
        console.error('Erreur chargement livres :', error);
    }
}

// ── Exécuté au chargement de la page ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    chargerLivres();

    // Recherche au clic sur Entrée
    document.getElementById('search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') rechercher();
    });
});