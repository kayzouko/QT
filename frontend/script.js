const emotionsMap = {
    'joie': 'joyeux',
    'joie': 'joyeux',
    'fierté': 'joyeux',
    'triste': 'triste',
    'tristesse': 'triste',
    'colère': 'colère',
    'peur': 'peur',
    'surprise': 'surprise',
    'neutre': 'neutre',
    'indifférence': 'neutre'
};

async function generateStory() {
    const prompt = document.getElementById('promptInput').value;
    const storyDisplay = document.getElementById('storyDisplay');
    const mouth = document.getElementById('mouth');
    
    if (!prompt) {
        alert('Veuillez entrer une demande !');
        return;
    }

    try {
        storyDisplay.textContent = 'Le robot réfléchit...';
        
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
                // Mise à jour de l'expression
                const emotion = emotionsMap[segment.emotion.toLowerCase()] || 'neutre';
                mouth.className = `mouth ${emotion}`;
                
                // Affichage progressif du texte
                storyDisplay.textContent += `${segment.text}\n\n`;
                
                // Animation des yeux
                if (index % 2 === 0) blinkEyes();
                
            }, delay);
            
            delay += 5000; // 5 secondes par segment
        });

    } catch (error) {
        console.error(error);
        storyDisplay.textContent = `Erreur : ${error.message}`;
        mouth.className = 'mouth triste';
    }
}

function blinkEyes() {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        eye.style.height = '5px';
        setTimeout(() => eye.style.height = '30px', 100);
    });
}