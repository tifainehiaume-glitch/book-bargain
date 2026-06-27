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
 
// ── Badge statut ──────────────────────────────────────────────
const STATUT_BADGES = {
    disponible: '<span class="status-badge s-dispo">Disponible</span>',
    en_cours:   '<span class="status-badge s-attente">Demande reçue</span>',
    echange:    '<span class="status-badge s-echange">Échangé ✓</span>',
};
 
// ── Génère le HTML d'une carte livre (mes livres) ─────────────
function creerCarteMonLivre(livre) {
    const couleur = GENRE_COULEURS[livre.genre] || '#5A4A3A';
    const badge   = STATUT_BADGES[livre.statut] || '';
 
    // Boutons selon le statut
    let actions = '';
    if (livre.statut === 'disponible') {
        actions = `
            <div class="book-actions">
                <button class="btn-xs" onclick="ouvrirModalModifier(${livre.id})">Modifier</button>
                <button class="btn-xs" onclick="supprimerMonLivre(${livre.id})">Retirer</button>
            </div>
        `;
    } else if (livre.statut === 'en_cours') {
        actions = `
            <div class="book-actions">
                <button class="btn-xs" onclick="switchTab(1)">Voir l'échange</button>
            </div>
        `;
    }
 
    return `
        <div class="card" id="livre-${livre.id}">
 
            <!-- Couverture -->
            <div class="book-cover" style="background: ${couleur};">
                <span class="cover-title">${livre.titre}</span>
            </div>
 
            <!-- Informations -->
            <div class="book-info">
                <p class="book-author">${livre.auteur}</p>
                <div class="book-foot">
                    ${badge}
                </div>
                ${actions}
            </div>
 
        </div>
    `;
}
 
// ── Génère le HTML d'une carte échange ───────────────────────
function creerCarteEchange(echange) {
 
    // Couleur des mini couvertures
    const couleur1 = '#2E4A38';
    const couleur2 = '#741D28';
 
    // Badge selon statut
    let badge = '';
    if (echange.statut === 'en_attente') {
        badge = '<span class="exc-badge exc-pending">En attente de ta réponse</span>';
    } else if (echange.statut === 'accepte') {
        badge = `<span class="exc-badge exc-accepted">Accepté · 📍 ${echange.lieu_rencontre || ''}</span>`;
    }
 
    // Boutons selon statut et rôle
    let boutons = '';
    const user = JSON.parse(localStorage.getItem('user'));
 
    if (echange.statut === 'en_attente' && echange.proprietaire_id === user.id) {
        boutons = `
            <button class="btn-accept" onclick="accepter(${echange.id})">Accepter</button>
            <button class="btn-decline" onclick="refuser(${echange.id})">Refuser</button>
        `;
    } else if (echange.statut === 'accepte') {
        boutons = `<button class="btn-accept" onclick="confirmerFait(${echange.id})">C'est fait ✓</button>`;
    }
 
    return `
        <div class="exc-card" id="echange-${echange.id}">
 
            <!-- Mini couvertures -->
            <div class="exc-covers">
                <div class="exc-cover" style="background: ${couleur1};"></div>
                <span class="exc-arrow">⇄</span>
                <div class="exc-cover" style="background: ${couleur2};"></div>
            </div>
 
            <!-- Informations -->
            <div class="exc-info">
                <h4>${echange.titre_demande} ⇄ ${echange.titre_propose}</h4>
                <p>
                    Avec <strong>${echange.prenom_demandeur}</strong>
                    · Il y a quelques jours
                </p>
                ${badge}
            </div>
 
            <!-- Actions -->
            <div class="exc-actions">
                ${boutons}
            </div>
 
        </div>
    `;
}
 
// ── Charger mes livres depuis l'API ───────────────────────────
async function chargerMesLivres() {
    try {
        const livres  = await getMesLivres();
        const grille  = document.getElementById('grille-mes-livres');
 
        // Affiche les livres
        let html = livres.map(creerCarteMonLivre).join('');
 
        // Bouton ajouter un livre toujours en dernier
        html += `
            <div class="add-card"
                 onclick="document.getElementById('modal-propose').classList.add('active')">
                <span>＋</span>
                <p>Ajouter un livre</p>
            </div>
        `;
 
        grille.innerHTML = html;
 
        // Met à jour le compteur dans l'onglet
        document.getElementById('count-livres').textContent = livres.length;
 
    } catch (error) {
        console.error('Erreur chargement mes livres :', error);
    }
}
 
// ── Charger mes échanges depuis l'API ─────────────────────────
async function chargerMesEchanges() {
    try {
        const echanges   = await getMesEchanges();
        const container  = document.getElementById('liste-echanges');
 
        if (echanges.length === 0) {
            container.innerHTML = '<p style="color:var(--text-mid);">Aucun échange en cours.</p>';
            return;
        }
 
        container.innerHTML = echanges.map(creerCarteEchange).join('');
 
        // Met à jour le compteur dans l'onglet
        document.getElementById('count-echanges').textContent = echanges.length;
 
    } catch (error) {
        console.error('Erreur chargement échanges :', error);
    }
}
 
// ── Proposer un livre ─────────────────────────────────────────
async function soumettreProposition() {
    const titre  = document.getElementById('p-titre').value;
    const auteur = document.getElementById('p-auteur').value;
    const genre  = document.getElementById('p-genre').value;
    const ville  = document.getElementById('p-ville').value;
    const etatTexte = document.querySelector('.etat-pill.sel')?.textContent.trim() || '';
    const etatMap = {
    '✨ Neuf': 'neuf',
    '👍 Très bon': 'tres_bon',
    '👌 Bon': 'bon',
    '📖 Acceptable': 'acceptable',
    };
    const etat = etatMap[etatTexte] || 'tres_bon';
 
    if (!titre || !auteur || !genre || !ville) {
        alert('Remplis tous les champs obligatoires.');
        return;
    }
 
    try {
        const data = await proposerLivre(titre, auteur, genre, 'Français', etat, ville, null);
 
        if (data.id) {
            document.getElementById('modal-propose').classList.remove('active');
            chargerMesLivres(); // Recharge la liste
        } else {
            alert(data.message || 'Erreur lors de l\'ajout.');
        }
    } catch (error) {
        console.error('Erreur proposition livre :', error);
    }
}
 
// ── Supprimer un livre ────────────────────────────────────────
async function supprimerMonLivre(id) {
    if (!confirm('Retirer ce livre du catalogue ?')) return;
 
    try {
        await supprimerLivre(id);
        document.getElementById(`livre-${id}`).remove();
    } catch (error) {
        console.error('Erreur suppression :', error);
    }
}
 
// ── Accepter un échange ───────────────────────────────────────
async function accepter(id) {
    const lieu  = prompt('Lieu de rencontre (ex: Place Bellecour, Lyon) :');
    if (!lieu) return;

    const heure = prompt('Heure de rencontre (ex: 14:30) :');
    if (!heure) return;

    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const dateFormatee = `${dateStr} ${heure}:00`;

    try {
        await accepterEchange(id, lieu, dateFormatee);
        chargerMesEchanges();
    } catch (error) {
        console.error('Erreur acceptation :', error);
    }
}
 
// ── Refuser un échange ────────────────────────────────────────
async function refuser(id) {
    if (!confirm('Refuser cet échange ?')) return;
 
    try {
        await refuserEchange(id);
        document.getElementById(`echange-${id}`).remove();
    } catch (error) {
        console.error('Erreur refus :', error);
    }
}
 
// ── Confirmer que l'échange a eu lieu ─────────────────────────
function confirmerFait(id) {
    // TODO : marquer l'échange comme terminé + inviter à laisser un avis
    alert('Super ! L\'échange est terminé.');
}
 
// ── Switch onglets ────────────────────────────────────────────
function sw(i) {
    document.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('active', i === j));
    document.querySelectorAll('.tab-panel').forEach((p, j) => p.classList.toggle('active', i === j));
}
 
// ── Sélection état du livre ───────────────────────────────────
function selEtat(el) {
    document.querySelectorAll('.etat-pill').forEach(p => p.classList.remove('sel'));
    el.classList.add('sel');
}
 
// ── Exécuté au chargement de la page ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Redirige si pas connecté
    protegerPage();
 
    // Charge les données
    chargerMesLivres();
    chargerMesEchanges();
});
