// --- MOB MANAGEMENT & BALANCED PROGRESSION ---
let mobs = [];
let walls = [];
let torches = [];

function loadStage(stageNum) {
    currentStage = stageNum;
    mobs = [];
    walls = [];
    torches = [];
    clearParticles();
    if (typeof clearTelegraphZones === 'function') clearTelegraphZones();
    if (typeof resetEventRoomState === 'function') resetEventRoomState();

    const canvas = document.getElementById('gameCanvas');

    player.x = 40;
    player.y = canvas.height / 2 - player.h / 2;
    player.invulnerableTimer = 0;
    player.isAttacking = false;

    dungeonGate.open = false;
    dungeonGate.swirlTimer = 0;

    const configIndex = Math.min(stageNum - 1, STAGE_CONFIGS.length - 1);
    const config = STAGE_CONFIGS[configIndex];

    if (config.walls) walls = [...config.walls];
    if (config.torches) torches = [...config.torches];

    if (torches.length === 0) {
        torches = [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }];
    }

    if (config.loots) {
        config.loots.forEach(l => {
            loots.push({ x: l.x, y: l.y, type: l.type, floatTimer: Math.random() * Math.PI * 2 });
        });
    }

    // Scaling multiplier for enemy strength based on stage level
    const hpScale = 1 + (stageNum - 1) * 0.07;
    const speedScale = 1 + Math.min(0.3, (stageNum - 1) * 0.012);

    if (stageNum > STAGE_CONFIGS.length) {
        const count = 4 + Math.floor(stageNum * 1.5);
        const speciesList = ['slime', 'zombie', 'skeleton', 'dragon'];
        const slimeColors = ['#2ecc71', '#3498db', '#9b59b6'];
        for (let i = 0; i < count; i++) {
            const isBoss = (i === 0 && stageNum % 3 === 0);
            const chosenSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
            let chosenColor = '#2ecc71';
            if (chosenSpecies === 'zombie') chosenColor = '#2d6a4f';
            else if (chosenSpecies === 'skeleton') chosenColor = '#f8fafc';
            else if (chosenSpecies === 'dragon') chosenColor = '#dc2626';
            else chosenColor = slimeColors[Math.floor(Math.random() * slimeColors.length)];

            if (isBoss) chosenColor = chosenSpecies === 'dragon' ? '#dc2626' : '#9b59b6';

            const baseHp = isBoss ? Math.round((300 + stageNum * 65) * 0.9) : 75 + stageNum * 20;
            const scaledHp = Math.round(baseHp * hpScale);

            mobs.push({
                id: i + 1,
                x: 280 + Math.random() * 240,
                y: 80 + Math.random() * 220,
                w: isBoss ? 56 : (chosenSpecies === 'dragon' ? 52 : (chosenSpecies === 'zombie' ? 24 : (chosenSpecies === 'skeleton' ? 22 : 20))),
                h: isBoss ? 56 : (chosenSpecies === 'dragon' ? 52 : (chosenSpecies === 'zombie' ? 28 : (chosenSpecies === 'skeleton' ? 26 : 20))),
                hp: scaledHp,
                maxHp: scaledHp,
                speed: isBoss ? 0.85 * speedScale : (chosenSpecies === 'skeleton' ? 1.2 * speedScale : (chosenSpecies === 'zombie' ? 0.82 * speedScale : (0.9 + Math.random() * 0.4) * speedScale)),
                color: chosenColor,
                type: isBoss ? 'boss' : 'normal',
                species: chosenSpecies,
                level: isBoss ? `Lv.${stageNum} BOSS 👑` : `Lv.${stageNum}`
            });
        }
    } else {
        config.mobs.forEach((m, idx) => {
            const species = m.species || 'slime';
            if (species === 'alter_ego') {
                const isApex = (stageNum >= 50 || m.isApexMirror);
                const alterEgoBoss = createAlterEgoBoss(stageNum, m.x, m.y, isApex);
                mobs.push(alterEgoBoss);
                if (typeof startAlterEgoCutscene === 'function') {
                    startAlterEgoCutscene(alterEgoBoss);
                }
                return;
            }

            if (species === 'warden') {
                const wardenBoss = createWardenBoss(stageNum, m.x, m.y);
                mobs.push(wardenBoss);
                if (typeof startWardenCutscene === 'function') {
                    startWardenCutscene(wardenBoss);
                }
                return;
            }

            let lvlLabel = `Lv.${stageNum}`;
            if (m.type === 'boss') {
                if (stageNum === 10) lvlLabel = 'Lv.10 SLIME KING 👑';
                else if (stageNum === 15) lvlLabel = 'Lv.15 ZOMBIE WARLORD 🧟';
                else if (stageNum === 20) lvlLabel = 'Lv.20 SKELETON KING 💀👑';
                else if (stageNum === 21) lvlLabel = 'Lv.21 ANCIENT DRAGON [BOSS]';
                else if (stageNum === 22) lvlLabel = 'Lv.22 SHADOW ALTER EGO 👑';
                else if (stageNum === 25) lvlLabel = 'Lv.25 SCULK GOLEM 👑';
                else if (stageNum === 30) lvlLabel = 'Lv.30 SCULK TITAN 👑';
                else if (stageNum === 35) lvlLabel = 'Lv.35 THE WARDEN 🔊💀👑';
                else if (stageNum === 40) lvlLabel = 'Lv.40 SOUL COLOSSUS 👑';
                else if (stageNum === 45) lvlLabel = 'Lv.45 SHADOW CLONE 👑';
                else if (stageNum === 50) lvlLabel = 'Lv.50 TRUE MIRROR ALTER EGO 👑';
                else lvlLabel = `Lv.${stageNum} BOSS 👑`;
            } else if (m.w && m.w > 25) {
                lvlLabel = `Lv.${stageNum} MINI-BOSS`;
            }

            let mobColor = m.color;
            if (!mobColor) {
                if (species === 'zombie' || species === 'sculk_zombie') mobColor = (species === 'sculk_zombie') ? '#0891b2' : '#2d6a4f';
                else if (species === 'skeleton' || species === 'sculk_spitter') mobColor = (species === 'sculk_spitter') ? '#06b6d4' : '#f8fafc';
                else if (species === 'dragon') mobColor = '#dc2626';
                else if (species === 'sculk_crawler') mobColor = '#06b6d4';
                else if (species === 'sculk_phantom') mobColor = '#22d3ee';
                else if (species === 'warden') mobColor = '#06b6d4';
                else mobColor = '#2ecc71';
            }

            const scaledHp = Math.round(m.hp * hpScale);

            mobs.push({
                id: idx + 1,
                x: m.x, y: m.y,
                w: m.w || (species === 'warden' ? 58 : (species === 'dragon' ? 64 : (species === 'sculk_crawler' ? 24 : (species === 'sculk_phantom' ? 32 : (species === 'zombie' || species === 'sculk_zombie' ? 24 : (species === 'skeleton' || species === 'sculk_spitter' ? 22 : 20)))))),
                h: m.h || (species === 'warden' ? 64 : (species === 'dragon' ? 64 : (species === 'sculk_crawler' ? 18 : (species === 'sculk_phantom' ? 22 : (species === 'zombie' || species === 'sculk_zombie' ? 28 : (species === 'skeleton' || species === 'sculk_spitter' ? 26 : 20)))))),
                hp: scaledHp,
                maxHp: scaledHp,
                speed: m.speed * speedScale,
                color: mobColor,
                type: m.type || 'normal',
                species: species,
                level: lvlLabel,
                phase60Triggered: false,
                phase30Triggered: false,
                isInvulnerable: false,
                isFlying: (species === 'dragon' || species === 'sculk_phantom'),
                flyZ: (species === 'dragon' ? 16 : 8),
                tailWhipCooldown: 0,
                ultimateTimer: 0,
                ultimateMaxTimer: 0,
                ultimateType: null
            });
        });
    }
}

function checkWallCollision(x, y, w, h) {
    const canvas = document.getElementById('gameCanvas');
    if (x < 16 || x + w > canvas.width - 16 || y < 64 || y + h > canvas.height - 16) {
        return true;
    }

    if (!dungeonGate.open) {
        if (x + w > dungeonGate.x && x < dungeonGate.x + dungeonGate.w &&
            y + h > dungeonGate.y && y < dungeonGate.y + dungeonGate.h) {
            return true;
        }
    }

    for (const wall of walls) {
        if (x < wall.x + wall.w && x + w > wall.x &&
            y < wall.y + wall.h && y + h > wall.y) {
            return true;
        }
    }
    return false;
}

function createSlimeExplosion(x, y, color, isBoss, species) {
    playSound('explode');
    screenShake = isBoss ? 12 : 6;

    const particleCount = isBoss ? 35 : 18;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isBoss ? 5.0 : 3.5) + 1.0;
        let particleColor = color;
        if (species === 'zombie') particleColor = Math.random() > 0.4 ? '#2d6a4f' : '#ef4444';
        else if (species === 'skeleton') particleColor = Math.random() > 0.4 ? '#f8fafc' : '#94a3b8';
        else particleColor = Math.random() > 0.3 ? color : '#ffffff';

        particles.push({
            x: x, y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * (isBoss ? 5 : 3.5) + 2,
            color: particleColor,
            life: Math.floor(Math.random() * 18) + 14,
            maxLife: 32
        });
    }

    // Coin drops: +7 gold bonus per 5 stages
    const stage = (typeof currentStage !== 'undefined') ? currentStage : 1;
    const coinCount = isBoss 
        ? Math.floor(Math.random() * 7) + 12 
        : Math.floor(Math.random() * 4) + 3;

    // Tambahan gold +3 dan bonus +7 gold setiap 5 stage
    const stageFiveBonus = Math.floor(stage / 5) * 7;

    const coinGoldVal = (isBoss 
        ? (10 + Math.floor(stage * 0.5)) 
        : (7 + Math.floor(stage * 0.25))) + stageFiveBonus;

    for (let i = 0; i < coinCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const ejectSpeed = Math.random() * 3.0 + 1.2;
        coins.push({
            x: x, y: y,
            vx: Math.cos(angle) * ejectSpeed,
            vy: Math.sin(angle) * ejectSpeed,
            z: 0,
            vz: Math.random() * 3.8 + 2.2,
            rotation: Math.random() * Math.PI * 2,
            value: 40,
            goldValue: coinGoldVal,
            bounced: 0
        });
    }

    if (Math.random() < 0.45) {
        const lootType = Math.random() < 0.6 ? 'health' : 'shield';
        loots.push({ x: x, y: y, type: lootType, floatTimer: 0 });
    }
}

// --- THE WARDEN BOSS CREATION (STAGE 35) ---
function createWardenBoss(stageNum, spawnX = 440, spawnY = 165) {
    const wardenHp = 19800;
    const wardenShield = 900;
    return {
        id: 998,
        x: spawnX,
        y: spawnY,
        w: 58,
        h: 64,
        facing: 'left',
        hp: wardenHp,
        maxHp: wardenHp,
        shield: wardenShield,
        maxShield: wardenShield,
        speed: 0.95,
        color: '#06b6d4',
        type: 'boss',
        species: 'warden',
        title: 'THE WARDEN - ANCIENT TITAN',
        level: `Lv.${stageNum} THE WARDEN 🔊💀👑`,
        phase60Triggered: false,
        phase30Triggered: false,
        isInvulnerable: false,
        sonicBoomTimer: 0,
        stompTimer: 0,
        tendrilTimer: 0,
        roarTimer: 0,
        ultimateTimer: 0,
        ultimateMaxTimer: 0,
        ultimateType: null
    };
}

// --- ALTER EGO BOSS CREATION (TRUE MIRROR OF PLAYER ROLE) ---
function createAlterEgoBoss(stageNum, spawnX = 450, spawnY = 175, isApex = false) {
    const playerRole = (player && player.characterRole) ? player.characterRole : 'knight';
    // Alter ego SELALU mencerminkan karakter yang dipilih oleh pemain (True Mirror)
    const chosenRole = playerRole;

    const isStage50 = (stageNum >= 50 || isApex);
    let equippedSet = {};
    let bossTitle = '';
    let bossHp = isStage50 ? 28800 : 8438;
    let bossShield = isStage50 ? 1200 : 450;
    let bossSpeed = isStage50 ? 1.25 : 1.15;

    if (chosenRole === 'knight') {
        bossTitle = isStage50 ? 'APEX VOID KNIGHT (SCULK MIRROR)' : 'SHADOW DRAGON KNIGHT';
        bossHp = isStage50 ? 30000 : 8200;
        bossShield = isStage50 ? 800 : 350;
        bossSpeed = isStage50 ? 1.15 : 1.05;
        equippedSet = {
            weapon: 'weapon_dragon_slayer',
            armor: 'armor_dragon_scale',
            helmet: 'helmet_dragon_helm',
            shield: 'shield_dragon_aegis',
            boots: 'boots_dragon_stride',
            cape: 'cape_dragon_wings'
        };
    } else if (chosenRole === 'mage') {
        bossTitle = isStage50 ? 'APEX VOID ARCHMAGE (SCULK MIRROR)' : 'SHADOW COSMIC ARCHMAGE';
        bossHp = isStage50 ? 27000 : 7929;
        bossShield = isStage50 ? 1200 : 450;
        bossSpeed = isStage50 ? 1.28 : 1.18;
        equippedSet = {
            weapon: 'weapon_cosmic_archstaff',
            armor: 'armor_archmage_vestment',
            helmet: 'helmet_astral_crown',
            shield: 'shield_cosmic_nova_orb',
            boots: 'boots_dimension_stride',
            cape: 'cape_eternal_nebula'
        };
    } else { // assassin
        bossTitle = isStage50 ? 'APEX VOID REAPER (SCULK MIRROR)' : 'SHADOW PHANTOM REAPER';
        bossHp = isStage50 ? 25200 : 7596;
        bossShield = isStage50 ? 1000 : 380;
        bossSpeed = isStage50 ? 1.45 : 1.35;
        equippedSet = {
            weapon: 'weapon_phantom_deathblades',
            armor: 'armor_phantom_suit',
            helmet: 'helmet_reaper_mask',
            shield: 'shield_shadow_guard',
            boots: 'boots_lightning_striders',
            cape: 'cape_blood_specter'
        };
    }

    return {
        id: 999,
        x: spawnX,
        y: spawnY,
        w: 24,
        h: 28,
        facing: 'left',
        hp: bossHp,
        maxHp: bossHp,
        shield: bossShield,
        maxShield: bossShield,
        speed: bossSpeed,
        color: isStage50 ? '#06b6d4' : '#dc2626',
        type: 'boss',
        species: 'alter_ego',
        alterEgoRole: chosenRole,
        title: bossTitle,
        level: isStage50 ? `Lv.${stageNum} TRUE MIRROR ALTER EGO 👑` : `Lv.${stageNum} ALTER EGO 👑`,
        isApexMirror: isStage50,
        equipped: equippedSet,
        isAttacking: false,
        attackTime: 0,
        attackDuration: 20,
        attackCooldown: isStage50 ? 38 : 50,
        slashArcProgress: 0,
        aiTimer: 0,
        specialTimer: 0,
        teleportTimer: 0,
        phase: 1,
        phase60Triggered: false,
        phase30Triggered: false,
        isInvulnerable: false,
        isShieldGuarding: false,
        isInvisible: false,
        evasionCooldown: 0,
        ultimateTimer: 0,
        ultimateMaxTimer: 0,
        ultimateType: null
    };
}

