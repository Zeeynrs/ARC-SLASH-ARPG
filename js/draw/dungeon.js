// --- DUNGEON DRAWING ---

function drawDungeonFloor() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const isDeepDark = (typeof currentStage !== 'undefined' && currentStage >= 23);

    ctx.fillStyle = isDeepDark ? '#020617' : '#0a0d14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const playTop = 46;

    const tileSize = 48;
    for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = playTop; y < canvas.height; y += tileSize) {
            const tileIdx = ((x / tileSize) + (y / tileSize));
            const isAlt = tileIdx % 2 === 0;

            if (isDeepDark) {
                // Deep Dark: Deepslate tiles with sculk patches
                ctx.fillStyle = isAlt ? '#030c17' : '#021420';
                ctx.fillRect(x, y, tileSize, tileSize);

                ctx.strokeStyle = '#062030';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

                // Procedural Sculk Veins & Catalysts
                if ((tileIdx * 7) % 5 === 0) {
                    ctx.fillStyle = '#042f2e';
                    ctx.fillRect(x + 6, y + 6, tileSize - 12, tileSize - 12);
                    ctx.fillStyle = '#0e7490';
                    ctx.fillRect(x + 10, y + 12, 6, 2);
                    ctx.fillRect(x + 14, y + 14, 2, 8);
                    ctx.fillRect(x + 22, y + 24, 8, 2);
                    ctx.fillStyle = '#06b6d4';
                    ctx.fillRect(x + 16, y + 22, 3, 3);
                }

                // Pulsing Sculk Sensors
                if ((tileIdx * 13) % 7 === 0) {
                    const pulse = Math.sin(Date.now() * 0.003 + tileIdx) * 0.4 + 0.6;
                    ctx.fillStyle = `rgba(6, 182, 212, ${pulse * 0.4})`;
                    ctx.beginPath();
                    ctx.arc(x + 24, y + 24, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#22d3ee';
                    ctx.fillRect(x + 23, y + 23, 2, 2);
                }

                ctx.fillStyle = '#020b14';
                ctx.fillRect(x + 8, y + 12, 3, 2);
                ctx.fillRect(x + 32, y + 28, 2, 2);
            } else {
                ctx.fillStyle = isAlt ? '#0f1420' : '#0c101a';
                ctx.fillRect(x, y, tileSize, tileSize);

                ctx.strokeStyle = '#161d2d';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

                ctx.fillStyle = '#1c263b';
                ctx.fillRect(x + 8, y + 12, 3, 2);
                ctx.fillRect(x + 32, y + 28, 2, 2);
                ctx.fillRect(x + 20, y + 38, 3, 3);
                ctx.fillStyle = '#080a10';
                ctx.fillRect(x + 11, y + 14, 2, 1);
                ctx.fillRect(x + 23, y + 41, 1, 2);
            }
        }
    }

    // Top Perimeter Wall
    ctx.fillStyle = isDeepDark ? '#070f1a' : '#161d2a';
    ctx.fillRect(0, playTop, canvas.width, 18);
    ctx.fillStyle = isDeepDark ? '#0e7490' : '#2a364d';
    ctx.fillRect(0, playTop, canvas.width, 3);

    // Wall crenellations / teeth
    ctx.fillStyle = isDeepDark ? '#040d18' : '#101622';
    for (let x = 0; x < canvas.width; x += 16) {
        const teethH = 4 + (x % 7);
        ctx.fillRect(x, playTop + 18, 12, teethH);
        ctx.fillStyle = isDeepDark ? '#0891b2' : '#222d40';
        ctx.fillRect(x, playTop + 18, 12, 1);
        ctx.fillStyle = isDeepDark ? '#040d18' : '#101622';
    }

    // Side Borders
    ctx.fillStyle = isDeepDark ? '#070f1a' : '#161d2a';
    ctx.fillRect(0, playTop, 16, canvas.height - playTop);
    ctx.fillRect(canvas.width - 16, playTop, 16, canvas.height - playTop);

    ctx.fillStyle = isDeepDark ? '#0e7490' : '#253147';
    for (let y = playTop; y < canvas.height; y += 24) {
        ctx.fillRect(14, y + 4, 4, 12);
        ctx.fillRect(canvas.width - 18, y + 10, 4, 12);
    }

    // Bottom Border
    ctx.fillStyle = isDeepDark ? '#070f1a' : '#161d2a';
    ctx.fillRect(0, canvas.height - 16, canvas.width, 16);
    ctx.fillStyle = isDeepDark ? '#0e7490' : '#253147';
    ctx.fillRect(0, canvas.height - 16, canvas.width, 3);

    // Internal Walls (Reinforced Deepslate in Deep Dark)
    walls.forEach(w => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(w.x + 4, w.y + w.h, w.w - 4, 6);

        ctx.fillStyle = isDeepDark ? '#070f1c' : '#1c2536';
        ctx.fillRect(w.x, w.y, w.w, w.h);

        const capH = Math.min(10, w.h / 2);
        ctx.fillStyle = isDeepDark ? '#0f2742' : '#334361';
        ctx.fillRect(w.x, w.y, w.w, capH);

        ctx.fillStyle = isDeepDark ? '#06b6d4' : '#4c618a';
        ctx.fillRect(w.x, w.y, w.w, 2);

        ctx.fillStyle = isDeepDark ? '#030812' : '#111724';
        ctx.fillRect(w.x, w.y + capH, w.w, 2);

        for (let bx = w.x + 16; bx < w.x + w.w; bx += 32) {
            ctx.fillRect(bx, w.y, 2, capH);
            ctx.fillRect(bx - 8, w.y + capH, 2, w.h - capH);
        }

        for (let by = w.y + capH + 16; by < w.y + w.h; by += 16) {
            ctx.fillRect(w.x, by, w.w, 2);
        }

        ctx.strokeStyle = isDeepDark ? '#04101e' : '#0b0f19';
        ctx.lineWidth = 2;
        ctx.strokeRect(w.x, w.y, w.w, w.h);

        // Sculk moss veins clinging to reinforced deepslate walls
        if (isDeepDark) {
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(w.x + 2, w.y + capH + 4, 3, 2);
            ctx.fillRect(w.x + w.w - 5, w.y + w.h - 6, 3, 2);
        }
    });

    // Deep Dark Atmospheric Darkness Vignette
    if (isDeepDark) {
        const darkVignette = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 120,
            canvas.width / 2, canvas.height / 2, 340
        );
        const pulse = Math.sin(Date.now() * 0.002) * 0.06;
        darkVignette.addColorStop(0, 'rgba(2, 6, 23, 0)');
        darkVignette.addColorStop(0.7, `rgba(2, 6, 23, ${0.28 + pulse})`);
        darkVignette.addColorStop(1, `rgba(2, 6, 23, ${0.52 + pulse})`);
        ctx.fillStyle = darkVignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawTorchesAndSmoke() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const isDeepDark = (typeof currentStage !== 'undefined' && currentStage >= 23);

    torches.forEach(t => {
        ctx.save();
        const glowRadius = isDeepDark ? 62 : 55;
        const glowGrad = ctx.createRadialGradient(t.x, t.y, 2, t.x, t.y, glowRadius);
        if (isDeepDark) {
            // Ethereal Soul Light
            glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
            glowGrad.addColorStop(0.5, 'rgba(8, 145, 178, 0.10)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            glowGrad.addColorStop(0, 'rgba(255, 120, 0, 0.22)');
            glowGrad.addColorStop(0.5, 'rgba(255, 80, 0, 0.08)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    smokeParticles.forEach(sm => {
        const opacity = (sm.life / sm.maxLife) * (isDeepDark ? 0.6 : 0.45);
        ctx.fillStyle = isDeepDark ? `rgba(34, 211, 238, ${opacity})` : `rgba(160, 175, 200, ${opacity})`;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
        ctx.fill();
    });

    torches.forEach(t => {
        if (isDeepDark) {
            // Soul Lantern / Sculk Shrine Mount
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(t.x - 6, t.y + 2, 12, 7);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(t.x - 4, t.y + 3, 8, 4);

            ctx.fillStyle = '#0e7490';
            ctx.fillRect(t.x - 2, t.y - 4, 4, 12);
            ctx.fillStyle = '#0891b2';
            ctx.fillRect(t.x, t.y - 4, 2, 12);

            ctx.fillStyle = '#1e293b';
            ctx.fillRect(t.x - 5, t.y - 7, 10, 4);

            ctx.save();
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 16;

            const flickerX = (Math.random() - 0.5) * 1.5;
            const flameSize = 6 + Math.random() * 3;

            // Soul Cyan Flame
            ctx.fillStyle = '#0891b2';
            ctx.beginPath();
            ctx.arc(t.x + flickerX, t.y - 11, flameSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.arc(t.x + flickerX, t.y - 12, flameSize * 0.65, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ecfeff';
            ctx.beginPath();
            ctx.arc(t.x + flickerX * 0.5, t.y - 13, flameSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            // Regular Torch
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(t.x - 5, t.y + 2, 10, 6);
            ctx.fillStyle = '#1a202c';
            ctx.fillRect(t.x - 3, t.y + 3, 6, 4);

            ctx.fillStyle = '#6e4726';
            ctx.fillRect(t.x - 2, t.y - 4, 4, 12);
            ctx.fillStyle = '#4a2e16';
            ctx.fillRect(t.x, t.y - 4, 2, 12);

            ctx.fillStyle = '#3a4a63';
            ctx.fillRect(t.x - 4, t.y - 7, 8, 4);

            ctx.save();
            ctx.shadowColor = '#ff6d00';
            ctx.shadowBlur = 14;

            const flickerX = (Math.random() - 0.5) * 1.5;
            const flameSize = 6 + Math.random() * 3;

            ctx.fillStyle = '#ff3d00';
            ctx.beginPath();
            ctx.arc(t.x + flickerX, t.y - 11, flameSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(t.x + flickerX, t.y - 12, flameSize * 0.65, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(t.x + flickerX * 0.5, t.y - 13, flameSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });
}

function drawDungeonGate() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const isDeepDark = (typeof currentStage !== 'undefined' && currentStage >= 23);

    ctx.save();

    const gx = dungeonGate.x + dungeonGate.w / 2;
    const gy = dungeonGate.y + dungeonGate.h / 2;

    ctx.fillStyle = isDeepDark ? '#070f1c' : '#1c2638';
    ctx.fillRect(dungeonGate.x - 4, dungeonGate.y - 4, dungeonGate.w + 8, dungeonGate.h + 8);

    ctx.fillStyle = isDeepDark ? '#0e7490' : '#3a4b6e';
    ctx.fillRect(dungeonGate.x - 4, dungeonGate.y - 4, dungeonGate.w + 8, 4);
    ctx.fillRect(dungeonGate.x - 4, dungeonGate.y - 4, 4, dungeonGate.h + 8);
    ctx.fillRect(dungeonGate.x + dungeonGate.w, dungeonGate.y - 4, 4, dungeonGate.h + 8);

    ctx.fillStyle = isDeepDark ? '#155e75' : '#526691';
    ctx.fillRect(gx - 6, dungeonGate.y - 6, 12, 6);
    ctx.strokeStyle = isDeepDark ? '#04101e' : '#101622';
    ctx.lineWidth = 1;
    ctx.strokeRect(gx - 6, dungeonGate.y - 6, 12, 6);

    if (dungeonGate.open) {
        const maxStages = (typeof STAGE_CONFIGS !== 'undefined') ? STAGE_CONFIGS.length : 50;
        const isFinalStage = (typeof currentStage !== 'undefined' && currentStage >= maxStages);
        const isDragonStage = (typeof currentStage !== 'undefined' && currentStage === 21);
        const isAlterEgoStage22 = (typeof currentStage !== 'undefined' && currentStage === 22);
        const isWardenStage = (typeof currentStage !== 'undefined' && currentStage === 35);

        let col1 = '#00e5ff';
        let col2 = '#0284c7';
        let colGlow = '#00e5ff';

        if (isFinalStage) {
            col1 = '#fbbf24'; col2 = '#f59e0b'; colGlow = '#fbbf24';
        } else if (isAlterEgoStage22) {
            col1 = '#06b6d4'; col2 = '#3b82f6'; colGlow = '#06b6d4';
        } else if (isDragonStage) {
            col1 = '#c084fc'; col2 = '#ec4899'; colGlow = '#a855f7';
        } else if (isDeepDark) {
            col1 = '#22d3ee'; col2 = '#0891b2'; colGlow = '#06b6d4';
        }

        ctx.shadowColor = colGlow;
        ctx.shadowBlur = (isFinalStage || isWardenStage || isAlterEgoStage22 || isDragonStage) ? 24 : 18;

        ctx.fillStyle = '#020617';
        ctx.fillRect(dungeonGate.x, dungeonGate.y, dungeonGate.w, dungeonGate.h);

        ctx.fillStyle = isFinalStage ? '#78350f' : (isDeepDark ? '#042f2e' : (isDragonStage ? '#3b0764' : '#3d2516'));
        ctx.fillRect(dungeonGate.x - 3, dungeonGate.y, 6, dungeonGate.h);
        ctx.fillRect(dungeonGate.x + dungeonGate.w - 3, dungeonGate.y, 6, dungeonGate.h);
        ctx.fillStyle = isFinalStage ? '#451a03' : (isDeepDark ? '#021817' : (isDragonStage ? '#1e0836' : '#1e120a'));
        ctx.fillRect(dungeonGate.x + 1, dungeonGate.y, 2, dungeonGate.h);
        ctx.fillRect(dungeonGate.x + dungeonGate.w - 3, dungeonGate.y, 2, dungeonGate.h);

        ctx.strokeStyle = col1;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(gx, gy, 15, dungeonGate.swirlTimer, dungeonGate.swirlTimer + Math.PI * 1.5);
        ctx.stroke();

        ctx.strokeStyle = col2;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(gx, gy, 9, -dungeonGate.swirlTimer * 1.3, -dungeonGate.swirlTimer * 1.3 + Math.PI * 1.5);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gx, gy, 4 + Math.sin(dungeonGate.swirlTimer * 2) * 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < (isFinalStage ? 6 : 4); i++) {
            const angle = dungeonGate.swirlTimer + i * (Math.PI * 2 / (isFinalStage ? 6 : 4));
            const px = gx + Math.cos(angle) * 13;
            const py = gy + Math.sin(angle) * 13;
            ctx.fillStyle = (i % 2 === 0) ? col1 : '#ffffff';
            ctx.fillRect(px, py, 2.5, 2.5);
        }

        ctx.fillStyle = col1;
        ctx.font = '7.5px "Press Start 2P", monospace';
        ctx.textAlign = 'center';

        let portalText = 'PORTAL 🌀';
        if (isFinalStage) portalText = 'VICTORY PORTAL 🏆';
        else if (isAlterEgoStage22) portalText = 'DEEP DARK PORTAL 🌌';
        else if (isWardenStage) portalText = 'ABYSSAL CORE PORTAL 🌀';
        else if (isDragonStage) portalText = 'SHADOW PORTAL 🌀';
        else if (isDeepDark) portalText = 'SCULK GATEWAY 🌌';

        ctx.fillText(portalText, gx, dungeonGate.y - 9);
        ctx.textAlign = 'left';

    } else {
        const halfW = dungeonGate.w / 2;

        ctx.fillStyle = isDeepDark ? '#041d2e' : '#5c3d2e';
        ctx.fillRect(dungeonGate.x, dungeonGate.y, halfW - 1, dungeonGate.h);

        ctx.fillStyle = isDeepDark ? '#021522' : '#4a2e1b';
        ctx.fillRect(dungeonGate.x + halfW + 1, dungeonGate.y, halfW - 1, dungeonGate.h);

        ctx.fillStyle = isDeepDark ? '#0e7490' : '#29190e';
        ctx.fillRect(dungeonGate.x + 6, dungeonGate.y, 1.5, dungeonGate.h);
        ctx.fillRect(dungeonGate.x + 13, dungeonGate.y, 1.5, dungeonGate.h);
        ctx.fillRect(dungeonGate.x + halfW + 7, dungeonGate.y, 1.5, dungeonGate.h);
        ctx.fillRect(dungeonGate.x + halfW + 14, dungeonGate.y, 1.5, dungeonGate.h);

        ctx.fillStyle = isDeepDark ? '#020912' : '#110a05';
        ctx.fillRect(dungeonGate.x + halfW - 1, dungeonGate.y, 2, dungeonGate.h);

        ctx.fillStyle = isDeepDark ? '#0f2742' : '#2d3748';
        ctx.fillRect(dungeonGate.x, dungeonGate.y + 10, dungeonGate.w, 4);
        ctx.fillRect(dungeonGate.x, dungeonGate.y + dungeonGate.h - 14, dungeonGate.w, 4);

        ctx.fillStyle = isDeepDark ? '#06b6d4' : '#a0aec0';
        ctx.fillRect(dungeonGate.x + 3, dungeonGate.y + 11, 2, 2);
        ctx.fillRect(dungeonGate.x + dungeonGate.w - 5, dungeonGate.y + 11, 2, 2);
        ctx.fillRect(dungeonGate.x + 3, dungeonGate.y + dungeonGate.h - 13, 2, 2);
        ctx.fillRect(dungeonGate.x + dungeonGate.w - 5, dungeonGate.y + dungeonGate.h - 13, 2, 2);

        ctx.strokeStyle = isDeepDark ? '#06b6d4' : '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(dungeonGate.x + halfW - 4, gy + 4, 3.5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(dungeonGate.x + halfW + 4, gy + 4, 3.5, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = isDeepDark ? '#0e7490' : '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(gx, gy - 10);
        ctx.lineTo(gx + 8, gy - 6);
        ctx.lineTo(gx + 8, gy + 2);
        ctx.quadraticCurveTo(gx, gy + 9, gx, gy + 11);
        ctx.quadraticCurveTo(gx, gy + 9, gx - 8, gy + 2);
        ctx.lineTo(gx - 8, gy - 6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = isDeepDark ? '#22d3ee' : '#f1c40f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(gx, gy - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(gx - 1.5, gy - 2, 3, 5);

        ctx.fillStyle = isDeepDark ? '#06b6d4' : '#ff4d4d';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LOCKED \u{1F512}', gx, dungeonGate.y - 9);
        ctx.textAlign = 'left';
    }

    ctx.restore();
}
