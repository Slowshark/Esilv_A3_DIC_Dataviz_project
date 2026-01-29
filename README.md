# 🚇 ParisFlow - Visualisation des Flux de Transports Paris & IDF

> **Projet de Data Visualization - ESILV A3 - 2025/2026**

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://votre-username.github.io/parisflow/)
[![D3.js](https://img.shields.io/badge/Made%20with-D3.js%20v7-orange)](https://d3js.org/)

## 📋 Description

ParisFlow est une visualisation interactive des flux de voyageurs sur le réseau de transports en commun parisien (métro et RER). Le projet simule en temps réel le déplacement des passagers à travers les différentes lignes, avec une carte détaillée de Paris incluant les arrondissements, la Seine et les monuments emblématiques.

## 🎯 Thème

**Mobilité et changement climatique** - Visualisation des flux de transport en commun à Paris et en Île-de-France, favorisant une compréhension de la mobilité urbaine durable.

## ✨ Fonctionnalités

### Carte Interactive

| Fonctionnalité | Description |
|----------------|-------------|
| **Carte de Paris détaillée** | 20 arrondissements, Seine, îles, bois de Boulogne et Vincennes |
| **19 lignes de transport** | 14 lignes de métro + 5 lignes RER avec couleurs officielles |
| **Stations interactives** | Hover pour infos, clic pour détails, mise en évidence des correspondances |
| **Monuments** | 20 monuments emblématiques avec icônes et descriptions |

### Animation en Temps Réel

| Visualisation | Description |
|---------------|-------------|
| **Particules animées** | Simulation du flux de voyageurs sur chaque ligne |
| **Intensité variable** | Densité des particules selon l'heure de la journée |
| **Effet de glow** | Halos lumineux sur les lignes pour effet visuel premium |

### Contrôles Interactifs

- **Timeline (5h-24h)** : Navigation dans la journée avec simulation du trafic
- **Animation automatique** : Mode lecture pour voir l'évolution du trafic
- **Filtres de lignes** : Activer/désactiver les lignes individuellement
- **Filtres de type** : Basculer entre métro et RER
- **Zoom & Pan** : Navigation fluide sur la carte

### Statistiques en Direct

- Nombre de voyageurs estimé par heure
- 303 stations représentées
- 225 km de lignes visualisées
- 12M voyageurs/jour

## 🛠️ Technologies utilisées

- **D3.js v7** - Visualisation de données et carte interactive
- **TopoJSON v3** - Gestion des données géographiques
- **HTML5 / CSS3** - Structure et style avec thème sombre
- **JavaScript ES6+** - Animation et logique applicative
- **CSS Animations** - Effets de glow et transitions fluides

## 📁 Structure du projet

```
parisflow/
├── index.html              # Redirection vers metro.html
├── metro.html              # Page principale de l'application
├── README.md               # Documentation
├── css/
│   └── metro-style.css     # Styles avec thème sombre et effets
├── js/
│   ├── metro-map.js        # Carte D3.js et interactions
│   └── metro-animation.js  # Système de particules animées
└── data/
    ├── metro_data.json          # Données des lignes et stations
    ├── paris_arrondissements.json # GeoJSON des 20 arrondissements
    └── paris_landmarks.json     # Monuments, Seine, îles, parcs
```

## 🚀 Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/parisflow.git
```

2. Lancer un serveur local :
```bash
python -m http.server 8080
# ou
npx serve .
```

3. Ouvrir dans le navigateur :
```
http://localhost:8080
```

## 📊 Sources de données

- **RATP** - Données des lignes de métro
- **SNCF Transilien** - Données des lignes RER
- **Île-de-France Mobilités** - Statistiques de fréquentation
- **OpenStreetMap** - Coordonnées géographiques

## 🎨 Design

Le projet utilise un thème sombre premium avec :
- Couleurs officielles des lignes RATP/SNCF
- Effets de glow et animations CSS
- Interface intuitive avec sidebar de contrôles
- Responsive design pour desktop

## 📈 Améliorations futures

- [ ] Données temps réel via API RATP
- [ ] Mode 3D avec élévation
- [ ] Comparaison avec d'autres métropoles
- [ ] Export des visualisations
- [ ] Calcul d'itinéraires

## 👤 Auteur

**ESILV A3 - Data Visualization 2025/2026**

## 📄 Licence

Ce projet est réalisé dans un cadre académique.

---

*Réalisé avec ❤️ et D3.js*
