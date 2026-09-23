// --- MOB RENDERING ---

function drawZombieMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.008 + mob.id;
    const wobble = Math.sin(time) * 2.5;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, mob.w * 0.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1b263b';
    ctx.fillRect(cx - 6, cy + 4, 5, 10);
    ctx.fillRect(cx + 1, cy + 4, 5, 10);

    ctx.fillStyle = '#3a5a40';
    ctx.fillRect(cx - 8 + wobble * 0.5, cy - 8, 16, 13);
    ctx.fillStyle = '#1e2923';
    ctx.fillRect(cx - 4 + wobble * 0.5, cy - 3, 4, 4);

    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(cx - 14 + wobble, cy - 4, 8, 4);
    ctx.fillRect(cx + 6 + wobble, cy - 4, 8, 4);

    const headY = cy - 18;
    ctx.fillStyle = '#40916c';
    ctx.fillRect(cx - 7, headY, 14, 11);

    ctx.fillStyle = '#1b4332';
    ctx.fillRect(cx - 7, headY, 14, 3);

    ctx.fillStyle = '#081c15';
    ctx.fillRect(cx - 5, headY + 4, 4, 3);
    ctx.fillRect(cx + 1, headY + 4, 4, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 4, headY + 5, 2, 1.5);
    ctx.fillRect(cx + 2, headY + 5, 2, 1.5);

    ctx.fillStyle = '#081c15';
    ctx.fillRect(cx - 3, headY + 8, 6, 2);
    ctx.fillStyle = '#74c69d';
    ctx.fillRect(cx - 1, headY + 9, 2, 3);

    if (mob.type === 'boss') {
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(cx - 8, headY - 5, 16, 4);
    }

    ctx.restore();
}

function drawSkeletonMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.01 + mob.id;
    const rattle = Math.sin(time * 2) * 1.5;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, mob.w * 0.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 5, cy + 5, 3, 9);
    ctx.fillRect(cx + 2, cy + 5, 3, 9);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 1, cy - 6, 2, 11);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - 6 + rattle * 0.3, cy - 6, 12, 2);
    ctx.fillRect(cx - 5 + rattle * 0.3, cy - 3, 10, 2);
    ctx.fillRect(cx - 4 + rattle * 0.3, cy, 8, 2);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 9 + rattle, cy - 4, 5, 3);
    ctx.fillRect(cx + 4 + rattle, cy - 4, 5, 3);

    const bowX = cx + 8 + rattle;
    const bowY = cy - 2;

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bowX, bowY, 11, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bowX + Math.cos(-Math.PI * 0.45) * 11, bowY + Math.sin(-Math.PI * 0.45) * 11);
    ctx.lineTo(bowX - 3, bowY);
    ctx.lineTo(bowX + Math.cos(Math.PI * 0.45) * 11, bowY + Math.sin(Math.PI * 0.45) * 11);
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.fillRect(bowX - 6, bowY - 1, 14, 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(bowX + 11, bowY);
    ctx.lineTo(bowX + 7, bowY - 3);
    ctx.lineTo(bowX + 7, bowY + 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bowX - 7, bowY - 2, 3, 4);

    const headY = cy - 17;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - 6, headY, 12, 10);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 5, headY + 3, 4, 3);
    ctx.fillRect(cx + 1, headY + 3, 4, 3);
    ctx.fillRect(cx - 1, headY + 6, 2, 2);

    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - 4, headY + 8, 8, 1.5);

    if (mob.type === 'boss') {
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(cx - 7, headY - 5, 14, 4);
        ctx.fillRect(cx - 7, headY - 8, 4, 3);
        ctx.fillRect(cx - 1, headY - 10, 3, 5);
        ctx.fillRect(cx + 3, headY - 8, 4, 3);
    }

    ctx.restore();
}

function drawDragonMob(ctx, mob, cx, cy, groundY) {
    const isBoss = (mob.type === 'boss' || mob.species === 'dragon');
    const time = Date.now() * 0.0045 + (mob.id || 0);

    // Orientation: face towards player if not moving vertically
    let facing = mob.facing || 'left';
    if (facing !== 'left' && facing !== 'right') {
        facing = (typeof player !== 'undefined' && player.x < cx) ? 'left' : 'right';
    }
    const dir = (facing === 'left') ? -1 : 1;

    // Flight & breathing elevation
    const baseFlyZ = mob.isFlying ? (mob.flyZ || 26) : 16;
    const hoverY = Math.sin(time * 3.2) * (mob.isFlying ? 8 : 4);
    const drawY = cy - baseFlyZ + hoverY;
    const wingCycle = Math.sin(time * (mob.isFlying ? 8 : 5.5));
    const breathe = Math.sin(time * 2.8);
    const chargingFire = (mob.dragonTimer && mob.dragonTimer > 35);
    const fireChargeIntensity = chargingFire ? Math.min(1, (mob.dragonTimer - 35) / 30) : 0;

    // Scale sizing: boss is massive and imposing
    const scale = isBoss ? 1.25 : 0.95;

    ctx.save();

    // 1. DYNAMIC GROUND SHADOW (Breathing & flight elevation)
    const shadowStretch = 1 - (baseFlyZ + hoverY) / 140;
    ctx.fillStyle = 'rgba(8, 2, 4, 0.68)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, (mob.w * 0.55 * scale) * shadowStretch, (8 * scale) * shadowStretch, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ambient floating embers venting from volcanic scales
    if (Math.random() < 0.35 && typeof particles !== 'undefined') {
        const emberX = cx + (Math.random() - 0.5) * mob.w * scale * 0.8;
        const emberY = drawY + (Math.random() - 0.5) * mob.h * scale * 0.5;
        particles.push({
            x: emberX,
            y: emberY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -Math.random() * 2 - 0.8,
            size: Math.random() * 2.2 + 1,
            color: Math.random() < 0.6 ? '#ff3d00' : '#ff9100',
            life: 22
        });
    }

    // Center and mirror horizontally based on facing direction
    ctx.translate(cx, drawY);
    ctx.scale(dir * scale, scale);

    // ==========================================
    // 2. SINUOUS BARBED TAIL (Swaying behind)
    // ==========================================
    ctx.save();
    const tailBaseX = -18;
    const tailBaseY = 8;
    const tailSway = Math.sin(time * 3.5) * 6;
    const tailTipY = tailBaseY + 18 + Math.cos(time * 3.2) * 5;

    // Heavy segmented tail spine
    ctx.strokeStyle = '#140608';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailBaseX, tailBaseY);
    ctx.quadraticCurveTo(-30, tailBaseY + 6, -42 + tailSway * 0.5, tailBaseY + 12);
    ctx.quadraticCurveTo(-54 + tailSway, tailBaseY + 16, -66 + tailSway * 1.2, tailTipY);
    ctx.stroke();

    // Dark crimson scale overlay
    ctx.strokeStyle = '#3b0d12';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(tailBaseX, tailBaseY);
    ctx.quadraticCurveTo(-30, tailBaseY + 6, -42 + tailSway * 0.5, tailBaseY + 12);
    ctx.quadraticCurveTo(-54 + tailSway, tailBaseY + 16, -66 + tailSway * 1.2, tailTipY);
    ctx.stroke();

    // Molten fissure along tail
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tailBaseX, tailBaseY);
    ctx.quadraticCurveTo(-30, tailBaseY + 6, -42 + tailSway * 0.5, tailBaseY + 12);
    ctx.quadraticCurveTo(-54 + tailSway, tailBaseY + 16, -66 + tailSway * 1.2, tailTipY);
    ctx.stroke();

    // Dorsal spikes along tail
    for (let s = 1; s <= 3; s++) {
        const spikeRatio = s / 4;
        const spkX = tailBaseX - s * 14 + tailSway * spikeRatio;
        const spkY = tailBaseY + s * 4 - 3;
        ctx.fillStyle = '#140608';
        ctx.beginPath();
        ctx.moveTo(spkX - 2, spkY);
        ctx.lineTo(spkX - 5, spkY - 8);
        ctx.lineTo(spkX + 2, spkY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(spkX - 4, spkY - 7, 2, 3);
    }

    // Barbed volcanic scythe blade tip
    const bladeX = -66 + tailSway * 1.2;
    const bladeY = tailTipY;
    ctx.fillStyle = '#140608';
    ctx.beginPath();
    ctx.moveTo(bladeX, bladeY - 6);
    ctx.lineTo(bladeX - 16, bladeY - 2);
    ctx.lineTo(bladeX - 22, bladeY + 12);
    ctx.lineTo(bladeX - 6, bladeY + 8);
    ctx.lineTo(bladeX + 2, bladeY + 3);
    ctx.closePath();
    ctx.fill();

    // Inner glowing blade edge
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(bladeX - 4, bladeY - 2);
    ctx.lineTo(bladeX - 16, bladeY + 1);
    ctx.lineTo(bladeX - 20, bladeY + 10);
    ctx.lineTo(bladeX - 8, bladeY + 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ==========================================
    // 3. BACKGROUND WING (Distant silhouette wing)
    // ==========================================
    ctx.save();
    const bgWingFlap = Math.sin(time * (mob.isFlying ? 8 : 5.5) + 0.3) * 0.45;
    ctx.translate(-4, -12);
    ctx.rotate(-0.35 + bgWingFlap);

    // Bone struts
    ctx.fillStyle = '#100405';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, -36);
    ctx.lineTo(-44, -46);
    ctx.lineTo(-32, -18);
    ctx.closePath();
    ctx.fill();

    // Tattered membrane (shaded dark)
    ctx.fillStyle = '#22080a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, -36);
    ctx.lineTo(-44, -46);
    ctx.quadraticCurveTo(-40, -30, -32, -18);
    ctx.quadraticCurveTo(-26, -10, -18, -4);
    ctx.quadraticCurveTo(-10, 2, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ==========================================
    // 4. REAR & FRONT TALONS (Muscular legs & razor claws)
    // ==========================================
    // Back leg
    ctx.fillStyle = '#180709';
    ctx.fillRect(-16, 12, 10, 16);
    ctx.fillStyle = '#0a0203';
    ctx.fillRect(-18, 26, 14, 6);
    // Back talons
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-20, 30, 4, 3);
    ctx.fillRect(-15, 30, 4, 3);

    // ==========================================
    // 5. ARMORED TORSO & MOLTEN VOLCANIC CORE
    // ==========================================
    const torsoBreath = breathe * 1.5;

    // Muscular dark obsidian flank
    ctx.fillStyle = '#180709';
    ctx.beginPath();
    ctx.ellipse(0, 4, 26, 18 + torsoBreath * 0.3, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Segmented obsidian scale plates
    ctx.strokeStyle = '#2b0c10';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Molten Heart / Sternum Fissure (Glows hotter when charging fire breath)
    const coreGlow = 0.5 + Math.sin(time * 4) * 0.3 + fireChargeIntensity * 0.5;
    ctx.fillStyle = `rgba(249, 115, 22, ${Math.min(1, coreGlow)})`;
    ctx.beginPath();
    ctx.ellipse(4, 3, 11, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // White-hot inner core
    ctx.fillStyle = `rgba(254, 240, 138, ${Math.min(1, coreGlow * 1.2)})`;
    ctx.beginPath();
    ctx.ellipse(5, 3, 6, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Scorched rib scale plates covering core
    ctx.fillStyle = '#140507';
    ctx.fillRect(0, -2, 14, 2.5);
    ctx.fillRect(2, 2, 13, 2.5);
    ctx.fillRect(4, 6, 11, 2.5);

    // Dorsal Spines along spine
    const spines = [
        { x: -14, y: -8, h: 9, w: 5 },
        { x: -7, y: -11, h: 12, w: 6 },
        { x: 2, y: -13, h: 14, w: 7 },
        { x: 11, y: -12, h: 11, w: 6 }
    ];
    spines.forEach(sp => {
        ctx.fillStyle = '#0e0304';
        ctx.beginPath();
        ctx.moveTo(sp.x - sp.w / 2, sp.y + 2);
        ctx.lineTo(sp.x - 3, sp.y - sp.h);
        ctx.lineTo(sp.x + sp.w / 2, sp.y + 2);
        ctx.closePath();
        ctx.fill();
        // Lava edge highlight on spine
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(sp.x - 2, sp.y - sp.h + 2, 2, sp.h * 0.6);
    });

    // Front leg & razor claws
    ctx.fillStyle = '#1d080b';
    ctx.fillRect(6, 10, 11, 18);
    ctx.fillStyle = '#0e0304';
    ctx.fillRect(4, 26, 16, 6);
    // Front razor talons
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(2, 30, 4, 4);
    ctx.fillRect(8, 30, 4, 4);
    ctx.fillRect(14, 30, 4, 4);

    // ==========================================
    // 6. POWERFUL SERPENTINE NECK
    // ==========================================
    ctx.fillStyle = '#1c080b';
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.lineTo(24, -14);
    ctx.lineTo(32, -12);
    ctx.lineTo(20, 8);
    ctx.closePath();
    ctx.fill();

    // Throat magma channel (ignites on fire breath)
    ctx.strokeStyle = chargingFire ? '#fbbf24' : '#c2410c';
    ctx.lineWidth = chargingFire ? 3.5 : 2;
    ctx.beginPath();
    ctx.moveTo(14, 4);
    ctx.lineTo(24, -4);
    ctx.lineTo(34, -7);
    ctx.stroke();

    // ==========================================
    // 7. SINISTER DEMONIC DRAGON HEAD & HORNS
    // ==========================================
    const headBaseX = 30;
    const headBaseY = -15;

    // Throat fire glow leaking forward
    if (chargingFire) {
        ctx.fillStyle = `rgba(251, 191, 36, ${fireChargeIntensity * 0.9})`;
        ctx.beginPath();
        ctx.arc(headBaseX + 16, headBaseY + 7, 7 * fireChargeIntensity, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cranium & Snout (angular predatory crocodilian silhouette)
    ctx.fillStyle = '#180709';
    ctx.beginPath();
    ctx.moveTo(headBaseX - 4, headBaseY - 6);
    ctx.lineTo(headBaseX + 10, headBaseY - 9);
    ctx.lineTo(headBaseX + 22, headBaseY - 3); // Snout tip
    ctx.lineTo(headBaseX + 22, headBaseY + 2); // Upper lip
    ctx.lineTo(headBaseX + 8, headBaseY + 3);  // Corner of mouth
    ctx.lineTo(headBaseX - 4, headBaseY + 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#380d12';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lower Jaw (dropped in aggressive snarl)
    ctx.fillStyle = '#120406';
    ctx.beginPath();
    ctx.moveTo(headBaseX + 6, headBaseY + 4);
    ctx.lineTo(headBaseX + 21, headBaseY + 5);
    ctx.lineTo(headBaseX + 18, headBaseY + 11);
    ctx.lineTo(headBaseX + 3, headBaseY + 8);
    ctx.closePath();
    ctx.fill();

    // Needle-sharp fangs in upper and lower jaw
    ctx.fillStyle = '#f8fafc';
    // Upper fangs
    ctx.beginPath();
    ctx.moveTo(headBaseX + 11, headBaseY + 2); ctx.lineTo(headBaseX + 13, headBaseY + 6); ctx.lineTo(headBaseX + 14, headBaseY + 2);
    ctx.moveTo(headBaseX + 16, headBaseY + 1); ctx.lineTo(headBaseX + 18, headBaseY + 7); ctx.lineTo(headBaseX + 19, headBaseY + 1);
    ctx.fill();
    // Lower fangs
    ctx.beginPath();
    ctx.moveTo(headBaseX + 13, headBaseY + 5); ctx.lineTo(headBaseX + 14, headBaseY + 2); ctx.lineTo(headBaseX + 16, headBaseY + 5);
    ctx.moveTo(headBaseX + 18, headBaseY + 5); ctx.lineTo(headBaseX + 19, headBaseY + 2); ctx.lineTo(headBaseX + 20, headBaseY + 5);
    ctx.fill();

    // Glowing internal throat fire inside gaping jaw
    ctx.fillStyle = chargingFire ? '#fef08a' : '#ea580c';
    ctx.fillRect(headBaseX + 7, headBaseY + 3, 5, 3);

    // Heavy menacing brow ridge
    ctx.fillStyle = '#090203';
    ctx.fillRect(headBaseX + 4, headBaseY - 8, 12, 3);

    // Terrifying Ember Slit Eye
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(headBaseX + 6, headBaseY - 5);
    ctx.lineTo(headBaseX + 12, headBaseY - 6);
    ctx.lineTo(headBaseX + 15, headBaseY - 4);
    ctx.lineTo(headBaseX + 8, headBaseY - 3);
    ctx.closePath();
    ctx.fill();

    // Sulfur molten iris
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(headBaseX + 10, headBaseY - 4.5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Demonic vertical slit pupil
    ctx.fillStyle = '#000000';
    ctx.fillRect(headBaseX + 10, headBaseY - 6.5, 1.2, 4);

    // Nostril with smoke vent
    ctx.fillStyle = '#050102';
    ctx.fillRect(headBaseX + 18, headBaseY - 2, 2.5, 2);

    // SERRATED OBSIDIAN HORNS
    // Primary Horn (Long, sweeping back and upward with fiery tip)
    ctx.fillStyle = '#0c0304';
    ctx.beginPath();
    ctx.moveTo(headBaseX + 2, headBaseY - 6);
    ctx.quadraticCurveTo(headBaseX - 14, headBaseY - 18, headBaseX - 28, headBaseY - 24);
    ctx.lineTo(headBaseX - 22, headBaseY - 18);
    ctx.quadraticCurveTo(headBaseX - 10, headBaseY - 12, headBaseX, headBaseY - 3);
    ctx.closePath();
    ctx.fill();
    // Fiery volcanic horn ridge
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(headBaseX - 26, headBaseY - 23, 5, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(headBaseX - 28, headBaseY - 24, 2, 2);

    // Secondary Cheek & Chin Horns
    ctx.fillStyle = '#0c0304';
    ctx.beginPath();
    ctx.moveTo(headBaseX + 4, headBaseY + 1);
    ctx.lineTo(headBaseX - 8, headBaseY + 3);
    ctx.lineTo(headBaseX + 2, headBaseY + 5);
    ctx.closePath();
    ctx.fill();
    // Chin barb
    ctx.beginPath();
    ctx.moveTo(headBaseX + 10, headBaseY + 9);
    ctx.lineTo(headBaseX + 8, headBaseY + 16);
    ctx.lineTo(headBaseX + 14, headBaseY + 10);
    ctx.closePath();
    ctx.fill();

    // ==========================================
    // 8. FOREGROUND WING (Massive, tattered bat-wing)
    // ==========================================
    ctx.save();
    const fgWingFlap = wingCycle * 0.48;
    ctx.translate(6, -10);
    ctx.rotate(0.2 - fgWingFlap);

    // Main bone arm
    ctx.fillStyle = '#180608';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-18, -38);
    ctx.lineTo(-58, -48);
    ctx.lineTo(-44, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#380d12';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sharp bone spur at wing elbow joint
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-16, -38);
    ctx.lineTo(-24, -46);
    ctx.lineTo(-19, -36);
    ctx.closePath();
    ctx.fill();

    // Tattered, battle-worn leathery wing membrane
    ctx.fillStyle = '#330c10';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-18, -38);
    ctx.lineTo(-58, -48);
    // Scalloped ragged bat tears with needle tips
    ctx.quadraticCurveTo(-52, -32, -44, -20);
    ctx.lineTo(-42, -17);
    ctx.quadraticCurveTo(-36, -8, -26, -4);
    ctx.lineTo(-24, -2);
    ctx.quadraticCurveTo(-14, 5, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Skeletal finger rays across membrane
    ctx.strokeStyle = '#180608';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -38); ctx.lineTo(-44, -20);
    ctx.moveTo(-18, -38); ctx.lineTo(-26, -4);
    ctx.stroke();

    // Glowing magma vein tears on the wing
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-20, -32); ctx.lineTo(-34, -26);
    ctx.moveTo(-12, -20); ctx.lineTo(-22, -14);
    ctx.stroke();

    ctx.restore();

    ctx.restore(); // Restore facing flip and scale

    // ==========================================
    // 9. CLAW ATTACK TELEGRAPH OVERLAY
    // ==========================================
    if (mob.clawTimer && mob.clawTimer > 0) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const clawProgress = (18 - mob.clawTimer) / 18;
        const clawX = player.x + player.w / 2;
        const clawY = player.y + player.h / 2;

        for (let k = -1; k <= 1; k++) {
            ctx.beginPath();
            ctx.moveTo(clawX - 18 + k * 10, clawY - 20 + clawProgress * 15);
            ctx.lineTo(clawX - 6 + k * 10, clawY + 15 + clawProgress * 15);
            ctx.stroke();
            // Intense red claw flash
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(clawX - 18 + k * 10, clawY - 20 + clawProgress * 15);
            ctx.lineTo(clawX - 6 + k * 10, clawY + 15 + clawProgress * 15);
            ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
        }
        ctx.restore();
    }
}

function drawSlimeMob(ctx, mob, cx, cy, groundY, scaleX, scaleY, hopZ) {
    const rx = (mob.w / 2) * scaleX;
    const ry = (mob.h / 2) * scaleY;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, Math.max(4, (mob.w / 2 + 4) * (1.8 - scaleX * 0.7)), Math.max(2, 4.5 * (1.8 - scaleY * 0.7)), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mob.color;
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 3 - hopZ * 0.25, rx * 1.5, Math.max(3, ry * 0.35), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath(); ctx.ellipse(cx - rx * 1.7, groundY + 1, 5 * scaleX, 2.5 * scaleY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + rx * 1.6, groundY + 2, 6 * scaleX, 2.2 * scaleY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - rx * 1.2, groundY + 4, 4 * scaleX, 2 * scaleY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + rx * 1.2, groundY + 5, 4.5 * scaleX, 2.2 * scaleY, 0, 0, Math.PI * 2); ctx.fill();

    if (mob.type === 'boss') {
        const crownY = cy - ry - 8;
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(cx - 12, crownY - 6, 24, 5);
        ctx.fillRect(cx - 12, crownY - 11, 5, 5);
        ctx.fillRect(cx - 2, crownY - 14, 4, 8);
        ctx.fillRect(cx + 7, crownY - 11, 5, 5);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx - 1, crownY - 9, 2, 2);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 12, crownY - 6, 24, 5);
    }

    ctx.shadowColor = mob.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = mob.color;
    ctx.strokeStyle = '#142010';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(cx - rx * 1.2, cy + ry);
    ctx.bezierCurveTo(cx - rx * 1.1, cy - ry * 0.3, cx - rx * 0.75, cy - ry * 1.1, cx, cy - ry * 1.1);
    ctx.bezierCurveTo(cx + rx * 0.75, cy - ry * 1.1, cx + rx * 1.1, cy - ry * 0.3, cx + rx * 1.2, cy + ry);
    ctx.quadraticCurveTo(cx, cy + ry * 1.2, cx - rx * 1.2, cy + ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx + rx * 0.3, cy - ry * 0.6, rx * 0.32, ry * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath(); ctx.arc(cx - rx * 0.45, cy - ry * 0.4, 2.5 * scaleX, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + rx * 0.5, cy - ry * 0.1, 2.2 * scaleX, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - rx * 0.6, cy + ry * 0.3, 3.0 * scaleX, 0, Math.PI * 2); ctx.fill();

    const eyeY = cy - ry * 0.25;
    const eyeW = Math.max(3, rx * 0.28);
    const eyeH = Math.max(3, ry * 0.22);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - rx * 0.45, eyeY, eyeW, eyeH);
    ctx.fillStyle = '#1c2918';
    ctx.fillRect(cx - rx * 0.45, eyeY, eyeW, Math.max(1, eyeH * 0.45));

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + rx * 0.17, eyeY, eyeW, eyeH);
    ctx.fillStyle = '#1c2918';
    ctx.fillRect(cx + rx * 0.17, eyeY, eyeW, Math.max(1, eyeH * 0.45));

    const mouthY = cy + ry * 0.05;
    const mouthW = rx * 0.65;
    const mouthH = ry * 0.5;

    ctx.fillStyle = '#110b1a';
    ctx.beginPath();
    ctx.ellipse(cx, mouthY + mouthH / 2, mouthW / 2, mouthH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1c2918';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = mob.color;
    ctx.fillRect(cx - mouthW * 0.3, mouthY, 2.5, mouthH * 0.55);
    ctx.fillRect(cx, mouthY, 3, mouthH * 0.7);
    ctx.fillRect(cx + mouthW * 0.25, mouthY, 2.5, mouthH * 0.45);
}

function drawBossInvulnerableBarrier(ctx, mob, cx, cy) {
    ctx.save();
    const time = Date.now() * 0.005;
    const role = mob.alterEgoRole || 'knight';

    if (role === 'mage') {
        // Astral Cosmic Sphere Barrier
        const r = 38;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 22;

        const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
        grad.addColorStop(0.65, 'rgba(236, 72, 153, 0.25)');
        grad.addColorStop(1, 'rgba(192, 132, 252, 0.85)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Orbiting Astral Runes / Stars
        for (let i = 0; i < 4; i++) {
            const a = time * 2.2 + (Math.PI / 2) * i;
            const ox = cx + Math.cos(a) * (r + 4);
            const oy = cy + Math.sin(a) * (r + 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ox - 2.5, oy - 2.5, 5, 5);
            ctx.fillStyle = '#c084fc';
            ctx.fillRect(ox - 1.5, oy - 1.5, 3, 3);
        }

    } else if (role === 'knight') {
        // Dragon Aegis Dome Barrier
        const r = 40;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 24;

        const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, 'rgba(220, 38, 38, 0.15)');
        grad.addColorStop(0.65, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(1, 'rgba(251, 191, 36, 0.9)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.lineDashOffset = -(Date.now() * 0.02) % 12;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Rising Dragon flame sparks
        ctx.fillStyle = '#f59e0b';
        for (let s = 0; s < 4; s++) {
            const sa = time * 2.5 + s * 1.57;
            const sx = cx + Math.cos(sa) * (r - 2);
            const sy = cy + Math.sin(sa) * (r - 2);
            ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
    }
    ctx.restore();
}

function drawAlterEgoMob(ctx, mob, cx, cy, groundY) {
    ctx.save();

    // 1. Invisibility / Smoke stealth for Assassin
    if (mob.isInvisible) {
        ctx.globalAlpha = 0.18 + Math.sin(Date.now() * 0.015) * 0.08;
    }

    // 2. Swirling dark corrupted puddle/shadow under feet
    const pulse = Math.sin(Date.now() * 0.008) * 3;
    ctx.fillStyle = 'rgba(15, 5, 25, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, 20 + pulse, 6 + pulse * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Corrupted Crimson/Violet Boss Glow Outline
    const glowCol = (mob.alterEgoRole === 'mage') ? '#a855f7' : ((mob.alterEgoRole === 'assassin') ? '#10b981' : '#ef4444');
    ctx.shadowColor = glowCol;
    ctx.shadowBlur = 18;

    // 4. Render character model by temporarily adapting player context
    if (typeof player !== 'undefined' && typeof drawPlayerModel === 'function') {
        const savedProps = {
            x: player.x,
            y: player.y,
            w: player.w,
            h: player.h,
            facing: player.facing,
            characterRole: player.characterRole,
            equipped: player.equipped,
            isAttacking: player.isAttacking,
            slashArcProgress: player.slashArcProgress
        };

        player.x = mob.x;
        player.y = mob.y;
        player.w = mob.w;
        player.h = mob.h;
        player.facing = mob.facing || 'left';
        player.characterRole = mob.alterEgoRole;
        player.equipped = mob.equipped;
        player.isAttacking = mob.isAttacking || false;
        player.slashArcProgress = mob.slashArcProgress || 0;

        // Draw the full Tier 4 Equipment character model & weapon
        drawPlayerModel(ctx, cx, cy);
        if (typeof drawEquippedWeapon === 'function') {
            drawEquippedWeapon(ctx, cx, cy);
        }
        if (mob.isAttacking && typeof drawSlashArc === 'function') {
            drawSlashArc(ctx, cx, cy);
        }

        // Restore player
        Object.assign(player, savedProps);
    }

    // 5. Glowing menacing eyes over helmet/visor (only if visible)
    if (!mob.isInvisible) {
        const eyeY = mob.y + 4;
        const isApex = (mob.isApexMirror || (typeof currentStage !== 'undefined' && currentStage >= 50));
        ctx.fillStyle = isApex ? '#22d3ee' : '#ff1744';
        ctx.shadowColor = isApex ? '#06b6d4' : '#ff1744';
        ctx.shadowBlur = isApex ? 14 : 8;
        if (mob.facing === 'left') {
            ctx.fillRect(cx - 6, eyeY, 2.5, 2);
            ctx.fillRect(cx - 2, eyeY, 2.5, 2);
        } else if (mob.facing === 'right') {
            ctx.fillRect(cx - 1, eyeY, 2.5, 2);
            ctx.fillRect(cx + 3, eyeY, 2.5, 2);
        } else {
            ctx.fillRect(cx - 4, eyeY, 2.5, 2);
            ctx.fillRect(cx + 1, eyeY, 2.5, 2);
        }
    }

    // 6. Knight Frontal Guard Shield Indicator
    if (mob.isShieldGuarding && !mob.isInvulnerable && typeof getFacingAngle === 'function') {
        ctx.save();
        const fa = getFacingAngle(mob.facing || 'left');
        const gx = cx + Math.cos(fa) * 18;
        const gy = cy + Math.sin(fa) * 18;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 24, fa - 0.55, fa + 0.55);
        ctx.stroke();

        ctx.font = '10px sans-serif';
        ctx.fillText('🛡️', gx - 5, gy + 4);
        ctx.restore();
    }

    // 7. Invulnerable Barrier Spheres (Mage Astral Barrier & Knight Dragon Dome)
    if (mob.isInvulnerable) {
        drawBossInvulnerableBarrier(ctx, mob, cx, cy);
    }

    ctx.restore();
}

// --- MINECRAFT-THEMED THE WARDEN BOSS RENDERING ---
function drawWardenMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.005 + mob.id;
    const breathe = Math.sin(time * 2.5) * 2;
    const heartbeat = Math.sin(time * 6); // Fast acoustic heartbeat
    const heartPulse = heartbeat > 0.4 ? 1.0 : 0.4;

    ctx.save();

    // 1. Heavy shadow on ground
    ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, mob.w * 0.58, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Muscular deepslate legs
    ctx.fillStyle = '#06131f';
    ctx.fillRect(cx - 16, cy + 12, 12, 18);
    ctx.fillRect(cx + 4, cy + 12, 12, 18);
    // Sculk patches on hooves/feet
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 18, cy + 24, 14, 6);
    ctx.fillRect(cx + 4, cy + 24, 14, 6);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(cx - 16, cy + 27, 4, 3);
    ctx.fillRect(cx + 12, cy + 27, 4, 3);

    // 3. Torso (Massive deepslate body)
    const torsoY = cy - 14 + breathe * 0.4;
    ctx.fillStyle = '#071626';
    ctx.fillRect(cx - 22, torsoY, 44, 28);
    ctx.fillStyle = '#030b14';
    ctx.fillRect(cx - 20, torsoY + 2, 40, 24);

    // 4. Exposed Rib Cage with Beating Sculk Soul Heart
    const ribY = torsoY + 4;
    ctx.fillStyle = `rgba(6, 182, 212, ${heartPulse * 0.85})`;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 16 * heartPulse;
    // Glowing soul center inside chest
    ctx.fillRect(cx - 8, ribY + 2, 16, 12);
    ctx.fillStyle = '#ecfeff';
    ctx.fillRect(cx - 4, ribY + 4, 8, 7);

    // Deepslate Ribs over the heart
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(cx - 12, ribY, 24, 2);
    ctx.fillRect(cx - 11, ribY + 4, 22, 2);
    ctx.fillRect(cx - 10, ribY + 8, 20, 2);
    ctx.fillRect(cx - 8, ribY + 12, 16, 2);

    // 5. Massive Muscular Arms & Sculk Claws
    const armWobble = Math.sin(time * 3) * 3;
    // Left arm
    ctx.fillStyle = '#071626';
    ctx.fillRect(cx - 30, torsoY + 2 + armWobble, 10, 24);
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 32, torsoY + 20 + armWobble, 12, 10);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(cx - 32, torsoY + 28 + armWobble, 3, 4);
    ctx.fillRect(cx - 27, torsoY + 29 + armWobble, 3, 4);

    // Right arm
    ctx.fillStyle = '#071626';
    ctx.fillRect(cx + 20, torsoY + 2 - armWobble, 10, 24);
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx + 20, torsoY + 20 - armWobble, 12, 10);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(cx + 24, torsoY + 29 - armWobble, 3, 4);
    ctx.fillRect(cx + 29, torsoY + 28 - armWobble, 3, 4);

    // 6. Warden Head (Eyeless, terrifying sculk mouth)
    const headY = torsoY - 20;
    ctx.fillStyle = '#0a1d30';
    ctx.fillRect(cx - 16, headY, 32, 20);
    ctx.fillStyle = '#040e1a';
    ctx.fillRect(cx - 14, headY + 2, 28, 16);

    // Terrifying toothy mouth cavity
    ctx.fillStyle = '#020617';
    ctx.fillRect(cx - 10, headY + 8, 20, 8);
    // Sculk teeth
    ctx.fillStyle = '#06b6d4';
    for (let t = -8; t <= 6; t += 4) {
        ctx.fillRect(cx + t, headY + 8, 2, 3);
        ctx.fillRect(cx + t, headY + 13, 2, 3);
    }

    // 7. Resonating Sculk Horns / Antennae
    const hornVibe = Math.sin(time * 12) * 1.5;
    ctx.fillStyle = '#071d2e';
    // Left horn
    ctx.fillRect(cx - 24 + hornVibe, headY - 8, 8, 12);
    ctx.fillRect(cx - 28 + hornVibe, headY - 14, 6, 8);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillRect(cx - 30 + hornVibe, headY - 18, 4, 6);

    // Right horn
    ctx.fillStyle = '#071d2e';
    ctx.shadowBlur = 0;
    ctx.fillRect(cx + 16 - hornVibe, headY - 8, 8, 12);
    ctx.fillRect(cx + 22 - hornVibe, headY - 14, 6, 8);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillRect(cx + 26 - hornVibe, headY - 18, 4, 6);

    // 8. Invulnerable Barrier Spheres if channeling
    if (mob.isInvulnerable) {
        ctx.save();
        const r = 46;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 24;
        const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        grad.addColorStop(0.7, 'rgba(8, 145, 178, 0.35)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0.9)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    ctx.restore();
}

// --- SCULK CRAWLER MOB ---
function drawSculkCrawlerMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.01 + mob.id;
    const legWalk = Math.sin(time * 4) * 3;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6 Skittering Sculk Legs
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(cx - 14 + legWalk, cy - 2, 4, 8);
    ctx.fillRect(cx - 12 - legWalk, cy + 4, 4, 8);
    ctx.fillRect(cx + 10 - legWalk, cy - 2, 4, 8);
    ctx.fillRect(cx + 8 + legWalk, cy + 4, 4, 8);

    // Dark Sculk Carapace Body
    ctx.fillStyle = '#040d18';
    ctx.fillRect(cx - 10, cy - 6, 20, 12);
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 7, cy - 4, 14, 8);

    // Glowing cyan sensor eyes
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.fillRect(cx - 6, cy - 3, 3, 2.5);
    ctx.fillRect(cx + 3, cy - 3, 3, 2.5);

    ctx.restore();
}

// --- SCULK ZOMBIE MOB ---
function drawSculkZombieMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.008 + mob.id;
    const wobble = Math.sin(time) * 2;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, mob.w * 0.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deepslate legs
    ctx.fillStyle = '#06131f';
    ctx.fillRect(cx - 6, cy + 4, 5, 10);
    ctx.fillRect(cx + 1, cy + 4, 5, 10);

    // Sculk moss torso
    ctx.fillStyle = '#071d2e';
    ctx.fillRect(cx - 8 + wobble * 0.5, cy - 8, 16, 13);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(cx - 3 + wobble * 0.5, cy - 4, 6, 5);

    // Arms
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 14 + wobble, cy - 4, 8, 4);
    ctx.fillRect(cx + 6 + wobble, cy - 4, 8, 4);

    // Head
    const headY = cy - 18;
    ctx.fillStyle = '#071626';
    ctx.fillRect(cx - 7, headY, 14, 11);
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 7, headY, 14, 3);

    // Glowing Sculk Eye
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.fillRect(cx - 4, headY + 5, 3, 2);
    ctx.fillRect(cx + 2, headY + 5, 3, 2);

    if (mob.type === 'boss') {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(cx - 8, headY - 5, 16, 4);
    }

    ctx.restore();
}

// --- SCULK PHANTOM MOB ---
function drawSculkPhantomMob(ctx, mob, cx, cy, groundY) {
    const time = Date.now() * 0.01 + mob.id;
    const flap = Math.sin(time * 3) * 6;
    const hoverY = Math.sin(time * 2) * 5;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - 2, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const py = cy + hoverY;

    // Translucent Sculk Wings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.beginPath();
    ctx.moveTo(cx, py);
    ctx.lineTo(cx - 18, py - 8 + flap);
    ctx.lineTo(cx - 6, py + 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, py);
    ctx.lineTo(cx + 18, py - 8 + flap);
    ctx.lineTo(cx + 6, py + 4);
    ctx.closePath();
    ctx.fill();

    // Dark sleek phantom spine
    ctx.fillStyle = '#040d18';
    ctx.fillRect(cx - 4, py - 6, 8, 14);
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(cx - 2, py - 4, 4, 10);

    // Glowing cyan eyes
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.fillRect(cx - 3, py - 5, 2, 2);
    ctx.fillRect(cx + 1, py - 5, 2, 2);

    ctx.restore();
}

function drawAllMobs(ctx) {
    mobs.forEach(mob => {
        const hopTimer = mob.hopTimer || 0;
        const bounceSin = Math.sin(hopTimer);
        const isAirborne = bounceSin > 0.2;
        const maxHop = mob.type === 'boss' ? 14 : 10;
        const hopZ = mob.species === 'slime' ? Math.max(0, bounceSin) * maxHop : 0;

        let scaleX = 1.0;
        let scaleY = 1.0;

        if (isAirborne) {
            scaleX = 0.82;
            scaleY = 1.22;
        } else {
            scaleX = 1.28;
            scaleY = 0.72;
        }

        const cx = mob.x + mob.w / 2;
        const groundY = mob.y + mob.h;
        const cy = mob.y + mob.h / 2 - hopZ;
        const rx = (mob.w / 2) * scaleX;
        const ry = (mob.h / 2) * scaleY;

        if (mob.species === 'alter_ego') {
            drawAlterEgoMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'warden') {
            drawWardenMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'sculk_crawler') {
            drawSculkCrawlerMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'sculk_zombie') {
            drawSculkZombieMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'sculk_phantom') {
            drawSculkPhantomMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'zombie') {
            drawZombieMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'skeleton' || mob.species === 'sculk_spitter') {
            drawSkeletonMob(ctx, mob, cx, cy, groundY);
        } else if (mob.species === 'dragon') {
            drawDragonMob(ctx, mob, cx, cy, groundY);
        } else {
            drawSlimeMob(ctx, mob, cx, cy, groundY, scaleX, scaleY, hopZ);
        }

        // Level badge & health bar
        const barY = cy - (mob.species === 'slime' ? ry * 1.2 : mob.h * 0.5) - 16;
        const levelText = mob.level || `Lv.${currentStage}`;
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';

        const textW = ctx.measureText(levelText).width;
        const pillW = Math.max(mob.w + 6, textW + 8);
        const pillX = cx - pillW / 2;

        ctx.fillStyle = 'rgba(10, 14, 23, 0.88)';
        ctx.fillRect(pillX, barY - 10, pillW, 11);

        let borderCol = mob.color || '#2ecc71';
        if (mob.species === 'alter_ego') borderCol = (mob.isApexMirror || currentStage >= 50) ? '#06b6d4' : '#f43f5e';
        else if (mob.species === 'warden') borderCol = '#06b6d4';
        else if (mob.type === 'boss') borderCol = '#f1c40f';

        ctx.strokeStyle = borderCol;
        ctx.lineWidth = (mob.species === 'alter_ego' || mob.species === 'warden') ? 1.5 : 1;
        ctx.strokeRect(pillX, barY - 10, pillW, 11);

        if (mob.species === 'alter_ego') ctx.fillStyle = (mob.isApexMirror || currentStage >= 50) ? '#22d3ee' : '#f43f5e';
        else if (mob.species === 'warden') ctx.fillStyle = '#22d3ee';
        else if (mob.type === 'boss') ctx.fillStyle = '#f1c40f';
        else if (mob.species === 'sculk_crawler' || mob.species === 'sculk_phantom') ctx.fillStyle = '#06b6d4';
        else if (mob.species === 'zombie' || mob.species === 'sculk_zombie') ctx.fillStyle = '#52b788';
        else if (mob.species === 'skeleton' || mob.species === 'sculk_spitter') ctx.fillStyle = '#f8fafc';
        else if (mob.color === '#2ecc71') ctx.fillStyle = '#2ecc71';
        else if (mob.color === '#3498db') ctx.fillStyle = '#00e5ff';
        else ctx.fillStyle = '#c084fc';

        ctx.fillText(levelText, cx, barY - 2);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - pillW / 2, barY + 2, pillW, 5);
        ctx.fillStyle = (mob.species === 'warden') ? '#06b6d4' : (mob.color || '#2ecc71');
        ctx.fillRect(cx - pillW / 2, barY + 2, pillW * Math.max(0, mob.hp / mob.maxHp), 5);
        if (mob.shield && mob.shield > 0) {
            ctx.fillStyle = '#00e5ff';
            ctx.fillRect(cx - pillW / 2, barY + 2, pillW * Math.min(1, mob.shield / mob.maxShield), 2.5);
        }
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(cx - pillW / 2, barY + 2, pillW, 5);

        ctx.textAlign = 'left';
    });
}
