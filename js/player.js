// --- CHARACTER ROLES DEFINITION ---
const CHARACTER_ROLES = {
    knight: {
        id: 'knight',
        name: 'Knight',
        title: 'Stalwart Guardian',
        icon: '⚔️',
        desc: 'High defense & wide sweeping arc slashes.',
        baseHp: 120,
        baseShield: 60,
        baseDamage: 24,
        baseSpeed: 2.4,
        attackType: 'melee_sword',
        attackDuration: 22,
        attackCooldown: 28,
        color: '#3b82f6',
        rating: { hp: '★★★★★', atk: '★★★★☆', spd: '★★★☆☆', def: '★★★★★' }
    },
    mage: {
        id: 'mage',
        name: 'Mage',
        title: 'Master of Arcana',
        icon: '🔮',
        desc: 'Hurls mystic magic bolts & elemental bursts.',
        baseHp: 85,
        baseShield: 40,
        baseDamage: 22,
        baseSpeed: 2.5,
        attackType: 'magic_bolt',
        attackDuration: 11,
        attackCooldown: 16,
        color: '#a855f7',
        rating: { hp: '★★★☆☆', atk: '★★★★★', spd: '★★★☆☆', def: '★★☆☆☆' }
    },
    assassin: {
        id: 'assassin',
        name: 'Assassin',
        title: 'Lethal Phantom',
        icon: '🗡️',
        desc: 'Swift mobility, stealth dash & twin daggers.',
        baseHp: 95,
        baseShield: 45,
        baseDamage: 18,
        baseSpeed: 3.1,
        attackType: 'dual_dagger',
        attackDuration: 10,
        attackCooldown: 15,
        color: '#10b981',
        rating: { hp: '★★★☆☆', atk: '★★★★☆', spd: '★★★★★', def: '★★★☆☆' }
    }
};

let selectedRole = 'knight';

// --- PLAYER OBJECT & STATE ---
const player = {
    x: 60,
    y: 200,
    w: 20,
    h: 24,
    characterRole: 'knight',
    baseSpeed: 2.4,
    speed: 2.4,
    facing: 'right',
    hp: 120,
    maxHp: 120,
    baseMaxHp: 120,
    shield: 60,
    maxShield: 60,
    baseMaxShield: 60,
    shieldRechargeTimer: 0,
    shieldHitFlashTimer: 0,
    invulnerableTimer: 0,
    baseDamage: 24,

    // Immunity Frames & Dodge/Dash System
    iFrames: 0,
    maxIFrames: 0,
    isDashing: false,
    dashTimer: 0,
    dashCooldown: 0,
    dashDx: 0,
    dashDy: 0,

    // Attack Mechanism
    isAttacking: false,
    attackTime: 0,
    attackDuration: 12,
    attackCooldown: 0,
    attackCooldownMax: 18,
    slashArcProgress: 0,
    hitMobsThisSwing: new Set(),

    // Equipment system
    equipped: null,
    inventory: [],
    
    // Gold (coins used as currency)
    gold: 0
};

function selectCharacter(role) {
    if (!CHARACTER_ROLES[role]) role = 'knight';
    selectedRole = role;
    const roleData = CHARACTER_ROLES[role];
    
    player.characterRole = role;
    player.baseMaxHp = roleData.baseHp;
    player.baseMaxShield = roleData.baseShield;
    player.baseDamage = roleData.baseDamage;
    player.baseSpeed = roleData.baseSpeed;
    player.speed = player.baseSpeed;
    player.attackDuration = roleData.attackDuration;
    player.attackCooldownMax = roleData.attackCooldown;
    
    player.equipped = getDefaultEquipment(role);
    player.inventory = Object.values(player.equipped);
    applyEquipmentStats();
    
    if (typeof initSkillsForRole === 'function') {
        initSkillsForRole(role);
    }
    if (typeof updateMobileControlsRole === 'function') {
        updateMobileControlsRole(role);
    }
}

function initPlayer() {
    selectCharacter(selectedRole);
    player.gold = 0;
    player.hp = player.maxHp;
    player.shield = player.maxShield;
}

function applyEquipmentStats() {
    if (!player.equipped) return;
    const oldMaxHp = player.maxHp || player.baseMaxHp;
    const oldMaxShield = player.maxShield || player.baseMaxShield;
    const stats = calculateEquipmentStats(player.equipped);
    player.maxHp = player.baseMaxHp + (stats.maxHpBonus || 0);
    player.maxShield = player.baseMaxShield + (stats.maxShieldBonus || 0);
    player.speed = player.baseSpeed + (stats.speedBonus || 0);
    // Increase current HP/shield by any max increase gained from equipment
    if (player.maxHp > oldMaxHp) {
        player.hp = Math.min(player.maxHp, (player.hp || 0) + (player.maxHp - oldMaxHp));
    } else {
        player.hp = Math.min(player.hp, player.maxHp);
    }
    if (player.maxShield > oldMaxShield) {
        player.shield = Math.min(player.maxShield, (player.shield || 0) + (player.maxShield - oldMaxShield));
    } else {
        player.shield = Math.min(player.shield, player.maxShield);
    }
}

function getPlayerDamage() {
    const stats = calculateEquipmentStats(player.equipped);
    const stage = (typeof currentStage !== 'undefined') ? currentStage : 1;
    // Gradual stage bonus so weapon upgrades remain the primary damage driver.
    const stageBonus = Math.round((stage - 1) * 1.5);
    return player.baseDamage + (stats.atkBonus || 0) + stageBonus;
}

function getPlayerDefense() {
    const stats = calculateEquipmentStats(player.equipped);
    return stats.defBonus || 0;
}

function equipItem(itemId) {
    const item = getEquipmentById(itemId);
    if (!item) return false;
    if (!player.inventory.includes(itemId)) return false;
    
    player.equipped[item.category] = itemId;
    applyEquipmentStats();
    return true;
}

// --- PLAYER EVASIVE DODGE / DASH WITH IMMUNITY FRAMES ---
function startPlayerDodge() {
    if (player.dashCooldown > 0 || player.isDashing || player.hp <= 0) return false;
    if (typeof gameState !== 'undefined' && gameState !== 'PLAYING' && gameState !== 'EVENT_ROOM') return false;

    // Movement direction from keys or keybinding action manager
    let dx = 0, dy = 0;
    if (typeof isActionActive === 'function') {
        if (isActionActive('moveUp')) dy -= 1;
        if (isActionActive('moveDown')) dy += 1;
        if (isActionActive('moveLeft')) dx -= 1;
        if (isActionActive('moveRight')) dx += 1;
    } else if (typeof keys !== 'undefined') {
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;
    }

    if (dx === 0 && dy === 0) {
        const facingAngle = (typeof getFacingAngle === 'function') ? getFacingAngle(player.facing || 'right') : 0;
        dx = Math.cos(facingAngle);
        dy = Math.sin(facingAngle);
    } else {
        const mag = Math.hypot(dx, dy) || 1;
        dx /= mag;
        dy /= mag;
    }

    player.isDashing = true;
    player.dashTimer = 10; // 10 ticks rapid dash
    player.dashCooldown = 42; // ~0.7s cooldown
    player.dashDx = dx;
    player.dashDy = dy;

    // Grants 20 Immunity Frames (covers entire dash + brief recovery window)
    player.iFrames = 20;
    player.maxIFrames = 20;
    player.invulnerableTimer = 20;

    if (typeof playSound === 'function') playSound('slash');

    if (typeof particles !== 'undefined') {
        for (let i = 0; i < 7; i++) {
            particles.push({
                x: player.x + player.w / 2 + (Math.random() - 0.5) * 8,
                y: player.y + player.h / 2 + (Math.random() - 0.5) * 8,
                vx: -dx * (Math.random() * 2.5 + 1.2),
                vy: -dy * (Math.random() * 2.5 + 1.2),
                size: Math.random() * 3 + 2,
                color: '#38bdf8',
                life: 14
            });
        }
    }
    return true;
}

