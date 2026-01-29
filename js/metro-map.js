/**
 * Metro Map - Visualisation D3.js de la carte du métro/RER Paris
 */

// Variables globales
let metroData = null;
let parisGeo = null;
let parisLandmarks = null;
let ileDeFranceGeo = null;
let svg = null;
let g = null;
let zoom = null;
let width, height;
let projection = null;
let currentHour = 8;
let activeLines = new Set();
let isPlaying = false;
let animationInterval = null;
let showMonuments = true;
let disruptedLine = null; // Ligne perturbée
let showMetro = true;
let showRER = true;

// Coordonnées étendues des stations (générer des positions réalistes)
const extendedStationCoords = {
    // Métro 1
    "La Défense": [2.2378, 48.8920],
    "Esplanade de La Défense": [2.2500, 48.8890],
    "Pont de Neuilly": [2.2590, 48.8850],
    "Les Sablons": [2.2720, 48.8810],
    "Porte Maillot": [2.2824, 48.8780],
    "Argentine": [2.2890, 48.8760],
    "Charles de Gaulle - Étoile": [2.2950, 48.8738],
    "George V": [2.3010, 48.8720],
    "Franklin D. Roosevelt": [2.3090, 48.8693],
    "Champs-Élysées - Clemenceau": [2.3140, 48.8673],
    "Concorde": [2.3214, 48.8656],
    "Tuileries": [2.3290, 48.8640],
    "Palais Royal": [2.3370, 48.8620],
    "Louvre - Rivoli": [2.3410, 48.8608],
    "Châtelet": [2.3470, 48.8589],
    "Hôtel de Ville": [2.3520, 48.8570],
    "Saint-Paul": [2.3610, 48.8550],
    "Bastille": [2.3692, 48.8531],
    "Gare de Lyon": [2.3735, 48.8443],
    "Reuilly - Diderot": [2.3870, 48.8470],
    "Nation": [2.3952, 48.8484],
    "Porte de Vincennes": [2.4105, 48.8472],
    "Saint-Mandé": [2.4200, 48.8460],
    "Bérault": [2.4300, 48.8455],
    "Château de Vincennes": [2.4405, 48.8444],
    
    // Métro 4
    "Porte de Clignancourt": [2.3449, 48.8975],
    "Simplon": [2.3480, 48.8930],
    "Marcadet - Poissonniers": [2.3500, 48.8910],
    "Château Rouge": [2.3490, 48.8870],
    "Barbès - Rochechouart": [2.3495, 48.8835],
    "Gare du Nord": [2.3553, 48.8809],
    "Gare de l'Est": [2.3588, 48.8763],
    "Château d'Eau": [2.3560, 48.8720],
    "Strasbourg - Saint-Denis": [2.3540, 48.8695],
    "Réaumur - Sébastopol": [2.3520, 48.8660],
    "Étienne Marcel": [2.3490, 48.8635],
    "Les Halles": [2.3450, 48.8620],
    "Cité": [2.3460, 48.8550],
    "Saint-Michel": [2.3440, 48.8530],
    "Odéon": [2.3390, 48.8510],
    "Saint-Germain-des-Prés": [2.3330, 48.8530],
    "Saint-Sulpice": [2.3310, 48.8505],
    "Saint-Placide": [2.3270, 48.8460],
    "Montparnasse": [2.3219, 48.8427],
    "Vavin": [2.3290, 48.8420],
    "Raspail": [2.3310, 48.8390],
    "Denfert-Rochereau": [2.3326, 48.8339],
    "Mouton-Duvernet": [2.3300, 48.8300],
    "Alésia": [2.3270, 48.8270],
    "Porte d'Orléans": [2.3258, 48.8227],
    "Mairie de Montrouge": [2.3200, 48.8180],
    "Bagneux": [2.3100, 48.8100],
    
    // Plus de stations...
    "République": [2.3633, 48.8675],
    "Opéra": [2.3316, 48.8702],
    "Saint-Lazare": [2.3250, 48.8756],
    "Place d'Italie": [2.3558, 48.8311],
    "Bercy": [2.3794, 48.8401],
    "Bibliothèque François Mitterrand": [2.3756, 48.8296],
    "Invalides": [2.3140, 48.8610],
    "Trocadéro": [2.2873, 48.8630],
    "Pigalle": [2.3378, 48.8821],
    "Anvers": [2.3445, 48.8831],
    "Place de Clichy": [2.3273, 48.8835],
    "Blanche": [2.3323, 48.8838],
    
    // RER A - Coordonnées corrigées
    "Saint-Germain-en-Laye": [2.0935, 48.8982],
    "Le Vésinet - Le Pecq": [2.1300, 48.8950],
    "Le Vésinet - Centre": [2.1450, 48.8920],
    "Chatou - Croissy": [2.1650, 48.8900],
    "Rueil-Malmaison": [2.1900, 48.8780],
    "Nanterre - Ville": [2.2050, 48.8920],
    "Nanterre - Préfecture": [2.2180, 48.8920],
    "Auber": [2.3295, 48.8726],
    "Châtelet - Les Halles": [2.3470, 48.8612],
    "Vincennes": [2.4320, 48.8470],
    "Fontenay-sous-Bois": [2.4750, 48.8520],
    "Nogent-sur-Marne": [2.4830, 48.8380],
    "Joinville-le-Pont": [2.4720, 48.8210],
    "Saint-Maur - Créteil": [2.4700, 48.8050],
    "Le Parc de Saint-Maur": [2.4900, 48.8000],
    "Champigny": [2.5150, 48.8170],
    "La Varenne - Chennevières": [2.5200, 48.7880],
    "Sucy - Bonneuil": [2.5100, 48.7700],
    "Boissy-Saint-Léger": [2.5064, 48.7533],
    "Val de Fontenay": [2.4700, 48.8550],
    "Neuilly-Plaisance": [2.5100, 48.8620],
    "Bry-sur-Marne": [2.5250, 48.8450],
    "Noisy-le-Grand - Mont d'Est": [2.5550, 48.8420],
    "Noisy - Champs": [2.5850, 48.8480],
    "Noisiel": [2.6200, 48.8520],
    "Lognes": [2.6350, 48.8380],
    "Torcy": [2.6550, 48.8350],
    "Bussy-Saint-Georges": [2.7100, 48.8420],
    "Val d'Europe": [2.7500, 48.8550],
    "Marne-la-Vallée - Chessy": [2.7833, 48.8674],
    
    // RER B - Coordonnées corrigées avec plus de stations
    "Aéroport CDG Terminal 2": [2.5700, 49.0047],
    "Aéroport CDG Terminal 1": [2.5650, 48.9930],
    "Parc des Expositions": [2.5150, 48.9730],
    "Villepinte": [2.5100, 48.9600],
    "Sevran - Beaudottes": [2.5200, 48.9450],
    "Aulnay-sous-Bois": [2.4950, 48.9320],
    "Le Blanc-Mesnil": [2.4650, 48.9280],
    "Drancy": [2.4500, 48.9200],
    "Le Bourget": [2.4254, 48.9313],
    "La Courneuve - Aubervilliers": [2.3900, 48.9200],
    "La Plaine - Stade de France": [2.3620, 48.9180],
    "Saint-Michel - Notre-Dame": [2.3460, 48.8535],
    "Luxembourg": [2.3400, 48.8462],
    "Port-Royal": [2.3370, 48.8400],
    "Denfert-Rochereau": [2.3326, 48.8339],
    "Cité Universitaire": [2.3390, 48.8230],
    "Gentilly": [2.3450, 48.8150],
    "Laplace": [2.3500, 48.8050],
    "Arcueil - Cachan": [2.3320, 48.7980],
    "Bagneux": [2.3150, 48.7920],
    "Bourg-la-Reine": [2.3100, 48.7800],
    "Parc de Sceaux": [2.2950, 48.7750],
    "La Croix de Berny": [2.2900, 48.7650],
    "Antony": [2.3020, 48.7540],
    "Fontaine-Michalon": [2.2900, 48.7420],
    "Les Baconnets": [2.2850, 48.7320],
    "Massy - Verrières": [2.2730, 48.7250],
    "Massy - Palaiseau": [2.2580, 48.7180],
    "Palaiseau": [2.2450, 48.7150],
    "Palaiseau - Villebon": [2.2300, 48.7030],
    "Lozère": [2.2100, 48.6950],
    "Le Guichet": [2.1900, 48.6900],
    "Orsay-Ville": [2.1850, 48.6980],
    "Bures-sur-Yvette": [2.1650, 48.6950],
    "La Hacquinière": [2.1400, 48.7000],
    "Gif-sur-Yvette": [2.1300, 48.7020],
    "Courcelle-sur-Yvette": [2.0900, 48.7000],
    "Saint-Rémy-lès-Chevreuse": [2.0714, 48.7025],
    
    // RER C - Coordonnées corrigées avec plus de stations
    "Versailles - Château Rive Gauche": [2.1286, 48.7997],
    "Viroflay - Rive Gauche": [2.1700, 48.7920],
    "Chaville - Vélizy": [2.1850, 48.8000],
    "Meudon - Val Fleury": [2.2350, 48.8050],
    "Issy": [2.2600, 48.8200],
    "Pont du Garigliano": [2.2720, 48.8380],
    "Champ de Mars - Tour Eiffel": [2.2895, 48.8560],
    "Pont de l'Alma": [2.3010, 48.8610],
    "Invalides": [2.3140, 48.8610],
    "Musée d'Orsay": [2.3258, 48.8607],
    "Saint-Michel - Notre-Dame": [2.3460, 48.8535],
    "Gare d'Austerlitz": [2.3648, 48.8424],
    "Bibliothèque François Mitterrand": [2.3756, 48.8296],
    "Ivry-sur-Seine": [2.3850, 48.8100],
    "Vitry-sur-Seine": [2.3950, 48.7900],
    "Les Ardoines": [2.4050, 48.7750],
    "Choisy-le-Roi": [2.4100, 48.7600],
    "Villeneuve-le-Roi": [2.4050, 48.7350],
    "Ablon": [2.4100, 48.7200],
    "Athis-Mons": [2.4000, 48.7050],
    "Juvisy": [2.3831, 48.6894],
    "Pontoise": [2.0953, 49.0504],
    "Saint-Ouen-l'Aumône": [2.1200, 49.0300],
    "Épinay-sur-Seine": [2.3100, 48.9550],
    "Gennevilliers": [2.2900, 48.9320],
    "Les Grésillons": [2.2900, 48.9200],
    "Saint-Ouen": [2.3200, 48.9100],
    "Porte de Clichy": [2.3150, 48.8950],
    "Pereire - Levallois": [2.2980, 48.8850],
    "Neuilly - Porte Maillot": [2.2824, 48.8780],
    "Avenue Foch": [2.2870, 48.8710],
    "Avenue Henri Martin": [2.2780, 48.8650],
    "Boulainvilliers": [2.2750, 48.8580],
    "Kennedy - Radio France": [2.2800, 48.8520],
    
    // RER D - Coordonnées corrigées avec plus de stations
    "Orry-la-Ville - Coye": [2.4850, 49.1350],
    "La Borne Blanche": [2.4700, 49.1100],
    "Survilliers - Fosses": [2.5200, 49.0980],
    "Louvres": [2.5050, 49.0450],
    "Les Noues": [2.4600, 49.0200],
    "Goussainville": [2.4650, 49.0100],
    "Villiers-le-Bel": [2.4050, 48.9650],
    "Arnouville": [2.4150, 48.9750],
    "Garges - Sarcelles": [2.3900, 48.9580],
    "Pierrefitte - Stains": [2.3700, 48.9400],
    "Saint-Denis": [2.3600, 48.9300],
    "Stade de France - Saint-Denis": [2.3658, 48.9176],
    "Maisons-Alfort - Alfortville": [2.4250, 48.8050],
    "Le Vert de Maisons": [2.4350, 48.7900],
    "Créteil - Pompadour": [2.4500, 48.7750],
    "Villeneuve-Saint-Georges": [2.4600, 48.7350],
    "Montgeron - Crosne": [2.4700, 48.7150],
    "Brunoy": [2.4950, 48.7050],
    "Yerres": [2.4800, 48.6900],
    "Boussy-Saint-Antoine": [2.5350, 48.6800],
    "Combs-la-Ville - Quincy": [2.5500, 48.6650],
    "Lieusaint - Moissy": [2.5600, 48.6350],
    "Savigny-le-Temple - Nandy": [2.5800, 48.5950],
    "Cesson": [2.6050, 48.5650],
    "Le Mée": [2.6200, 48.5450],
    "Melun": [2.6553, 48.5272],
    
    // RER E - Coordonnées corrigées avec plus de stations
    "Haussmann - Saint-Lazare": [2.3275, 48.8752],
    "Magenta": [2.3569, 48.8818],
    "Rosa Parks": [2.3743, 48.8971],
    "Pantin": [2.4050, 48.8950],
    "Noisy-le-Sec": [2.4600, 48.8920],
    "Bondy": [2.4850, 48.8930],
    "Le Raincy - Villemomble - Montfermeil": [2.5200, 48.8850],
    "Gagny": [2.5350, 48.8830],
    "Le Chénay - Gagny": [2.5550, 48.8780],
    "Chelles - Gournay": [2.5820, 48.8780],
    "Vaires - Torcy": [2.6350, 48.8650],
    "Lagny - Thorigny": [2.7100, 48.8720],
    "Esbly": [2.8100, 48.9000],
    "Meaux": [2.8800, 48.9600],
    "Tournan": [2.7614, 48.7403],
    
    // Autres stations importantes
    "Bobigny - Pablo Picasso": [2.4494, 48.9067],
    "La Courneuve": [2.4103, 48.9207],
    "Mairie d'Ivry": [2.3843, 48.8112],
    "Créteil - Préfecture": [2.4590, 48.7798],
    "Pont de Sèvres": [2.2305, 48.8297],
    "Mairie de Montreuil": [2.4414, 48.8622],
    "Gallieni": [2.4162, 48.8652],
    "Châtillon - Montrouge": [2.3015, 48.8109],
    "Mairie d'Issy": [2.2738, 48.8241],
    "Front Populaire": [2.3654, 48.9067],
    "Saint-Denis - Université": [2.3640, 48.9459],
    "Olympiades": [2.3673, 48.8270],
    "Aéroport d'Orly": [2.3652, 48.7433],
    "Saint-Denis Pleyel": [2.3459, 48.9183],
    "Mairie des Lilas": [2.4163, 48.8797]
};

// Données Île-de-France (contour simplifié)
const ileDeFranceContour = [
    [1.4500, 49.2500], [1.6000, 49.2800], [1.8000, 49.2600], [2.0000, 49.2400],
    [2.2500, 49.2200], [2.5000, 49.2500], [2.7500, 49.2300], [2.9500, 49.1500],
    [3.1000, 49.0800], [3.1500, 48.9500], [3.1500, 48.8000], [3.1000, 48.6500],
    [3.0000, 48.5000], [2.8500, 48.3500], [2.6500, 48.2800], [2.4500, 48.2500],
    [2.2500, 48.2500], [2.0000, 48.2800], [1.8000, 48.3500], [1.6000, 48.4500],
    [1.4500, 48.5500], [1.4000, 48.7000], [1.4000, 48.8500], [1.4000, 49.0000],
    [1.4200, 49.1500], [1.4500, 49.2500]
];

// Chargement des données
async function loadMetroData() {
    try {
        const [metroResponse, geoResponse, landmarksResponse] = await Promise.all([
            fetch('data/metro_data.json'),
            fetch('data/paris_arrondissements.json'),
            fetch('data/paris_landmarks.json')
        ]);
        
        metroData = await metroResponse.json();
        parisGeo = await geoResponse.json();
        parisLandmarks = await landmarksResponse.json();
        
        // Initialiser toutes les lignes comme actives
        metroData.lines.forEach(line => activeLines.add(line.id));
        
        initializeMap();
        createLineFilters();
        setupEventListeners();
        setupDisruptionControls();
        
    } catch (error) {
        console.error('Erreur chargement données:', error);
    }
}

// Initialisation de la carte
function initializeMap() {
    const container = document.getElementById('map');
    width = container.clientWidth;
    height = container.clientHeight;
    
    // Créer le SVG
    svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Groupe principal pour le zoom
    g = svg.append('g');
    
    // Configuration de la projection - zoom plus important sur Paris
    projection = d3.geoMercator()
        .center([2.35, 48.86])  // Centre sur Paris
        .scale(width * 120)  // Zoom plus important pour mieux voir Paris
        .translate([width / 2, height / 2]);
    
    // Zoom
    zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Dessiner les éléments dans l'ordre (IDF -> Paris -> lignes -> stations)
    drawIleDeFrance();
    drawParisMap();
    drawLines();
    drawStations();
    
    // Démarrer l'animation
    startParticleAnimation();
    
    // Update initial
    updateTrafficDisplay();
}

// Dessiner le contour de l'Île-de-France
function drawIleDeFrance() {
    const idfGroup = g.append('g').attr('class', 'idf-group');
    
    const idfLine = d3.line()
        .x(d => projection(d)[0])
        .y(d => projection(d)[1])
        .curve(d3.curveCardinalClosed.tension(0.5));
    
    // Contour de l'Île-de-France
    idfGroup.append('path')
        .datum(ileDeFranceContour)
        .attr('class', 'idf-contour')
        .attr('d', idfLine)
        .attr('fill', 'rgba(8, 8, 15, 0.9)')
        .attr('stroke', 'rgba(100, 100, 150, 0.4)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '15,10');
    
    // Label IDF
    const idfCenter = projection([2.35, 49.05]);
    idfGroup.append('text')
        .attr('x', idfCenter[0])
        .attr('y', idfCenter[1])
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(150, 150, 200, 0.3)')
        .attr('font-size', '24px')
        .attr('font-weight', 'bold')
        .text('ÎLE-DE-FRANCE');
    
    // Villes principales hors Paris
    const majorCities = [
        { name: 'Versailles', coord: [2.1286, 48.7997] },
        { name: 'Cergy', coord: [2.0953, 49.0504] },
        { name: 'Melun', coord: [2.6553, 48.5272] },
        { name: 'Marne-la-Vallée', coord: [2.7833, 48.8674] },
        { name: 'CDG', coord: [2.5700, 49.0047] },
        { name: 'Orly', coord: [2.3652, 48.7433] },
        { name: 'Massy', coord: [2.2730, 48.7250] },
        { name: 'Saint-Denis', coord: [2.3600, 48.9350] }
    ];
    
    majorCities.forEach(city => {
        const pos = projection(city.coord);
        idfGroup.append('text')
            .attr('x', pos[0])
            .attr('y', pos[1])
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(180, 180, 220, 0.4)')
            .attr('font-size', '10px')
            .text(city.name);
    });
}

// Dessiner la carte détaillée de Paris (arrondissements, Seine, etc.)
function drawParisMap() {
    const mapGroup = g.append('g').attr('class', 'paris-map-group');
    
    // Dessiner le périphérique (contour de Paris)
    if (parisLandmarks && parisLandmarks.periph) {
        const periphLine = d3.line()
            .x(d => projection(d)[0])
            .y(d => projection(d)[1])
            .curve(d3.curveCardinalClosed);
        
        mapGroup.append('path')
            .datum(parisLandmarks.periph.path)
            .attr('class', 'peripherique')
            .attr('d', periphLine)
            .attr('fill', 'rgba(15, 15, 25, 0.7)')
            .attr('stroke', 'rgba(255, 255, 255, 0.2)')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '10,5');
    }
    
    // Dessiner les bois (Boulogne et Vincennes)
    if (parisLandmarks && parisLandmarks.bois) {
        const boisGroup = mapGroup.append('g').attr('class', 'bois-group');
        
        parisLandmarks.bois.forEach(bois => {
            const boisLine = d3.line()
                .x(d => projection(d)[0])
                .y(d => projection(d)[1])
                .curve(d3.curveCardinalClosed);
            
            boisGroup.append('path')
                .datum(bois.coordinates[0])
                .attr('d', boisLine)
                .attr('fill', 'rgba(30, 80, 50, 0.35)')
                .attr('stroke', 'rgba(50, 150, 80, 0.5)')
                .attr('stroke-width', 1);
            
            // Label du bois
            const centroid = d3.polygonCentroid(bois.coordinates[0].map(c => projection(c)));
            boisGroup.append('text')
                .attr('x', centroid[0])
                .attr('y', centroid[1])
                .attr('text-anchor', 'middle')
                .attr('fill', 'rgba(100, 180, 120, 0.6)')
                .attr('font-size', '10px')
                .text(bois.name);
        });
    }
    
    // Dessiner les arrondissements
    if (parisGeo && parisGeo.features) {
        const arrondGroup = mapGroup.append('g').attr('class', 'arrondissements-group');
        
        parisGeo.features.forEach(feature => {
            const arrondLine = d3.line()
                .x(d => projection(d)[0])
                .y(d => projection(d)[1])
                .curve(d3.curveLinearClosed);
            
            arrondGroup.append('path')
                .datum(feature.geometry.coordinates[0])
                .attr('class', `arrond arrond-${feature.properties.id}`)
                .attr('d', arrondLine)
                .attr('fill', 'rgba(25, 30, 45, 0.5)')
                .attr('stroke', 'rgba(255, 255, 255, 0.1)')
                .attr('stroke-width', 1)
                .on('mouseenter', function(event) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', 'rgba(45, 50, 80, 0.6)')
                        .attr('stroke', 'rgba(255, 255, 255, 0.25)');
                })
                .on('mouseleave', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', 'rgba(25, 30, 45, 0.5)')
                        .attr('stroke', 'rgba(255, 255, 255, 0.1)');
                });
            
            // Numéro de l'arrondissement
            const centroid = d3.polygonCentroid(feature.geometry.coordinates[0].map(c => projection(c)));
            arrondGroup.append('text')
                .attr('x', centroid[0])
                .attr('y', centroid[1])
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', 'rgba(255, 255, 255, 0.2)')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .attr('class', 'arrond-label')
                .text(feature.properties.name);
        });
    }
    
    // Dessiner la Seine
    if (parisLandmarks && parisLandmarks.seine) {
        const seineLine = d3.line()
            .x(d => projection(d)[0])
            .y(d => projection(d)[1])
            .curve(d3.curveCatmullRom.alpha(0.5));
        
        // Glow de la Seine
        mapGroup.append('path')
            .datum(parisLandmarks.seine.path)
            .attr('class', 'seine-glow')
            .attr('d', seineLine)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(0, 150, 255, 0.15)')
            .attr('stroke-width', 40)
            .attr('stroke-linecap', 'round')
            .style('filter', 'blur(10px)');
        
        // Seine principale
        mapGroup.append('path')
            .datum(parisLandmarks.seine.path)
            .attr('class', 'seine')
            .attr('d', seineLine)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(40, 120, 200, 0.6)')
            .attr('stroke-width', 16)
            .attr('stroke-linecap', 'round');
        
        // Seine - ligne centrale brillante
        mapGroup.append('path')
            .datum(parisLandmarks.seine.path)
            .attr('class', 'seine-bright')
            .attr('d', seineLine)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(100, 180, 255, 0.5)')
            .attr('stroke-width', 5)
            .attr('stroke-linecap', 'round');
    }
    
    // Dessiner les îles
    if (parisLandmarks && parisLandmarks.islands) {
        const islandsGroup = mapGroup.append('g').attr('class', 'islands-group');
        
        parisLandmarks.islands.forEach(island => {
            const islandLine = d3.line()
                .x(d => projection(d)[0])
                .y(d => projection(d)[1])
                .curve(d3.curveCardinalClosed.tension(0.8));
            
            islandsGroup.append('path')
                .datum(island.coordinates[0])
                .attr('d', islandLine)
                .attr('fill', 'rgba(40, 40, 60, 0.9)')
                .attr('stroke', 'rgba(100, 160, 220, 0.5)')
                .attr('stroke-width', 1);
        });
    }
}

// Dessiner les monuments
function drawMonuments() {
    if (!parisLandmarks || !parisLandmarks.monuments) return;
    
    const monumentsGroup = g.append('g').attr('class', 'monuments-group');
    
    parisLandmarks.monuments.forEach(monument => {
        const pos = projection(monument.coord);
        
        const monumentG = monumentsGroup.append('g')
            .attr('class', 'monument')
            .attr('transform', `translate(${pos[0]}, ${pos[1]})`)
            .datum(monument)
            .style('cursor', 'pointer');
        
        // Cercle de fond avec glow
        monumentG.append('circle')
            .attr('r', 14)
            .attr('fill', 'rgba(255, 200, 100, 0.1)')
            .attr('stroke', 'rgba(255, 200, 100, 0.4)')
            .attr('stroke-width', 1)
            .attr('class', 'monument-glow');
        
        // Icône emoji
        monumentG.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '18px')
            .attr('class', 'monument-icon')
            .text(monument.icon);
        
        // Label (caché par défaut, visible au hover)
        monumentG.append('text')
            .attr('y', 24)
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(255, 220, 150, 0.95)')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .attr('class', 'monument-label')
            .attr('opacity', 0)
            .text(monument.name);
        
        // Interactions
        monumentG
            .on('mouseenter', function(event, d) {
                d3.select(this).select('.monument-label')
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
                
                d3.select(this).select('.monument-glow')
                    .transition()
                    .duration(200)
                    .attr('r', 20)
                    .attr('fill', 'rgba(255, 200, 100, 0.25)');
                
                d3.select(this).select('.monument-icon')
                    .transition()
                    .duration(200)
                    .attr('font-size', '22px');
                
                showMonumentTooltip(event, d);
            })
            .on('mouseleave', function() {
                d3.select(this).select('.monument-label')
                    .transition()
                    .duration(200)
                    .attr('opacity', 0);
                
                d3.select(this).select('.monument-glow')
                    .transition()
                    .duration(200)
                    .attr('r', 14)
                    .attr('fill', 'rgba(255, 200, 100, 0.1)');
                
                d3.select(this).select('.monument-icon')
                    .transition()
                    .duration(200)
                    .attr('font-size', '18px');
                
                hideTooltip();
            });
    });
}

// Tooltip pour monuments
function showMonumentTooltip(event, monument) {
    const tooltip = document.getElementById('tooltip');
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${monument.icon} ${monument.name}</div>
        <div class="tooltip-stat">${monument.description}</div>
    `;
    
    tooltip.style.left = (event.pageX + 15) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
    tooltip.classList.add('visible');
}

// Dessiner les lignes
function drawLines() {
    const linesGroup = g.append('g').attr('class', 'lines-group');
    
    metroData.lines.forEach(line => {
        const lineCoords = getLineCoordinates(line);
        
        if (lineCoords.length < 2) return;
        
        const lineGenerator = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveCatmullRom.alpha(0.5));
        
        // Ligne de fond (glow)
        linesGroup.append('path')
            .datum(lineCoords)
            .attr('class', `metro-line metro-line-glow line-${line.id}`)
            .attr('d', lineGenerator)
            .attr('stroke', line.color)
            .attr('stroke-width', 8)
            .attr('opacity', 0.3)
            .attr('filter', 'blur(4px)');
        
        // Ligne principale
        linesGroup.append('path')
            .datum(lineCoords)
            .attr('class', `metro-line line-${line.id}`)
            .attr('id', `path-${line.id}`)
            .attr('d', lineGenerator)
            .attr('stroke', line.color)
            .attr('stroke-width', line.type === 'rer' ? 5 : 4);
    });
}

// Obtenir les coordonnées d'une ligne
function getLineCoordinates(line) {
    const coords = [];
    
    line.stations.forEach(stationName => {
        const coord = extendedStationCoords[stationName];
        if (coord) {
            const projected = projection(coord);
            coords.push(projected);
        }
    });
    
    return coords;
}

// Dessiner les stations
function drawStations() {
    const stationsGroup = g.append('g').attr('class', 'stations-group');
    
    // Collecter toutes les stations uniques avec leurs lignes
    const stationMap = new Map();
    
    metroData.lines.forEach(line => {
        line.stations.forEach(stationName => {
            if (extendedStationCoords[stationName]) {
                if (!stationMap.has(stationName)) {
                    stationMap.set(stationName, {
                        name: stationName,
                        coord: extendedStationCoords[stationName],
                        lines: []
                    });
                }
                stationMap.get(stationName).lines.push(line);
            }
        });
    });
    
    // Stations majeures (correspondances)
    const majorStations = ['Châtelet', 'Châtelet - Les Halles', 'Gare du Nord', 'Gare de Lyon',
                          'Saint-Lazare', 'Montparnasse', 'Nation', 'République', 'La Défense',
                          'Bastille', 'Opéra', 'Concorde', 'Charles de Gaulle - Étoile'];
    
    stationMap.forEach((station, name) => {
        const projected = projection(station.coord);
        const isMajor = majorStations.includes(name) || station.lines.length >= 3;
        
        const stationG = stationsGroup.append('g')
            .attr('class', `station ${isMajor ? 'major' : ''}`)
            .attr('transform', `translate(${projected[0]}, ${projected[1]})`)
            .datum(station);
        
        // Cercle de la station
        stationG.append('circle')
            .attr('r', isMajor ? 6 : 4)
            .attr('fill', '#0a0a0f')
            .attr('stroke', isMajor ? '#ffffff' : 'rgba(255,255,255,0.6)')
            .attr('stroke-width', isMajor ? 3 : 2);
        
        // Événements
        stationG
            .on('mouseenter', (event, d) => showTooltip(event, d))
            .on('mouseleave', hideTooltip)
            .on('click', (event, d) => showStationPanel(d));
    });
}

// Tooltip
function showTooltip(event, station) {
    const tooltip = document.getElementById('tooltip');
    
    let linesHTML = station.lines.map(line => 
        `<span class="tooltip-line" style="background-color: ${line.color}">${line.id.replace('_', ' ')}</span>`
    ).join('');
    
    const passengers = station.lines.reduce((sum, line) => 
        sum + (line.avgPassengersPerDay / line.stations.length), 0);
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${station.name}</div>
        <div class="tooltip-lines">${linesHTML}</div>
        <div class="tooltip-stat"><strong>${formatNumber(Math.round(passengers))}</strong> voyageurs/jour</div>
    `;
    
    tooltip.style.left = (event.pageX + 15) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
    tooltip.classList.add('visible');
}

function hideTooltip() {
    document.getElementById('tooltip').classList.remove('visible');
}

// Panneau station
function showStationPanel(station) {
    const panel = document.getElementById('station-panel');
    
    document.getElementById('station-name').textContent = station.name;
    
    const linesContainer = document.getElementById('station-lines');
    linesContainer.innerHTML = station.lines.map(line =>
        `<span class="station-line-badge" style="background-color: ${line.color}">${line.id.replace('_', ' ')}</span>`
    ).join('');
    
    const passengers = station.lines.reduce((sum, line) => 
        sum + (line.avgPassengersPerDay / line.stations.length), 0);
    
    document.getElementById('station-passengers').textContent = formatNumber(Math.round(passengers));
    document.getElementById('station-connections').textContent = station.lines.length;
    
    panel.classList.remove('hidden');
}

// Créer les filtres de lignes
function createLineFilters() {
    const metroContainer = document.getElementById('metro-lines-filter');
    const rerContainer = document.getElementById('rer-lines-filter');
    
    metroData.lines.forEach(line => {
        const btn = document.createElement('button');
        btn.className = 'line-btn active';
        btn.style.backgroundColor = line.color;
        btn.textContent = line.id.replace('M', '').replace('RER_', '');
        btn.dataset.lineId = line.id;
        
        btn.addEventListener('click', () => toggleLine(line.id, btn));
        
        if (line.type === 'metro') {
            metroContainer.appendChild(btn);
        } else {
            rerContainer.appendChild(btn);
        }
    });
}

// Toggle ligne
function toggleLine(lineId, btn) {
    if (activeLines.has(lineId)) {
        activeLines.delete(lineId);
        btn.classList.remove('active');
        btn.classList.add('inactive');
        d3.selectAll(`.line-${lineId}`).classed('dimmed', true);
    } else {
        activeLines.add(lineId);
        btn.classList.add('active');
        btn.classList.remove('inactive');
        d3.selectAll(`.line-${lineId}`).classed('dimmed', false);
    }
}

// Event listeners
function setupEventListeners() {
    // Time slider
    const timeSlider = document.getElementById('time-slider');
    timeSlider.addEventListener('input', (e) => {
        currentHour = parseInt(e.target.value);
        updateTimeDisplay();
        updateTrafficDisplay();
    });
    
    // Play button
    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', togglePlayAnimation);
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        svg.transition().call(zoom.scaleBy, 1.5);
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        svg.transition().call(zoom.scaleBy, 0.67);
    });
    
    document.getElementById('zoom-reset').addEventListener('click', () => {
        svg.transition().call(zoom.transform, d3.zoomIdentity);
    });
    
    // Close panel
    document.getElementById('close-panel').addEventListener('click', () => {
        document.getElementById('station-panel').classList.add('hidden');
    });
    
    // Type filters
    document.getElementById('filter-metro').addEventListener('change', (e) => {
        toggleLineType('metro', e.target.checked);
    });
    
    document.getElementById('filter-rer').addEventListener('change', (e) => {
        toggleLineType('rer', e.target.checked);
    });
}

// Toggle type de ligne - Amélioration pour masquer complètement les lignes
function toggleLineType(type, show) {
    if (type === 'metro') {
        showMetro = show;
    } else {
        showRER = show;
    }
    
    metroData.lines
        .filter(line => line.type === type)
        .forEach(line => {
            if (show) {
                activeLines.add(line.id);
            } else {
                activeLines.delete(line.id);
            }
            
            // Masquer/afficher les lignes avec animation
            d3.selectAll(`.line-${line.id}`)
                .transition()
                .duration(300)
                .style('opacity', show ? 1 : 0)
                .classed('dimmed', !show);
            
            // Masquer/afficher les stations de cette ligne
            d3.selectAll('.station').each(function() {
                const station = d3.select(this).datum();
                if (station && station.lines) {
                    const hasVisibleLine = station.lines.some(l => activeLines.has(l.id));
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style('opacity', hasVisibleLine ? 1 : 0.1);
                }
            });
            
            const btn = document.querySelector(`[data-line-id="${line.id}"]`);
            if (btn) {
                btn.classList.toggle('active', show);
                btn.classList.toggle('inactive', !show);
            }
        });
    
    // Mettre à jour le compteur de lignes actives
    document.getElementById('active-lines').textContent = activeLines.size;
}

// Configuration des contrôles de perturbation
function setupDisruptionControls() {
    // Créer le panneau de perturbation dans la sidebar s'il n'existe pas
    const disruptionSection = document.createElement('div');
    disruptionSection.className = 'disruption-section';
    disruptionSection.innerHTML = `
        <h3>⚠️ Simulation perturbation</h3>
        <div class="disruption-controls">
            <select id="disruption-line" class="disruption-select">
                <option value="">Sélectionner une ligne RER</option>
            </select>
            <button id="toggle-disruption" class="disruption-btn">Simuler incident</button>
            <div id="disruption-info" class="disruption-info hidden">
                <p class="disruption-text">🚫 Ligne <span id="disrupted-line-name"></span> perturbée</p>
                <p class="disruption-impact">Impact: report sur les autres lignes</p>
            </div>
        </div>
    `;
    
    // Insérer après la section des filtres
    const filtersSection = document.querySelector('.filters-section');
    filtersSection.parentNode.insertBefore(disruptionSection, filtersSection.nextSibling);
    
    // Peupler le select avec les lignes RER
    const disruptionSelect = document.getElementById('disruption-line');
    metroData.lines
        .filter(line => line.type === 'rer')
        .forEach(line => {
            const option = document.createElement('option');
            option.value = line.id;
            option.textContent = line.name;
            option.style.color = line.color;
            disruptionSelect.appendChild(option);
        });
    
    // Event listener pour le bouton de perturbation
    document.getElementById('toggle-disruption').addEventListener('click', () => {
        const selectedLine = document.getElementById('disruption-line').value;
        if (!selectedLine) {
            alert('Veuillez sélectionner une ligne RER');
            return;
        }
        
        if (disruptedLine === selectedLine) {
            // Désactiver la perturbation
            clearDisruption();
        } else {
            // Activer la perturbation sur cette ligne
            simulateDisruption(selectedLine);
        }
    });
}

// Simuler une perturbation sur une ligne
function simulateDisruption(lineId) {
    disruptedLine = lineId;
    const line = metroData.lines.find(l => l.id === lineId);
    
    // Afficher les infos de perturbation
    document.getElementById('disruption-info').classList.remove('hidden');
    document.getElementById('disrupted-line-name').textContent = line.name;
    document.getElementById('toggle-disruption').textContent = 'Annuler incident';
    document.getElementById('toggle-disruption').classList.add('active');
    
    // Effet visuel sur la ligne perturbée
    d3.selectAll(`.line-${lineId}`)
        .classed('disrupted', true)
        .attr('stroke-dasharray', '10,5')
        .transition()
        .duration(500)
        .attr('stroke', '#ff3b5c')
        .attr('stroke-width', 8);
    
    // Animation de pulsation sur la ligne perturbée
    animateDisruptedLine(lineId);
    
    // Augmenter le flux sur les lignes alternatives (métro)
    d3.selectAll('.metro-line')
        .filter(function() {
            return !d3.select(this).classed(`line-${lineId}`);
        })
        .classed('increased-flux', true);
    
    // Mettre à jour les particules - réduire sur la ligne perturbée
    if (typeof updateDisruptionParticles === 'function') {
        updateDisruptionParticles(lineId, true);
    }
}

// Animation de la ligne perturbée
function animateDisruptedLine(lineId) {
    if (disruptedLine !== lineId) return;
    
    d3.selectAll(`.line-${lineId}.metro-line-glow`)
        .transition()
        .duration(800)
        .attr('stroke', '#ff3b5c')
        .attr('opacity', 0.7)
        .transition()
        .duration(800)
        .attr('opacity', 0.2)
        .on('end', () => animateDisruptedLine(lineId));
}

// Annuler la perturbation
function clearDisruption() {
    if (!disruptedLine) return;
    
    const lineId = disruptedLine;
    const line = metroData.lines.find(l => l.id === lineId);
    
    // Masquer les infos de perturbation
    document.getElementById('disruption-info').classList.add('hidden');
    document.getElementById('toggle-disruption').textContent = 'Simuler incident';
    document.getElementById('toggle-disruption').classList.remove('active');
    
    // Restaurer l'apparence de la ligne
    d3.selectAll(`.line-${lineId}`)
        .classed('disrupted', false)
        .attr('stroke-dasharray', null)
        .transition()
        .duration(500)
        .attr('stroke', line.color)
        .attr('stroke-width', 5);
    
    d3.selectAll(`.line-${lineId}.metro-line-glow`)
        .transition()
        .duration(500)
        .attr('stroke', line.color)
        .attr('opacity', 0.3);
    
    // Restaurer les autres lignes
    d3.selectAll('.metro-line').classed('increased-flux', false);
    
    // Restaurer les particules
    if (typeof updateDisruptionParticles === 'function') {
        updateDisruptionParticles(lineId, false);
    }
    
    disruptedLine = null;
}

// Mise à jour affichage heure
function updateTimeDisplay() {
    const hour = currentHour % 24;
    document.getElementById('current-time').textContent = 
        `${hour.toString().padStart(2, '0')}:00`;
}

// Mise à jour du trafic
function updateTrafficDisplay() {
    const hour = currentHour % 24;
    const trafficMultiplier = metroData.trafficByHour[hour] || 0.5;
    
    const basePassengers = 500000; // Voyageurs par heure en heure de pointe
    const currentPassengers = Math.round(basePassengers * trafficMultiplier);
    
    document.getElementById('current-passengers').textContent = 
        formatNumber(currentPassengers);
    
    // Mettre à jour l'intensité des particules
    updateParticleIntensity(trafficMultiplier);
}

// Animation play/pause
function togglePlayAnimation() {
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    
    if (isPlaying) {
        isPlaying = false;
        clearInterval(animationInterval);
        playIcon.textContent = '▶';
        playBtn.classList.remove('playing');
    } else {
        isPlaying = true;
        playIcon.textContent = '⏸';
        playBtn.classList.add('playing');
        
        animationInterval = setInterval(() => {
            currentHour = (currentHour % 24) + 1;
            if (currentHour > 24) currentHour = 5;
            
            document.getElementById('time-slider').value = currentHour;
            updateTimeDisplay();
            updateTrafficDisplay();
        }, 1000);
    }
}

// Formatage des nombres
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Démarrage
document.addEventListener('DOMContentLoaded', loadMetroData);

// Resize handler
window.addEventListener('resize', () => {
    if (svg) {
        const container = document.getElementById('map');
        width = container.clientWidth;
        height = container.clientHeight;
        
        svg.attr('width', width).attr('height', height);
        
        projection
            .scale(width * 120)
            .translate([width / 2, height / 2]);
    }
});
