// Automated Test Suite for Main Menu Flow & Achievement System
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import assert from 'assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock DOM and browser environment
const localStorageData = {};
global.window = global;
global.localStorage = {
    getItem: (key) => localStorageData[key] || null,
    setItem: (key, val) => { localStorageData[key] = String(val); },
    removeItem: (key) => { delete localStorageData[key]; }
};

global.document = {
    getElementById: (id) => ({
        width: 640,
        height: 384,
        textContent: '',
        classList: {
            toggle: () => {},
            add: () => {},
            remove: () => {},
            contains: () => false
        },
        setAttribute: () => {},
        removeAttribute: () => {},
        querySelector: () => ({ textContent: '' }),
        getContext: () => ({
            save: () => {},
            restore: () => {},
            fillRect: () => {},
            strokeRect: () => {},
            fillText: () => {},
            measureText: () => ({ width: 50 }),
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {}
        })
    })
};

global.keys = {};
global.gameState = 'MAIN_MENU';
global.currentStage = 1;
global.mouseX = 0;
global.mouseY = 0;
global.isHovering = (x, y, w, h, pad = 0) => (
    global.mouseX >= x - pad && global.mouseX <= x + w + pad &&
    global.mouseY >= y - pad && global.mouseY <= y + h + pad
);
global.score = 0;
global.screenShake = 0;
global.particles = [];
global.floatingTexts = [];
global.enemyProjectiles = [];
global.playerProjectiles = [];
global.loots = [];
global.coins = [];
global.mobs = [];
global.dungeonGate = { x: 580, y: 165, w: 42, h: 58, open: false, swirlTimer: 0 };
global.soundsPlayed = [];
global.playSound = (s) => global.soundsPlayed.push(s);
global.checkWallCollision = () => false;

// Load core modules
const modules = [
    'js/particles.js',
    'js/stages.js',
    'js/equipment.js',
    'js/player.js',
    'js/skills.js',
    'js/dialogue.js',
    'js/mobs.js',
    'js/combat.js',
    'js/shop.js',
    'js/event-room.js',
    'js/achievements.js',
    'js/draw/hud.js'
];

modules.forEach(f => {
    const filePath = path.resolve(__dirname, '..', f);
    const code = fs.readFileSync(filePath, 'utf8');
    vm.runInThisContext(code);
});

console.log('====================================================');
console.log('🏆 TESTING MAIN MENU & ACHIEVEMENT PROGRESSION SYSTEM');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: ACHIEVEMENT SYSTEM DEFINITIONS & METRICS
// -----------------------------------------------------------------------------
console.log('--- [TEST 1] ACHIEVEMENT REGISTRY & INTEGRITY ---');
assert.strictEqual(ACHIEVEMENTS_LIST.length, 18, 'Must have exactly 18 achievements');
const achIds = new Set(ACHIEVEMENTS_LIST.map(a => a.id));
assert.strictEqual(achIds.size, 18, 'All 18 achievements must have unique IDs');

const categories = ['combat', 'wealth', 'tactics', 'progress'];
categories.forEach(cat => {
    const inCat = ACHIEVEMENTS_LIST.filter(a => a.category === cat);
    assert.ok(inCat.length >= 3, `Category ${cat} should have at least 3 achievements`);
});
console.log('✓ 18 Achievements registered across 4 balanced categories (combat, wealth, tactics, progress)');

// -----------------------------------------------------------------------------
// TEST 2: STAT TRACKING & UNLOCK TRIGGERS
// -----------------------------------------------------------------------------
console.log('\n--- [TEST 2] COMBAT STATS & MONSTER KILL UNLOCKS ---');
const tracker = achievementTracker;

// Kills
assert.ok(!tracker.isUnlocked('first_blood'), 'First Blood initially locked');
tracker.onKill({ species: 'slime', type: 'normal' });
assert.ok(tracker.isUnlocked('first_blood'), 'First Blood unlocks on 1st kill');
assert.strictEqual(soundsPlayed[soundsPlayed.length - 1], 'achievement', 'Achievement sound played on unlock');

// Accumulate to 25 kills
for (let i = 0; i < 24; i++) {
    tracker.onKill({ species: 'slime', type: 'normal' });
}
assert.ok(tracker.isUnlocked('slime_hunter'), 'Slime Hunter unlocks at 25 kills');

// Accumulate to 100 kills
for (let i = 0; i < 75; i++) {
    tracker.onKill({ species: 'goblin', type: 'normal' });
}
assert.ok(tracker.isUnlocked('monster_slayer'), 'Monster Slayer unlocks at 100 kills');
console.log('✓ Total Kills progression (1 -> 25 -> 100) verified');

// Boss Kills
assert.ok(!tracker.isUnlocked('dragon_slayer'), 'Dragon Slayer initially locked');
tracker.onKill({ species: 'dragon', type: 'boss' });
assert.ok(tracker.isUnlocked('dragon_slayer'), 'Dragon Slayer unlocks on Ancient Dragon death');

tracker.onKill({ species: 'alter_ego', type: 'boss', isApexMirror: false });
assert.ok(tracker.isUnlocked('alter_ego_slayer'), 'Shadow Nemesis unlocks on Alter Ego death');

tracker.onKill({ species: 'warden', type: 'boss' });
assert.ok(tracker.isUnlocked('warden_conqueror'), 'Warden Slayer unlocks on The Warden death');

tracker.onKill({ species: 'alter_ego', type: 'boss', isApexMirror: true });
assert.ok(tracker.isUnlocked('apex_champion'), 'Apex Champion unlocks on Apex Mirror shattered');
console.log('✓ All 4 dungeon biome bosses trigger their respective achievements');

// -----------------------------------------------------------------------------
// TEST 3: WEALTH, SHOPPING & EQUIPMENT PROGRESSION
// -----------------------------------------------------------------------------
console.log('\n--- [TEST 3] WEALTH, SHOPPING & ARSENAL PROGRESSION ---');
tracker.onGoldCollected(600);
assert.ok(tracker.isUnlocked('gold_digger'), 'Gold Digger unlocks at 500+ gold');

tracker.onGoldCollected(2500); // total 3100
assert.ok(tracker.isUnlocked('treasure_hoarder'), 'Treasure Hoarder unlocks at 3000+ gold');

tracker.onGoldCollected(7000); // total 10100
assert.ok(tracker.isUnlocked('dungeon_tycoon'), 'Dungeon Tycoon unlocks at 10000+ gold');

initPlayer();
player.inventory = ['weapon_starter', 'weapon_broadsword', 'armor_iron', 'ring_speed'];
tracker.onItemPurchased({ id: 'weapon_broadsword' });
assert.ok(tracker.isUnlocked('first_purchase'), 'Arms Deal unlocks on 1st shop item purchase');
assert.ok(tracker.isUnlocked('arsenal_master'), 'Arsenal Master unlocks when owning 4+ items');
console.log('✓ Gold milestones (500 -> 3000 -> 10000) & Shop equipment collection verified');

// -----------------------------------------------------------------------------
// TEST 4: TACTICS, DEFENSE & EXPLORATION
// -----------------------------------------------------------------------------
console.log('\n--- [TEST 4] TACTICAL COMBAT & EXPLORATION MILESTONES ---');
for (let i = 0; i < 30; i++) {
    tracker.onSkillUsed({ id: 'whirlwind' });
}
assert.ok(tracker.isUnlocked('skill_expert'), 'Skill Virtuoso unlocks at 30 skill uses');

tracker.onDamageShielded(350);
assert.ok(tracker.isUnlocked('iron_wall'), 'Iron Bastion unlocks at 300+ damage shielded');

tracker.onStageCleared(1, false); // stage 1 cleared without taking HP damage
assert.ok(tracker.isUnlocked('untouchable'), 'Untouchable unlocks on flawless stage completion');

tracker.onStageCleared(9, true); // cleared stage 9, reaching stage 10
assert.ok(tracker.isUnlocked('survivor_10'), 'Dungeon Survivor unlocks at Stage 10 reached');

tracker.onRouletteSpin();
assert.ok(tracker.isUnlocked('lucky_gambler'), 'Lucky Gambler unlocks on Event Room roulette spin');

tracker.onRoleSelected('knight');
tracker.onRoleSelected('mage');
assert.ok(!tracker.isUnlocked('versatile_hero'), 'Versatile hero requires 3 classes');
tracker.onRoleSelected('assassin');
assert.ok(tracker.isUnlocked('versatile_hero'), 'Heroic Versatility unlocks when all 3 roles tried');
console.log('✓ Tactical shield, flawless stage, roulette spin, and 3-class mastery verified');

// -----------------------------------------------------------------------------
// TEST 5: PERSISTENCE & LOCALSTORAGE RELIABILITY
// -----------------------------------------------------------------------------
console.log('\n--- [TEST 5] PERSISTENCE & LOCALSTORAGE ---');
tracker.save();
assert.ok(localStorageData[ACHIEVEMENTS_STORAGE_KEY], 'Saved state must exist in localStorage');

const freshTracker = new AchievementTracker();
assert.strictEqual(freshTracker.getUnlockedCount(), 18, 'All 18 achievements should restore from localStorage');
console.log('✓ All 18 achievements and player lifetime stats successfully persist across game reloads');

// -----------------------------------------------------------------------------
// TEST 6: TOAST NOTIFICATIONS & OVERLAY PAGINATION
// -----------------------------------------------------------------------------
console.log('\n--- [TEST 6] TOAST NOTIFICATIONS & PAGINATION ---');
assert.ok(achievementToasts.length > 0 || currentToast !== null, 'Toasts must be queued on unlock');
updateAchievementToasts();
assert.ok(currentToast !== null, 'Current active toast must be loaded');

openAchievementsScreen('MAIN_MENU');
assert.strictEqual(gameState, 'ACHIEVEMENTS', 'State transitions to ACHIEVEMENTS');
assert.strictEqual(achievementsReturnState, 'MAIN_MENU', 'Return state recorded as MAIN_MENU');
assert.strictEqual(achievementsPage, 0, 'Initial achievements page is 0 (Page 1)');

// Verify step-by-step pagination navigation (never skips Page 2)
global.mouseX = 320 + 70 + 20;
global.mouseY = 258 + 10;
handleAchievementsClick();
assert.strictEqual(achievementsPage, 1, 'Page 1 advances exactly to Page 2 (not skipping to 3)');

lastAchievementNavTime = 0;
handleAchievementsClick();
assert.strictEqual(achievementsPage, 2, 'Page 2 advances to Page 3');

// Navigate back one page at a time
lastAchievementNavTime = 0;
global.mouseX = 320 - 170 + 20;
global.mouseY = 258 + 10;
handleAchievementsClick();
assert.strictEqual(achievementsPage, 1, 'Page 3 returns exactly to Page 2 (not skipping to 1)');

lastAchievementNavTime = 0;
handleAchievementsClick();
assert.strictEqual(achievementsPage, 0, 'Page 2 returns to Page 1');

closeAchievementsScreen();
assert.strictEqual(gameState, 'MAIN_MENU', 'State correctly returns to MAIN_MENU');
console.log('✓ Toast notifications, achievements overlay modal, and single-step pagination verified');

console.log('\n====================================================');
console.log('🎉 ALL MAIN MENU & ACHIEVEMENT TESTS PASSED!');
console.log('====================================================');
