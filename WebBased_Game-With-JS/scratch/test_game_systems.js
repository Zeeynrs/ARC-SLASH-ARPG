// Consolidated Game Systems & Mechanics Automated Test Suite
import fs from 'fs';
import vm from 'vm';
import assert from 'assert';

// Mock DOM and browser environment
global.window = global;
global.document = {
    getElementById: () => ({
        width: 640,
        height: 384,
        getContext: () => ({
            save: () => {},
            restore: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} }),
            fillRect: () => {},
            strokeRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {},
            measureText: () => ({ width: 50 }),
            fillText: () => {}
        })
    })
};
global.keys = {};
global.gameState = 'PLAYING';
global.currentStage = 1;
global.score = 0;
global.screenShake = 0;
global.particles = [];
global.floatingTexts = [];
global.enemyProjectiles = [];
global.playerProjectiles = [];
global.loots = [];
global.coins = [];
global.dungeonGate = { x: 580, y: 165, w: 42, h: 58, open: false, swirlTimer: 0 };
global.soundsPlayed = [];
global.playSound = (s) => global.soundsPlayed.push(s);
global.checkWallCollision = () => false;

// Load all core game modules
const coreModules = [
    'js/particles.js',
    'js/stages.js',
    'js/equipment.js',
    'js/player.js',
    'js/skills.js',
    'js/dialogue.js',
    'js/mobs.js',
    'js/combat.js',
    'js/event-room.js',
    'js/draw/hud.js'
];

coreModules.forEach(f => {
    const code = fs.readFileSync(f, 'utf8');
    vm.runInThisContext(code);
});

console.log('====================================================');
console.log('🎮 RUNNING CONSOLIDATED GAME SYSTEMS TEST SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: CHARACTER DAMAGE, STAGE SCALING, & ITEM DEPENDENCY
// -----------------------------------------------------------------------------
console.log('--- [SUITE 1] CHARACTER DAMAGE & ITEM DEPENDENCY ---');
assert.strictEqual(CHARACTER_ROLES.knight.baseDamage, 24, 'Knight baseDamage should be 24');
assert.strictEqual(CHARACTER_ROLES.mage.baseDamage, 22, 'Mage baseDamage should be 22');
assert.strictEqual(CHARACTER_ROLES.assassin.baseDamage, 18, 'Assassin baseDamage should be 18');
console.log('✓ Base damages: Knight=24, Mage=22, Assassin=18');

selectCharacter('knight');
currentStage = 1;
assert.strictEqual(getPlayerDamage(), 24, 'Stage 1 damage should be 24');

currentStage = 10;
assert.strictEqual(getPlayerDamage(), 24 + Math.round(9 * 1.5), 'Stage 10 should add +14 stage bonus');

currentStage = 35;
const unequippedDmg = getPlayerDamage(); // 24 + 51 = 75
player.inventory.push('weapon_sculk_greatsword');
equipItem('weapon_sculk_greatsword');
const equippedDmg = getPlayerDamage(); // 75 + 135 = 210
assert.strictEqual(equippedDmg, 210, 'Stage 35 damage with Tier 5 Sculk weapon should be 210');
assert.ok(equippedDmg >= unequippedDmg * 2.5, 'Weapons should provide >2.5x damage scaling');
console.log('✓ Stage scaling & item dependency verified (Gear accounts for 64% of high-stage DPS)');

// Combat pacing: 50 HP slime survives hit 1, defeated on hit 2
currentStage = 1;
selectCharacter('knight');
player.x = 100;
player.y = 100;
const slimeMob = { id: 101, x: 120, y: 100, w: 20, h: 20, hp: 50, maxHp: 50, speed: 1 };
mobs = [slimeMob];
keys['j'] = true;
updateCombat();
player.attackTime = player.attackDuration;
updateCombat();
keys['j'] = false;
assert.ok(slimeMob.hp > 0 && slimeMob.hp <= 30, 'Slime survives hit 1 (no instant one-shot)');

player.attackCooldown = 0;
keys['j'] = true;
updateCombat();
player.attackTime = player.attackDuration;
updateCombat();
keys['j'] = false;
assert.ok(slimeMob.hp <= 0, 'Slime defeated cleanly in 2 hits');
console.log('✓ Early game pacing verified: 2-3 hits per mob, no starter gear one-shots');

// Skills
assert.strictEqual(ROLE_SKILLS.knight[0].damage, 45, 'Whirlwind base damage should be 45');
assert.strictEqual(ROLE_SKILLS.knight[2].damage, 60, 'Shield Bash base damage should be 60');
assert.strictEqual(ROLE_SKILLS.mage[0].damage, 50, 'Fireball base damage should be 50');
assert.strictEqual(ROLE_SKILLS.mage[2].damage, 65, 'Cosmic Storm base damage should be 65');
assert.strictEqual(ROLE_SKILLS.assassin[0].damage, 45, 'Shadow Dash base damage should be 45');
assert.strictEqual(ROLE_SKILLS.assassin[2].damage, 30, 'Poison Fan base damage should be 30');
console.log('✓ Role skills damage formulas rebalanced and verified');


// -----------------------------------------------------------------------------
// SUITE 2: BOSS ARMOR PENETRATION & DAMAGE MITIGATION
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 2] BOSS ARMOR PENETRATION & DAMAGE MITIGATION ---');
const originalGetPlayerDefense = getPlayerDefense;
getPlayerDefense = () => 65; // High defense player (def = 65)

player.hp = 150;
player.shield = 100;
player.invulnerableTimer = 0;
soundsPlayed.length = 0;
floatingTexts.length = 0;

// Regular mob attack (70 raw vs 65 def -> 5 dmg absorbed by shield)
damagePlayer(70, '👾', false);
assert.strictEqual(player.shield, 95, 'Regular attack should reduce shield by 5 after flat defense');
assert.strictEqual(player.hp, 150, 'Regular attack should not penetrate intact shield');
console.log('✓ Regular mob attack flat-mitigated by player defense');

// Boss attack with 2.2x armor shredding
player.invulnerableTimer = 0;
player.shield = 100;
player.hp = 150;
floatingTexts.length = 0;
soundsPlayed.length = 0;
damagePlayer(135, '⚔️', true);
assert.strictEqual(player.shield, 0, 'Boss attack should completely shatter 100 shield with 2.2x shred');
assert.strictEqual(player.hp, 83, 'Boss attack should pierce through shattered shield and deal 67 HP damage');
assert.ok(floatingTexts.some(t => t.text.includes('ARMOR SHATTERED!')), 'Should show ARMOR SHATTERED text');
console.log('✓ Boss armor shredding (2.2x multiplier) and HP piercing verified');

// Broken armor lethal hit
player.invulnerableTimer = 0;
player.shield = 0;
player.hp = 83;
damagePlayer(145, '🌀', true);
assert.strictEqual(player.hp, 0, 'Direct boss attack on 0 shield finishes player');
assert.strictEqual(gameState, 'GAMEOVER', 'Game state transitions to GAMEOVER');
console.log('✓ Broken armor lethal attack transitions to GAMEOVER');
gameState = 'PLAYING';
getPlayerDefense = originalGetPlayerDefense;


// -----------------------------------------------------------------------------
// SUITE 3: BOSS MECHANICS & TELEGRAPH DANGER ZONES
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 3] BOSS MECHANICS & TELEGRAPH DANGER ZONES ---');
clearTelegraphZones();
addTelegraphCircle({ x: 100, y: 100, radius: 30, duration: 2, dmg: 30, effectType: 'meteor' });
addTelegraphLine({ x1: 50, y1: 50, x2: 200, y2: 50, width: 20, duration: 2, dmg: 25, effectType: 'slash' });
assert.strictEqual(telegraphZones.length, 2, 'Should spawn 2 telegraph zones');

updateTelegraphZones();
assert.strictEqual(telegraphZones[0].timer, 1, 'Zone countdown progresses');

updateTelegraphZones();
assert.strictEqual(telegraphZones.length, 0, 'Telegraph zones detonate and clear');
console.log('✓ Telegraph zones countdown and detonation verified');

// Invulnerability check
const invulMob = { x: 200, y: 150, w: 32, h: 32, hp: 1000, maxHp: 1000, isInvulnerable: true, shield: 0 };
assert.strictEqual(damageMob(invulMob, 100), 0, 'Invulnerable mob must take 0 damage');
console.log('✓ Mob invulnerability verified');

// Alter Ego phase ultimates
loadStage(22);
let mageBoss = createAlterEgoBoss(22, 450, 175);
mageBoss.alterEgoRole = 'mage';
mobs = [mageBoss];
mageBoss.hp = mageBoss.maxHp * 0.58;
updateCombat();
assert.strictEqual(mageBoss.phase60Triggered, true, 'Mage phase 60 ultimate triggers');
assert.strictEqual(mageBoss.isInvulnerable, true, 'Mage gains invulnerability during ultimate');
console.log('✓ Alter Ego timed ultimate execution verified');

// Knight Frontal Shield Block
let guardKnight = createAlterEgoBoss(22, 300, 180);
guardKnight.alterEgoRole = 'knight';
guardKnight.isShieldGuarding = true;
guardKnight.shield = 0;
guardKnight.facing = 'left';
player.x = 240;
player.y = 180;
const blockedDmg = damageMob(guardKnight, 100);
assert.strictEqual(blockedDmg, 70, 'Knight shield guard should block 30% frontal damage');
console.log('✓ Knight frontal shield block (-30% damage) verified');

// Knight counter-attack opening when shield is dropped
guardKnight.isShieldGuarding = false;
const unblockedDmg = damageMob(guardKnight, 100);
assert.strictEqual(unblockedDmg, 100, 'Knight should take 100% full damage when shield is lowered');
console.log('✓ Knight counter-attack opening (100% unblocked damage) verified');


// -----------------------------------------------------------------------------
// SUITE 4: DEEP DARK BIOME, WARDEN BOSS, & STAGE 50 APEX MIRROR
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 4] DEEP DARK BIOME, WARDEN BOSS, & APEX MIRROR ---');
assert.strictEqual(STAGE_CONFIGS.length, 50, 'Total stages should be 50');

// Stage 35 Warden
loadStage(35);
const warden = mobs.find(m => m.species === 'warden');
assert.ok(warden, 'Warden boss spawned on Stage 35');
assert.ok(warden.maxHp >= 18000, 'Warden HP >= 18000');
warden.hp = warden.maxHp * 0.55;
updateCombat();
assert.strictEqual(warden.phase60Triggered, true, 'Warden phase 60 triggered');
assert.strictEqual(warden.ultimateType, 'warden_sonic_cataclysm', 'Warden triggers Sonic Cataclysm');
console.log(`✓ Warden boss verified (HP: ${warden.maxHp}, Shield: ${warden.shield}, Sonic Cataclysm ultimate)`);

// Stage 50 Apex Mirror Reflection
selectCharacter('knight');
loadStage(50);
const knightMirror = mobs.find(m => m.species === 'alter_ego');
assert.strictEqual(knightMirror.alterEgoRole, 'knight', 'Stage 50 mirrors Knight');
assert.ok(knightMirror.maxHp >= 30000, 'Apex Mirror HP >= 30000');

selectCharacter('mage');
loadStage(50);
const mageMirror = mobs.find(m => m.species === 'alter_ego');
assert.strictEqual(mageMirror.alterEgoRole, 'mage', 'Stage 50 mirrors Mage');

selectCharacter('assassin');
loadStage(50);
const assassinMirror = mobs.find(m => m.species === 'alter_ego');
assert.strictEqual(assassinMirror.alterEgoRole, 'assassin', 'Stage 50 mirrors Assassin');
console.log('✓ Stage 50 True Mirror alter ego role reflection verified for all 3 classes');


// -----------------------------------------------------------------------------
// SUITE 5: EVENT ROOM & PROGRESSIVE ROULETTE
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 5] EVENT ROOM & PROGRESSIVE ROULETTE ---');
gameState = 'EVENT_ROOM';
initEventRoom(6);
assert.strictEqual(eventRoom.freeSpinAvailable, true, 'First spin is free');
assert.strictEqual(eventRoom.spinCost, 75, 'Base spin cost is 75');

// Spin 1: Free
player.gold = 500;
spinRoulette();
assert.strictEqual(player.gold, 500, 'Free spin does not deduct gold');
eventRoom.roulette.isSpinning = false;

// Spin 2: 75 gold -> next is 150
spinRoulette();
assert.strictEqual(player.gold, 425, 'Spin 2 deducts 75 gold');
assert.strictEqual(eventRoom.spinCost, 150, 'Spin cost scales to 150');
eventRoom.roulette.isSpinning = false;

// Spin 3: 150 gold -> next is 250
spinRoulette();
assert.strictEqual(player.gold, 275, 'Spin 3 deducts 150 gold');
assert.strictEqual(eventRoom.spinCost, 250, 'Spin cost scales to 250');
eventRoom.roulette.isSpinning = false;

// Spin 4: 250 gold -> next is 400
spinRoulette();
assert.strictEqual(player.gold, 25, 'Spin 4 deducts 250 gold');
assert.strictEqual(eventRoom.spinCost, 400, 'Spin cost scales to 400');
eventRoom.roulette.isSpinning = false;

// Spin 5: Unaffordable (player has 25, cost is 400)
spinRoulette();
assert.strictEqual(player.gold, 25, 'Insufficient gold prevents spin');
assert.strictEqual(eventRoom.roulette.isSpinning, false, 'Wheel does not spin');

// Reset on exit
leaveEventRoom();
assert.strictEqual(eventRoom.freeSpinAvailable, true, 'Free spin resets on room exit');
assert.strictEqual(eventRoom.spinCost, 75, 'Spin cost resets to 75');
console.log('✓ Progressive roulette costs (Free -> 75 -> 150 -> 250 -> 400) and room reset verified');

console.log('\n====================================================');
console.log('🎉 ALL 5 CONSOLIDATED TEST SUITES PASSED SUCCESSFULLY!');
console.log('====================================================');
