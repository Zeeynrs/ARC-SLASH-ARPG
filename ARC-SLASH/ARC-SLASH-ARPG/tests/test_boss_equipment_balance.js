import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import assert from 'assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock browser
global.window = global;
global.document = {
    getElementById: () => ({
        width: 640, height: 384,
        getContext: () => ({ save: ()=>{}, restore: ()=>{}, fillRect: ()=>{}, strokeRect: ()=>{} })
    })
};
global.keys = {};
global.screenShake = 0;
global.gameState = 'PLAYING';
global.currentStage = 20;
global.particles = [];
global.floatingTexts = [];
global.loots = [];
global.coins = [];
global.soundsPlayed = [];
global.playSound = (s) => soundsPlayed.push(s);

const modules = [
    'js/particles.js',
    'js/stages.js',
    'js/equipment.js',
    'js/player.js',
    'js/combat.js'
];
modules.forEach(m => {
    const filePath = path.resolve(__dirname, '..', m);
    const code = fs.readFileSync(filePath, 'utf8');
    vm.runInThisContext(code);
});

console.log('🎮 TESTING NEW BOSS-SLAYER EQUIPMENT BALANCE & SURVIVABILITY...\n');

// 1. KNIGHT WITH FULL TIER 5 DIVINE GODSLAYER SET
selectCharacter('knight');
const knightSet = [
    'weapon_godslayer_excalibur',
    'armor_celestial_divine_cuirass',
    'helmet_valkyrie_warcrest',
    'shield_aegis_of_the_gods',
    'boots_paladin_crusaders',
    'cape_radiant_solar_wings'
];
knightSet.forEach(id => {
    player.inventory.push(id);
    assert.ok(equipItem(id), 'Failed to equip ' + id);
});

const knightStats = calculateEquipmentStats(player.equipped);
console.log('--- KNIGHT DIVINE GODSLAYER BUILD ---');
console.log(`Max HP: ${player.maxHp} | Max Shield: ${player.maxShield} | Defense: ${getPlayerDefense()} | Attack: ${getPlayerDamage()}`);

assert.ok(player.maxHp >= 600, 'Knight HP should reach >= 600');
assert.ok(player.maxShield >= 400, 'Knight Shield should reach >= 400');
assert.ok(getPlayerDefense() >= 150, 'Knight DEF should reach >= 150');
assert.ok(getPlayerDamage() >= 300, 'Knight ATK should reach >= 300');

// Test boss hit mitigation
player.shield = player.maxShield;
player.hp = player.maxHp;
player.invulnerableTimer = 0;
// Devastating Boss attack of 135 raw damage
damagePlayer(135, '⚔️', true);
console.log(`After Boss 135-Dmg Hit: Shield remaining: ${player.shield} / ${player.maxShield}, HP: ${player.hp} / ${player.maxHp}`);
assert.strictEqual(player.hp, player.maxHp, 'Player shield absorbed the boss attack with ZERO HP loss!');
assert.ok(player.shield > 200, 'Player retains over 200 shield after taking a full boss blow!');
console.log('✓ Knight can comfortably tank boss hits and dish out 300+ damage per swing!\n');

// 2. MAGE WITH FULL TIER 5 SINGULARITY ARCHON SET
selectCharacter('mage');
const mageSet = [
    'weapon_singularity_void_orb_staff',
    'armor_chrono_god_robe',
    'helmet_crown_of_supernova',
    'shield_omniscient_void_matrix',
    'boots_astral_warp_walkers',
    'cape_singularity_infinite_shroud'
];
mageSet.forEach(id => {
    player.inventory.push(id);
    assert.ok(equipItem(id), 'Failed to equip ' + id);
});
console.log('--- MAGE VOID SINGULARITY ARCHON BUILD ---');
console.log(`Max HP: ${player.maxHp} | Max Shield: ${player.maxShield} | Defense: ${getPlayerDefense()} | Attack: ${getPlayerDamage()}`);
assert.ok(player.maxHp >= 450, 'Mage HP should reach >= 450');
assert.ok(player.maxShield >= 600, 'Mage Shield should reach >= 600');
assert.ok(getPlayerDamage() >= 350, 'Mage ATK should reach >= 350');

const aura = getMageAuraConfig();
assert.strictEqual(aura.id, 'singularity', 'Mage aura correctly identifies singularity');
console.log(`Mage Mana Aura: ${aura.name} (${aura.icon}) - Radiant radius ${aura.radius}px`);
console.log('✓ Mage builds a massive 600+ mana shield and delivers 350+ spell damage!\n');

// 3. ASSASSIN WITH FULL TIER 5 GOD-SLAYER SET
selectCharacter('assassin');
const assassinSet = [
    'weapon_god_slayer_daggers',
    'armor_abyssal_reaper_shroud',
    'helmet_crown_of_the_abyss',
    'shield_eclipse_death_matrix',
    'boots_abyssal_dimension_dashes',
    'cape_deathshade_god_mantle'
];
assassinSet.forEach(id => {
    player.inventory.push(id);
    assert.ok(equipItem(id), 'Failed to equip ' + id);
});
console.log('--- ASSASSIN ABYSSAL GOD-SLAYER BUILD ---');
console.log(`Max HP: ${player.maxHp} | Max Shield: ${player.maxShield} | Defense: ${getPlayerDefense()} | Attack: ${getPlayerDamage()} | Speed: ${player.speed.toFixed(2)}`);
assert.ok(player.maxHp >= 500, 'Assassin HP should reach >= 500');
assert.ok(player.maxShield >= 350, 'Assassin Shield should reach >= 350');
assert.ok(getPlayerDamage() >= 390, 'Assassin ATK should reach >= 390');
assert.ok(player.speed >= 5.0, 'Assassin speed enables blistering evasion');
console.log('✓ Assassin deals devastating 400+ strike damage at lightning speed!\n');

// 4. DEEP DARK BIOME EQUIPMENT LOCKS
console.log('--- DEEP DARK BIOME EQUIPMENT LOCKS (STAGE 23+) ---');
const allNewEquipmentIds = [
    // Knight
    'weapon_titan_breaker', 'weapon_godslayer_excalibur',
    'armor_colossus_bastion', 'armor_celestial_divine_cuirass',
    'helmet_titan_crown', 'helmet_valkyrie_warcrest',
    'shield_bastion_fortress', 'shield_aegis_of_the_gods',
    'boots_war_striders', 'boots_paladin_crusaders',
    'cape_warlord_banner', 'cape_radiant_solar_wings',
    // Mage
    'weapon_solar_annihilator', 'weapon_singularity_void_orb_staff',
    'armor_archon_astral_vestment', 'armor_chrono_god_robe',
    'helmet_solar_corona_diadem', 'helmet_crown_of_supernova',
    'shield_supernova_barrier', 'shield_omniscient_void_matrix',
    'boots_aether_gliders', 'boots_astral_warp_walkers',
    'cape_celestial_aurora', 'cape_singularity_infinite_shroud',
    // Assassin
    'weapon_eclipse_twin_scythes', 'weapon_god_slayer_daggers',
    'armor_dread_shadow_carapace', 'armor_abyssal_reaper_shroud',
    'helmet_phantom_executioner_cowl', 'helmet_crown_of_the_abyss',
    'shield_void_parry_buckler', 'shield_eclipse_death_matrix',
    'boots_ghost_treads', 'boots_abyssal_dimension_dashes',
    'cape_void_reaper_shroud', 'cape_deathshade_god_mantle'
];

allNewEquipmentIds.forEach(id => {
    const item = getEquipmentById(id);
    assert.ok(item, `Item ${id} should exist in EQUIPMENT_DB`);
    assert.strictEqual(item.minStage, 23, `Item ${id} must require Stage 23 (Deep Dark)`);
    assert.strictEqual(item.biomeName, 'DEEP DARK', `Item ${id} must have biomeName 'DEEP DARK'`);
    if (item.tier === 5) {
        assert.strictEqual(item.isGodTier, true, `Tier 5 item ${id} must have isGodTier: true`);
    }
});
console.log(`✓ All ${allNewEquipmentIds.length} new equipment pieces are strictly locked until Stage 23 (Deep Dark Biome)`);

// Test shop lock behavior across stages
const sampleExcalibur = getEquipmentById('weapon_godslayer_excalibur');
const isLockedAtStage10 = (10 < sampleExcalibur.minStage);
assert.strictEqual(isLockedAtStage10, true, 'Should be locked at Stage 10');
const isLockedAtStage23 = (23 < sampleExcalibur.minStage);
assert.strictEqual(isLockedAtStage23, false, 'Should be unlocked when reaching Stage 23 (Deep Dark)');
console.log('✓ Stage-based unlock validation confirmed (Locked before 23, Unlocked at 23+)\n');

console.log('🎉 ALL NEW BOSS-SLAYER EQUIPMENT BALANCE & LOCK TESTS PASSED SUCCESSFULLY!');

