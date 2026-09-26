// --- INPUT HANDLING WITH CUSTOM DESKTOP KEYBINDS & MENU SELECTION ---
const keys = {};
let mouseX = 0;
let mouseY = 0;
let mouseClicked = false;

const DEFAULT_KEYBINDS = {
    moveUp: { label: 'Move Up', defaultKey: 'W / ↑', keys: ['w', 'arrowup'] },
    moveDown: { label: 'Move Down', defaultKey: 'S / ↓', keys: ['s', 'arrowdown'] },
    moveLeft: { label: 'Move Left', defaultKey: 'A / ←', keys: ['a', 'arrowleft'] },
    moveRight: { label: 'Move Right', defaultKey: 'D / →', keys: ['d', 'arrowright'] },
    attack: { label: 'Attack / Slash', defaultKey: 'J / Space', keys: ['j', ' '] },
    dodge: { label: 'Dodge / Dash (i-Frames)', defaultKey: 'Shift / K', keys: ['shift', 'k'] },
    skill1: { label: 'Skill 1', defaultKey: '1 / U', keys: ['1', 'u'] },
    skill2: { label: 'Skill 2', defaultKey: '2 / I', keys: ['2', 'i'] },
    skill3: { label: 'Skill 3', defaultKey: '3 / O', keys: ['3', 'o'] },
    shop: { label: 'Open Shop', defaultKey: 'B', keys: ['b'] },
    pause: { label: 'Pause / Resume', defaultKey: 'Esc / P', keys: ['escape', 'p'] },
    restart: { label: 'Restart Stage', defaultKey: 'R', keys: ['r'] },
    interact: { label: 'Interact / Spin', defaultKey: 'E / Enter', keys: ['e', 'enter'] }
};

let currentKeybinds = null;
let rebindActiveAction = null;
let keybindReturnState = 'PAUSED';
let settingsReturnState = 'PAUSED';

function formatKeyDisplayName(rawKey) {
    if (!rawKey) return 'NONE';
    const k = rawKey.toLowerCase();
    if (k === ' ') return 'SPACE';
    if (k === 'arrowup') return '▲ UP';
    if (k === 'arrowdown') return '▼ DOWN';
    if (k === 'arrowleft') return '◄ LEFT';
    if (k === 'arrowright') return '► RIGHT';
    if (k === 'escape' || k === 'esc') return 'ESC';
    if (k === 'enter') return 'ENTER';
    if (k === 'shift') return 'SHIFT';
    if (k === 'control' || k === 'ctrl') return 'CTRL';
    if (k === 'alt') return 'ALT';
    if (k === 'tab') return 'TAB';
    if (k === 'backspace') return 'BKSP';
    return rawKey.toUpperCase();
}

function loadCustomKeybinds() {
    try {
        const stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('arc_slash_keybinds') : null;
        if (stored) {
            currentKeybinds = JSON.parse(stored);
            for (const act in DEFAULT_KEYBINDS) {
                if (!currentKeybinds[act] || !Array.isArray(currentKeybinds[act].keys)) {
                    currentKeybinds[act] = JSON.parse(JSON.stringify(DEFAULT_KEYBINDS[act]));
                }
            }
            if (typeof window !== 'undefined') window.currentKeybinds = currentKeybinds;
            return currentKeybinds;
        }
    } catch (e) {
        console.warn('Failed to load keybinds:', e);
    }
    currentKeybinds = JSON.parse(JSON.stringify(DEFAULT_KEYBINDS));
    if (typeof window !== 'undefined') window.currentKeybinds = currentKeybinds;
    return currentKeybinds;
}

function saveCustomKeybinds() {
    try {
        if (typeof localStorage !== 'undefined' && currentKeybinds) {
            localStorage.setItem('arc_slash_keybinds', JSON.stringify(currentKeybinds));
        }
    } catch (e) {
        console.warn('Failed to save keybinds:', e);
    }
    if (typeof window !== 'undefined') window.currentKeybinds = currentKeybinds;
}

function resetCustomKeybinds() {
    currentKeybinds = JSON.parse(JSON.stringify(DEFAULT_KEYBINDS));
    saveCustomKeybinds();
    if (typeof window !== 'undefined') window.currentKeybinds = currentKeybinds;
    if (typeof playSound === 'function') playSound('buy');
}

function isActionActive(actionName) {
    if (!currentKeybinds) loadCustomKeybinds();
    const binding = currentKeybinds[actionName];
    if (binding && binding.keys) {
        for (let i = 0; i < binding.keys.length; i++) {
            if (keys[binding.keys[i].toLowerCase()]) return true;
        }
    }
    if (keys['virtual_' + actionName]) return true;
    return false;
}

function isKeyForAction(actionName, rawKey) {
    if (!currentKeybinds) loadCustomKeybinds();
    const binding = currentKeybinds[actionName];
    if (!binding || !binding.keys) return false;
    const cleanKey = (rawKey === ' ' ? ' ' : rawKey.toLowerCase());
    return binding.keys.some(k => k.toLowerCase() === cleanKey);
}

function bindActionKey(actionName, rawKey) {
    if (!currentKeybinds) loadCustomKeybinds();
    if (!currentKeybinds[actionName]) return;
    const cleanKey = (rawKey === ' ' ? ' ' : rawKey.toLowerCase());
    currentKeybinds[actionName].keys = [cleanKey];
    currentKeybinds[actionName].defaultKey = formatKeyDisplayName(rawKey);
    saveCustomKeybinds();
    if (typeof window !== 'undefined') window.currentKeybinds = currentKeybinds;
}

function openKeybindsScreen(returnState = 'PAUSED') {
    keybindReturnState = returnState;
    rebindActiveAction = null;
    gameState = 'KEYBINDS';
    if (typeof window !== 'undefined') {
        window.keybindReturnState = keybindReturnState;
        window.rebindActiveAction = null;
    }
    if (typeof playSound === 'function') playSound('slash');
}

function closeKeybindsScreen() {
    rebindActiveAction = null;
    gameState = keybindReturnState || 'PAUSED';
    if (typeof window !== 'undefined') {
        window.rebindActiveAction = null;
    }
    if (typeof playSound === 'function') playSound('slash');
}

function openSettingsScreen(returnState = 'PAUSED') {
    settingsReturnState = returnState;
    gameState = 'SETTINGS';
    if (typeof window !== 'undefined') {
        window.settingsReturnState = settingsReturnState;
    }
    if (typeof playSound === 'function') playSound('slash');
}

function closeSettingsScreen() {
    gameState = settingsReturnState || 'PAUSED';
    if (typeof playSound === 'function') playSound('slash');
}

function initInput() {
    loadCustomKeybinds();

    window.addEventListener('keydown', (e) => {
        initAudio();
        const k = e.key.toLowerCase();
        keys[k] = true;

        // Handling saat dalam menu Settings
        if (gameState === 'SETTINGS') {
            if (k === 'escape' || k === 'esc' || k === 'q') {
                closeSettingsScreen();
                e.preventDefault();
                return;
            }
            if (k === 's') {
                soundEnabled = !soundEnabled;
                if (typeof updateMobileSoundBtn === 'function') updateMobileSoundBtn();
                if (typeof playSound === 'function') playSound(soundEnabled ? 'buy' : 'hit');
                return;
            }
            if (k === '-' || k === '_') {
                if (typeof adjustMasterVolume === 'function') adjustMasterVolume(-0.1);
                if (typeof playSound === 'function') playSound('coin');
                return;
            }
            if (k === '+' || k === '=') {
                if (typeof adjustMasterVolume === 'function') adjustMasterVolume(0.1);
                if (typeof playSound === 'function') playSound('coin');
                return;
            }
            if (k === 'k' || k === 'c') {
                openKeybindsScreen('SETTINGS');
                return;
            }
            if (k === 't') {
                if (typeof cycleTickRate === 'function') cycleTickRate();
                return;
            }
            return;
        }

        // Handling saat dalam menu Re-Keybinding
        if (gameState === 'KEYBINDS') {
            if (rebindActiveAction) {
                if (k === 'escape' || k === 'esc') {
                    rebindActiveAction = null;
                    if (typeof window !== 'undefined') window.rebindActiveAction = null;
                    if (typeof playSound === 'function') playSound('shield');
                } else {
                    bindActionKey(rebindActiveAction, k);
                    rebindActiveAction = null;
                    if (typeof window !== 'undefined') window.rebindActiveAction = null;
                    if (typeof playSound === 'function') playSound('buy');
                }
                e.preventDefault();
                return;
            } else {
                if (k === 'escape' || k === 'esc' || k === 'q') {
                    closeKeybindsScreen();
                    e.preventDefault();
                    return;
                }
                if (k === 'r') {
                    resetCustomKeybinds();
                    return;
                }
                return;
            }
        }

        if (k === 'escape' || k === 'esc' || isKeyForAction('pause', k)) {
            if (gameState === 'PLAYING' || gameState === 'EVENT_ROOM') {
                gameState = 'PAUSED';
                return;
            } else if (gameState === 'PAUSED') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
                return;
            } else if (gameState === 'SHOP') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
                return;
            }
        }

        if (gameState === 'BOSS_DIALOGUE') {
            if (k === ' ' || k === 'enter' || k === 'j') {
                if (typeof advanceBossDialogue === 'function') advanceBossDialogue();
                return;
            }
            if (k === 'escape' || k === 'esc' || k === 's') {
                if (typeof skipBossDialogue === 'function') skipBossDialogue();
                return;
            }
            return;
        }

        if (gameState === 'PAUSED') {
            if (k === 'q') {
                gameState = 'MAIN_MENU';
                return;
            }
            if (k === 'a' && typeof openAchievementsScreen === 'function') {
                openAchievementsScreen('PAUSED');
                return;
            }
            if (k === 's') {
                openSettingsScreen('PAUSED');
                return;
            }
            if (k === 'k' || k === 'c') {
                openKeybindsScreen('PAUSED');
                return;
            }
            if (k === 'r') {
                resetGame(currentStage);
                return;
            }
            return;
        }

        if (gameState === 'GAMEOVER') {
            if (k === 'q') gameState = 'MAIN_MENU';
            if (k === 'a' && typeof openAchievementsScreen === 'function') openAchievementsScreen('GAMEOVER');
        }

        if (gameState === 'VICTORY') {
            if (k === 'r') {
                resetGame(1);
            } else if (k === 'q' || k === 'escape' || k === 'enter' || k === ' ') {
                gameState = 'MAIN_MENU';
            } else if (k === 'a' && typeof openAchievementsScreen === 'function') {
                openAchievementsScreen('VICTORY');
            }
            return;
        }

        // Shortcut debug untuk menambahkan koin (+5000 Gold) via hotkey 'C' atau '6'
        if ((k === 'c' || k === '6') && (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'SHOP' || gameState === 'EVENT_ROOM')) {
            if (typeof window.addCoin === 'function') window.addCoin(5000);
            return;
        }

        // Shortcut debug untuk langsung lompat ke Deep Dark Biome (Stage 23)
        if (k === '7' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
            if (typeof window.jumpToStage === 'function') window.jumpToStage(23);
            return;
        }

        // Shortcut debug untuk langsung lompat ke The Warden Boss (Stage 35)
        if (k === '8' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
            if (typeof window.jumpToStage === 'function') window.jumpToStage(35);
            return;
        }

        // Shortcut debug untuk langsung lompat ke Alter Ego Boss (Stage 22)
        if (k === '9' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
            if (typeof window.jumpToStage === 'function') window.jumpToStage(22);
            return;
        }

        // Shortcut debug untuk langsung lompat ke Apex Sculk Mirror Final Boss (Stage 50)
        if (k === '0' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
            if (typeof window.jumpToStage === 'function') window.jumpToStage(50);
            return;
        }

        if (k === 'r' || isKeyForAction('restart', k)) {
            if (gameState === 'GAMEOVER') {
                resetGame(1);
            } else if (gameState === 'PAUSED') {
                resetGame(currentStage);
            }
        }

        // Toggle tampilan kontrol sentuh HP di desktop (Shortcut 'M')
        if (k === 'm') {
            toggleMobileControlsDisplay();
        }

        // Main Menu Navigation Keybinds
        if (gameState === 'MAIN_MENU') {
            if (k === '1' || k === ' ' || k === 'enter' || k === 'p') {
                gameState = 'CHAR_SELECT';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
            if (k === '2' || k === 'a') {
                if (typeof openAchievementsScreen === 'function') openAchievementsScreen('MAIN_MENU');
                return;
            }
            if (k === '3' || k === 'h') {
                gameState = 'HOW_TO_PLAY';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
            if (k === '4') {
                openSettingsScreen('MAIN_MENU');
                return;
            }
        }

        // Achievements Screen Navigation Keybinds
        if (gameState === 'ACHIEVEMENTS') {
            if (k === 'escape' || k === 'esc' || k === 'q') {
                if (typeof closeAchievementsScreen === 'function') closeAchievementsScreen();
                return;
            }
            if (k === 'arrowleft' || k === 'a') {
                if (typeof achievementsPage !== 'undefined' && achievementsPage > 0) {
                    achievementsPage--;
                    if (typeof playSound === 'function') playSound('slash');
                }
                return;
            }
            if (k === 'arrowright' || k === 'd') {
                const totalPages = (typeof ACHIEVEMENTS_LIST !== 'undefined' && typeof ACHIEVEMENTS_PER_PAGE !== 'undefined')
                    ? Math.ceil(ACHIEVEMENTS_LIST.length / ACHIEVEMENTS_PER_PAGE) : 3;
                if (typeof achievementsPage !== 'undefined' && achievementsPage < totalPages - 1) {
                    achievementsPage++;
                    if (typeof playSound === 'function') playSound('slash');
                }
                return;
            }
        }

        // How to Play Screen Navigation Keybinds
        if (gameState === 'HOW_TO_PLAY') {
            if (k === 'escape' || k === 'esc' || k === 'q' || k === 'enter' || k === ' ') {
                gameState = 'MAIN_MENU';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
        }

        // Menu Character Selection Keybinds
        if (gameState === 'MENU' || gameState === 'CHAR_SELECT') {
            if (k === 'escape' || k === 'esc' || k === 'q') {
                gameState = 'MAIN_MENU';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
            if (k === '1') selectCharacter('knight');
            if (k === '2') selectCharacter('mage');
            if (k === '3') selectCharacter('assassin');
            
            if (k === 'arrowleft' || k === 'a') {
                const roles = ['knight', 'mage', 'assassin'];
                const idx = roles.indexOf(selectedRole);
                selectCharacter(roles[(idx + 2) % 3]);
            }
            if (k === 'arrowright' || k === 'd') {
                const roles = ['knight', 'mage', 'assassin'];
                const idx = roles.indexOf(selectedRole);
                selectCharacter(roles[(idx + 1) % 3]);
            }
            if (k === ' ' || k === 'enter' || k === 'j') {
                startGame();
            }
        }

        // Shop toggle
        if (k === 'b' || isKeyForAction('shop', k)) {
            if ((gameState === 'PLAYING' && dungeonGate.open) || gameState === 'EVENT_ROOM') {
                gameState = 'SHOP';
                shopScrollOffset = 0;
            } else if (gameState === 'SHOP') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
            }
        }

        // Skill & Action hotkeys
        if (gameState === 'PLAYING' || gameState === 'EVENT_ROOM') {
            if (isKeyForAction('dodge', k)) {
                if (typeof startPlayerDodge === 'function') startPlayerDodge();
            }
            if (k === 't' && typeof cycleTickRate === 'function') cycleTickRate();
            if (isKeyForAction('skill1', k)) activateSkill(0);
            if (isKeyForAction('skill2', k)) activateSkill(1);
            if (isKeyForAction('skill3', k)) activateSkill(2);
        }

        // Event Room Roulette spin hotkey (E, or Space/Enter when near table)
        if (gameState === 'EVENT_ROOM') {
            const tx = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.x : 320;
            const ty = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.y : 165;
            const distToTable = Math.hypot((player.x + player.w / 2) - tx, (player.y + player.h / 2) - ty);
            if (isKeyForAction('interact', k) || k === 'e' || ((k === ' ' || k === 'enter') && distToTable < 115)) {
                if (typeof spinRoulette === 'function') spinRoulette();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    const canvas = document.getElementById('gameCanvas');

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    let lastTouchEndTime = 0;

    canvas.addEventListener('mousedown', (e) => {
        // Prevent double-firing from synthetic mouse events emitted by mobile browsers after touch
        if (Date.now() - lastTouchEndTime < 500) {
            return;
        }
        initAudio();
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        mouseClicked = true;
        handleCanvasClick();
    });

    // Touch handling on gameCanvas for mobile menus, shop, dialogue, roulette, and shop scrolling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastY = 0;
    let touchMoved = false;

    canvas.addEventListener('touchstart', (e) => {
        initAudio();
        if (e.touches.length === 0) return;
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = (t.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (t.clientY - rect.top) * (canvas.height / rect.height);
        touchStartX = mouseX;
        touchStartY = mouseY;
        touchLastY = t.clientY;
        touchMoved = false;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 0) return;
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = (t.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (t.clientY - rect.top) * (canvas.height / rect.height);

        const deltaY = touchLastY - t.clientY;
        touchLastY = t.clientY;

        if (gameState === 'SHOP' && typeof handleShopScroll === 'function') {
            if (Math.abs(deltaY) > 4) {
                handleShopScroll(deltaY);
                touchMoved = true;
            }
        } else {
            if (Math.hypot(mouseX - touchStartX, mouseY - touchStartY) > 24) {
                touchMoved = true;
            }
        }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
        lastTouchEndTime = Date.now();
        if (e && e.changedTouches && e.changedTouches.length > 0) {
            const t = e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            mouseX = (t.clientX - rect.left) * (canvas.width / rect.width);
            mouseY = (t.clientY - rect.top) * (canvas.height / rect.height);
        }
        if (!touchMoved) {
            mouseClicked = true;
            handleCanvasClick();
        }
        touchMoved = false;
    }, { passive: true });

    // Mouse wheel scrolling for Shop
    canvas.addEventListener('wheel', (e) => {
        if (gameState === 'SHOP' && typeof handleShopScroll === 'function') {
            e.preventDefault();
            handleShopScroll(e.deltaY);
        }
    }, { passive: false });
}

function isHovering(x, y, w, h, pad = 0) {
    return mouseX >= (x - pad) && mouseX <= (x + w + pad) && mouseY >= (y - pad) && mouseY <= (y + h + pad);
}

function setMouseCoordinates(x, y) {
    mouseX = x;
    mouseY = y;
}

if (typeof window !== 'undefined') {
    window.setMouseCoordinates = setMouseCoordinates;
}

function handleMainMenuClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const btnW = 230;
    const btnH = 32;
    const btnX = (canvas.width - btnW) / 2;

    // Button 1: Play Game -> Character Selection
    const btn1Y = 92;
    if (isHovering(btnX, btn1Y, btnW, btnH, 4)) {
        if (typeof playSound === 'function') playSound('slash');
        gameState = 'CHAR_SELECT';
        return;
    }

    // Button 2: Achievements
    const btn2Y = 129;
    if (isHovering(btnX, btn2Y, btnW, btnH, 4)) {
        if (typeof openAchievementsScreen === 'function') {
            openAchievementsScreen('MAIN_MENU');
        }
        return;
    }

    // Button 3: How to Play
    const btn3Y = 166;
    if (isHovering(btnX, btn3Y, btnW, btnH, 4)) {
        if (typeof playSound === 'function') playSound('slash');
        gameState = 'HOW_TO_PLAY';
        return;
    }

    // Button 4: Settings / Pengaturan
    const btn4Y = 203;
    if (isHovering(btnX, btn4Y, btnW, btnH, 4)) {
        openSettingsScreen('MAIN_MENU');
        return;
    }
}

function handleSettingsClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const btnW = 260;
    const btnX = (canvas.width - btnW) / 2;

    // 1. Audio Mute / Sound FX Toggle (y: 70, h: 34)
    if (isHovering(btnX, 70, btnW, 34)) {
        soundEnabled = !soundEnabled;
        if (typeof updateMobileSoundBtn === 'function') updateMobileSoundBtn();
        if (typeof playSound === 'function') playSound(soundEnabled ? 'buy' : 'hit');
        return;
    }

    // 2. Master Volume Adjustment
    const volY = 116;
    const volH = 32;
    const minusW = 38;
    const plusW = 38;
    const barW = btnW - minusW - plusW - 16;
    const minusX = btnX;
    const barX = minusX + minusW + 8;
    const plusX = barX + barW + 8;

    // Minus Button
    if (isHovering(minusX, volY, minusW, volH)) {
        if (typeof adjustMasterVolume === 'function') adjustMasterVolume(-0.1);
        if (typeof playSound === 'function') playSound('coin');
        return;
    }

    // Volume Bar direct click
    if (isHovering(barX, volY, barW, volH)) {
        const ratio = Math.max(0, Math.min(1, (mouseX - barX) / barW));
        if (typeof setMasterVolume === 'function') setMasterVolume(ratio);
        if (typeof playSound === 'function') playSound('coin');
        return;
    }

    // Plus Button
    if (isHovering(plusX, volY, plusW, volH)) {
        if (typeof adjustMasterVolume === 'function') adjustMasterVolume(0.1);
        if (typeof playSound === 'function') playSound('coin');
        return;
    }

    // 3. Re-Keybinding Button (y: 160, h: 34)
    if (isHovering(btnX, 160, btnW, 34)) {
        openKeybindsScreen('SETTINGS');
        return;
    }

    // 4. Tick Rate Button (y: 206, h: 34)
    if (isHovering(btnX, 206, btnW, 34)) {
        if (typeof cycleTickRate === 'function') cycleTickRate();
        return;
    }

    // 5. Back Button (y: 270, h: 38)
    if (isHovering(btnX, 270, btnW, 38)) {
        closeSettingsScreen();
        return;
    }
}

function handleKeybindsClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    if (!currentKeybinds) loadCustomKeybinds();
    const actionKeys = Object.keys(currentKeybinds);

    const col1 = actionKeys.slice(0, 7);
    const col2 = actionKeys.slice(7);

    const startY = 72;
    const rowH = 28;
    const gap = 5;

    // Check Col 1
    col1.forEach((act, idx) => {
        const rx = 52;
        const ry = startY + idx * (rowH + gap);
        if (isHovering(rx, ry, 260, rowH)) {
            rebindActiveAction = act;
            if (typeof window !== 'undefined') window.rebindActiveAction = act;
            if (typeof playSound === 'function') playSound('slash');
        }
    });

    // Check Col 2
    col2.forEach((act, idx) => {
        const rx = 328;
        const ry = startY + idx * (rowH + gap);
        if (isHovering(rx, ry, 260, rowH)) {
            rebindActiveAction = act;
            if (typeof window !== 'undefined') window.rebindActiveAction = act;
            if (typeof playSound === 'function') playSound('slash');
        }
    });

    // Bottom Action Buttons: Reset defaults & Back
    if (isHovering(110, 312, 200, 32)) {
        resetCustomKeybinds();
        return;
    }
    if (isHovering(330, 312, 200, 32)) {
        closeKeybindsScreen();
        return;
    }
}

function handleCanvasClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    // Prioritas 1: Mode overlay layar penuh/modal harus diproses terlebih dahulu
    if (gameState === 'SHOP') {
        handleShopClick();
        return;
    }

    if (gameState === 'SETTINGS') {
        handleSettingsClick();
        return;
    }

    if (gameState === 'KEYBINDS') {
        handleKeybindsClick();
        return;
    }

    if (gameState === 'BOSS_DIALOGUE') {
        if (typeof handleDialogueClick === 'function') handleDialogueClick();
        return;
    }

    if (gameState === 'MAIN_MENU') {
        handleMainMenuClick();
        return;
    }

    if (gameState === 'MENU' || gameState === 'CHAR_SELECT') {
        handleMenuClick();
        return;
    }

    if (gameState === 'ACHIEVEMENTS') {
        if (typeof handleAchievementsClick === 'function') handleAchievementsClick();
        return;
    }

    if (gameState === 'HOW_TO_PLAY') {
        if (typeof handleHowToPlayClick === 'function') handleHowToPlayClick();
        return;
    }

    if (gameState === 'GAMEOVER') {
        // Button 1: Retry [R]
        const btn1X = canvas.width / 2 - 200;
        const btn1Y = 186;
        if (isHovering(btn1X, btn1Y, 190, 40, 8)) { resetGame(1); return; }

        // Button 2: Trophy [A]
        const btn2X = canvas.width / 2 + 10;
        if (isHovering(btn2X, btn1Y, 190, 40, 8)) {
            if (typeof openAchievementsScreen === 'function') openAchievementsScreen('GAMEOVER');
            return;
        }

        // Button 3: Main Menu [Q]
        const btn3X = canvas.width / 2 - 110;
        const btn3Y = 240;
        if (isHovering(btn3X, btn3Y, 220, 38, 8)) { gameState = 'MAIN_MENU'; return; }

        if (isHovering(canvas.width / 2 - 90, 224, 180, 44, 12)) resetGame(1);
        return;
    }

    if (gameState === 'VICTORY') {
        handleVictoryClick();
        return;
    }

    if (gameState === 'PAUSED') {
        const btnW = 240;
        const btnX = (canvas.width - btnW) / 2;

        // Button 1: Resume (y: 96, h: 36)
        if (isHovering(btnX, 96, btnW, 36, 4)) {
            gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
            if (typeof playSound === 'function') playSound('slash');
            return;
        }
        // Button 2: Restart Stage (y: 144, h: 36)
        if (isHovering(btnX, 144, btnW, 36, 4)) {
            resetGame(currentStage);
            return;
        }
        // Button 3: Achievements / Trophy (y: 214..248, touches y=230)
        if (isHovering(btnX, 214, btnW, 34, 4)) {
            if (typeof openAchievementsScreen === 'function') openAchievementsScreen('PAUSED');
            return;
        }
        // Button 4: Settings / Pengaturan (y: 258, h: 34)
        if (isHovering(btnX, 258, btnW, 34, 4)) {
            openSettingsScreen('PAUSED');
            return;
        }
        // Button 5: Exit to Main Menu (y: 302, h: 34)
        if (isHovering(btnX, 302, btnW, 34, 4)) {
            gameState = 'MAIN_MENU';
            if (typeof playSound === 'function') playSound('slash');
            return;
        }
    }

    // Tombol HUD (hanya aktif saat PLAYING, EVENT_ROOM, atau PAUSED)
    // Audio Mute Toggle Button (x: 606, y: 8, w: 26, h: 31)
    if (isHovering(606, 8, 26, 31, 4)) {
        soundEnabled = !soundEnabled;
        if (typeof updateMobileSoundBtn === 'function') updateMobileSoundBtn();
        return;
    }

    // Pause Toggle Button on HUD (x: 576, y: 8, w: 26, h: 31)
    if (isHovering(576, 8, 26, 31, 4)) {
        if (gameState === 'PLAYING' || gameState === 'EVENT_ROOM') gameState = 'PAUSED';
        else if (gameState === 'PAUSED') gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
        return;
    }

    // Tick Rate Toggle on HUD (x: 476, y: 8, w: 48, h: 31)
    if (isHovering(476, 8, 48, 31, 4)) {
        if (typeof cycleTickRate === 'function') cycleTickRate();
        return;
    }

    if (gameState === 'EVENT_ROOM') {
        if (typeof handleEventRoomClick === 'function') handleEventRoomClick();
        return;
    }
}

function handleMenuClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    // Character selection cards
    const cardW = 186;
    const cardH = 206;
    const cardY = 66;
    const gap = 14;
    const totalW = 3 * cardW + 2 * gap;
    const startX = (canvas.width - totalW) / 2;
    
    // Card 1: Knight
    if (isHovering(startX, cardY, cardW, cardH, 8)) {
        selectCharacter('knight');
        playSound('slash');
        return;
    }
    
    // Card 2: Mage
    if (isHovering(startX + cardW + gap, cardY, cardW, cardH, 8)) {
        selectCharacter('mage');
        playSound('slash');
        return;
    }
    
    // Card 3: Assassin
    if (isHovering(startX + 2 * (cardW + gap), cardY, cardW, cardH, 8)) {
        selectCharacter('assassin');
        playSound('slash');
        return;
    }

    // Back Button (◄ MENU [ESC])
    const backBtnX = canvas.width / 2 - 200;
    const backBtnY = 286;
    if (isHovering(backBtnX, backBtnY, 160, 42, 8)) {
        if (typeof playSound === 'function') playSound('slash');
        gameState = 'MAIN_MENU';
        return;
    }

    // Start Button (START GAME [ENTER])
    const btnX = canvas.width / 2 - 20;
    const btnY = 286;
    if (isHovering(btnX, btnY, 220, 42, 8) || isHovering(canvas.width / 2 - 100, 285, 200, 42, 10)) {
        startGame();
        return;
    }
}

function handleVictoryClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    // Button 1: Main Lagi [R]
    const btn1X = canvas.width / 2 - 210;
    const btn1Y = 296;
    const btn1W = 195;
    const btn1H = 42;
    if (isHovering(btn1X, btn1Y, btn1W, btn1H, 10)) {
        resetGame(1);
        return;
    }

    // Button 2: Menu Utama [Q]
    const btn2X = canvas.width / 2 + 15;
    const btn2Y = 296;
    const btn2W = 195;
    const btn2H = 42;
    if (isHovering(btn2X, btn2Y, btn2W, btn2H, 10)) {
        gameState = 'MAIN_MENU';
        return;
    }
}

// --- MOBILE TOUCH CONTROLS & ROLE-ADAPTIVE ATTACK BUTTON SYSTEM ---

const PIXEL_ICONS = {
    pause: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="3" y="2" width="4" height="12" fill="#0c4a6e"/>
        <rect x="3" y="2" width="3" height="11" fill="#0284c7"/>
        <rect x="3" y="2" width="2" height="10" fill="#38bdf8"/>
        <rect x="3" y="2" width="1" height="9" fill="#f0f9ff"/>
        <rect x="9" y="2" width="4" height="12" fill="#0c4a6e"/>
        <rect x="9" y="2" width="3" height="11" fill="#0284c7"/>
        <rect x="9" y="2" width="2" height="10" fill="#38bdf8"/>
        <rect x="9" y="2" width="1" height="9" fill="#f0f9ff"/>
    </svg>`,

    play: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="3" y="2" width="2" height="12" fill="#15803d"/>
        <rect x="5" y="3" width="2" height="10" fill="#16a34a"/>
        <rect x="7" y="4" width="2" height="8" fill="#22c55e"/>
        <rect x="9" y="5" width="2" height="6" fill="#4ade80"/>
        <rect x="11" y="6" width="2" height="4" fill="#86efac"/>
        <rect x="13" y="7" width="1" height="2" fill="#f0fdf4"/>
    </svg>`,

    fullscreen: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="1" y="1" width="5" height="2" fill="#38bdf8"/>
        <rect x="1" y="1" width="2" height="5" fill="#38bdf8"/>
        <rect x="2" y="2" width="3" height="1" fill="#e0f2fe"/>
        <rect x="10" y="1" width="5" height="2" fill="#38bdf8"/>
        <rect x="13" y="1" width="2" height="5" fill="#38bdf8"/>
        <rect x="11" y="2" width="3" height="1" fill="#e0f2fe"/>
        <rect x="1" y="13" width="5" height="2" fill="#0284c7"/>
        <rect x="1" y="10" width="2" height="5" fill="#0284c7"/>
        <rect x="2" y="13" width="3" height="1" fill="#38bdf8"/>
        <rect x="10" y="13" width="5" height="2" fill="#0284c7"/>
        <rect x="13" y="10" width="2" height="5" fill="#0284c7"/>
        <rect x="11" y="13" width="3" height="1" fill="#38bdf8"/>
        <rect x="7" y="6" width="2" height="4" fill="#f59e0b"/>
        <rect x="6" y="7" width="4" height="2" fill="#f59e0b"/>
        <rect x="7" y="7" width="2" height="2" fill="#fef08a"/>
    </svg>`,

    restart: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="1" y="1" width="5" height="2" fill="#f87171"/>
        <rect x="1" y="3" width="3" height="2" fill="#ef4444"/>
        <rect x="1" y="5" width="2" height="1" fill="#dc2626"/>
        <rect x="6" y="2" width="5" height="2" fill="#f87171"/>
        <rect x="11" y="3" width="2" height="2" fill="#f87171"/>
        <rect x="12" y="5" width="2" height="5" fill="#ef4444"/>
        <rect x="11" y="10" width="2" height="2" fill="#dc2626"/>
        <rect x="5" y="12" width="6" height="2" fill="#dc2626"/>
        <rect x="3" y="10" width="2" height="2" fill="#b91c1c"/>
        <rect x="2" y="7" width="2" height="3" fill="#b91c1c"/>
        <rect x="7" y="3" width="3" height="1" fill="#fef2f2"/>
    </svg>`,

    shop: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="2" y="3" width="12" height="3" fill="#92400e"/>
        <rect x="3" y="3" width="10" height="2" fill="#b45309"/>
        <rect x="4" y="3" width="8" height="1" fill="#d97706"/>
        <rect x="4" y="3" width="2" height="3" fill="#94a3b8"/>
        <rect x="10" y="3" width="2" height="3" fill="#94a3b8"/>
        <rect x="2" y="6" width="12" height="8" fill="#78350f"/>
        <rect x="3" y="7" width="10" height="6" fill="#92400e"/>
        <rect x="4" y="6" width="2" height="8" fill="#64748b"/>
        <rect x="10" y="6" width="2" height="8" fill="#64748b"/>
        <rect x="7" y="5" width="2" height="4" fill="#facc15"/>
        <rect x="7" y="6" width="2" height="1" fill="#fef08a"/>
        <rect x="7" y="7" width="2" height="1" fill="#854d0e"/>
    </svg>`,

    trophy: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="4" y="2" width="8" height="2" fill="#fef08a"/>
        <rect x="4" y="4" width="8" height="3" fill="#facc15"/>
        <rect x="5" y="7" width="6" height="2" fill="#eab308"/>
        <rect x="6" y="9" width="4" height="2" fill="#ca8a04"/>
        <rect x="7" y="11" width="2" height="2" fill="#a16207"/>
        <rect x="2" y="3" width="2" height="3" fill="#facc15"/>
        <rect x="2" y="5" width="2" height="2" fill="#ca8a04"/>
        <rect x="12" y="3" width="2" height="3" fill="#facc15"/>
        <rect x="12" y="5" width="2" height="2" fill="#ca8a04"/>
        <rect x="4" y="13" width="8" height="2" fill="#78350f"/>
        <rect x="5" y="13" width="6" height="1" fill="#b45309"/>
        <rect x="6" y="13" width="4" height="1" fill="#fde047"/>
    </svg>`,

    soundOn: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="1" y="5" width="3" height="6" fill="#475569"/>
        <rect x="2" y="6" width="2" height="4" fill="#94a3b8"/>
        <rect x="4" y="4" width="2" height="8" fill="#64748b"/>
        <rect x="6" y="3" width="2" height="10" fill="#94a3b8"/>
        <rect x="8" y="2" width="1" height="12" fill="#cbd5e1"/>
        <rect x="10" y="5" width="1" height="2" fill="#38bdf8"/>
        <rect x="11" y="7" width="1" height="2" fill="#38bdf8"/>
        <rect x="10" y="9" width="1" height="2" fill="#38bdf8"/>
        <rect x="13" y="3" width="1" height="2" fill="#7dd3fc"/>
        <rect x="14" y="5" width="1" height="6" fill="#7dd3fc"/>
        <rect x="13" y="11" width="1" height="2" fill="#7dd3fc"/>
    </svg>`,

    soundMuted: `<svg class="pixel-art-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" shape-rendering="crispEdges">
        <rect x="1" y="5" width="3" height="6" fill="#334155"/>
        <rect x="2" y="6" width="2" height="4" fill="#475569"/>
        <rect x="4" y="4" width="2" height="8" fill="#475569"/>
        <rect x="6" y="3" width="2" height="10" fill="#64748b"/>
        <rect x="8" y="2" width="1" height="12" fill="#94a3b8"/>
        <rect x="10" y="4" width="2" height="2" fill="#ef4444"/>
        <rect x="14" y="4" width="2" height="2" fill="#ef4444"/>
        <rect x="11" y="6" width="2" height="2" fill="#f87171"/>
        <rect x="13" y="6" width="2" height="2" fill="#f87171"/>
        <rect x="12" y="7" width="2" height="2" fill="#fca5a5"/>
        <rect x="11" y="8" width="2" height="2" fill="#f87171"/>
        <rect x="13" y="8" width="2" height="2" fill="#f87171"/>
        <rect x="10" y="10" width="2" height="2" fill="#ef4444"/>
        <rect x="14" y="10" width="2" height="2" fill="#ef4444"/>
    </svg>`
};

if (typeof window !== 'undefined') {
    window.PIXEL_ICONS = PIXEL_ICONS;
}

const MOBILE_ROLE_CONFIG = {
    knight: {
        attackText: 'SLASH',
        className: 'role-knight',
        skills: ['WHIRL', 'SHIELD', 'BASH'],
        svg: `<svg class="atk-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 4 L34 10 L16 28 L11 27 L12 22 Z" fill="#93c5fd" stroke="#60a5fa" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="28" y1="5" x2="14" y2="24" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 22 L18 32" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="12" y1="26" x2="6" y2="32" stroke="#b45309" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="5" cy="33" r="3" fill="#facc15" stroke="#78350f" stroke-width="1"/>
        </svg>`
    },
    mage: {
        attackText: 'CAST',
        className: 'role-mage',
        skills: ['FIRE', 'HEAL', 'STORM'],
        svg: `<svg class="atk-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="33" x2="25" y2="15" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="10" y1="31" x2="23" y2="17" stroke="#e9d5ff" stroke-width="1" stroke-linecap="round"/>
            <path d="M21 19 C20 10 31 7 34 13 C36 18 29 25 23 21" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <circle cx="28" cy="13" r="5.5" fill="#f0abfc" stroke="#ffffff" stroke-width="1.8"/>
            <line x1="28" y1="4" x2="28" y2="6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <line x1="28" y1="20" x2="28" y2="22" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <line x1="19" y1="13" x2="21" y2="13" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <line x1="35" y1="13" x2="37" y2="13" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>`
    },
    assassin: {
        attackText: 'STAB',
        className: 'role-assassin',
        skills: ['DASH', 'SMOKE', 'DAGGER'],
        svg: `<svg class="atk-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8 L14 5 L26 21 L23 23 Z" fill="#6ee7b7" stroke="#34d399" stroke-width="1.2" stroke-linejoin="round"/>
            <line x1="9" y1="7" x2="22" y2="20" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="21" y1="20" x2="27" y2="26" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
            <circle cx="28" cy="27" r="2" fill="#047857"/>
            <path d="M32 8 L26 5 L14 21 L17 23 Z" fill="#6ee7b7" stroke="#34d399" stroke-width="1.2" stroke-linejoin="round"/>
            <line x1="31" y1="7" x2="18" y2="20" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="19" y1="20" x2="13" y2="26" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
            <circle cx="12" cy="27" r="2" fill="#047857"/>
        </svg>`
    }
};

let mobileControlsInitialized = false;

let dpadLastMenuDir = 0;

function initMobileControls() {
    if (mobileControlsInitialized) return;
    mobileControlsInitialized = true;

    // --- D-PAD TOUCH & DRAG SYSTEM ---
    const dpadContainer = document.getElementById('dpadContainer');
    const dpadBtns = {
        up: document.querySelector('.dpad-btn.dpad-up'),
        down: document.querySelector('.dpad-btn.dpad-down'),
        left: document.querySelector('.dpad-btn.dpad-left'),
        right: document.querySelector('.dpad-btn.dpad-right')
    };

    let dpadTouchId = null;

    function updateDpadFromCoords(clientX, clientY) {
        if (!dpadContainer) return;
        const rect = dpadContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);

        // Reset movement states
        keys['w'] = false;
        keys['s'] = false;
        keys['a'] = false;
        keys['d'] = false;

        if (dpadBtns.up) dpadBtns.up.classList.remove('active');
        if (dpadBtns.down) dpadBtns.down.classList.remove('active');
        if (dpadBtns.left) dpadBtns.left.classList.remove('active');
        if (dpadBtns.right) dpadBtns.right.classList.remove('active');

        // Deadzone check
        if (dist < 8) return;

        // Support menu character selection via D-pad horizontal swipe
        if ((gameState === 'MENU' || gameState === 'CHAR_SELECT') && typeof selectCharacter === 'function') {
            const roles = ['knight', 'mage', 'assassin'];
            const currentRole = (typeof selectedRole !== 'undefined') ? selectedRole : 'knight';
            const idx = roles.indexOf(currentRole);
            if (dx < -16 && dpadLastMenuDir !== -1) {
                dpadLastMenuDir = -1;
                selectCharacter(roles[(idx + 2) % 3]);
                if (typeof playSound === 'function') playSound('slash');
            } else if (dx > 16 && dpadLastMenuDir !== 1) {
                dpadLastMenuDir = 1;
                selectCharacter(roles[(idx + 1) % 3]);
                if (typeof playSound === 'function') playSound('slash');
            } else if (Math.abs(dx) <= 10) {
                dpadLastMenuDir = 0;
            }
        }

        // Support 8-way diagonal moving in gameplay
        const threshold = 12;
        if (dy < -threshold) {
            keys['virtual_moveUp'] = true;
            keys['w'] = true;
            if (dpadBtns.up) dpadBtns.up.classList.add('active');
        } else if (dy > threshold) {
            keys['virtual_moveDown'] = true;
            keys['s'] = true;
            if (dpadBtns.down) dpadBtns.down.classList.add('active');
        }

        if (dx < -threshold) {
            keys['virtual_moveLeft'] = true;
            keys['a'] = true;
            if (dpadBtns.left) dpadBtns.left.classList.add('active');
        } else if (dx > threshold) {
            keys['virtual_moveRight'] = true;
            keys['d'] = true;
            if (dpadBtns.right) dpadBtns.right.classList.add('active');
        }
    }

    function clearDpad() {
        dpadTouchId = null;
        dpadLastMenuDir = 0;
        keys['virtual_moveUp'] = false;
        keys['virtual_moveDown'] = false;
        keys['virtual_moveLeft'] = false;
        keys['virtual_moveRight'] = false;
        keys['w'] = false;
        keys['s'] = false;
        keys['a'] = false;
        keys['d'] = false;
        if (dpadBtns.up) dpadBtns.up.classList.remove('active');
        if (dpadBtns.down) dpadBtns.down.classList.remove('active');
        if (dpadBtns.left) dpadBtns.left.classList.remove('active');
        if (dpadBtns.right) dpadBtns.right.classList.remove('active');
    }

    if (dpadContainer) {
        dpadContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            initAudio();
            if (dpadTouchId === null && e.changedTouches.length > 0) {
                const t = e.changedTouches[0];
                dpadTouchId = t.identifier;
                updateDpadFromCoords(t.clientX, t.clientY);
            }
        }, { passive: false });

        dpadContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (dpadTouchId !== null) {
                for (let i = 0; i < e.touches.length; i++) {
                    if (e.touches[i].identifier === dpadTouchId) {
                        updateDpadFromCoords(e.touches[i].clientX, e.touches[i].clientY);
                        break;
                    }
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            if (dpadTouchId !== null) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === dpadTouchId) {
                        clearDpad();
                        break;
                    }
                }
            }
        };

        dpadContainer.addEventListener('touchend', endTouch, { passive: false });
        dpadContainer.addEventListener('touchcancel', endTouch, { passive: false });

        // Mouse fallback on D-pad for desktop testing
        let isMouseDownOnDpad = false;
        dpadContainer.addEventListener('mousedown', (e) => {
            isMouseDownOnDpad = true;
            initAudio();
            updateDpadFromCoords(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
            if (isMouseDownOnDpad) updateDpadFromCoords(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => {
            if (isMouseDownOnDpad) {
                isMouseDownOnDpad = false;
                clearDpad();
            }
        });
    }

    // --- PRIMARY CONTEXT-AWARE ATTACK BUTTON ---
    const btnAttack = document.getElementById('btnAttack');
    if (btnAttack) {
        const startAttack = (e) => {
            if (e) e.preventDefault();
            initAudio();
            btnAttack.classList.add('active');

            if (gameState === 'MAIN_MENU') {
                gameState = 'CHAR_SELECT';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
            if (gameState === 'MENU' || gameState === 'CHAR_SELECT') {
                if (typeof startGame === 'function') startGame();
                return;
            }
            if (gameState === 'ACHIEVEMENTS') {
                if (typeof closeAchievementsScreen === 'function') closeAchievementsScreen();
                return;
            }
            if (gameState === 'HOW_TO_PLAY') {
                gameState = 'MAIN_MENU';
                if (typeof playSound === 'function') playSound('slash');
                return;
            }
            if (gameState === 'BOSS_DIALOGUE') {
                if (typeof advanceBossDialogue === 'function') advanceBossDialogue();
                return;
            }
            if (gameState === 'GAMEOVER') {
                if (typeof resetGame === 'function') resetGame(1);
                return;
            }
            if (gameState === 'VICTORY') {
                if (typeof resetGame === 'function') resetGame(1);
                return;
            }
            if (gameState === 'EVENT_ROOM') {
                const tx = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.x : 320;
                const ty = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.y : 165;
                const dist = (typeof player !== 'undefined') ? Math.hypot((player.x + player.w / 2) - tx, (player.y + player.h / 2) - ty) : 999;
                if (dist < 115 && typeof spinRoulette === 'function') {
                    spinRoulette();
                    return;
                }
            }

            keys['virtual_attack'] = true;
            keys['j'] = true;
        };

        const stopAttack = (e) => {
            if (e) e.preventDefault();
            btnAttack.classList.remove('active');
            keys['virtual_attack'] = false;
            keys['j'] = false;
        };

        btnAttack.addEventListener('touchstart', startAttack, { passive: false });
        btnAttack.addEventListener('touchend', stopAttack, { passive: false });
        btnAttack.addEventListener('touchcancel', stopAttack, { passive: false });
        btnAttack.addEventListener('mousedown', startAttack);
        btnAttack.addEventListener('mouseup', stopAttack);
        btnAttack.addEventListener('mouseleave', stopAttack);
    }

    // --- SKILL BUTTONS (1, 2, 3) ---
    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById('btnSkill' + i);
        if (!btn) continue;

        const handleSkill = (e) => {
            if (e) e.preventDefault();
            initAudio();
            if (typeof activateSkill === 'function') {
                activateSkill(i);
            }
        };

        btn.addEventListener('touchstart', handleSkill, { passive: false });
        btn.addEventListener('click', handleSkill);
    }

    // --- QUICK UTILITY BUTTONS (FULLSCREEN, SHOP, PAUSE, SFX) ---
    const btnMobileShop = document.getElementById('btnMobileShop');
    if (btnMobileShop) {
        const toggleShop = (e) => {
            if (e) e.preventDefault();
            initAudio();
            if (gameState === 'SHOP') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
            } else if ((gameState === 'PLAYING' && dungeonGate.open) || gameState === 'EVENT_ROOM') {
                gameState = 'SHOP';
                shopScrollOffset = 0;
            } else if (gameState === 'PLAYING' && !dungeonGate.open) {
                if (typeof floatingTexts !== 'undefined' && player) {
                    floatingTexts.push({
                        x: player.x + player.w / 2,
                        y: player.y - 12,
                        text: 'Defeat all enemies first! 🚪',
                        color: '#ef4444',
                        life: 45
                    });
                }
            }
        };
        btnMobileShop.addEventListener('touchstart', toggleShop, { passive: false });
        btnMobileShop.addEventListener('click', toggleShop);
    }

    const btnMobilePause = document.getElementById('btnMobilePause');
    if (btnMobilePause) {
        const togglePause = (e) => {
            if (e) e.preventDefault();
            initAudio();
            if (gameState === 'PLAYING' || gameState === 'EVENT_ROOM') {
                gameState = 'PAUSED';
            } else if (gameState === 'PAUSED') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
            } else if (gameState === 'SHOP') {
                gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
            }
        };
        btnMobilePause.addEventListener('touchstart', togglePause, { passive: false });
        btnMobilePause.addEventListener('click', togglePause);
    }

    const btnMobileSound = document.getElementById('btnMobileSound');
    if (btnMobileSound) {
        const toggleSound = (e) => {
            if (e) e.preventDefault();
            initAudio();
            soundEnabled = !soundEnabled;
            updateMobileSoundBtn();
        };
        btnMobileSound.addEventListener('touchstart', toggleSound, { passive: false });
        btnMobileSound.addEventListener('click', toggleSound);
    }

    // --- FULLSCREEN TOGGLE BUTTON ---
    const btnMobileFullscreen = document.getElementById('btnMobileFullscreen');
    if (btnMobileFullscreen) {
        const handleFullscreenClick = (e) => {
            if (e) e.preventDefault();
            initAudio();
            toggleFullscreenMode();
        };
        btnMobileFullscreen.addEventListener('touchstart', handleFullscreenClick, { passive: false });
        btnMobileFullscreen.addEventListener('click', handleFullscreenClick);
    }

    // --- RESTART BUTTON ---
    const btnMobileRestart = document.getElementById('btnMobileRestart');
    if (btnMobileRestart) {
        const handleRestart = (e) => {
            if (e) e.preventDefault();
            initAudio();
            if (typeof resetGame === 'function') {
                if (gameState === 'PAUSED') {
                    resetGame(currentStage);
                } else if (gameState === 'PLAYING' || gameState === 'GAMEOVER' || gameState === 'VICTORY') {
                    resetGame(1);
                }
            }
        };
        btnMobileRestart.addEventListener('touchstart', handleRestart, { passive: false });
        btnMobileRestart.addEventListener('click', handleRestart);
    }

    // --- TROPHY / ACHIEVEMENTS BUTTON ---
    const btnMobileTrophy = document.getElementById('btnMobileTrophy');
    if (btnMobileTrophy) {
        const handleTrophy = (e) => {
            if (e) e.preventDefault();
            initAudio();
            if (gameState === 'ACHIEVEMENTS') {
                if (typeof closeAchievementsScreen === 'function') closeAchievementsScreen();
            } else if (typeof openAchievementsScreen === 'function') {
                openAchievementsScreen(gameState === 'SHOP' ? 'PLAYING' : gameState);
            }
        };
        btnMobileTrophy.addEventListener('touchstart', handleTrophy, { passive: false });
        btnMobileTrophy.addEventListener('click', handleTrophy);
    }

    // --- DESKTOP TESTING TOGGLE BUTTON ---
    const btnToggleMobileTest = document.getElementById('btnToggleMobileTest');
    if (btnToggleMobileTest) {
        btnToggleMobileTest.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileControlsDisplay();
        });
    }

    updateMobileSoundBtn();
}

function updateMobileSoundBtn() {
    const soundIcon = document.getElementById('mobileSoundIcon');
    const soundLabel = document.getElementById('mobileSoundLabel');
    const soundBtn = document.getElementById('btnMobileSound');
    if (soundIcon && typeof PIXEL_ICONS !== 'undefined') {
        soundIcon.innerHTML = soundEnabled ? PIXEL_ICONS.soundOn : PIXEL_ICONS.soundMuted;
    }
    if (soundLabel) soundLabel.textContent = soundEnabled ? 'SFX' : 'MUT';
    if (soundBtn) soundBtn.classList.toggle('active', !soundEnabled);
}

function requestMobileFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) {
            rfs.call(el).catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        }
    }
}

function toggleFullscreenMode() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        const efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (efs) efs.call(document).catch(() => {});
    } else {
        requestMobileFullscreen();
    }
}

// Auto Fullscreen on first user touch gesture on mobile devices
let mobileFullscreenTriggered = false;
window.addEventListener('touchstart', () => {
    if (!mobileFullscreenTriggered && (('ontouchstart' in window) || (navigator && navigator.maxTouchPoints > 0))) {
        mobileFullscreenTriggered = true;
        requestMobileFullscreen();
    }
}, { passive: true });

function toggleMobileControlsDisplay() {
    const mobileControls = document.getElementById('mobileControls');
    const toggleBtn = document.getElementById('btnToggleMobileTest');
    if (!mobileControls) return;
    const isForced = mobileControls.classList.toggle('force-show');
    if (toggleBtn) {
        toggleBtn.classList.toggle('active', isForced);
        toggleBtn.textContent = isForced ? '📱 Sembunyikan HP' : '📱 Tes Tombol HP';
    }
}

function isMobileControlsActive() {
    const el = document.getElementById('mobileControls');
    if (!el) return false;
    if (typeof window === 'undefined') return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

if (typeof window !== 'undefined') {
    window.toggleMobileControls = toggleMobileControlsDisplay;
    window.isMobileControlsActive = isMobileControlsActive;
}

function updateMobileControlsRole(role) {
    const config = MOBILE_ROLE_CONFIG[role] || MOBILE_ROLE_CONFIG.knight;
    const btnAttack = document.getElementById('btnAttack');
    const attackIconWrapper = document.getElementById('attackIconWrapper');
    const attackBtnText = document.getElementById('attackBtnText');

    if (btnAttack) {
        btnAttack.className = 'mobile-attack-btn ' + config.className;
    }
    if (attackIconWrapper) {
        attackIconWrapper.innerHTML = config.svg;
    }
    if (attackBtnText) {
        attackBtnText.textContent = config.attackText;
    }

    for (let i = 0; i < 3; i++) {
        const skillNameEl = document.getElementById('skillName' + i);
        if (skillNameEl && config.skills[i]) {
            skillNameEl.textContent = config.skills[i];
        }
    }
}

function updateMobileSkillButtonsState() {
    if (typeof skillSlots === 'undefined' || typeof ROLE_SKILLS === 'undefined') return;

    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById('btnSkill' + i);
        const cdOverlay = document.getElementById('skillCd' + i);
        if (!btn || !cdOverlay) continue;

        const skill = (typeof getSkillData === 'function') ? getSkillData(i) : null;
        const slot = skillSlots[i];
        if (!skill || !slot) continue;

        const unlocked = (typeof isSkillUnlocked === 'function') ? isSkillUnlocked(i) : true;
        if (!unlocked) {
            btn.classList.add('skill-locked');
            btn.classList.remove('on-cooldown');
            cdOverlay.textContent = '🔒Lv' + skill.unlockStage;
        } else if (slot.cooldownTimer > 0) {
            btn.classList.remove('skill-locked');
            btn.classList.add('on-cooldown');
            const sec = (slot.cooldownTimer / 60).toFixed(1);
            cdOverlay.textContent = sec + 's';
        } else {
            btn.classList.remove('skill-locked');
            btn.classList.remove('on-cooldown');
            cdOverlay.textContent = '';
        }
    }
}

// --- REACTIVE STATE SYNCHRONIZATION FOR MOBILE CONTROLS ---
function updateMobileControlsState() {
    const controls = document.getElementById('mobileControls');
    const attackText = document.getElementById('attackBtnText');
    const attackBtn = document.getElementById('btnAttack');
    const shopBtn = document.getElementById('btnMobileShop');
    const pauseBtn = document.getElementById('btnMobilePause');
    const deckRole = document.getElementById('deckStatusRole');

    if (!controls) return;

    // Synchronize container state classes for contextual visibility and clean layouts
    controls.classList.toggle('state-shop', gameState === 'SHOP');
    controls.classList.toggle('state-paused', gameState === 'PAUSED');
    controls.classList.toggle('state-dialogue', gameState === 'BOSS_DIALOGUE');
    controls.classList.toggle('state-menu', gameState === 'MENU' || gameState === 'MAIN_MENU' || gameState === 'CHAR_SELECT' || gameState === 'ACHIEVEMENTS' || gameState === 'HOW_TO_PLAY');
    controls.classList.toggle('state-gameover', gameState === 'GAMEOVER');
    controls.classList.toggle('state-victory', gameState === 'VICTORY');

    // Update Shop button label
    if (shopBtn) {
        const label = shopBtn.querySelector('.util-label');
        if (label) label.textContent = (gameState === 'SHOP') ? 'BACK' : 'SHOP';
        shopBtn.classList.toggle('active', gameState === 'SHOP');
    }

    // Update Pause button label & pixel art icon
    if (pauseBtn) {
        const label = pauseBtn.querySelector('.util-label');
        const icon = pauseBtn.querySelector('.util-badge');
        if (label) label.textContent = (gameState === 'PAUSED') ? 'RESUME' : 'PAUSE';
        if (icon && typeof PIXEL_ICONS !== 'undefined') {
            icon.innerHTML = (gameState === 'PAUSED') ? PIXEL_ICONS.play : PIXEL_ICONS.pause;
        }
        pauseBtn.classList.toggle('active', gameState === 'PAUSED');
    }

    // Update Trophy button active state
    const trophyBtn = document.getElementById('btnMobileTrophy');
    if (trophyBtn) {
        trophyBtn.classList.toggle('active', gameState === 'ACHIEVEMENTS');
    }

    // Update Portrait Deck Status Role Tag
    if (deckRole && typeof player !== 'undefined') {
        const r = (player.characterRole || (typeof selectedRole !== 'undefined' ? selectedRole : 'knight')).toUpperCase();
        const stg = typeof currentStage !== 'undefined' ? currentStage : 1;
        deckRole.textContent = `${r} • STG ${stg}`;
    }

    // Update Contextual Attack Button Text & Attributes
    if (attackBtn && attackText) {
        if (gameState === 'MAIN_MENU') {
            attackText.textContent = 'PLAY';
            attackBtn.setAttribute('data-context', 'play');
        } else if (gameState === 'MENU' || gameState === 'CHAR_SELECT') {
            attackText.textContent = 'START';
            attackBtn.setAttribute('data-context', 'start');
        } else if (gameState === 'ACHIEVEMENTS' || gameState === 'HOW_TO_PLAY') {
            attackText.textContent = 'BACK';
            attackBtn.setAttribute('data-context', 'back');
        } else if (gameState === 'BOSS_DIALOGUE') {
            attackText.textContent = 'NEXT';
            attackBtn.setAttribute('data-context', 'dialogue');
        } else if (gameState === 'EVENT_ROOM') {
            const tx = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.x : 320;
            const ty = (typeof eventRoom !== 'undefined' && eventRoom.table) ? eventRoom.table.y : 165;
            const dist = (typeof player !== 'undefined') ? Math.hypot((player.x + player.w / 2) - tx, (player.y + player.h / 2) - ty) : 999;
            if (dist < 115) {
                attackText.textContent = 'SPIN';
                attackBtn.setAttribute('data-context', 'spin');
            } else {
                const currentRole = (player && player.characterRole) || (typeof selectedRole !== 'undefined' ? selectedRole : 'knight');
                const config = MOBILE_ROLE_CONFIG[currentRole] || MOBILE_ROLE_CONFIG.knight;
                attackText.textContent = config.attackText;
                attackBtn.removeAttribute('data-context');
            }
        } else if (gameState === 'GAMEOVER') {
            attackText.textContent = 'RETRY';
            attackBtn.setAttribute('data-context', 'retry');
        } else if (gameState === 'VICTORY') {
            attackText.textContent = 'AGAIN';
            attackBtn.setAttribute('data-context', 'again');
        } else {
            const currentRole = (player && player.characterRole) || (typeof selectedRole !== 'undefined' ? selectedRole : 'knight');
            const config = MOBILE_ROLE_CONFIG[currentRole] || MOBILE_ROLE_CONFIG.knight;
            attackText.textContent = config.attackText;
            attackBtn.removeAttribute('data-context');
        }
    }

    updateMobileSkillButtonsState();
}

if (typeof window !== 'undefined') {
    window.keys = keys;
    window.DEFAULT_KEYBINDS = DEFAULT_KEYBINDS;
    window.currentKeybinds = currentKeybinds;
    window.loadCustomKeybinds = loadCustomKeybinds;
    window.saveCustomKeybinds = saveCustomKeybinds;
    window.resetCustomKeybinds = resetCustomKeybinds;
    window.isActionActive = isActionActive;
    window.isKeyForAction = isKeyForAction;
    window.bindActionKey = bindActionKey;
    window.openKeybindsScreen = openKeybindsScreen;
    window.closeKeybindsScreen = closeKeybindsScreen;
    window.openSettingsScreen = openSettingsScreen;
    window.closeSettingsScreen = closeSettingsScreen;
    window.formatKeyDisplayName = formatKeyDisplayName;
    window.handleCanvasClick = handleCanvasClick;
    window.updateMobileControlsState = updateMobileControlsState;
}


