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
        'rage': 'en-colere.png',
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

    const robotFace = document.getElementById('robotFace');
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
            robotFace.src = 'emotions/neutre.png';

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

            //attendre que les voix soient chargées
            await loadVoices();
            const frenchVoice = window.speechSynthesis.getVoices().find(v => v.lang.includes('fr'));

            for (const segment of data.data.segments) {
                if (!isSpeaking) break;

                //crée un élément pour afficher le texte de l'histoire
                const segmentDiv = document.createElement('div');
                segmentDiv.className = 'story-segment';
                const cleanedText = segment.text.replace(/\s*\[.*?\]\s*/g, '');
                segmentDiv.textContent = cleanedText; //pour afficher uniquement le texte, sans l'émotion
                storyDisplay.appendChild(segmentDiv);
                storyDisplay.scrollTop = storyDisplay.scrollHeight;

                //change l'image du robot en fonction de l'émotion
                const emotion = segment.emotion.toLowerCase();
                robotFace.src = `emotions/${emotionsMap[emotion] || 'neutre.png'}`;

                //va lire le texte à voix haute
                await speakText(segment.text, frenchVoice);

                if (!isSpeaking) break;
                await new Promise(resolve => setTimeout(resolve, 800));
            }

        } catch (error) {
            console.error('Erreur:', error);
            storyDisplay.innerHTML = `<div class="error">Erreur: ${error.message}</div>`;
            robotFace.src = 'emotions/triste.png';
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
        robotFace.classList.remove('speaking');
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

    document.getElementById('exportPdfButton').addEventListener('click', () => {
        // On récupère l'objet jsPDF depuis le module chargé
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Récupération du contenu de l'histoire
        const storyContent = document.getElementById('storyDisplay').innerText;
    
        // Optionnel : séparation du texte en lignes adaptées à la largeur de la page
        const lines = doc.splitTextToSize(storyContent, 180); // 180 correspond à la largeur maximale du texte en mm
    
        // Ajout du texte dans le PDF à partir de la position (10, 10)
        doc.text(lines, 10, 10);
    
        // Sauvegarde du PDF avec le nom "histoire_QT.pdf"
        doc.save('histoire_QT.pdf');
    });
});