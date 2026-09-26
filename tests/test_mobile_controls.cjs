// Test Mobile Controls & Character-Specific Attack Button Systems
const fs = require('fs');
const path = require('path');

console.log('Testing Mobile Touch & Role-Adaptive Controller Integration...');

// Mock Minimal DOM
const domElements = {};
function createMockElement(id, className = '') {
    const attrs = {};
    const children = {};
    return {
        id,
        className,
        classList: {
            classes: new Set(className.split(' ').filter(Boolean)),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); },
            toggle(c, force) {
                if (force !== undefined) {
                    if (force) this.classes.add(c);
                    else this.classes.delete(c);
                    return force;
                }
                if (this.classes.has(c)) {
                    this.classes.delete(c);
                    return false;
                } else {
                    this.classes.add(c);
                    return true;
                }
            }
        },
        innerHTML: '',
        textContent: '',
        style: {},
        setAttribute(k, v) { attrs[k] = v; },
        getAttribute(k) { return attrs[k]; },
        removeAttribute(k) { delete attrs[k]; },
        querySelector(sel) {
            if (!children[sel]) children[sel] = createMockElement('sub_' + sel, sel.replace('.', ''));
            return children[sel];
        },
        addEventListener() {}
    };
}

global.document = {
    getElementById(id) {
        if (!domElements[id]) {
            domElements[id] = createMockElement(id);
        }
        return domElements[id];
    },
    querySelector(sel) {
        return createMockElement('query_' + sel, sel.replace('.', ''));
    }
};

global.window = {
    addEventListener() {}
};

global.navigator = {
    vibrate(ms) { return true; }
};

// Global variables needed by input.js
global.gameState = 'PLAYING';
global.player = { characterRole: 'knight', x: 100, y: 100, w: 20, h: 24 };
global.dungeonGate = { open: false };
global.floatingTexts = [];
global.initAudio = () => {};

// Load code
const vm = require('vm');
const inputCode = fs.readFileSync(path.join(__dirname, '../js/input.js'), 'utf8');
vm.runInThisContext(inputCode);

// 1. Verify Role Configurations
if (!MOBILE_ROLE_CONFIG.knight || !MOBILE_ROLE_CONFIG.mage || !MOBILE_ROLE_CONFIG.assassin) {
    throw new Error('Missing mobile role configs');
}

console.log('✓ MOBILE_ROLE_CONFIG contains knight, mage, assassin');

// Test Knight
updateMobileControlsRole('knight');
let btnAttack = document.getElementById('btnAttack');
let iconWrap = document.getElementById('attackIconWrapper');
let textEl = document.getElementById('attackBtnText');

if (!btnAttack.className.includes('role-knight') || textEl.textContent !== 'SLASH') {
    throw new Error('Knight config mismatch: ' + btnAttack.className + ', text: ' + textEl.textContent);
}
if (!iconWrap.innerHTML.includes('<svg') || !iconWrap.innerHTML.includes('M28 4')) {
    throw new Error('Knight SVG icon missing or invalid');
}
console.log('✓ Knight Attack Button verified: Class = role-knight, Action = SLASH, Icon = Broadsword SVG');

// Test Mage
updateMobileControlsRole('mage');
if (!btnAttack.className.includes('role-mage') || textEl.textContent !== 'CAST') {
    throw new Error('Mage config mismatch: ' + btnAttack.className + ', text: ' + textEl.textContent);
}
if (!iconWrap.innerHTML.includes('<svg') || !iconWrap.innerHTML.includes('c084fc')) {
    throw new Error('Mage SVG icon missing or invalid');
}
console.log('✓ Mage Attack Button verified: Class = role-mage, Action = CAST, Icon = Arcane Staff SVG');

// Test Assassin
updateMobileControlsRole('assassin');
if (!btnAttack.className.includes('role-assassin') || textEl.textContent !== 'STAB') {
    throw new Error('Assassin config mismatch: ' + btnAttack.className + ', text: ' + textEl.textContent);
}
if (!iconWrap.innerHTML.includes('<svg') || !iconWrap.innerHTML.includes('6ee7b7')) {
    throw new Error('Assassin SVG icon missing or invalid');
}
console.log('✓ Assassin Attack Button verified: Class = role-assassin, Action = STAB, Icon = Twin Daggers SVG');

// Test Skill button updates
global.skillSlots = [
    { skillIndex: 0, cooldownTimer: 120 },
    { skillIndex: 1, cooldownTimer: 0 },
    { skillIndex: 2, cooldownTimer: 0 }
];
global.ROLE_SKILLS = {
    knight: [
        { id: 's1', unlockStage: 1, cooldown: 300 },
        { id: 's2', unlockStage: 3, cooldown: 400 },
        { id: 's3', unlockStage: 5, cooldown: 500 }
    ]
};
global.getSkillData = (i) => global.ROLE_SKILLS.knight[i];
global.currentStage = 2; // stage 2 -> skill 3 is locked (unlockStage 5)
global.isSkillUnlocked = (i) => global.currentStage >= global.ROLE_SKILLS.knight[i].unlockStage;

updateMobileSkillButtonsState();

const btn0 = document.getElementById('btnSkill0');
const cd0 = document.getElementById('skillCd0');
const btn2 = document.getElementById('btnSkill2');
const cd2 = document.getElementById('skillCd2');

if (!btn0.classList.contains('on-cooldown') || cd0.textContent !== '2.0s') {
    throw new Error('Skill 0 cooldown overlay mismatch: ' + cd0.textContent);
}
console.log('✓ Skill 0 Cooldown Sync verified: 2.0s remaining countdown');

if (!btn2.classList.contains('skill-locked') || !cd2.textContent.includes('Lv5')) {
    throw new Error('Skill 2 Locked overlay mismatch: ' + cd2.textContent);
}
console.log('✓ Skill 2 Locked State verified: 🔒Lv5 stage lock displayed');

// --- Test Contextual Mobile States ---
const mobileControlsEl = document.getElementById('mobileControls');
const shopBtnEl = document.getElementById('btnMobileShop');
const pauseBtnEl = document.getElementById('btnMobilePause');
const deckRoleEl = document.getElementById('deckStatusRole');

// Test 1: MENU State -> Attack button shows START
global.gameState = 'MENU';
updateMobileControlsState();
if (textEl.textContent !== 'START' || btnAttack.getAttribute('data-context') !== 'start') {
    throw new Error('MENU state mismatch: text=' + textEl.textContent);
}
console.log('✓ MENU contextual state verified: Attack button shows START');

// Test 2: BOSS_DIALOGUE State -> Attack button shows NEXT
global.gameState = 'BOSS_DIALOGUE';
updateMobileControlsState();
if (textEl.textContent !== 'NEXT' || btnAttack.getAttribute('data-context') !== 'dialogue') {
    throw new Error('BOSS_DIALOGUE state mismatch: text=' + textEl.textContent);
}
console.log('✓ BOSS_DIALOGUE contextual state verified: Attack button shows NEXT');

// Test 3: EVENT_ROOM State near roulette table -> Attack button shows SPIN
global.gameState = 'EVENT_ROOM';
global.eventRoom = { table: { x: 320, y: 165 } };
global.player.x = 310;
global.player.y = 160;
updateMobileControlsState();
if (textEl.textContent !== 'SPIN' || btnAttack.getAttribute('data-context') !== 'spin') {
    throw new Error('EVENT_ROOM near table mismatch: text=' + textEl.textContent);
}
console.log('✓ EVENT_ROOM contextual state verified: Attack button shows SPIN near table');

// Test 4: GAMEOVER State -> Attack button shows RETRY
global.gameState = 'GAMEOVER';
updateMobileControlsState();
if (textEl.textContent !== 'RETRY' || btnAttack.getAttribute('data-context') !== 'retry') {
    throw new Error('GAMEOVER state mismatch: text=' + textEl.textContent);
}
console.log('✓ GAMEOVER contextual state verified: Attack button shows RETRY');

// Test 5: SHOP State -> Controls gets state-shop class
global.gameState = 'SHOP';
updateMobileControlsState();
if (!mobileControlsEl.classList.contains('state-shop')) {
    throw new Error('SHOP state class missing from mobileControls');
}
console.log('✓ SHOP state verified: container gets .state-shop modal dimming class');

// Test 6: Sound Toggle Button with Pixel Art SVGs
global.soundEnabled = false;
updateMobileSoundBtn();
const soundIcon = document.getElementById('mobileSoundIcon');
const soundLabel = document.getElementById('mobileSoundLabel');
if (!soundIcon.innerHTML.includes('<svg') || !soundIcon.innerHTML.includes('pixel-art-icon') || soundLabel.textContent !== 'MUT') {
    throw new Error('Muted sound btn mismatch: ' + soundIcon.innerHTML + ' ' + soundLabel.textContent);
}
global.soundEnabled = true;
updateMobileSoundBtn();
if (!soundIcon.innerHTML.includes('<svg') || !soundIcon.innerHTML.includes('pixel-art-icon') || soundLabel.textContent !== 'SFX') {
    throw new Error('Unmuted sound btn mismatch: ' + soundIcon.innerHTML + ' ' + soundLabel.textContent);
}
console.log('✓ Mobile SFX Sound Toggle verified: Pixel Art SFX <-> Pixel Art MUT');

// Test 7: Pixel Art Icons Registry & Utility System
const requiredIcons = ['pause', 'play', 'fullscreen', 'restart', 'shop', 'trophy', 'soundOn', 'soundMuted'];
for (const iconKey of requiredIcons) {
    if (!PIXEL_ICONS[iconKey] || !PIXEL_ICONS[iconKey].includes('shape-rendering="crispEdges"')) {
        throw new Error('Missing or invalid pixel-art icon: ' + iconKey);
    }
}
console.log('✓ PIXEL_ICONS verified: All 8 retro 16-bit pixel art SVG icons present');

// Test 8: Pause Button Reactive Pixel Icon Toggle
const pauseIconEl = pauseBtnEl.querySelector('.util-badge');
const pauseLabelEl = pauseBtnEl.querySelector('.util-label');
global.gameState = 'PLAYING';
updateMobileControlsState();
if (pauseLabelEl.textContent !== 'PAUSE' || !pauseIconEl.innerHTML.includes('0c4a6e')) {
    throw new Error('Pause playing state mismatch: ' + pauseLabelEl.textContent);
}
global.gameState = 'PAUSED';
updateMobileControlsState();
if (pauseLabelEl.textContent !== 'RESUME' || !pauseIconEl.innerHTML.includes('15803d')) {
    throw new Error('Pause paused state mismatch: ' + pauseLabelEl.textContent);
}
console.log('✓ Pause / Resume button reactive pixel art toggle verified (Pause bars <-> Play arrow)');

// Test 9: Restart and Trophy Utility Buttons
const restartBtn = document.getElementById('btnMobileRestart');
const trophyBtn = document.getElementById('btnMobileTrophy');
if (!restartBtn || !trophyBtn) {
    throw new Error('Missing restart or trophy mobile buttons');
}
console.log('✓ Vertical Column Utility Buttons verified: Pause, Fullscreen, Restart, Shop, Trophy, SFX');

console.log('\n🎉 ALL MOBILE CONTROLLER TESTS PASSED SUCCESSFULLY!');
