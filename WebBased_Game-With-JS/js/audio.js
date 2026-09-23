// --- WEB AUDIO API SYNTHESIZER ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        if (type === 'slash') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.12);
        } else if (type === 'hit') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'explode') {
            const bufferSize = audioCtx.sampleRate * 0.25;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 0.25);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
            noise.start(now);
        } else if (type === 'coin') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.06);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.18);
        } else if (type === 'heal') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.22);
        } else if (type === 'shield') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.18);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.2);
        } else if (type === 'teleport') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'victory') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                gain.gain.setValueAtTime(0.2, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.25);
            });
        } else if (type === 'skill') {
            // New skill activation sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(660, now);
            osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.2);
            // Second harmonic
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(990, now + 0.05);
            osc2.frequency.exponentialRampToValueAtTime(1650, now + 0.2);
            gain2.gain.setValueAtTime(0.15, now + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc2.connect(gain2); gain2.connect(audioCtx.destination);
            osc2.start(now + 0.05); osc2.stop(now + 0.25);
        } else if (type === 'buy') {
            // Shop purchase sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.08);
            osc.frequency.setValueAtTime(783.99, now + 0.16);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'achievement') {
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.25, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.28);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.28);
            });
        } else if (type === 'error') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.setValueAtTime(150, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.2);
        }
    } catch (e) {
        console.error(e);
    }
}
