/**
 * Metro Animation - Système de particules animées pour simuler les flux de voyageurs
 */

// Variables pour l'animation
let particleGroups = [];
let particleAnimationFrame = null;
let currentTrafficIntensity = 1.0;

// Initialiser l'animation des particules
function startParticleAnimation() {
    const particlesGroup = g.append('g')
        .attr('class', 'particles-group');
    
    // Créer des particules pour chaque ligne active
    metroData.lines.forEach(line => {
        createParticlesForLine(line, particlesGroup);
    });
    
    // Lancer l'animation
    animateParticles();
}

// Créer des particules pour une ligne
function createParticlesForLine(line, container) {
    const path = document.getElementById(`path-${line.id}`);
    if (!path) return;
    
    const pathLength = path.getTotalLength();
    const numParticles = Math.floor(pathLength / 50); // Une particule tous les 50px
    
    const lineParticles = {
        lineId: line.id,
        color: line.color,
        path: path,
        pathLength: pathLength,
        particles: [],
        baseSpeed: line.type === 'rer' ? 1.5 : 1.0 // RER plus rapide
    };
    
    for (let i = 0; i < numParticles; i++) {
        const particle = {
            offset: (i / numParticles) * pathLength,
            speed: (0.5 + Math.random() * 0.5) * lineParticles.baseSpeed,
            size: 2 + Math.random() * 2,
            direction: Math.random() > 0.5 ? 1 : -1,
            element: null
        };
        
        // Créer l'élément SVG de la particule
        particle.element = container.append('circle')
            .attr('class', `particle particle-${line.id}`)
            .attr('r', particle.size)
            .attr('fill', line.color)
            .attr('opacity', 0.8)
            .style('filter', `drop-shadow(0 0 ${particle.size}px ${line.color})`);
        
        lineParticles.particles.push(particle);
    }
    
    particleGroups.push(lineParticles);
}

// Animation des particules
function animateParticles() {
    particleGroups.forEach(lineGroup => {
        if (!activeLines.has(lineGroup.lineId)) {
            // Cacher les particules des lignes inactives
            lineGroup.particles.forEach(p => {
                p.element.attr('opacity', 0);
            });
            return;
        }
        
        lineGroup.particles.forEach(particle => {
            // Mettre à jour la position
            particle.offset += particle.speed * particle.direction * currentTrafficIntensity * 2;
            
            // Boucler
            if (particle.offset > lineGroup.pathLength) {
                particle.offset = 0;
            } else if (particle.offset < 0) {
                particle.offset = lineGroup.pathLength;
            }
            
            // Obtenir la position sur le chemin
            try {
                const point = lineGroup.path.getPointAtLength(particle.offset);
                
                particle.element
                    .attr('cx', point.x)
                    .attr('cy', point.y)
                    .attr('opacity', 0.6 + (currentTrafficIntensity * 0.4))
                    .attr('r', particle.size * (0.8 + currentTrafficIntensity * 0.4));
            } catch (e) {
                // Ignorer les erreurs si le chemin n'est pas valide
            }
        });
    });
    
    particleAnimationFrame = requestAnimationFrame(animateParticles);
}

// Mettre à jour l'intensité des particules selon le trafic
function updateParticleIntensity(intensity) {
    currentTrafficIntensity = intensity;
    
    // Ajouter/retirer des particules selon l'intensité
    particleGroups.forEach(lineGroup => {
        lineGroup.particles.forEach((particle, index) => {
            // Certaines particules sont invisibles en heure creuse
            const visibilityThreshold = index / lineGroup.particles.length;
            const isVisible = visibilityThreshold < intensity;
            
            particle.element
                .transition()
                .duration(500)
                .attr('opacity', isVisible ? (0.5 + intensity * 0.5) : 0);
        });
    });
    
    // Mettre à jour les effets visuels des lignes
    updateLineGlow(intensity);
}

// Effet de glow sur les lignes selon l'intensité
function updateLineGlow(intensity) {
    d3.selectAll('.metro-line-glow')
        .transition()
        .duration(500)
        .attr('opacity', 0.1 + intensity * 0.4)
        .attr('stroke-width', 6 + intensity * 6);
}

// Créer un effet de "train" plus visible
function createTrainEffect(lineGroup) {
    const train = g.append('g')
        .attr('class', `train train-${lineGroup.lineId}`);
    
    // Corps du train
    train.append('rect')
        .attr('width', 20)
        .attr('height', 8)
        .attr('rx', 3)
        .attr('fill', lineGroup.color)
        .attr('x', -10)
        .attr('y', -4);
    
    // Phares
    train.append('circle')
        .attr('r', 2)
        .attr('fill', '#ffffff')
        .attr('cx', 8)
        .attr('cy', 0);
    
    return train;
}

// Animation d'un train sur une ligne
function animateTrain(lineId, duration = 10000) {
    const lineGroup = particleGroups.find(lg => lg.lineId === lineId);
    if (!lineGroup || !lineGroup.path) return;
    
    const train = createTrainEffect(lineGroup);
    const pathLength = lineGroup.pathLength;
    
    function moveTrain(progress) {
        const point = lineGroup.path.getPointAtLength(progress * pathLength);
        const nextPoint = lineGroup.path.getPointAtLength((progress + 0.01) * pathLength);
        
        // Calculer l'angle de rotation
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
        
        train.attr('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);
    }
    
    // Animation
    let progress = 0;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        progress = (elapsed / duration) % 1;
        
        moveTrain(progress);
        
        if (elapsed < duration) {
            requestAnimationFrame(animate);
        } else {
            train.remove();
        }
    }
    
    animate();
}

// Effet de vague de voyageurs (heure de pointe)
function createRushHourEffect() {
    if (currentTrafficIntensity < 0.8) return;
    
    // Ajouter des particules supplémentaires temporairement
    const particlesGroup = g.select('.particles-group');
    
    metroData.lines.slice(0, 5).forEach(line => { // Top 5 lignes les plus fréquentées
        if (!activeLines.has(line.id)) return;
        
        const path = document.getElementById(`path-${line.id}`);
        if (!path) return;
        
        const pathLength = path.getTotalLength();
        
        // Créer une vague de particules
        for (let i = 0; i < 20; i++) {
            const offset = Math.random() * pathLength;
            const point = path.getPointAtLength(offset);
            
            particlesGroup.append('circle')
                .attr('cx', point.x)
                .attr('cy', point.y)
                .attr('r', 1)
                .attr('fill', line.color)
                .attr('opacity', 0.9)
                .style('filter', `drop-shadow(0 0 5px ${line.color})`)
                .transition()
                .duration(2000)
                .attr('r', 8)
                .attr('opacity', 0)
                .remove();
        }
    });
}

// Lancer l'effet de vague périodiquement en heure de pointe
setInterval(() => {
    if (currentTrafficIntensity >= 0.8) {
        createRushHourEffect();
    }
}, 3000);

// Effet de pulsation sur les grandes stations
function pulseMainStations() {
    d3.selectAll('.station.major circle')
        .transition()
        .duration(1000)
        .attr('r', 8)
        .attr('stroke-width', 4)
        .transition()
        .duration(1000)
        .attr('r', 6)
        .attr('stroke-width', 3)
        .on('end', function() {
            if (currentTrafficIntensity >= 0.7) {
                d3.select(this.parentNode).select('circle').call(pulseStation);
            }
        });
}

function pulseStation(selection) {
    selection
        .transition()
        .duration(800)
        .attr('r', 8)
        .attr('fill', 'rgba(0, 180, 255, 0.3)')
        .transition()
        .duration(800)
        .attr('r', 6)
        .attr('fill', '#0a0a0f');
}

// Initialiser les effets supplémentaires après un délai
setTimeout(() => {
    pulseMainStations();
}, 2000);

// Nettoyage
function stopParticleAnimation() {
    if (particleAnimationFrame) {
        cancelAnimationFrame(particleAnimationFrame);
    }
    particleGroups = [];
}

// Mettre à jour les particules lors d'une perturbation
function updateDisruptionParticles(disruptedLineId, isDisrupted) {
    particleGroups.forEach(lineGroup => {
        if (lineGroup.lineId === disruptedLineId) {
            // Réduire/restaurer les particules sur la ligne perturbée
            lineGroup.particles.forEach((particle, index) => {
                if (isDisrupted) {
                    // Réduire drastiquement les particules (10% seulement)
                    const isVisible = index % 10 === 0;
                    particle.element
                        .transition()
                        .duration(500)
                        .attr('opacity', isVisible ? 0.3 : 0)
                        .attr('fill', '#ff3b5c');
                } else {
                    // Restaurer les particules
                    particle.element
                        .transition()
                        .duration(500)
                        .attr('opacity', 0.8)
                        .attr('fill', lineGroup.color);
                }
            });
        } else if (lineGroup.lineId.startsWith('M')) {
            // Augmenter les particules sur les lignes de métro (report de voyageurs)
            lineGroup.particles.forEach(particle => {
                if (isDisrupted) {
                    particle.speed *= 1.3; // Accélérer
                    particle.element
                        .transition()
                        .duration(500)
                        .attr('r', particle.size * 1.5)
                        .attr('opacity', 0.95);
                } else {
                    particle.speed /= 1.3; // Restaurer vitesse
                    particle.element
                        .transition()
                        .duration(500)
                        .attr('r', particle.size)
                        .attr('opacity', 0.8);
                }
            });
        }
    });
}

// Export pour usage global
window.startParticleAnimation = startParticleAnimation;
window.stopParticleAnimation = stopParticleAnimation;
window.updateParticleIntensity = updateParticleIntensity;
window.animateTrain = animateTrain;
window.updateDisruptionParticles = updateDisruptionParticles;
