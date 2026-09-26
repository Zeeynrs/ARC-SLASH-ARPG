// --- HUD & OVERLAY DRAWING (ARCADE RETRO 16-BIT DARK FANTASY) ---
// Designed under antislop-ui guidelines: matte stone surfaces, crisp typography,
// solid color hierarchy, zero artificial glow, and tactile retro feedback.

function drawTopHUD() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 1. Top HUD Chassis Bar
    ctx.fillStyle = '#0d121c';
    ctx.fillRect(0, 0, canvas.width, 46);
    ctx.fillStyle = '#243044';
    ctx.fillRect(0, 44, canvas.width, 2);

    // 2. HP Bar (Forged Iron & Vitality Crimson)
    ctx.fillStyle = '#111622';
    ctx.fillRect(10, 6, 125, 15);
    ctx.strokeStyle = '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 6, 125, 15);

    const hpRatio = Math.max(0, Math.min(1, player.hp / player.maxHp));
    if (hpRatio > 0) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(12, 8, 121 * hpRatio, 11);
        // Subtle top bevel highlight
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(12, 8, 121 * hpRatio, 3);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '7.5px "Press Start 2P", monospace';
    ctx.fillText(`HP ${Math.ceil(player.hp)}/${player.maxHp}`, 16, 17);

    // 3. ARMOR Bar (Forged Iron & Mana Cobalt)
    ctx.fillStyle = '#111622';
    ctx.fillRect(10, 24, 125, 15);
    ctx.strokeStyle = '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 24, 125, 15);

    const shieldRatio = Math.max(0, Math.min(1, player.shield / player.maxShield));
    if (shieldRatio > 0) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(12, 26, 121 * shieldRatio, 11);
        // Subtle top bevel highlight
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(12, 26, 121 * shieldRatio, 3);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '7.5px "Press Start 2P", monospace';
    ctx.fillText(`ARMOR ${Math.ceil(player.shield)}/${player.maxShield}`, 16, 35);

    // i-Frame Visual Aura / Indicator in Top HUD
    if (player.iFrames > 0) {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.strokeRect(9, 5, 127, 35);
        ctx.fillStyle = '#22d3ee';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(`iF:${player.iFrames}`, 94, 20);
    }

    // 4. STAGE TITLE PANEL
    const currentStageObj = STAGE_CONFIGS[Math.min(currentStage - 1, STAGE_CONFIGS.length - 1)];
    const stageName = currentStageObj ? currentStageObj.name : `CAVE DEPTH ${currentStage}`;

    ctx.fillStyle = '#111622';
    ctx.fillRect(142, 8, 160, 31);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(142, 8, 160, 31);

    ctx.fillStyle = '#facc15';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`STAGE ${currentStage}`, 222, 21, 150);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(stageName, 222, 33, 150);
    ctx.textAlign = 'left';

    // 5. COINS & SCORE PANEL
    ctx.fillStyle = '#111622';
    ctx.fillRect(308, 8, 80, 31);
    ctx.strokeStyle = '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(308, 8, 80, 31);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`🪙 ${player.gold}`, 312, 20, 72);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText(`P:${score}`, 312, 33, 72);

    // 6. ATTACK STATS PANEL
    const currentAtk = (typeof getPlayerDamage === 'function') ? getPlayerDamage() : (player.baseDamage || 0);
    const stgBonus = Math.round(((typeof currentStage !== 'undefined' ? currentStage : 1) - 1) * 1.5);

    ctx.fillStyle = '#111622';
    ctx.fillRect(394, 8, 76, 31);
    ctx.strokeStyle = '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(394, 8, 76, 31);

    ctx.fillStyle = '#f87171';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`ATK ${currentAtk}`, 398, 20, 68);

    ctx.fillStyle = stgBonus > 0 ? '#4ade80' : '#64748b';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(stgBonus > 0 ? `+${stgBonus} STG` : 'BASE', 398, 33, 68);

    // 7. TICK RATE BADGE (Desktop: Click to cycle; Press T)
    const tpsX = 476;
    const tpsY = 8;
    const tpsW = 48;
    const tpsH = 31;
    const isTpsHover = isHovering(tpsX, tpsY, tpsW, tpsH);
    ctx.fillStyle = isTpsHover ? '#1e293b' : '#111622';
    ctx.fillRect(tpsX, tpsY, tpsW, tpsH);
    ctx.strokeStyle = isTpsHover ? '#38bdf8' : '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tpsX, tpsY, tpsW, tpsH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '5.5px "Press Start 2P", monospace';
    ctx.fillText('RATE', tpsX + tpsW / 2, tpsY + 11);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '7px "Press Start 2P", monospace';
    const rateText = (typeof targetTickRate !== 'undefined' ? targetTickRate : 60) + 'T';
    ctx.fillText(rateText, tpsX + tpsW / 2, tpsY + 24);
    ctx.textAlign = 'left';

    // 8. ART STYLE BADGE (Desktop: Click to toggle; Press O)
    const artX = 528;
    const artY = 8;
    const artW = 44;
    const artH = 31;
    const isArtHover = isHovering(artX, artY, artW, artH);
    ctx.fillStyle = isArtHover ? '#1e293b' : '#111622';
    ctx.fillRect(artX, artY, artW, artH);
    ctx.strokeStyle = isArtHover ? '#fbbf24' : '#2d3b52';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(artX, artY, artW, artH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '5.5px "Press Start 2P", monospace';
    ctx.fillText('ART', artX + artW / 2, artY + 11);
    const isEnhanced = (typeof currentArtStyle !== 'undefined' && currentArtStyle === 'enhanced');
    ctx.fillStyle = isEnhanced ? '#fbbf24' : '#94a3b8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(isEnhanced ? 'HD' : 'RET', artX + artW / 2, artY + 24);
    ctx.textAlign = 'left';

    // 9. PAUSE BUTTON & 10. AUDIO BUTTON (Desktop only; mobile uses dedicated bar)
    const isMobileHUD = (typeof isMobileControlsActive === 'function' && isMobileControlsActive());
    if (!isMobileHUD) {
        const pauseBtnX = 576;
        const pauseBtnY = 8;
        const pauseBtnW = 26;
        const pauseBtnH = 31;
        const isPauseHover = isHovering(pauseBtnX, pauseBtnY, pauseBtnW, pauseBtnH);

        ctx.fillStyle = isPauseHover ? '#273449' : '#151d2c';
        ctx.fillRect(pauseBtnX, pauseBtnY, pauseBtnW, pauseBtnH);
        ctx.strokeStyle = isPauseHover ? '#64748b' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pauseBtnX, pauseBtnY, pauseBtnW, pauseBtnH);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(gameState === 'PAUSED' ? '▶' : '||', pauseBtnX + pauseBtnW / 2, pauseBtnY + 20);

        // 10. AUDIO BUTTON [SFX]
        const sndBtnX = 606;
        const sndBtnY = 8;
        const sndBtnW = 26;
        const sndBtnH = 31;
        const isSndHover = isHovering(sndBtnX, sndBtnY, sndBtnW, sndBtnH);

        ctx.fillStyle = isSndHover ? '#273449' : '#151d2c';
        ctx.fillRect(sndBtnX, sndBtnY, sndBtnW, sndBtnH);
        ctx.strokeStyle = isSndHover ? '#64748b' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sndBtnX, sndBtnY, sndBtnW, sndBtnH);

        ctx.fillStyle = soundEnabled ? '#4ade80' : '#94a3b8';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(soundEnabled ? 'SND' : 'MUT', sndBtnX + sndBtnW / 2, sndBtnY + 20);
        ctx.textAlign = 'left';
    }

    if (typeof drawAchievementToasts === 'function') {
        drawAchievementToasts(ctx);
    }
}

// --- TOP BOSS HEALTH BAR (HIGH-IMPACT SOLID RETRO DESIGN) ---
function drawBossBar(ctx) {
    if (gameState !== 'PLAYING') return;
    if (typeof mobs === 'undefined' || !mobs.length) return;

    // Prioritize active boss
    const boss = mobs.find(m => m.species === 'alter_ego') || mobs.find(m => m.species === 'warden') || mobs.find(m => m.species === 'dragon' || (m.type === 'boss' && m.hp > 0));
    if (!boss || boss.hp <= 0) return;

    const barW = 340;
    const barH = 12;
    const barX = (640 - barW) / 2;
    const barY = 60;

    // Solid Stone Chassis Frame
    ctx.fillStyle = '#0f1420';
    ctx.fillRect(barX - 6, barY - 14, barW + 12, barH + 20);
    ctx.strokeStyle = boss.isInvulnerable ? '#f59e0b' : '#2b384e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX - 6, barY - 14, barW + 12, barH + 20);

    // Title / Identity
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    let bossTitle = 'DUNGEON BOSS';
    let titleColor = '#f59e0b';
    let hpColor = '#b91c1c';
    let hpHighlight = '#ef4444';

    if (boss.species === 'warden') {
        bossTitle = 'THE WARDEN - ANCIENT TITAN';
        titleColor = '#22d3ee';
        hpColor = '#0891b2';
        hpHighlight = '#22d3ee';
    } else if (boss.species === 'alter_ego') {
        const isApex = boss.isApexMirror || (typeof currentStage !== 'undefined' && currentStage >= 50);
        const roleName = (boss.alterEgoRole || 'VOID').toUpperCase();
        bossTitle = isApex ? `APEX SCULK MIRROR: ${boss.title || roleName}` : `ALTER EGO: ${boss.title || roleName}`;
        titleColor = isApex ? '#67e8f9' : '#fb7185';
        hpColor = isApex ? '#0e7490' : '#be123c';
        hpHighlight = isApex ? '#06b6d4' : '#f43f5e';
    } else if (boss.species === 'dragon') {
        bossTitle = 'ANCIENT DRAGON (STAGE 21 BOSS)';
        titleColor = '#fbbf24';
        hpColor = '#b45309';
        hpHighlight = '#f59e0b';
    }

    if (boss.isInvulnerable) {
        const timeLeft = boss.ultimateTimer ? (boss.ultimateTimer / 60).toFixed(1) : '';
        bossTitle = `[IMMUNE - ULTIMATE: ${timeLeft}s]`;
        titleColor = '#facc15';
    }

    ctx.fillStyle = titleColor;
    ctx.fillText(bossTitle, 640 / 2, barY - 3, barW);

    // HP Bar Track
    ctx.fillStyle = '#161c28';
    ctx.fillRect(barX, barY, barW, barH);

    // HP Fill
    const hpRatio = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
    if (hpRatio > 0) {
        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barW * hpRatio, barH);
        ctx.fillStyle = hpHighlight;
        ctx.fillRect(barX, barY, barW * hpRatio, 3);
    }

    // Shield Bar (Mana Cyan bottom line)
    if (boss.shield && boss.maxShield && boss.shield > 0) {
        const shieldRatio = Math.max(0, Math.min(1, boss.shield / boss.maxShield));
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(barX, barY + barH - 3, barW * shieldRatio, 3);
    }

    // Border
    ctx.strokeStyle = '#37455d';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Numbers & Tags
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P", monospace';
    const shieldStr = (boss.shield && boss.shield > 0) ? ` | SHIELD ${Math.ceil(boss.shield)}` : '';
    ctx.fillText(`${Math.max(0, Math.ceil(boss.hp))} / ${boss.maxHp} HP${shieldStr}`, 640 / 2, barY + 9, barW - 10);
    ctx.textAlign = 'left';
}

// --- SKILL HOTBAR & SHOP PROMPT ---
function drawSkillHUD(ctx, canvas) {
    // When on-screen mobile controls are active, the physical touch buttons handle skills with cooldown overlays.
    // Suppress drawing redundant in-canvas bottom-left boxes under the D-pad!
    if (typeof isMobileControlsActive === 'function' && isMobileControlsActive()) {
        return;
    }

    const startX = 10;
    const startY = canvas.height - 44;
    const slotW = 38;
    const slotH = 34;
    const gap = 5;

    for (let i = 0; i < skillSlots.length; i++) {
        const slot = skillSlots[i];
        const skill = getSkillData(i);
        if (!skill) continue;

        const x = startX + i * (slotW + gap);
        const unlocked = isSkillUnlocked(i);
        const onCooldown = slot.cooldownTimer > 0;

        // Slot Chassis
        ctx.fillStyle = unlocked ? '#111622' : '#0a0d14';
        ctx.fillRect(x, startY, slotW, slotH);

        // Cooldown Swipe
        if (onCooldown && unlocked) {
            const ratio = slot.cooldownTimer / skill.cooldown;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x, startY, slotW, slotH * ratio);
        }

        ctx.strokeStyle = unlocked ? (onCooldown ? '#3b4861' : skill.color) : '#1e2638';
        ctx.lineWidth = unlocked && !onCooldown ? 1.5 : 1;
        ctx.strokeRect(x, startY, slotW, slotH);

        // Skill Icon
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = unlocked ? '#fff' : '#4a5568';
        ctx.fillText(skill.icon, x + slotW / 2, startY + 18);

        // Keybind Pill [1], [2], [3]
        ctx.fillStyle = '#1c2433';
        ctx.fillRect(x + slotW / 2 - 8, startY + slotH - 10, 16, 9);
        ctx.strokeStyle = '#3b4861';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + slotW / 2 - 8, startY + slotH - 10, 16, 9);

        ctx.font = '6.5px "Press Start 2P", monospace';
        ctx.fillStyle = unlocked ? '#e2e8f0' : '#475569';
        ctx.fillText(`${i + 1}`, x + slotW / 2, startY + slotH - 3);

        // Remaining Cooldown Seconds
        if (onCooldown && unlocked) {
            ctx.font = '7.5px "Press Start 2P", monospace';
            ctx.fillStyle = '#f59e0b';
            const secs = Math.ceil(slot.cooldownTimer / 60);
            ctx.fillText(`${secs}s`, x + slotW / 2, startY + 14);
        }

        // Lock Badge
        if (!unlocked) {
            ctx.fillStyle = '#dc2626';
            ctx.font = '6px "Press Start 2P", monospace';
            ctx.fillText(`LV.${skill.unlockStage}`, x + slotW / 2, startY + 14);
        }

        ctx.textAlign = 'left';
    }

    // Shop Prompt when Dungeon Gate is Open (Suppress on mobile; mobile top utility bar handles SHOP button cleanly)
    if (dungeonGate.open && gameState === 'PLAYING') {
        if (typeof isMobileControlsActive === 'function' && isMobileControlsActive()) {
            return;
        }
        const btnX = canvas.width - 120;
        const btnY = canvas.height - 30;
        const btnW = 110;
        const btnH = 22;

        ctx.fillStyle = '#111622';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#facc15';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[B] SHOP', btnX + btnW / 2, btnY + 15);
        ctx.textAlign = 'left';
    }
}

// --- HELPER: 5-SEGMENT RETRO STAT PIPS ---
function drawStatPips(ctx, label, pips, maxPips, x, y, activeColor) {
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(label, x, y + 6);

    const pipW = 7;
    const pipH = 6;
    const pipGap = 3;
    const startPipX = x + 34;

    for (let p = 0; p < maxPips; p++) {
        const px = startPipX + p * (pipW + pipGap);
        const isFilled = p < pips;

        ctx.fillStyle = isFilled ? activeColor : '#182030';
        ctx.fillRect(px, y, pipW, pipH);
        ctx.strokeStyle = isFilled ? '#f8fafc' : '#2b3648';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, y, pipW, pipH);
    }
}

// --- MAIN MENU OVERLAY (TITLE, PLAY, ACHIEVEMENTS, GUIDE) ---
function drawMainMenuOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Deep dark stone backdrop
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative subtle stone border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Ambient Torch embers / mini avatars showcase
    const time = Date.now() * 0.004;

    // Mini decorative hero sprites standing on pedestals
    drawMiniCharacterAvatar(ctx, 'knight', 95, 200, time);
    drawMiniCharacterAvatar(ctx, 'mage', canvas.width - 95, 200, time + 1.2);
    drawMiniCharacterAvatar(ctx, 'assassin', 95, 290, time + 2.4);

    // Epic Main Title Banner
    ctx.textAlign = 'center';

    // Game Title Shadow & Text
    ctx.fillStyle = '#78350f';
    ctx.font = '22px "Press Start 2P", monospace';
    ctx.fillText('ARC SLASH ARPG', canvas.width / 2 + 2, 46 + 2);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('ARC SLASH ARPG', canvas.width / 2, 46);

    // Subtitle
    ctx.fillStyle = '#38bdf8';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('SLIME DUNGEON LABYRINTH', canvas.width / 2, 66);

    ctx.fillStyle = '#64748b';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('50 FLOORS OF DUNGEON PERIL & HEROIC GLORY', canvas.width / 2, 80);

    // Button Geometry
    const btnW = 230;
    const btnH = 32;
    const btnX = (canvas.width - btnW) / 2;

    // Button 1: PLAY GAME
    const btn1Y = 92;
    const h1 = isHovering(btnX, btn1Y, btnW, btnH);
    ctx.fillStyle = h1 ? '#16a34a' : '#15803d';
    ctx.fillRect(btnX, btn1Y, btnW, btnH);
    ctx.strokeStyle = h1 ? '#86efac' : '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn1Y, btnW, btnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('▶ PLAY GAME [1]', canvas.width / 2, btn1Y + 21);

    // Button 2: ACHIEVEMENTS
    const btn2Y = 129;
    const h2 = isHovering(btnX, btn2Y, btnW, btnH);
    ctx.fillStyle = h2 ? '#b45309' : '#92400e';
    ctx.fillRect(btnX, btn2Y, btnW, btnH);
    ctx.strokeStyle = h2 ? '#fde047' : '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn2Y, btnW, btnH);

    const unlocked = (typeof achievementTracker !== 'undefined') ? achievementTracker.getUnlockedCount() : 0;
    const total = (typeof achievementTracker !== 'undefined') ? achievementTracker.getTotalCount() : 18;
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText(`🏆 PENCAPAIAN [2] (${unlocked}/${total})`, canvas.width / 2, btn2Y + 21);

    // Button 3: HOW TO PLAY
    const btn3Y = 166;
    const h3 = isHovering(btnX, btn3Y, btnW, btnH);
    ctx.fillStyle = h3 ? '#2563eb' : '#1e40af';
    ctx.fillRect(btnX, btn3Y, btnW, btnH);
    ctx.strokeStyle = h3 ? '#93c5fd' : '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn3Y, btnW, btnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('📖 CARA MAIN [3]', canvas.width / 2, btn3Y + 21);

    // Button 4: ATUR TOMBOL / KEYBINDS
    const btn4Y = 203;
    const h4 = isHovering(btnX, btn4Y, btnW, btnH);
    ctx.fillStyle = h4 ? '#475569' : '#334155';
    ctx.fillRect(btnX, btn4Y, btnW, btnH);
    ctx.strokeStyle = h4 ? '#cbd5e1' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn4Y, btnW, btnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('⌨️ ATUR TOMBOL [4]', canvas.width / 2, btn4Y + 21);

    // Summary Stat Banner
    const statBoxY = 244;
    ctx.fillStyle = '#111622';
    ctx.fillRect(btnX - 40, statBoxY, btnW + 80, 44);
    ctx.strokeStyle = '#27354a';
    ctx.lineWidth = 1;
    ctx.strokeRect(btnX - 40, statBoxY, btnW + 80, 44);

    const stats = (typeof achievementTracker !== 'undefined' && achievementTracker.stats) ? achievementTracker.stats : {};
    const bestFloor = stats.maxStageReached || 1;
    const kills = stats.totalKills || 0;
    const gold = stats.totalGoldCollected || 0;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('CATATAN PETUALANG:', canvas.width / 2, statBoxY + 16);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`FLOOR: ${bestFloor}  |  KILLS: ${kills}  |  GOLD: ${gold} 🪙`, canvas.width / 2, statBoxY + 33);

    // Bottom Navigation Hint
    ctx.fillStyle = '#64748b';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('Pilih: Klik tombol atau tekan [1] / [2] / [3] / [4] / [ENTER]', canvas.width / 2, 308);
    ctx.fillText('Gaya Visual: [O] | Tick Rate: [T] | Info: Retro 16-Bit', canvas.width / 2, 324);
    ctx.fillText('Move: WASD | Attack: J / Space | Dash: Shift/K | Shop: B', canvas.width / 2, 340);

    ctx.textAlign = 'left';
}

// --- CHARACTER SELECTION MENU OVERLAY ---
function drawMenuOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Solid dark stone backdrop
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText('ARC SLASH ARPG', canvas.width / 2, 34);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '7.5px "Press Start 2P", monospace';
    ctx.fillText('CHOOSE YOUR HERO & COMBAT PATH', canvas.width / 2, 52);

    // 3 Character Pedestal Cards
    const roles = ['knight', 'mage', 'assassin'];
    const cardW = 186;
    const cardH = 212;
    const cardY = 64;
    const gap = 14;
    const totalW = 3 * cardW + 2 * gap;
    const startX = (canvas.width - totalW) / 2;

    const time = Date.now() * 0.005;

    for (let i = 0; i < roles.length; i++) {
        const roleKey = roles[i];
        const roleData = CHARACTER_ROLES[roleKey];
        const cx = startX + i * (cardW + gap);
        const isSelected = (selectedRole === roleKey);
        const hovered = isHovering(cx, cardY, cardW, cardH);

        // Stone Card Chassis
        ctx.fillStyle = isSelected ? '#162032' : (hovered ? '#141a27' : '#10141e');
        ctx.fillRect(cx, cardY, cardW, cardH);

        ctx.strokeStyle = isSelected ? '#f59e0b' : (hovered ? roleData.color : '#253043');
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(cx, cardY, cardW, cardH);

        // Selected Status Badge
        if (isSelected) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(cx + cardW / 2 - 36, cardY - 7, 72, 14);
            ctx.fillStyle = '#090c12';
            ctx.font = '6.5px "Press Start 2P", monospace';
            ctx.fillText('ACTIVE', cx + cardW / 2, cardY + 3);
        }

        // Role Title
        ctx.fillStyle = roleData.color;
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillText(`${roleData.name.toUpperCase()}`, cx + cardW / 2, cardY + 22);

        ctx.fillStyle = '#64748b';
        ctx.font = '6.5px "Press Start 2P", monospace';
        ctx.fillText(roleData.title, cx + cardW / 2, cardY + 34);

        // Mini Avatar Preview on Pedestal
        drawMiniCharacterAvatar(ctx, roleKey, cx + cardW / 2, cardY + 70, time);

        // 5-Segment Stat Pips
        ctx.textAlign = 'left';
        const pipsHp = (roleKey === 'knight') ? 5 : ((roleKey === 'mage') ? 3 : 4);
        const pipsAtk = (roleKey === 'knight') ? 4 : ((roleKey === 'mage') ? 5 : 4);
        const pipsSpd = (roleKey === 'knight') ? 3 : ((roleKey === 'mage') ? 3 : 5);
        const pipsDef = (roleKey === 'knight') ? 5 : ((roleKey === 'mage') ? 2 : 3);

        drawStatPips(ctx, 'HP', pipsHp, 5, cx + 18, cardY + 110, '#ef4444');
        drawStatPips(ctx, 'ATK', pipsAtk, 5, cx + 18, cardY + 124, '#f59e0b');
        drawStatPips(ctx, 'SPD', pipsSpd, 5, cx + 18, cardY + 138, '#10b981');
        drawStatPips(ctx, 'DEF', pipsDef, 5, cx + 18, cardY + 152, '#38bdf8');

        // Concise Trait Description
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '6.5px "Press Start 2P", monospace';
        let descLine1 = '';
        let descLine2 = '';
        if (roleKey === 'knight') {
            descLine1 = 'Heavy armor & wide';
            descLine2 = 'sweeping arc slashes.';
        } else if (roleKey === 'mage') {
            descLine1 = 'Ranged arcane bolts &';
            descLine2 = 'bursting mana aura.';
        } else if (roleKey === 'assassin') {
            descLine1 = 'Rapid mobility dash &';
            descLine2 = 'dual critical blades.';
        }
        ctx.fillText(descLine1, cx + cardW / 2, cardY + 182, cardW - 12);
        ctx.fillText(descLine2, cx + cardW / 2, cardY + 196, cardW - 12);
    }

    // Two Buttons: Back [ESC] and Start Game [ENTER]
    const backBtnX = canvas.width / 2 - 200;
    const backBtnY = 286;
    const backBtnW = 160;
    const backBtnH = 42;
    const backHovered = isHovering(backBtnX, backBtnY, backBtnW, backBtnH);

    ctx.fillStyle = backHovered ? '#374151' : '#1f2937';
    ctx.fillRect(backBtnX, backBtnY, backBtnW, backBtnH);
    ctx.strokeStyle = backHovered ? '#9ca3af' : '#4b5563';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(backBtnX, backBtnY, backBtnW, backBtnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('◄ MENU [ESC]', backBtnX + backBtnW / 2, backBtnY + 26);

    // Start Button (Tactile 3D Bevel)
    const btnX = canvas.width / 2 - 20;
    const btnY = 286;
    const btnW = 220;
    const btnH = 42;
    const btnHovered = isHovering(btnX, btnY, btnW, btnH);

    ctx.fillStyle = btnHovered ? '#16a34a' : '#15803d';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = btnHovered ? '#86efac' : '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btnY, btnW, btnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9.5px "Press Start 2P", monospace';
    ctx.fillText('START GAME [ENTER]', btnX + btnW / 2, btnY + 26);

    // Controls hints at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('Pilih: Klik / [1][2][3] | Mulai: [SPACE] / [ENTER] | Kembali: [ESC]', canvas.width / 2, 348);
    ctx.fillText('Move: WASD | Attack: J / Space | Skills: 1,2,3 | Shop: B', canvas.width / 2, 364);
    ctx.textAlign = 'left';
}

// Mini Character Avatar for Menu Preview
function drawMiniCharacterAvatar(ctx, role, x, y, time) {
    const bob = Math.sin(time * 3) * 1.5;
    ctx.save();
    ctx.translate(x, y + bob);

    if (role === 'knight') {
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-8, -8, 16, 22);
        ctx.fillStyle = '#475569';
        ctx.fillRect(-6, -6, 12, 16);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-4, -4, 8, 8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, -9, 8, 3);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(0, -9, 3, 2);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-2, -13, 4, 4);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(8, -10, 3, 18);
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(-12, -2, 5, 10);
    } else if (role === 'mage') {
        ctx.fillStyle = '#4c1d95';
        ctx.fillRect(-7, -6, 14, 20);
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(-4, -4, 8, 14);
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.moveTo(-9, -7); ctx.lineTo(9, -7); ctx.lineTo(0, -18);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-1, -12, 2, 2);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(1, -6, 3, 2);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(8, -14, 2.5, 22);
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath(); ctx.arc(9, -15, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (role === 'assassin') {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(-7, -7, 14, 20);
        ctx.fillStyle = '#27272a';
        ctx.fillRect(-4, -4, 8, 14);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-4, 0, 8, 2);
        ctx.fillStyle = '#000000';
        ctx.fillRect(-5, -11, 10, 8);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, -8, 3, 1.5);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(8, -6, 2, 12);
        ctx.fillRect(-10, -4, 2, 10);
    }

    ctx.restore();
}

// --- PAUSE OVERLAY (CLEAN TACTILE ARCADE MENU) ---
function drawPauseOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(8, 10, 15, 0.94)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText('PAUSED', canvas.width / 2, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`STAGE ${currentStage} IN PROGRESS`, canvas.width / 2, 70);

    const btnW = 240;
    const btnH = 32;
    const btnX = (canvas.width - btnW) / 2;

    // Button 1: Resume
    const btn1Y = 86;
    const h1 = isHovering(btnX, btn1Y, btnW, btnH);
    ctx.fillStyle = h1 ? '#16a34a' : '#15803d';
    ctx.fillRect(btnX, btn1Y, btnW, btnH);
    ctx.strokeStyle = h1 ? '#86efac' : '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn1Y, btnW, btnH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('RESUME [ESC]', canvas.width / 2, btn1Y + 21);

    // Button 2: Restart Stage
    const btn2Y = 128;
    const h2 = isHovering(btnX, btn2Y, btnW, btnH);
    ctx.fillStyle = h2 ? '#d97706' : '#b45309';
    ctx.fillRect(btnX, btn2Y, btnW, btnH);
    ctx.strokeStyle = h2 ? '#fde047' : '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn2Y, btnW, btnH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('RESTART STAGE [R]', canvas.width / 2, btn2Y + 21);

    // Button 3: Keybinds / Controls
    const btn3Y = 171;
    const h3 = isHovering(btnX, btn3Y, btnW, btnH);
    ctx.fillStyle = h3 ? '#475569' : '#334155';
    ctx.fillRect(btnX, btn3Y, btnW, btnH);
    ctx.strokeStyle = h3 ? '#cbd5e1' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn3Y, btnW, btnH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('ATUR TOMBOL [K]', canvas.width / 2, btn3Y + 21);

    // Button 4: Achievements (y: 214..248, touches y=230 directly)
    const btn4Y = 214;
    const btn4H = 34;
    const h4 = isHovering(btnX, btn4Y, btnW, btn4H);
    ctx.fillStyle = h4 ? '#2563eb' : '#1e40af';
    ctx.fillRect(btnX, btn4Y, btnW, btn4H);
    ctx.strokeStyle = h4 ? '#93c5fd' : '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn4Y, btnW, btn4H);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('PENCAPAIAN [A]', canvas.width / 2, btn4Y + 22);

    // Settings Row: Art Style & Tick Rate (y: 258, h: 30)
    const halfW = 117;
    const artBtnX = btnX;
    const tpsBtnX = btnX + halfW + 6;
    const setY = 258;
    const setH = 30;

    // Art Style Toggle
    const isArtHov = isHovering(artBtnX, setY, halfW, setH);
    const isEnhanced = (typeof currentArtStyle !== 'undefined' && currentArtStyle === 'enhanced');
    ctx.fillStyle = isArtHov ? '#7c2d12' : '#451a03';
    ctx.fillRect(artBtnX, setY, halfW, setH);
    ctx.strokeStyle = isArtHov ? '#fbbf24' : '#b45309';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(artBtnX, setY, halfW, setH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`ART:${isEnhanced ? 'HD✨' : 'RET🕹️'} [O]`, artBtnX + halfW / 2, setY + 19);

    // Tick Rate Toggle
    const isTpsHov = isHovering(tpsBtnX, setY, halfW, setH);
    const tpsVal = (typeof targetTickRate !== 'undefined') ? targetTickRate : 60;
    ctx.fillStyle = isTpsHov ? '#065f46' : '#064e3b';
    ctx.fillRect(tpsBtnX, setY, halfW, setH);
    ctx.strokeStyle = isTpsHov ? '#34d399' : '#059669';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tpsBtnX, setY, halfW, setH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`RATE:${tpsVal}T [T]`, tpsBtnX + halfW / 2, setY + 19);

    // Button 6: Exit to Main Menu
    const btn6Y = 296;
    const h6 = isHovering(btnX, btn6Y, btnW, 30);
    ctx.fillStyle = h6 ? '#dc2626' : '#b91c1c';
    ctx.fillRect(btnX, btn6Y, btnW, 30);
    ctx.strokeStyle = h6 ? '#fca5a5' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btnX, btn6Y, btnW, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('EXIT TO MENU [Q]', canvas.width / 2, btn6Y + 20);

    ctx.fillStyle = '#64748b';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('Klik tombol atau tekan shortcut keyboard yang tertera', canvas.width / 2, 346);

    ctx.textAlign = 'left';
}

// --- KEYBOARD RE-BINDING OVERLAY ---
function drawKeybindsOverlay(ctx, canvas) {
    ctx.fillStyle = 'rgba(8, 10, 15, 0.96)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#27354a';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText('PENGATURAN TOMBOL / KEYBINDS', canvas.width / 2, 36);

    ctx.fillStyle = (typeof rebindActiveAction !== 'undefined' && rebindActiveAction) ? '#fde047' : '#94a3b8';
    ctx.font = '6.5px "Press Start 2P", monospace';
    if (typeof rebindActiveAction !== 'undefined' && rebindActiveAction) {
        const actLabel = (typeof currentKeybinds !== 'undefined' && currentKeybinds[rebindActiveAction]) ? currentKeybinds[rebindActiveAction].label : rebindActiveAction;
        ctx.fillText(`TEKAN TOMBOL BARU UNTUK [${actLabel.toUpperCase()}] (ESC BATAL)`, canvas.width / 2, 54);
    } else {
        ctx.fillText('KLIK BARIS TOMBOL UNTUK MENGGANTI KEYBINDING', canvas.width / 2, 54);
    }

    if ((typeof currentKeybinds === 'undefined' || !currentKeybinds) && typeof loadCustomKeybinds === 'function') {
        loadCustomKeybinds();
    }
    const actionKeys = (typeof currentKeybinds !== 'undefined' && currentKeybinds) ? Object.keys(currentKeybinds) : [];

    const col1 = actionKeys.slice(0, 7);
    const col2 = actionKeys.slice(7);

    const startY = 72;
    const rowH = 28;
    const gap = 5;

    // Col 1
    col1.forEach((act, idx) => {
        drawKeybindRow(ctx, act, 52, startY + idx * (rowH + gap), 260, rowH);
    });

    // Col 2
    col2.forEach((act, idx) => {
        drawKeybindRow(ctx, act, 328, startY + idx * (rowH + gap), 260, rowH);
    });

    // Bottom Action Buttons
    // Reset to defaults
    const btnResetHover = isHovering(110, 312, 200, 32);
    ctx.fillStyle = btnResetHover ? '#dc2626' : '#991b1b';
    ctx.fillRect(110, 312, 200, 32);
    ctx.strokeStyle = btnResetHover ? '#fca5a5' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(110, 312, 200, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('RESET DEFAULT [R]', 210, 332);

    // Back / Close
    const btnBackHover = isHovering(330, 312, 200, 32);
    ctx.fillStyle = btnBackHover ? '#2563eb' : '#1e40af';
    ctx.fillRect(330, 312, 200, 32);
    ctx.strokeStyle = btnBackHover ? '#93c5fd' : '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(330, 312, 200, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('SELESAI / TUTUP [ESC]', 430, 332);

    ctx.fillStyle = '#64748b';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('Tombol kustom tersimpan otomatis di browser (localStorage)', canvas.width / 2, 362);

    ctx.textAlign = 'left';
}

function drawKeybindRow(ctx, act, x, y, w, h) {
    const bind = (typeof currentKeybinds !== 'undefined' && currentKeybinds) ? currentKeybinds[act] : null;
    if (!bind) return;

    const isRecording = (typeof rebindActiveAction !== 'undefined' && rebindActiveAction === act);
    const hovered = isHovering(x, y, w, h);

    ctx.fillStyle = isRecording ? '#312e81' : (hovered ? '#1e293b' : '#111622');
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = isRecording ? '#a855f7' : (hovered ? '#64748b' : '#27354a');
    ctx.lineWidth = isRecording ? 2 : 1;
    ctx.strokeRect(x, y, w, h);

    // Action Name
    ctx.textAlign = 'left';
    ctx.fillStyle = isRecording ? '#c084fc' : (hovered ? '#ffffff' : '#cbd5e1');
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText(bind.label, x + 8, y + 18, w - 85);

    // Key Pill on the Right
    const pillW = 68;
    const pillH = 18;
    const pillX = x + w - pillW - 6;
    const pillY = y + 5;

    ctx.fillStyle = isRecording ? '#4338ca' : '#1e2533';
    ctx.fillRect(pillX, pillY, pillW, pillH);
    ctx.strokeStyle = isRecording ? '#facc15' : '#3b4861';
    ctx.lineWidth = 1;
    ctx.strokeRect(pillX, pillY, pillW, pillH);

    ctx.textAlign = 'center';
    ctx.fillStyle = isRecording ? '#fef08a' : '#f59e0b';
    ctx.font = '6px "Press Start 2P", monospace';
    let keyText = bind.defaultKey || 'NONE';
    if (bind.keys && bind.keys.length > 0) {
        const raw = bind.keys[0];
        keyText = (raw === ' ') ? 'Space' : raw.toUpperCase();
    }
    if (isRecording) keyText = 'PRESS...';
    ctx.fillText(keyText, pillX + pillW / 2, pillY + 12, pillW - 6);
    ctx.textAlign = 'left';
}

// --- GAME OVER OVERLAY ---
function drawGameOverOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(10, 6, 8, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = '22px "Press Start 2P", monospace';
    ctx.fillText('DEFEATED', canvas.width / 2, 92);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText(`Reached Stage ${currentStage}`, canvas.width / 2, 126);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, 146);

    // Button 1: Retry [R]
    const btn1X = canvas.width / 2 - 200;
    const btn1Y = 186;
    const btn1W = 190;
    const btn1H = 40;
    const h1 = isHovering(btn1X, btn1Y, btn1W, btn1H);

    ctx.fillStyle = h1 ? '#dc2626' : '#b91c1c';
    ctx.fillRect(btn1X, btn1Y, btn1W, btn1H);
    ctx.strokeStyle = h1 ? '#fca5a5' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btn1X, btn1Y, btn1W, btn1H);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('RETRY [R]', btn1X + btn1W / 2, btn1Y + 25);

    // Button 2: Trophy [A]
    const btn2X = canvas.width / 2 + 10;
    const btn2Y = 186;
    const btn2W = 190;
    const btn2H = 40;
    const h2 = isHovering(btn2X, btn2Y, btn2W, btn2H);

    ctx.fillStyle = h2 ? '#b45309' : '#92400e';
    ctx.fillRect(btn2X, btn2Y, btn2W, btn2H);
    ctx.strokeStyle = h2 ? '#fde047' : '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btn2X, btn2Y, btn2W, btn2H);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('PENCAPAIAN [A]', btn2X + btn2W / 2, btn2Y + 25);

    // Button 3: Main Menu [Q]
    const btn3X = canvas.width / 2 - 110;
    const btn3Y = 240;
    const btn3W = 220;
    const btn3H = 38;
    const h3 = isHovering(btn3X, btn3Y, btn3W, btn3H);

    ctx.fillStyle = h3 ? '#374151' : '#1f2937';
    ctx.fillRect(btn3X, btn3Y, btn3W, btn3H);
    ctx.strokeStyle = h3 ? '#9ca3af' : '#4b5563';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btn3X, btn3Y, btn3W, btn3H);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8.5px "Press Start 2P", monospace';
    ctx.fillText('MAIN MENU [Q]', canvas.width / 2, btn3Y + 24);

    ctx.fillStyle = '#64748b';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('Pelajari pola musuh dan lengkapi senjata terbaikmu!', canvas.width / 2, 320);

    ctx.textAlign = 'left';
}

// --- VICTORY OVERLAY (CLEAN RETRO HEROIC CELEBRATION) ---
function drawVictoryOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Solid dark backdrop
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Confetti particles
    if (typeof victoryParticles !== 'undefined') {
        victoryParticles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
            ctx.restore();
        });
    }

    // Title
    ctx.textAlign = 'center';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('VICTORY - CLEARED!', canvas.width / 2, 44);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('YOU HAVE CONQUERED THE LABYRINTH!', canvas.width / 2, 64, 600);

    let defeatedBossText = 'THE WARDEN (STAGE 35) & APEX SCULK MIRROR (STAGE 50) DEFEATED!';
    if (typeof lastDefeatedAlterEgo !== 'undefined' && lastDefeatedAlterEgo) {
        let alterRoleName = 'VOID ARCHMAGE';
        if (lastDefeatedAlterEgo === 'knight') alterRoleName = 'VOID DRAGON KNIGHT';
        else if (lastDefeatedAlterEgo === 'assassin') alterRoleName = 'VOID PHANTOM REAPER';
        defeatedBossText = `APEX SCULK MIRROR (${alterRoleName}) SHATTERED!`;
    }
    ctx.fillStyle = '#38bdf8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(defeatedBossText, canvas.width / 2, 80, 600);

    // Hero Summary Card
    const cardX = canvas.width / 2 - 240;
    const cardY = 96;
    const cardW = 480;
    const cardH = 180;

    ctx.fillStyle = '#111622';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Left Column: Hero Character Showcase
    const role = (player && player.characterRole) ? player.characterRole : 'knight';
    let roleColor = '#3b82f6';
    if (role === 'mage') roleColor = '#a855f7';
    else if (role === 'assassin') roleColor = '#10b981';

    const heroBoxX = cardX + 16;
    const heroBoxY = cardY + 16;
    const heroBoxW = 120;
    const heroBoxH = 148;

    ctx.fillStyle = '#172033';
    ctx.fillRect(heroBoxX, heroBoxY, heroBoxW, heroBoxH);
    ctx.strokeStyle = roleColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(heroBoxX, heroBoxY, heroBoxW, heroBoxH);

    // Centered mini preview of hero
    ctx.save();
    const prevX = player.x;
    const prevY = player.y;
    const prevFacing = player.facing;
    player.x = heroBoxX + (heroBoxW - player.w) / 2;
    player.y = heroBoxY + 36;
    player.facing = 'down';
    drawPlayerModel(ctx, player.x + player.w / 2, player.y + player.h / 2);
    player.x = prevX;
    player.y = prevY;
    player.facing = prevFacing;
    ctx.restore();

    ctx.fillStyle = roleColor;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(role.toUpperCase(), heroBoxX + heroBoxW / 2, heroBoxY + 116, heroBoxW - 8);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('HERO OF REALM', heroBoxX + heroBoxW / 2, heroBoxY + 134, heroBoxW - 8);

    // Right Column: Progression & Combat Stats Table
    const statsX = cardX + 152;
    let statY = cardY + 28;
    const lineSpacing = 22;

    ctx.textAlign = 'left';

    // Stage Cleared
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('STAGE STATUS:', statsX, statY, 120);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('STAGE 50 CLEARED [100%]', statsX + 124, statY, 190);

    // Alter Ego Boss Info
    statY += lineSpacing;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CLIMAX BOSS:', statsX, statY, 120);
    ctx.fillStyle = '#ec4899';
    let alterLabel = 'APEX MIRROR ARCHMAGE';
    if (typeof lastDefeatedAlterEgo !== 'undefined' && lastDefeatedAlterEgo) {
        alterLabel = `APEX ${lastDefeatedAlterEgo.toUpperCase()}`;
    }
    ctx.fillText(alterLabel, statsX + 124, statY, 190);

    // Final Score
    statY += lineSpacing;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('TOTAL SCORE:', statsX, statY, 120);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${score} PTS`, statsX + 124, statY, 190);

    // Gold
    statY += lineSpacing;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('GOLD HOARD:', statsX, statY, 120);
    ctx.fillStyle = '#fde047';
    ctx.fillText(`${player.gold || 0} COINS`, statsX + 124, statY, 190);

    // Final Weapon
    statY += lineSpacing;
    const weaponItem = (player.equipped && player.equipped.weapon && typeof getEquipmentById === 'function') 
        ? getEquipmentById(player.equipped.weapon) : null;
    const weaponName = weaponItem ? weaponItem.name : 'Starter Weapon';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('FINAL WEAPON:', statsX, statY, 120);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${weaponName}`, statsX + 124, statY, 190);

    // Health Status
    statY += lineSpacing;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('HP REMAINING:', statsX, statY, 120);
    ctx.fillStyle = '#f87171';
    ctx.fillText(`${Math.max(1, Math.round(player.hp))} / ${player.maxHp}`, statsX + 124, statY, 190);

    ctx.textAlign = 'center';

    // Interactive Action Buttons
    // Button 1: Play Again [R]
    const btn1X = canvas.width / 2 - 210;
    const btn1Y = 296;
    const btn1W = 195;
    const btn1H = 42;
    const h1 = isHovering(btn1X, btn1Y, btn1W, btn1H);

    ctx.fillStyle = h1 ? '#16a34a' : '#15803d';
    ctx.fillRect(btn1X, btn1Y, btn1W, btn1H);
    ctx.strokeStyle = h1 ? '#86efac' : '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btn1X, btn1Y, btn1W, btn1H);
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('PLAY AGAIN [R]', btn1X + btn1W / 2, btn1Y + 26);

    // Button 2: Main Menu [Q]
    const btn2X = canvas.width / 2 + 15;
    const btn2Y = 296;
    const btn2W = 195;
    const btn2H = 42;
    const h2 = isHovering(btn2X, btn2Y, btn2W, btn2H);

    ctx.fillStyle = h2 ? '#2563eb' : '#1e40af';
    ctx.fillRect(btn2X, btn2Y, btn2W, btn2H);
    ctx.strokeStyle = h2 ? '#93c5fd' : '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(btn2X, btn2Y, btn2W, btn2H);
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('MAIN MENU [Q]', btn2X + btn2W / 2, btn2Y + 26);

    ctx.fillStyle = '#64748b';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('Thank you for playing Arc Slash ARPG!', canvas.width / 2, 360);
    ctx.textAlign = 'left';
}

if (typeof window !== 'undefined') {
    window.drawTopHUD = drawTopHUD;
    window.drawPauseOverlay = drawPauseOverlay;
    window.drawKeybindsOverlay = drawKeybindsOverlay;
}
