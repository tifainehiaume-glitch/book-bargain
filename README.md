# 📚 Book Bargain

Application web d'échange de livres gratuit entre particuliers.

## Prérequis

- Docker Desktop installé

## Lancement

```bash
git clone https://github.com/tifainehiaume-glitch/book-bargain.git
cd book-bargain
cp .env.example .env
cd docker
docker-compose up --build
```

## Accès

| Interface | URL |
|-----------|-----|
| Book Bargain | http://localhost:3001 |
| phpMyAdmin | http://localhost:8080 |

## Stack

- Node.js / Express
- MySQL / mysql2
- MongoDB / Mongoose
- Docker
- HTML / CSS / JavaScript

## Notes

Ne jamais commiter le fichier `.env`. Utiliser `.env.example` comme modèle.
