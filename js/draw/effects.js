// --- EFFECTS RENDERING ---

function drawCoins(ctx) {
    coins.forEach(c => {
        const drawY = c.y - c.z;
        ctx.save();
        ctx.translate(c.x, drawY);

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(0, c.z, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d4ac0d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fff59d';
        ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
    });
}

function drawLoots(ctx) {
    loots.forEach(l => {
        const floatOffset = Math.sin(l.floatTimer) * 4;
        ctx.save();
        ctx.translate(l.x, l.y + floatOffset);

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 9 - floatOffset, 8, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (l.type === 'health') {
            ctx.shadowColor = '#ff1744';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ff1744';
            ctx.beginPath();
            ctx.moveTo(0, 6);
            ctx.bezierCurveTo(-9, -2, -9, -11, 0, -4);
            ctx.bezierCurveTo(9, -11, 9, -2, 0, 6);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-3, -6, 2, 2);
        } else if (l.type === 'shield') {
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#00e5ff';
            ctx.beginPath();
            ctx.moveTo(-8, -8);
            ctx.lineTo(8, -8);
            ctx.lineTo(8, -1);
            ctx.quadraticCurveTo(8, 9, 0, 13);
            ctx.quadraticCurveTo(-8, 9, -8, -1);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.fillStyle = '#ffea00';
            ctx.fillRect(-2, -5, 4, 11);
            ctx.fillRect(-6, -2, 12, 4);
        }

        ctx.restore();
    });
}

function drawEnemyProjectiles(ctx) {
    enemyProjectiles.forEach(arr => {
        ctx.save();
        ctx.translate(arr.x, arr.y);
        ctx.rotate(arr.angle);

        if (arr.type === 'fireball') {
            ctx.shadowColor = '#ff6d00';
            ctx.shadowBlur = 14;

            ctx.fillStyle = '#ff3d00';
            ctx.beginPath();
            ctx.arc(0, 0, 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (arr.type === 'cosmic_bolt') {
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 14;

            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f472b6';
            ctx.fillRect(-10, -1.5, 6, 3);

        } else if (arr.type === 'phantom_dagger') {
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 10;

            ctx.fillStyle = '#064e3b';
            ctx.fillRect(-12, -2, 6, 4);

            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-4, -4);
            ctx.lineTo(-4, 4);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-2, -1, 8, 2);

        } else {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-16, 2);
            ctx.lineTo(4, 2);
            ctx.stroke();

            ctx.fillStyle = '#78350f';
            ctx.fillRect(-10, -1, 16, 2);

            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(9, 0);
            ctx.lineTo(5, -3);
            ctx.lineTo(5, 3);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-10, -1);
            ctx.lineTo(-13, -4);
            ctx.lineTo(-8, -1);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-10, 1);
            ctx.lineTo(-13, 4);
            ctx.lineTo(-8, 1);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    });
}

function drawPlayerProjectiles(ctx) {
    if (typeof playerProjectiles === 'undefined') return;
    playerProjectiles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.type === 'snowball') {
            // === FROST SNOWBALL (Bola Salju Bersalju Abadi) ===
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 14;

            // Ice-blue outer halo
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            // Fluffy white snowball sphere
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
            ctx.fill();

            // Shading & snow texture clumps
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.arc(-2, -1.5, 2.5, 0, Math.PI * 2);
            ctx.arc(1.5, 2, 2.2, 0, Math.PI * 2);
            ctx.arc(-1, 3, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Frozen crystal points / sparkles
            ctx.fillStyle = '#7dd3fc';
            ctx.fillRect(-7, -2, 2, 2);
            ctx.fillRect(5, 2, 2, 2);
            ctx.fillRect(-2, -7, 2, 2);

            // Frost stream tail
            ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(-14, 0);
            ctx.stroke();

        } else {
            // Standard Glowing magical missile with radiant energy halo
            ctx.shadowColor = p.color || '#c084fc';
            ctx.shadowBlur = 12;

            // Outer magical aura
            ctx.fillStyle = p.color || '#c084fc';
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Bright sparkling white core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(2, 0, 4, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Stream trail
            ctx.strokeStyle = p.color || '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(-12, 0);
            ctx.stroke();
        }

        ctx.restore();
    });
}

function drawParticles(ctx) {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
}

function drawFloatingTexts(ctx) {
    floatingTexts.forEach(d => {
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#111';
        ctx.fillText(d.text, d.x + 1, d.y + 1);
        ctx.fillStyle = d.color || '#ffeb3b';
        ctx.fillText(d.text, d.x, d.y);
    });
}

// Skill active visual effects
function drawSkillEffects(ctx) {
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    
    // Whirlwind active aura (Knight Skill 1)
    if (skillSlots[0] && skillSlots[0].isActive && skillSlots[0].activeTimer > 0) {
        const skill = getSkillData(0) || getSkillData('skill_whirlwind');
        if (skill && skill.duration) {
            const progress = 1 - (skillSlots[0].activeTimer / skill.duration);
            const radius = (skill.radius || 80) * (0.5 + progress * 0.5);
            const alpha = 0.4 * (1 - progress);
            
            ctx.save();
            ctx.strokeStyle = `rgba(241, 196, 15, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(px, py, radius, Date.now() * 0.01, Date.now() * 0.01 + Math.PI * 1.5);
            ctx.stroke();
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px, py, radius * 0.7, -Date.now() * 0.015, -Date.now() * 0.015 + Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    }
}

// --- TELEGRAPH DANGER ZONES (CIRCLES & LINES) ---
function drawTelegraphZones(ctx) {
    if (typeof telegraphZones === 'undefined' || !telegraphZones.length) return;

    telegraphZones.forEach(zone => {
        const progress = Math.max(0, Math.min(1, 1 - zone.timer / zone.maxTimer));
        ctx.save();

        if (zone.type === 'circle') {
            // 1. Semi-transparent Danger Area
            ctx.fillStyle = zone.fillColor || 'rgba(239, 68, 68, 0.25)';
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Outer Border with pulsating dashed stroke
            ctx.strokeStyle = zone.color || '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.lineDashOffset = (Date.now() * 0.02) % 9;
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 3. Inner Expanding Progress Circle (showing exact detonation moment)
            const currR = Math.max(0, zone.radius * progress);
            ctx.fillStyle = (zone.color === '#a855f7' || zone.color === '#ec4899')
                ? `rgba(236, 72, 153, ${0.2 + progress * 0.35})`
                : `rgba(239, 68, 68, ${0.2 + progress * 0.35})`;
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, currR, 0, Math.PI * 2);
            ctx.fill();

            // Progress Edge Ring
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, currR, 0, Math.PI * 2);
            ctx.stroke();

            // 4. Center Warning Icon
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const pulse = 1 + Math.sin(Date.now() * 0.015) * 0.15;
            ctx.save();
            ctx.translate(zone.x, zone.y);
            ctx.scale(pulse, pulse);
            ctx.fillText(zone.icon || '⚠️', 0, 0);
            ctx.restore();

            // 5. If meteor / boulder falling: draw descending projectile streak during final 35% of telegraph
            if ((zone.effectType === 'meteor' || zone.effectType === 'dragon_boulder') && progress > 0.65) {
                const dropProg = (progress - 0.65) / 0.35;
                const startY = zone.y - 140;
                const currY = startY + 140 * dropProg;
                const isBoulder = zone.effectType === 'dragon_boulder';

                // Fiery comet trail
                ctx.strokeStyle = isBoulder ? 'rgba(234, 88, 12, 0.8)' : 'rgba(236, 72, 153, 0.8)';
                ctx.lineWidth = isBoulder ? 8 : 5;
                ctx.beginPath();
                ctx.moveTo(zone.x, currY - 30);
                ctx.lineTo(zone.x, currY);
                ctx.stroke();

                // Blazing Head
                ctx.shadowColor = isBoulder ? '#f59e0b' : '#ec4899';
                ctx.shadowBlur = 12;
                ctx.fillStyle = isBoulder ? '#ea580c' : '#f43f5e';
                ctx.beginPath();
                ctx.arc(zone.x, currY, isBoulder ? 10 : 7, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(zone.x, currY, isBoulder ? 5 : 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

        } else if (zone.type === 'line') {
            const dx = zone.x2 - zone.x1;
            const dy = zone.y2 - zone.y1;
            const len = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);

            ctx.translate(zone.x1, zone.y1);
            ctx.rotate(angle);

            // 1. Line corridor background
            const isFlame = zone.effectType === 'flame_line';
            ctx.fillStyle = isFlame ? 'rgba(239, 68, 68, 0.22)' : 'rgba(168, 85, 247, 0.22)';
            ctx.fillRect(0, -zone.width / 2, len, zone.width);

            // 2. Dashed Border Edges
            ctx.strokeStyle = isFlame ? '#ef4444' : (zone.color || '#dc2626');
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            ctx.lineDashOffset = -(Date.now() * 0.02) % 10;
            ctx.beginPath();
            ctx.moveTo(0, -zone.width / 2);
            ctx.lineTo(len, -zone.width / 2);
            ctx.moveTo(0, zone.width / 2);
            ctx.lineTo(len, zone.width / 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 3. Progress fill bar sweeping along the width
            const fillH = zone.width * progress;
            ctx.fillStyle = isFlame
                ? `rgba(245, 158, 11, ${0.25 + progress * 0.4})`
                : `rgba(225, 29, 72, ${0.25 + progress * 0.4})`;
            ctx.fillRect(0, -fillH / 2, len, fillH);

            // 4. Center cutting guideline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(len, 0);
            ctx.stroke();

            // 5. Direction icons
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const numIcons = Math.floor(len / 45);
            for (let k = 1; k <= numIcons; k++) {
                ctx.fillText(isFlame ? '🔥' : '⚔️', k * (len / (numIcons + 1)), 0);
            }
        }

        ctx.restore();
    });
}
