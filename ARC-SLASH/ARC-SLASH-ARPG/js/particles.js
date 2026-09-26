// --- PARTICLES & EFFECTS STATE ---
const particles = [];
const smokeParticles = [];
const coins = [];
const loots = [];
const floatingTexts = [];
const enemyProjectiles = [];
const playerProjectiles = [];

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function updateSmokeParticles() {
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const sm = smokeParticles[i];
        sm.x += sm.vx; sm.y += sm.vy;
        sm.size += 0.04;
        sm.life--;
        if (sm.life <= 0) smokeParticles.splice(i, 1);
    }
}

function updateFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.6;
        ft.life--;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
    }
}

function clearParticles() {
    particles.length = 0;
    smokeParticles.length = 0;
    coins.length = 0;
    loots.length = 0;
    floatingTexts.length = 0;
    enemyProjectiles.length = 0;
    playerProjectiles.length = 0;
}
