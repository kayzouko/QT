const emotionsMap = {
    'joie': 'joyeux.png',
    'joyeux': 'joyeux.png',
    'triste': 'triste.png',
    'taquin': 'taquin.png',
    'colère': 'en-colere.png',
    'en colère': 'en-colere.png',
    'affectueux': 'affectueux.png',
    'timide': 'timide.png',
    'heureux': 'heureux.png',
    'déçu': 'deçu.png',
    'chagriné': 'chagrine.png',
    'surprise': 'surpris.png',
    'surpris': 'surpris.png',
    'neutre': 'neutre.png',
    'étonné': 'etonne.png',
    'fâché': 'fache.png',
    'amusé': 'amuse.png',
    'inquiet': 'inquiet.png'
};

async function generateStory() {
    const prompt = document.getElementById('promptInput').value;
    const storyDisplay = document.getElementById('storyDisplay');
    const robotImage = document.getElementById('robotImage');
    
    if (!prompt) {
        alert('Écrivez votre demande d\'histoire !');
        return;
    }

    try {
        storyDisplay.textContent = 'QT réfléchit...';
        robotImage.src = 'emotions/neutre.png';

        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        if (!data.success) throw new Error(data.error);

        storyDisplay.textContent = '';
        let delay = 0;

        data.data.segments.forEach((segment, index) => {
            setTimeout(() => {
                // Changement d'expression
                const emotion = segment.emotion.toLowerCase();
                const imageFile = emotionsMap[emotion] || 'neutre.png';
                robotImage.src = `emotions/${imageFile}`;
                
                // Affichage progressif
                storyDisplay.textContent += `${segment.text}\n\n`;
                
                // Effet de clignotement
                if (index % 2 === 0) blinkEffect();
                
            }, delay);
            
            delay += 5000; // 5s par segment
        });

    } catch (error) {
        console.error(error);
        storyDisplay.textContent = `Erreur : ${error.message}`;
        robotImage.src = 'emotions/triste.png';
    }
}

function blinkEffect() {
    robotImage.style.opacity = '0.5';
    setTimeout(() => robotImage.style.opacity = '1', 100);
}