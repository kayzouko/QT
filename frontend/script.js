let voicesReady = false;

document.addEventListener('DOMContentLoaded', () => {
    const emotionsMap = {
        'joie': 'joyeux.png',
        'joyeux': 'joyeux.png',
        'triste': 'triste.png',
        'tristesse': 'triste.png',
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

    const robotImage = document.getElementById('robotImage');
    const promptInput = document.getElementById('promptInput');
    const storyDisplay = document.getElementById('storyDisplay');
    const generateButton = document.getElementById('generateButton');
    const stopButton = document.getElementById('stopButton');

    let currentSpeech = null;
    let isSpeaking = false;

    generateButton.addEventListener('click', generateStory);
    stopButton.addEventListener('click', stopSpeech);

    async function generateStory() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            alert('Veuillez décrire votre histoire !');
            return;
        }

        if (isSpeaking) {
            stopSpeech();
            return;
        }

        try {
            storyDisplay.innerHTML = '<div class="loading">QT réfléchit...</div>';
            robotImage.src = 'emotions/neutre.png';

            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            storyDisplay.innerHTML = '';
            isSpeaking = true;
            generateButton.textContent = 'Génération...';
            stopButton.classList.add('visible');

            // Attendre que les voix soient chargées
            await loadVoices();
            const frenchVoice = window.speechSynthesis.getVoices().find(v => v.lang.includes('fr'));

            for (const segment of data.data.segments) {
                if (!isSpeaking) break;

                const segmentDiv = document.createElement('div');
                segmentDiv.className = 'story-segment';
                segmentDiv.textContent = segment.text;
                storyDisplay.appendChild(segmentDiv);
                storyDisplay.scrollTop = storyDisplay.scrollHeight;

                const emotion = segment.emotion.toLowerCase();
                robotImage.src = `emotions/${emotionsMap[emotion] || 'neutre.png'}`;
                robotImage.classList.add('speaking');

                await speakText(segment.text, frenchVoice);
                robotImage.classList.remove('speaking');

                if (!isSpeaking) break;
                await new Promise(resolve => setTimeout(resolve, 800));
            }

        } catch (error) {
            console.error('Erreur:', error);
            storyDisplay.innerHTML = `<div class="error">Erreur: ${error.message}</div>`;
            robotImage.src = 'emotions/triste.png';
        } finally {
            resetUI();
        }
    }

    function speakText(text, voice) {
        return new Promise(resolve => {
            currentSpeech = new SpeechSynthesisUtterance(text);
            currentSpeech.voice = voice;
            currentSpeech.rate = 1.1;
            currentSpeech.pitch = 0.9;
            currentSpeech.onend = resolve;
            currentSpeech.onerror = () => {
                console.error('Erreur de synthèse vocale');
                resolve();
            };
            window.speechSynthesis.speak(currentSpeech);
        });
    }

    function stopSpeech() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
        resetUI();
    }

    function resetUI() {
        generateButton.textContent = 'Commencer l\'histoire';
        stopButton.classList.remove('visible');
        robotImage.classList.remove('speaking');
    }

    function loadVoices() {
        return new Promise(resolve => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve();
            } else {
                window.speechSynthesis.onvoiceschanged = resolve;
            }
        });
    }
});