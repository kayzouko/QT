
# Robot Conteur Émotif QT

**Créez des histoires interactives avec un robot expressif !**  
Ce projet permet à un robot virtuel (inspiré de QT) de raconter des histoires en changeant d'expression selon les émotions du récit.

---

## Prérequis

- **Ordinateur** : Windows 10/11, macOS 10.15+ ou Ubuntu 20.04+
- **Espace disque** : 4 Go minimum
- **Connexion Internet** : Pour l'installation initiale

---

## Installation Pas à Pas

### 1. Installer Node.js (Backend)

- **Windows** :  
  Téléchargez depuis [nodejs.org](https://nodejs.org/) → LTS Version → Installez comme une app normale

- **macOS/Linux** :  
  Ouvrez le Terminal et collez :
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

### 2. Installer Ollama (IA Locale)

- **Windows** :  
  Téléchargez OllamaSetup.exe depuis https://ollama.com/download/windows → Exécutez le fichier

- **macOS** :  
  Ouvrez le Terminal et collez :
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

### 3. Télécharger le Projet

- Allez sur le lien GitHub du projet
- Cliquez sur **Code** → **Download ZIP**
- Dézippez le dossier où vous voulez (Bureau par exemple)

---

## Configuration

### 1. Installer les Dépendances

- Ouvrez le dossier du projet QT et allez dans le dossier backend où se trouve package.json
  - **Windows** :  
    Clic dans la barre d’adresse → Tapez cmd ou powershell → Entrée
  - **macOS/Linux** :
    Clic droit dans le dossier → "Ouvrir dans le Terminal"  
    Collez :
    ```bash
    npm install
    ```

### 2. Configurer l'IA

- Dans le Terminal toujours, collez maintenant :
  ```bash
  ollama pull llama3
  ```

---

## Lancer le Projet

### 1. Démarrer l'IA

- Ouvrez un nouveau Terminal et collez :
  ```bash
  ollama serve
  ```

### 2. Lancer le Backend

- Dans le premier Terminal, collez :
  ```bash
  node index.js
  ```

### 3. Ouvrir l'Interface

- Dans votre explorateur de fichiers :  
  Allez dans le dossier `frontend`  
  Double-cliquez sur `index.html` et vous voilà devant le site fonctionnel

---

## Aide & Dépannage

### Problèmes Courants

- **"Port déjà utilisé"** : Redémarrez l'ordinateur  
- **"Modèle non trouvé"** : Relancez `ollama pull llama3`  
- **Pas de son** : Cliquez sur l'icône 🔊 dans le navigateur

### Commandes Utiles dans le terminal

| Action                   | Commande              |
|--------------------------|-----------------------|
| Arrêter le robot         | Ctrl + C x2           |
| Mettre à jour            | `ollama pull llama3`  |

---

## Personnalisation

### Changer les Émotions

- Remplacez les images dans le dossier `emotions/`  
- Formats supportés : PNG 
- Gardez les noms originaux

---

Bon amusement avec votre robot conteur !  
Pour toute question : nizar.boulac@etu.umontpellier.fr
