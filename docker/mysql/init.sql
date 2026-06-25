CREATE DATABASE IF NOT EXISTS book_bargain
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE book_bargain;

CREATE TABLE IF NOT EXISTS utilisateurs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  prenom      VARCHAR(100)        NOT NULL,
  nom         VARCHAR(100)        NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255)       NOT NULL,
  ville       VARCHAR(100),
  code_postal VARCHAR(10),
  bio         TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS livres (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT          NOT NULL,
  titre          VARCHAR(255) NOT NULL,
  auteur         VARCHAR(255) NOT NULL,
  genre          ENUM('roman','sf','jeunesse','manga','bd','essai','autre') NOT NULL,
  langue         VARCHAR(50)  DEFAULT 'Français',
  etat           ENUM('neuf','tres_bon','bon','acceptable')  NOT NULL,
  photo_url      VARCHAR(500),
  statut         ENUM('disponible','en_cours','echange') DEFAULT 'disponible',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS echanges (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  livre_demande_id  INT NOT NULL,
  livre_propose_id  INT NOT NULL,
  demandeur_id      INT NOT NULL,
  proprietaire_id   INT NOT NULL,
  statut          ENUM('en_attente','accepte','refuse') DEFAULT 'en_attente',
  lieu_rencontre  VARCHAR(255),
  date_rencontre  DATETIME,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (livre_demande_id)  REFERENCES livres(id),
  FOREIGN KEY (livre_propose_id)  REFERENCES livres(id),
  FOREIGN KEY (demandeur_id)      REFERENCES utilisateurs(id),
  FOREIGN KEY (proprietaire_id)   REFERENCES utilisateurs(id)
);

INSERT INTO utilisateurs (prenom, nom, email, mot_de_passe, ville, code_postal) VALUES
  ('Léa',    'Martin',  'lea@exemple.fr',   '$2y$10$exemple_hash_1', 'Lyon',      '69003'),
  ('Marie',  'Dupont',  'marie@exemple.fr', '$2y$10$exemple_hash_2', 'Paris',     '75011'),
  ('Thomas', 'Richard', 'thomas@exemple.fr','$2y$10$exemple_hash_3', 'Bordeaux',  '33000');

INSERT INTO livres (utilisateur_id, titre, auteur, genre, etat, statut) VALUES
  (1, 'L\'Alchimiste',          'Paulo Coelho',      'roman',    'tres_bon',   'disponible'),
  (2, 'Dune',                   'Frank Herbert',     'sf',       'tres_bon',   'disponible'),
  (2, 'La Horde du Contrevent', 'Alain Damasio',     'sf',       'bon',        'disponible'),
  (3, 'Naruto T.1',             'Masashi Kishimoto', 'manga',    'tres_bon',   'disponible'),
  (1, 'Harry Potter T.1',       'J.K. Rowling',      'jeunesse', 'bon',        'disponible');