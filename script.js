// ------------------------------------------------------------------
// CONFIGURATION (Votre numéro WhatsApp)
// ------------------------------------------------------------------
const MON_NUMERO_WHATSAPP = "224627288828"; // mon numéro WhatsApp au format international (sans le '+', ex: 33600000000)

const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const modalOverlay = document.getElementById('error-modal-overlay');
let yesSize = 1.1;

// ------------------------------------------------------------------
// A. SYNTHETISEURS SONORES (API Web Audio)
// ------------------------------------------------------------------
function playErrorSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(150, ctx.currentTime);
  gain1.gain.setValueAtTime(0.1, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(110, ctx.currentTime + 0.12);
  gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.3);
}

function playVictorySound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const notes = [261.63, 329.63, 392.00, 523.25];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    const startTime = ctx.currentTime + (index * 0.08);
    const duration = index === notes.length - 1 ? 0.6 : 0.2;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

// ------------------------------------------------------------------
// B. ANIMATION DES COEURS FLOTTANTS
// ------------------------------------------------------------------
function createHeart() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heart = document.createElement('div');
  heart.classList.add('heart');
  
  const symbols = ['❤️', '💖', '💕', '✨', '💗'];
  heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = Math.random() * 100 + 'vw';
  const size = Math.random() * 20 + 15;
  heart.style.fontSize = size + 'px';

  const duration = Math.random() * 4 + 4;
  heart.style.animationDuration = duration + 's';

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}
setInterval(createHeart, 400);


// C. ANIMATION DES PHOTOS FLOTTANTES
// ------------------------------------------------------------------
function createPhoto() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const photos = [
    'poto9 (1).png',
    'poto9 (2).png',
    'poto9 (3).png',
    'poto9 (4).png',
    'poto9 (5).png',
    'poto9 (6).png',
    'poto9 (7).png',
    'poto9 (8).png',
    'poto9 (9).png'
  ];

  const photo = document.createElement('img');
  photo.classList.add('photo-rising');
  
  // Choix d'une photo aléatoire dans la liste
  const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
  photo.src = `images/${randomPhoto}`;

  // Position et taille aléatoires
  photo.style.left = Math.random() * 90 + 'vw';
  const width = Math.random() * 20 + 60; // taille entre 60px et 80px
  photo.style.width = width + 'px';

  // Durée de montée aléatoire
  const duration = Math.random() * 4 + 4;
  photo.style.animationDuration = duration + 's';

  container.appendChild(photo);

  // Suppression après l'animation
  setTimeout(() => {
    photo.remove();
  }, duration * 1000);
}

// Génère une photo toutes les 2.5 secondes
setInterval(createPhoto, 1000);setInterval(createHeart, 400);

// ------------------------------------------------------------------
// C. GESTION DU BOUTON "NON" & MODALE
// ------------------------------------------------------------------
btnNo.addEventListener('click', () => {
  playErrorSound();
  modalOverlay.classList.add('active');

  yesSize += 0.2;
  btnYes.style.fontSize = `${yesSize}rem`;
  btnYes.style.padding = `${12 * (yesSize / 1.1)}px ${28 * (yesSize / 1.1)}px`;
});

function closeErrorModal() {
  modalOverlay.classList.remove('active');
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeErrorModal();
  }
});

// ------------------------------------------------------------------
// D. NAVIGATION ET SOUMISSION DU FORMULAIRE
// ------------------------------------------------------------------
function nextStep(stepNumber) {
  if (stepNumber === 2) {
    playVictorySound();
  }

  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');
}

function submitForm(event) {
  event.preventDefault();

// 1. Récupération des valeurs saisies à l'étape 2
const activityInput = document.querySelector('input[name="activity"]:checked');
if (!activityInput) {
    alert("Veuillez sélectionner une activité.");
    return;
  }
  const activity = document.querySelector('input[name="activity"]:checked').value;
  const dateInput = document.getElementById('date').value;
  const timeInput = document.getElementById('time').value;

  // Formate la date au format JJ/MM/AAAA si elle existe
  let dateFormatee = dateInput;
  if (dateInput) {
    const [annee, mois, jour] = dateInput.split('-');
    dateFormatee = `${jour}/${mois}/${annee}`;
  }

  // 2. Numéro WhatsApp 
  const numeroTelephone = "224627288828"; 

  // 3. Construction du message WhatsApp
  let message = `✨ *Rendez-vous confirmé !* ✨\n\n`;
  message += `📍 *Activité :* ${activity}\n`;
  message += `📅 *Date :* ${dateFormatee || "Non précisée"}\n`;
  message += `⏰ *Heure :* ${timeInput || "Non précisée"}\n\n`;
  message += `À très vite ! 😉`;

  // 4. Envoi vers WhatsApp
  setTimeout(() => {
  const urlWhatsApp = `https://wa.me/${224627288828}?text=${encodeURIComponent(message)}`;
  window.location.href = urlWhatsApp;}, 3500); // Délai de 3500ms pour laisser le temps à l'animation de se terminer

// Masquer le formulaire (étape 2) et afficher la confirmation finale (étape 3)
document.getElementById('step-2').classList.remove('active');
document.getElementById('step-3').classList.add('active');
}
