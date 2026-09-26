// --- MAIN GAME ENTRY POINT ---
// This file ties all modules together and runs the game loop

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Mobile Performance Optimization:
// Disabling shadowBlur on mobile devices prevents mobile GPUs (Adreno/Mali) from stalling on CPU software Gaussian blur passes
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth <= 1024);
    if (isMobileDevice) {
        try {
            if (typeof CanvasRenderingContext2D !== 'undefined' && CanvasRenderingContext2D.prototype) {
                Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowBlur', {
                    get() { return 0; },
                    set() { /* no-op on mobile to guarantee silky 60fps */ },
                    configurable: true
                });
            }
        } catch (_) {}
    }
}

// --- GAME STATE & GLOBALS ---
let gameState = 'MAIN_MENU';
let currentStage = 1;
let score = 0;
let screenShake = 0;
let teleportFlashTimer = 0;
let victoryParticles = [];
let victoryAutoTimer = 0;
let tookDamageInStage = false;

// Physical Dungeon Gate / Portal
const dungeonGate = {
    x: 580,
    y: 165,
    w: 42,
    h: 58,
    open: false,
    swirlTimer: 0
};

// --- INITIALIZATION ---
function init() {
    initPlayer();
    initInput();
    if (typeof initMobileControls === 'function') initMobileControls();
    if (typeof updateMobileControlsRole === 'function') updateMobileControlsRole(player.characterRole);
    if (typeof resetEventRoomState === 'function') resetEventRoomState();
    if (typeof window.dev !== 'undefined' && typeof window.dev.help === 'function') {
        window.dev.help();
    }
}

// --- GAME FLOW FUNCTIONS ---
function startGame() {
    score = 0;
    selectCharacter(selectedRole);
    player.gold = 0;
    player.hp = player.maxHp;
    player.shield = player.maxShield;
    victoryAutoTimer = 0;
    tookDamageInStage = false;
    loadStage(1);
    resetSkillCooldowns();
    if (typeof achievementTracker !== 'undefined') {
        achievementTracker.onRoleSelected(selectedRole);
    }
    gameState = 'PLAYING';
}

function resetGame(stageNum = 1) {
    if (stageNum === 1) {
        score = 0;
        selectCharacter(selectedRole);
        player.gold = 0;
    }
    player.hp = player.maxHp;
    player.shield = player.maxShield;
    victoryAutoTimer = 0;
    tookDamageInStage = false;
    loadStage(stageNum);
    resetSkillCooldowns();
    if (typeof achievementTracker !== 'undefined' && stageNum === 1) {
        achievementTracker.onRoleSelected(selectedRole);
    }
    if (gameState !== 'BOSS_DIALOGUE') {
        gameState = 'PLAYING';
    }
}

function nextStage() {
    playSound('teleport');
    teleportFlashTimer = 25;

    if (typeof achievementTracker !== 'undefined') {
        achievementTracker.onStageCleared(currentStage, tookDamageInStage);
    }
    tookDamageInStage = false;

    // Check if player just beat the final stage boss (Stage 50 Apex Mirror Boss)
    const maxStages = (typeof STAGE_CONFIGS !== 'undefined') ? STAGE_CONFIGS.length : 50;
    if (currentStage >= maxStages) {
        triggerVictory();
        return;
    }

    // Random Event: 15% chance to enter Event Room (Ruang Event Roulette Gacha) between non-boss stages
    // Excludes boss transitions: 21->22 (Alter Ego), 34->35 (Warden), 49->50 (Apex Mirror)
    if (Math.random() < 0.15 && (currentStage < 21 || (currentStage >= 23 && currentStage < 34) || (currentStage >= 36 && currentStage < 49)) && typeof initEventRoom === 'function') {
        initEventRoom(currentStage + 1);
        return;
    }

    loadStage(currentStage + 1);
    if (gameState !== 'BOSS_DIALOGUE') {
        gameState = 'PLAYING';
    }
}

function triggerVictory() {
    gameState = 'VICTORY';
    playSound('victory');
    initVictoryParticles();
}

function initVictoryParticles() {
    victoryParticles = [];
    const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ffffff'];
    for (let i = 0; i < 75; i++) {
        victoryParticles.push({
            x: Math.random() * 640,
            y: Math.random() * -384,
            vx: (Math.random() - 0.5) * 1.8,
            vy: Math.random() * 2 + 1.2,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
            size: Math.random() * 5 + 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function updateVictory() {
    victoryParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > 384 + 10) {
            p.y = -10;
            p.x = Math.random() * 640;
        }
    });
}

// Debug shortcut to jump to any stage from console or hotkey
window.jumpToStage = function(stageNum) {
    victoryAutoTimer = 0;
    loadStage(stageNum);
    if (gameState !== 'BOSS_DIALOGUE') {
        gameState = 'PLAYING';
    }
};

// Debug / Dev Command: Set player coins / gold
window.setCoin = window.setCoins = window.setGold = function(amount) {
    if (typeof player !== 'undefined' && player) {
        const val = Math.max(0, parseInt(amount, 10) || 0);
        player.gold = val;
        if (typeof floatingTexts !== 'undefined' && player.x) {
            floatingTexts.push({
                x: player.x + player.w / 2,
                y: player.y - 12,
                text: `🪙 Gold set: ${val}`,
                color: '#fbbf24',
                life: 50
            });
        }
        if (typeof playSound === 'function') playSound('buy');
        console.log(`%c[DEV] Player Gold successfully set to: ${player.gold} 🪙`, 'color: #fbbf24; font-weight: bold; font-size: 12px;');
        return player.gold;
    }
    console.warn('[DEV] Player is not initialized yet. Start the game first!');
    return 0;
};

// Debug / Dev Command: Add player coins / gold
window.addCoin = window.addCoins = window.addGold = function(amount = 5000) {
    if (typeof player !== 'undefined' && player) {
        const val = parseInt(amount, 10) || 5000;
        player.gold = Math.max(0, player.gold + val);
        if (typeof floatingTexts !== 'undefined' && player.x) {
            floatingTexts.push({
                x: player.x + player.w / 2,
                y: player.y - 12,
                text: `+${val} 🪙 (DEV)`,
                color: '#fbbf24',
                life: 50
            });
        }
        if (typeof playSound === 'function') playSound('buy');
        console.log(`%c[DEV] Added ${val} Gold! Current total: ${player.gold} 🪙`, 'color: #fbbf24; font-weight: bold; font-size: 12px;');
        return player.gold;
    }
    console.warn('[DEV] Player is not initialized yet. Start the game first!');
    return 0;
};

// Developer Console Suite
window.dev = {
    setCoin: window.setCoin,
    setCoins: window.setCoin,
    setGold: window.setGold,
    addCoin: window.addCoin,
    addCoins: window.addCoins,
    addGold: window.addGold,
    jumpToStage: window.jumpToStage,
    toggleMobileControls: function() {
        if (typeof window.toggleMobileControls === 'function') window.toggleMobileControls();
    },
    giveAllGear: function() {
        if (typeof EQUIPMENT_DB !== 'undefined' && player) {
            const roleGear = EQUIPMENT_DB.filter(e => e.role === player.characterRole || e.role === 'all');
            roleGear.forEach(i => {
                if (!player.inventory.includes(i.id)) player.inventory.push(i.id);
            });
            console.log(`%c[DEV] Unlocked all ${roleGear.length} items for ${player.characterRole}!`, 'color: #38bdf8; font-weight: bold;');
        }
    },
    help: function() {
        console.log('%c=== DUNGEON RPG DEV COMMANDS ===', 'color: #f59e0b; font-weight: bold; font-size: 13px;');
        console.log('🪙 setCoin(amount)  / setGold(amount)   -> Set exact gold amount (e.g. setCoin(99999))');
        console.log('🪙 addCoin(amount)  / addGold(amount)   -> Add gold (default +5000, e.g. addCoin(10000))');
        console.log('🚀 jumpToStage(num)                     -> Teleport to stage 1-50 (e.g. jumpToStage(23))');
        console.log('📱 dev.toggleMobileControls()           -> Show/hide on-screen mobile gamepad (Hotkey [M])');
        console.log('⚔️ dev.giveAllGear()                    -> Unlock all weapons/armors for current character');
        console.log('⌨️ In-Game Hotkeys:');
        console.log('   [C] atau [6] -> Quick Add +5,000 Coins (🪙)');
        console.log('   [M]          -> Toggle On-Screen Mobile Gamepad (Tes Tombol HP)');
        console.log('   [7]          -> Stage 23 (Deep Dark Biome)');
        console.log('   [8]          -> Stage 35 (Warden Boss)');
        console.log('   [9]          -> Stage 22 (Alter Ego Boss)');
        console.log('   [0]          -> Stage 50 (Apex Final Boss)');
    }
};

// --- UPDATE LOOP ---
function update() {
    if (typeof updateAchievementToasts === 'function') {
        updateAchievementToasts();
    }

    if (screenShake > 0) screenShake *= 0.85;
    if (teleportFlashTimer > 0) teleportFlashTimer--;

    if (gameState === 'EVENT_ROOM') {
        if (typeof updateEventRoom === 'function') updateEventRoom();
        return;
    }

    if (gameState === 'VICTORY') {
        if (typeof updateVictory === 'function') updateVictory();
        return;
    }

    if (gameState === 'BOSS_DIALOGUE') {
        if (typeof updateBossDialogue === 'function') updateBossDialogue();
        return;
    }

    if (gameState !== 'PLAYING') return;

    if (player.shieldHitFlashTimer > 0) player.shieldHitFlashTimer--;

    if (player.shieldRechargeTimer > 0) {
        player.shieldRechargeTimer--;
    } else if (player.shield < player.maxShield) {
        player.shield = Math.min(player.maxShield, player.shield + 0.12);
    }

    // Torch smoke particles
    torches.forEach(t => {
        if (Math.random() < 0.35) {
            smokeParticles.push({
                x: t.x + (Math.random() - 0.5) * 4,
                y: t.y - 6,
                vx: (Math.random() - 0.5) * 0.35,
                vy: -0.7 - Math.random() * 0.4,
                size: 3 + Math.random() * 3.5,
                life: 32,
                maxLife: 32
            });
        }
    });

    // Player movement (respects key rebindings and active dash state)
    if (!player.isDashing) {
        let moveDx = 0;
        let moveDy = 0;
        const upActive = (typeof isActionActive === 'function') ? (isActionActive('moveUp') || keys['w'] || keys['arrowup']) : (keys['w'] || keys['arrowup']);
        const downActive = (typeof isActionActive === 'function') ? (isActionActive('moveDown') || keys['s'] || keys['arrowdown']) : (keys['s'] || keys['arrowdown']);
        const leftActive = (typeof isActionActive === 'function') ? (isActionActive('moveLeft') || keys['a'] || keys['arrowleft']) : (keys['a'] || keys['arrowleft']);
        const rightActive = (typeof isActionActive === 'function') ? (isActionActive('moveRight') || keys['d'] || keys['arrowright']) : (keys['d'] || keys['arrowright']);

        if (upActive) { moveDy -= 1; player.facing = 'up'; }
        if (downActive) { moveDy += 1; player.facing = 'down'; }
        if (leftActive) { moveDx -= 1; player.facing = 'left'; }
        if (rightActive) { moveDx += 1; player.facing = 'right'; }

        if (moveDx !== 0 && moveDy !== 0) {
            moveDx *= 0.7071;
            moveDy *= 0.7071;
        }

        // No speed penalty when attacking - keeps movement fluid and responsive
        const stepSpeed = player.speed;
        const nextX = player.x + moveDx * stepSpeed;
        const nextY = player.y + moveDy * stepSpeed;

        if (!checkWallCollision(nextX, player.y, player.w, player.h)) {
            player.x = nextX;
        }
        if (!checkWallCollision(player.x, nextY, player.w, player.h)) {
            player.y = nextY;
        }
    }

    // Combat update
    updateCombat();

    // Skills update
    updateSkills();
    if (typeof updateMobileSkillButtonsState === 'function') {
        updateMobileSkillButtonsState();
    }

    // Check gate open condition
    if (mobs.length === 0) {
        const maxStages = (typeof STAGE_CONFIGS !== 'undefined') ? STAGE_CONFIGS.length : 50;
        const isFinalStage = (currentStage >= maxStages);
        const isDragonStage = (currentStage === 21);
        const isStage22 = (currentStage === 22);
        const isWardenStage = (currentStage === 35);

        if (!dungeonGate.open) {
            dungeonGate.open = true;
            playSound('victory');
            if (isDragonStage) {
                floatingTexts.push({
                    x: dungeonGate.x - 30,
                    y: dungeonGate.y - 14,
                    text: '[ANCIENT DRAGON DEFEATED]',
                    color: '#fbbf24',
                    life: 90
                });
                floatingTexts.push({
                    x: dungeonGate.x - 40,
                    y: dungeonGate.y - 30,
                    text: '[SHADOW SANCTUARY GATE UNLOCKED]',
                    color: '#c084fc',
                    life: 90
                });
            } else if (isStage22) {
                floatingTexts.push({
                    x: dungeonGate.x - 30,
                    y: dungeonGate.y - 14,
                    text: 'ALTER EGO DEFEATED! 💀',
                    color: '#fbbf24',
                    life: 90
                });
                floatingTexts.push({
                    x: dungeonGate.x - 45,
                    y: dungeonGate.y - 30,
                    text: 'DEEP DARK EXPEDITION OPENS! 🌌',
                    color: '#06b6d4',
                    life: 90
                });
            } else if (isWardenStage) {
                floatingTexts.push({
                    x: dungeonGate.x - 30,
                    y: dungeonGate.y - 14,
                    text: 'THE WARDEN HAS FALLEN! 🔊💀',
                    color: '#22d3ee',
                    life: 90
                });
                floatingTexts.push({
                    x: dungeonGate.x - 45,
                    y: dungeonGate.y - 30,
                    text: 'PATH TO SCULK CORE UNSEALED! 💎',
                    color: '#67e8f9',
                    life: 90
                });
            } else if (isFinalStage) {
                floatingTexts.push({
                    x: dungeonGate.x - 30,
                    y: dungeonGate.y - 14,
                    text: 'APEX MIRROR SHATTERED! 🏆',
                    color: '#fbbf24',
                    life: 90
                });
                floatingTexts.push({
                    x: dungeonGate.x - 30,
                    y: dungeonGate.y - 30,
                    text: 'PORTAL OF TRUE VICTORY! 👑',
                    color: '#06b6d4',
                    life: 90
                });
                victoryAutoTimer = 180; // auto-transition in ~3s if player stays
            } else {
                floatingTexts.push({
                    x: dungeonGate.x + 20,
                    y: dungeonGate.y - 14,
                    text: 'GATE OPENED! 🌀',
                    color: '#2ecc71',
                    life: 60
                });
            }
        }

        // For final stage: spawn celebratory sparks and countdown auto victory
        if (isFinalStage && victoryAutoTimer > 0) {
            victoryAutoTimer--;
            if (Math.random() < 0.4) {
                particles.push({
                    x: dungeonGate.x + Math.random() * dungeonGate.w,
                    y: dungeonGate.y + Math.random() * dungeonGate.h,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: -Math.random() * 2.5 - 1.2,
                    size: Math.random() * 3 + 2,
                    color: Math.random() > 0.5 ? '#fbbf24' : '#ffffff',
                    life: 22
                });
            }
            if (victoryAutoTimer === 0) {
                triggerVictory();
                return;
            }
        }

        dungeonGate.swirlTimer += 0.1;

        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const gx = dungeonGate.x + dungeonGate.w / 2;
        const gy = dungeonGate.y + dungeonGate.h / 2;

        if (Math.hypot(px - gx, py - gy) < 26) {
            nextStage();
        }
    }

    // Coin pickup
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.x += c.vx; c.y += c.vy;
        c.vx *= 0.92; c.vy *= 0.92;

        c.z += c.vz; c.vz -= 0.45;
        if (c.z <= 0) {
            c.z = 0;
            if (c.bounced < 2) { c.vz = -c.vz * 0.45; c.bounced++; }
            else { c.vz = 0; }
        }

        const distToPlayer = Math.hypot(px - c.x, py - c.y);
        if (distToPlayer < 90) {
            c.x += ((px - c.x) / distToPlayer) * 4.6;
            c.y += ((py - c.y) / distToPlayer) * 4.6;
        }

        if (distToPlayer < 20) {
            const goldEarned = c.goldValue || 10;
            player.gold += goldEarned;
            score += c.value;
            if (typeof achievementTracker !== 'undefined') {
                achievementTracker.onGoldCollected(goldEarned);
            }
            playSound('coin');

            floatingTexts.push({
                x: c.x, y: c.y - 6,
                text: `+${goldEarned} \u{1FA99} (+${c.value})`, color: '#f1c40f', life: 24
            });

            for (let p = 0; p < 4; p++) {
                particles.push({
                    x: c.x, y: c.y,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                    size: 2, color: '#ffe135', life: 10
                });
            }
            coins.splice(i, 1);
        }
    }

    // Loot pickup
    for (let i = loots.length - 1; i >= 0; i--) {
        const l = loots[i];
        l.floatTimer += 0.08;

        const distToPlayer = Math.hypot(px - l.x, py - l.y);
        if (distToPlayer < 75) {
            l.x += ((px - l.x) / distToPlayer) * 3.8;
            l.y += ((py - l.y) / distToPlayer) * 3.8;
        }

        if (distToPlayer < 20) {
            if (l.type === 'health') {
                const healAmount = 35;
                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                playSound('heal');
                floatingTexts.push({
                    x: l.x, y: l.y - 8,
                    text: `+${healAmount} HP \u2764\uFE0F`, color: '#2ecc71', life: 30
                });
            } else if (l.type === 'shield') {
                const shieldAmount = 30;
                player.shield = Math.min(player.maxShield, player.shield + shieldAmount);
                playSound('shield');
                floatingTexts.push({
                    x: l.x, y: l.y - 8,
                    text: `+${shieldAmount} ARMOR \u{1F6E1}\uFE0F`, color: '#00e5ff', life: 30
                });
            }

            for (let p = 0; p < 8; p++) {
                particles.push({
                    x: l.x, y: l.y,
                    vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                    size: 3, color: l.type === 'health' ? '#2ecc71' : '#00e5ff', life: 15
                });
            }

            loots.splice(i, 1);
        }
    }

    // Update particles
    updateParticles();
    updateSmokeParticles();
    updateFloatingTexts();

    // Sync mobile controls state reactively
    if (typeof updateMobileControlsState === 'function') {
        updateMobileControlsState();
    }
}

// --- DRAW LOOP ---
function draw() {
    if (gameState === 'VICTORY') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (typeof drawVictoryOverlay === 'function') drawVictoryOverlay();
        mouseClicked = false;
        return;
    }

    if (gameState === 'BOSS_DIALOGUE') {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDungeonFloor();
        drawTorchesAndSmoke();
        drawDungeonGate();
        drawCoins(ctx);
        drawLoots(ctx);
        drawAllMobs(ctx);
        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        drawPlayerModel(ctx, px, py);
        ctx.restore();

        // Dark dramatic vignette over arena
        ctx.fillStyle = 'rgba(4, 6, 12, 0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawTopHUD();
        if (typeof drawBossBar === 'function') drawBossBar(ctx);
        if (typeof drawBossDialogue === 'function') drawBossDialogue(ctx);
        mouseClicked = false;
        return;
    }

    if (gameState === 'EVENT_ROOM') {
        if (typeof drawEventRoom === 'function') drawEventRoom(ctx);
        if (teleportFlashTimer > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${teleportFlashTimer / 25})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        drawTopHUD();
        mouseClicked = false;
        return;
    }

    ctx.save();

    if (screenShake > 0.5) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawDungeonFloor();
    drawTorchesAndSmoke();
    drawDungeonGate();
    drawCoins(ctx);
    drawLoots(ctx);
    if (typeof drawTelegraphZones === 'function') drawTelegraphZones(ctx);
    drawEnemyProjectiles(ctx);
    if (typeof drawPlayerProjectiles === 'function') drawPlayerProjectiles(ctx);

    // Draw mobs
    drawAllMobs(ctx);

    // Draw player
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    drawSlashArc(ctx, px, py);

    const isVisible = player.invulnerableTimer % 6 < 3;
    if (isVisible) {
        if (player.facing === 'up') drawSword(ctx, px, py);

        if (player.shield > 0 && player.shieldHitFlashTimer > 0) {
            ctx.save();
            const ratio = player.shieldHitFlashTimer / 16;
            const radius = 24 + (1 - ratio) * 5;

            ctx.fillStyle = `rgba(0, 229, 255, ${0.4 * ratio})`;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * ratio})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.strokeStyle = `rgba(0, 229, 255, ${1.0 * ratio})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        drawPlayerModel(ctx, px, py);

        if (player.facing !== 'up') drawSword(ctx, px, py);
    }

    // Draw skill effects
    drawSkillEffects(ctx);

    // Draw particles and floating texts
    drawParticles(ctx);
    drawFloatingTexts(ctx);

    ctx.restore();

    // Teleport flash
    if (teleportFlashTimer > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${teleportFlashTimer / 25})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // HUD
    drawTopHUD();
    if (typeof drawBossBar === 'function') drawBossBar(ctx);
    drawSkillHUD(ctx, canvas);

    // Overlays
    if (gameState === 'MAIN_MENU') {
        if (typeof drawMainMenuOverlay === 'function') drawMainMenuOverlay();
        else drawMenuOverlay();
    } else if (gameState === 'MENU' || gameState === 'CHAR_SELECT') {
        drawMenuOverlay();
    } else if (gameState === 'KEYBINDS') {
        if (typeof drawKeybindsOverlay === 'function') drawKeybindsOverlay();
    } else if (gameState === 'ACHIEVEMENTS') {
        if (typeof drawAchievementsOverlay === 'function') drawAchievementsOverlay(ctx, canvas);
    } else if (gameState === 'HOW_TO_PLAY') {
        if (typeof drawHowToPlayOverlay === 'function') drawHowToPlayOverlay(ctx, canvas);
    } else if (gameState === 'PAUSED') {
        drawPauseOverlay();
    } else if (gameState === 'GAMEOVER') {
        drawGameOverOverlay();
    } else if (gameState === 'SHOP') {
        drawShopOverlay();
    } else if (gameState === 'VICTORY') {
        if (typeof drawVictoryOverlay === 'function') drawVictoryOverlay();
    }

    mouseClicked = false;
}

// --- CONFIGURABLE FIXED TIMESTEP & TICK RATE ENGINE ---
let targetTickRate = 60;
try {
    const savedRate = parseInt(localStorage.getItem('arc_slash_tick_rate'), 10);
    if ([30, 60, 90, 120].includes(savedRate)) targetTickRate = savedRate;
} catch (e) {}

let FIXED_STEP_MS = 1000 / targetTickRate;
let lastGameLoopTime = (typeof performance !== 'undefined') ? performance.now() : Date.now();
let physicsAccumulator = 0;
let MAX_ACCUMULATOR_MS = FIXED_STEP_MS * 8;

let currentTPS = targetTickRate;
let currentFPS = 60;
let tickCountThisSec = 0;
let frameCountThisSec = 0;
let lastRateCheckTime = (typeof performance !== 'undefined') ? performance.now() : Date.now();

function setTargetTickRate(rate) {
    if (![30, 60, 90, 120].includes(rate)) rate = 60;
    targetTickRate = rate;
    FIXED_STEP_MS = 1000 / targetTickRate;
    MAX_ACCUMULATOR_MS = FIXED_STEP_MS * 8;
    try {
        localStorage.setItem('arc_slash_tick_rate', rate.toString());
    } catch (e) {}
    if (typeof floatingTexts !== 'undefined' && typeof player !== 'undefined' && player.x) {
        floatingTexts.push({
            x: player.x + player.w / 2,
            y: player.y - 16,
            text: `⚡ TICK RATE: ${rate} TPS`,
            color: '#38bdf8',
            life: 45
        });
    }
}

function cycleTickRate() {
    const rates = [60, 90, 120, 30];
    const idx = rates.indexOf(targetTickRate);
    const nextRate = rates[(idx + 1) % rates.length];
    setTargetTickRate(nextRate);
    if (typeof playSound === 'function') playSound('buy');
}

if (typeof window !== 'undefined') {
    window.setTargetTickRate = setTargetTickRate;
    window.cycleTickRate = cycleTickRate;
    window.getTickRateStats = () => ({ tps: currentTPS, fps: currentFPS, targetTPS: targetTickRate });
}

function isOrientationBlocked() {
    return false;
}

function gameLoop(timestamp) {
    if (!timestamp) timestamp = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    let frameDelta = timestamp - lastGameLoopTime;
    lastGameLoopTime = timestamp;

    // Guard against tab switching or device sleep (if inactive for > 1s)
    if (frameDelta > 1000) frameDelta = FIXED_STEP_MS;
    if (frameDelta < 0) frameDelta = 0;

    physicsAccumulator += frameDelta;
    if (physicsAccumulator > MAX_ACCUMULATOR_MS) {
        physicsAccumulator = MAX_ACCUMULATOR_MS;
    }

    // Run physics updates at target tick rate if not blocked
    const blocked = isOrientationBlocked();
    let subSteps = 0;
    const maxSubSteps = 8;
    while (physicsAccumulator >= FIXED_STEP_MS && subSteps < maxSubSteps) {
        if (!blocked) {
            update();
            tickCountThisSec++;
        }
        physicsAccumulator -= FIXED_STEP_MS;
        subSteps++;
    }

    if (!blocked) {
        draw();
        frameCountThisSec++;
    }

    // Calculate real-time TPS & FPS
    if (timestamp - lastRateCheckTime >= 1000) {
        currentTPS = tickCountThisSec;
        currentFPS = frameCountThisSec;
        tickCountThisSec = 0;
        frameCountThisSec = 0;
        lastRateCheckTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

// --- START ---
init();
gameLoop();
