db = db.getSiblingDB('book_bargain');


db.createCollection('avis');

db.avis.insertMany([
  {
    echange_id:      1,
    auteur_id:       2,
    destinataire_id: 1,
    note:            5,
    commentaire:     "Super échange avec Léa ! Très ponctuelle, livre en parfait état.",
    created_at:      new Date()
  },
  {
    echange_id:      2,
    auteur_id:       1,
    destinataire_id: 2,
    note:            5,
    commentaire:     "Marie est très sympa, échange rapide et agréable.",
    created_at:      new Date()
  }
]);


db.avis.createIndex({ destinataire_id: 1 });
db.avis.createIndex({ echange_id: 1 });

print('MongoDB initialisé avec succès');