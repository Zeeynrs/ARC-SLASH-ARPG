// --- ARC SLASH ARPG: ACHIEVEMENTS & PERSISTENT PROGRESSION SYSTEM ---
// Handles 18 distinct achievement goals, stats tracking, persistence (localStorage),
// in-game toast banner notifications, and dedicated achievement UI modal.

const ACHIEVEMENTS_STORAGE_KEY = 'arc_slash_achievements_v1';

// 18 Balanced Achievements covering Combat, Wealth, Tactics, and Exploration
const ACHIEVEMENTS_LIST = [
    {
        id: 'first_blood',
        category: 'combat',
        icon: '⚔️',
        title: 'First Blood',
        desc: 'Kalahkan monster pertamamu di dungeon.',
        target: 1,
        getProgress: (s) => Math.min(1, s.totalKills || 0),
        formatProgress: (s) => `${Math.min(1, s.totalKills || 0)} / 1`
    },
    {
        id: 'slime_hunter',
        category: 'combat',
        icon: '🎯',
        title: 'Slime Hunter',
        desc: 'Kalahkan 25 monster dungeon.',
        target: 25,
        getProgress: (s) => Math.min(25, s.totalKills || 0),
        formatProgress: (s) => `${Math.min(25, s.totalKills || 0)} / 25`
    },
    {
        id: 'monster_slayer',
        category: 'combat',
        icon: '💀',
        title: 'Monster Slayer',
        desc: 'Kalahkan 100 monster dungeon.',
        target: 100,
        getProgress: (s) => Math.min(100, s.totalKills || 0),
        formatProgress: (s) => `${Math.min(100, s.totalKills || 0)} / 100`
    },
    {
        id: 'dragon_slayer',
        category: 'combat',
        icon: '🐉',
        title: 'Dragon Slayer',
        desc: 'Kalahkan Ancient Dragon di Stage 21.',
        target: 1,
        getProgress: (s) => (s.dragonDefeated ? 1 : 0),
        formatProgress: (s) => (s.dragonDefeated ? '1 / 1' : '0 / 1')
    },
    {
        id: 'alter_ego_slayer',
        category: 'combat',
        icon: '👥',
        title: 'Shadow Nemesis',
        desc: 'Kalahkan Alter Ego Bos Cermin di Stage 22.',
        target: 1,
        getProgress: (s) => (s.alterEgoDefeated ? 1 : 0),
        formatProgress: (s) => (s.alterEgoDefeated ? '1 / 1' : '0 / 1')
    },
    {
        id: 'warden_conqueror',
        category: 'combat',
        icon: '🔊',
        title: 'Warden Slayer',
        desc: 'Kalahkan The Warden di Stage 35 (Deep Dark).',
        target: 1,
        getProgress: (s) => (s.wardenDefeated ? 1 : 0),
        formatProgress: (s) => (s.wardenDefeated ? '1 / 1' : '0 / 1')
    },
    {
        id: 'apex_champion',
        category: 'combat',
        icon: '👑',
        title: 'Apex Champion',
        desc: 'Hancurkan Apex Sculk Mirror di Stage 50.',
        target: 1,
        getProgress: (s) => (s.apexDefeated ? 1 : 0),
        formatProgress: (s) => (s.apexDefeated ? '1 / 1' : '0 / 1')
    },
    {
        id: 'gold_digger',
        category: 'wealth',
        icon: '🪙',
        title: 'Gold Digger',
        desc: 'Kumpulkan total 500 keping emas (Gold).',
        target: 500,
        getProgress: (s) => Math.min(500, s.totalGoldCollected || 0),
        formatProgress: (s) => `${Math.min(500, s.totalGoldCollected || 0)} / 500`
    },
    {
        id: 'treasure_hoarder',
        category: 'wealth',
        icon: '💰',
        title: 'Treasure Hoarder',
        desc: 'Kumpulkan total 3,000 keping emas.',
        target: 3000,
        getProgress: (s) => Math.min(3000, s.totalGoldCollected || 0),
        formatProgress: (s) => `${Math.min(3000, s.totalGoldCollected || 0)} / 3000`
    },
    {
        id: 'dungeon_tycoon',
        category: 'wealth',
        icon: '💎',
        title: 'Dungeon Tycoon',
        desc: 'Kumpulkan total 10,000 keping emas.',
        target: 10000,
        getProgress: (s) => Math.min(10000, s.totalGoldCollected || 0),
        formatProgress: (s) => `${Math.min(10000, s.totalGoldCollected || 0)} / 10000`
    },
    {
        id: 'first_purchase',
        category: 'wealth',
        icon: '🛒',
        title: 'Arms Deal',
        desc: 'Beli senjata atau armor pertama dari Toko.',
        target: 1,
        getProgress: (s) => Math.min(1, s.itemsPurchased || 0),
        formatProgress: (s) => `${Math.min(1, s.itemsPurchased || 0)} / 1`
    },
    {
        id: 'arsenal_master',
        category: 'wealth',
        icon: '🗡️',
        title: 'Arsenal Master',
        desc: 'Miliki minimal 4 perlengkapan senjata di inventaris.',
        target: 4,
        getProgress: (s) => Math.min(4, s.maxInventorySize || 0),
        formatProgress: (s) => `${Math.min(4, s.maxInventorySize || 0)} / 4`
    },
    {
        id: 'skill_expert',
        category: 'tactics',
        icon: '⚡',
        title: 'Skill Virtuoso',
        desc: 'Gunakan keahlian (Skill) tempur sebanyak 30 kali.',
        target: 30,
        getProgress: (s) => Math.min(30, s.skillsUsed || 0),
        formatProgress: (s) => `${Math.min(30, s.skillsUsed || 0)} / 30`
    },
    {
        id: 'iron_wall',
        category: 'tactics',
        icon: '🛡️',
        title: 'Iron Bastion',
        desc: 'Serap 300 damage menggunakan Armor / Shield.',
        target: 300,
        getProgress: (s) => Math.min(300, Math.floor(s.damageShielded || 0)),
        formatProgress: (s) => `${Math.min(300, Math.floor(s.damageShielded || 0))} / 300`
    },
    {
        id: 'untouchable',
        category: 'tactics',
        icon: '✨',
        title: 'Untouchable',
        desc: 'Selesaikan 1 stage dungeon tanpa terkena luka HP.',
        target: 1,
        getProgress: (s) => Math.min(1, s.flawlessStages || 0),
        formatProgress: (s) => (s.flawlessStages > 0 ? '1 / 1' : '0 / 1')
    },
    {
        id: 'survivor_10',
        category: 'progress',
        icon: '🚩',
        title: 'Dungeon Survivor',
        desc: 'Capai Lantai (Stage) 10 di dungeon.',
        target: 10,
        getProgress: (s) => Math.min(10, s.maxStageReached || 1),
        formatProgress: (s) => `${Math.min(10, s.maxStageReached || 1)} / 10`
    },
    {
        id: 'lucky_gambler',
        category: 'progress',
        icon: '🎲',
        title: 'Lucky Gambler',
        desc: 'Putar Roda Keberuntungan di Ruang Event Roulette.',
        target: 1,
        getProgress: (s) => Math.min(1, s.rouletteSpins || 0),
        formatProgress: (s) => `${Math.min(1, s.rouletteSpins || 0)} / 1`
    },
    {
        id: 'versatile_hero',
        category: 'progress',
        icon: '🌟',
        title: 'Heroic Versatility',
        desc: 'Mainkan ketiga karakter (Knight, Mage, & Assassin).',
        target: 3,
        getProgress: (s) => (s.rolesPlayed ? Object.keys(s.rolesPlayed).length : 0),
        formatProgress: (s) => `${s.rolesPlayed ? Object.keys(s.rolesPlayed).length : 0} / 3`
    }
];

// Persistent Achievement Tracker
class AchievementTracker {
    constructor() {
        this.stats = {
            totalKills: 0,
            totalGoldCollected: 0,
            itemsPurchased: 0,
            maxInventorySize: 0,
            skillsUsed: 0,
            damageShielded: 0,
            flawlessStages: 0,
            maxStageReached: 1,
            rouletteSpins: 0,
            rolesPlayed: {},
            dragonDefeated: false,
            alterEgoDefeated: false,
            wardenDefeated: false,
            apexDefeated: false
        };
        this.unlocked = {};
        this.load();
    }

    load() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.stats) this.stats = Object.assign(this.stats, parsed.stats);
                    if (parsed.unlocked) this.unlocked = Object.assign(this.unlocked, parsed.unlocked);
                }
            }
        } catch (_) {}
    }

    save() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({
                    stats: this.stats,
                    unlocked: this.unlocked
                }));
            }
        } catch (_) {}
    }

    isUnlocked(id) {
        return !!this.unlocked[id];
    }

    getUnlockedCount() {
        return Object.keys(this.unlocked).length;
    }

    getTotalCount() {
        return ACHIEVEMENTS_LIST.length;
    }

    triggerUnlock(achievement) {
        if (this.unlocked[achievement.id]) return;
        this.unlocked[achievement.id] = { timestamp: Date.now() };
        this.save();

        // Queue in-game toast notification
        queueAchievementToast(achievement);

        // Sound effect
        if (typeof playSound === 'function') {
            playSound('achievement');
        }
    }

    checkAll() {
        for (let i = 0; i < ACHIEVEMENTS_LIST.length; i++) {
            const ach = ACHIEVEMENTS_LIST[i];
            if (this.isUnlocked(ach.id)) continue;
            const progress = ach.getProgress(this.stats);
            if (progress >= ach.target) {
                this.triggerUnlock(ach);
            }
        }
    }

    onKill(mob) {
        this.stats.totalKills = (this.stats.totalKills || 0) + 1;

        if (mob) {
            if (mob.species === 'dragon') {
                this.stats.dragonDefeated = true;
            }
            if (mob.species === 'alter_ego') {
                if (mob.isApexMirror || (typeof currentStage !== 'undefined' && currentStage >= 50)) {
                    this.stats.apexDefeated = true;
                } else {
                    this.stats.alterEgoDefeated = true;
                }
            }
            if (mob.species === 'warden') {
                this.stats.wardenDefeated = true;
            }
        }

        this.checkAll();
    }

    onGoldCollected(amount) {
        const val = parseInt(amount, 10) || 0;
        if (val > 0) {
            this.stats.totalGoldCollected = (this.stats.totalGoldCollected || 0) + val;
            this.checkAll();
        }
    }

    onItemPurchased(item) {
        this.stats.itemsPurchased = (this.stats.itemsPurchased || 0) + 1;
        if (typeof player !== 'undefined' && player && Array.isArray(player.inventory)) {
            this.stats.maxInventorySize = Math.max(this.stats.maxInventorySize || 0, player.inventory.length);
        }
        this.checkAll();
    }

    onSkillUsed(skill) {
        this.stats.skillsUsed = (this.stats.skillsUsed || 0) + 1;
        this.checkAll();
    }

    onDamageShielded(amount) {
        const val = parseFloat(amount) || 0;
        if (val > 0) {
            this.stats.damageShielded = (this.stats.damageShielded || 0) + val;
            this.checkAll();
        }
    }

    onStageCleared(stageNum, tookDamage) {
        const nextStageNum = stageNum + 1;
        this.stats.maxStageReached = Math.max(this.stats.maxStageReached || 1, nextStageNum);

        if (!tookDamage) {
            this.stats.flawlessStages = (this.stats.flawlessStages || 0) + 1;
        }

        this.checkAll();
    }

    onRouletteSpin() {
        this.stats.rouletteSpins = (this.stats.rouletteSpins || 0) + 1;
        this.checkAll();
    }

    onRoleSelected(role) {
        if (!this.stats.rolesPlayed) this.stats.rolesPlayed = {};
        if (role) {
            this.stats.rolesPlayed[role] = true;
            this.checkAll();
        }
    }
}

// Global instance
const achievementTracker = new AchievementTracker();

// --- IN-GAME ACHIEVEMENT TOAST QUEUE ---
let achievementToasts = [];
let currentToast = null;

function queueAchievementToast(achievement) {
    achievementToasts.push({
        achievement,
        timer: 190,
        maxTimer: 190
    });
}

function updateAchievementToasts() {
    if (!currentToast && achievementToasts.length > 0) {
        currentToast = achievementToasts.shift();
    }

    if (currentToast) {
        currentToast.timer--;
        if (currentToast.timer <= 0) {
            currentToast = null;
        }
    }
}

function drawAchievementToasts(ctx) {
    if (!currentToast) return;

    const ach = currentToast.achievement;
    const progress = currentToast.timer / currentToast.maxTimer;
    
    // Slide down in first 20 frames, slide up in last 20 frames
    let animOffset = 0;
    const enterFrames = 20;
    const exitFrames = 20;
    const elapsed = currentToast.maxTimer - currentToast.timer;

    if (elapsed < enterFrames) {
        animOffset = (1 - (elapsed / enterFrames)) * -60;
    } else if (currentToast.timer < exitFrames) {
        animOffset = (1 - (currentToast.timer / exitFrames)) * -60;
    }

    const toastW = 320;
    const toastH = 46;
    const toastX = (640 - toastW) / 2;
    const toastY = 12 + animOffset;

    ctx.save();

    // Backdrop with forged border
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(toastX, toastY, toastW, toastH);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(toastX, toastY, toastW, toastH);

    // Left Icon Square
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(toastX + 4, toastY + 4, 38, 38);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(toastX + 4, toastY + 4, 38, 38);

    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ach.icon || '🏆', toastX + 23, toastY + 28);

    // Header Tag
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('★ PENCAPAIAN TERBUKA! ★', toastX + 48, toastY + 16);

    // Achievement Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(ach.title, toastX + 48, toastY + 29);

    // Short Goal
    ctx.fillStyle = '#94a3b8';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(ach.desc, toastX + 48, toastY + 40, toastW - 54);

    ctx.restore();
}

// --- ACHIEVEMENTS SCREEN OVERLAY ---
let achievementsPage = 0;
const ACHIEVEMENTS_PER_PAGE = 6;
let achievementsReturnState = 'MAIN_MENU';

function openAchievementsScreen(returnState = 'MAIN_MENU') {
    achievementsReturnState = returnState;
    achievementsPage = 0;
    gameState = 'ACHIEVEMENTS';
    if (typeof playSound === 'function') playSound('slash');
}

function drawAchievementsOverlay(ctx, canvas) {
    // Backdrop
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText('TROPHY ROOM / PENCAPAIAN', canvas.width / 2, 28);

    const unlockedCount = achievementTracker.getUnlockedCount();
    const totalCount = achievementTracker.getTotalCount();
    const pct = Math.round((unlockedCount / totalCount) * 100);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`PROGRES TOTAL: ${unlockedCount} / ${totalCount} TERBUKA (${pct}%)`, canvas.width / 2, 44);

    // Achievement Cards (2 columns x 3 rows = 6 per page)
    const cardW = 286;
    const cardH = 58;
    const gapX = 16;
    const gapY = 8;
    const startX = (canvas.width - (2 * cardW + gapX)) / 2;
    const startY = 56;

    const totalPages = Math.ceil(ACHIEVEMENTS_LIST.length / ACHIEVEMENTS_PER_PAGE);
    const startIndex = achievementsPage * ACHIEVEMENTS_PER_PAGE;
    const pageItems = ACHIEVEMENTS_LIST.slice(startIndex, startIndex + ACHIEVEMENTS_PER_PAGE);

    for (let i = 0; i < pageItems.length; i++) {
        const ach = pageItems[i];
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = startX + col * (cardW + gapX);
        const cy = startY + row * (cardH + gapY);

        const isUnlocked = achievementTracker.isUnlocked(ach.id);
        const progress = ach.getProgress(achievementTracker.stats);
        const progressRatio = Math.min(1, progress / ach.target);

        // Card Frame
        ctx.fillStyle = isUnlocked ? '#111827' : '#0e121c';
        ctx.fillRect(cx, cy, cardW, cardH);

        ctx.strokeStyle = isUnlocked ? '#f59e0b' : '#222f42';
        ctx.lineWidth = isUnlocked ? 1.5 : 1;
        ctx.strokeRect(cx, cy, cardW, cardH);

        // Left Icon Box
        ctx.fillStyle = isUnlocked ? '#1f2937' : '#141a24';
        ctx.fillRect(cx + 6, cy + 6, 44, 46);
        ctx.strokeStyle = isUnlocked ? '#10b981' : '#27354a';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + 6, cy + 6, 44, 46);

        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isUnlocked ? ach.icon : '🔒', cx + 28, cy + 34);

        // Title
        ctx.textAlign = 'left';
        ctx.fillStyle = isUnlocked ? '#fbbf24' : '#64748b';
        ctx.font = '7.5px "Press Start 2P", monospace';
        ctx.fillText(ach.title, cx + 56, cy + 18, cardW - 62);

        // Description
        ctx.fillStyle = isUnlocked ? '#94a3b8' : '#475569';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(ach.desc, cx + 56, cy + 30, cardW - 62);

        // Progress Bar & Status Text
        const barX = cx + 56;
        const barY = cy + 40;
        const barW = 135;
        const barH = 6;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(barX, barY, barW, barH);

        ctx.fillStyle = isUnlocked ? '#22c55e' : '#38bdf8';
        ctx.fillRect(barX, barY, barW * progressRatio, barH);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Progress text label
        ctx.textAlign = 'right';
        ctx.fillStyle = isUnlocked ? '#4ade80' : '#94a3b8';
        ctx.font = '5.5px "Press Start 2P", monospace';
        const progLabel = isUnlocked ? 'TERBUKA ✓' : ach.formatProgress(achievementTracker.stats);
        ctx.fillText(progLabel, cx + cardW - 8, cy + 46);
    }

    // Bottom Navigation Bar
    const navY = 258;

    // Prev Button
    const prevX = canvas.width / 2 - 170;
    const prevW = 100;
    const prevH = 28;
    const prevHover = (typeof isHovering === 'function') && isHovering(prevX, navY, prevW, prevH);
    ctx.fillStyle = prevHover ? '#2563eb' : (achievementsPage > 0 ? '#1e3a8a' : '#172033');
    ctx.fillRect(prevX, navY, prevW, prevH);
    ctx.strokeStyle = achievementsPage > 0 ? '#3b82f6' : '#27354a';
    ctx.lineWidth = 1;
    ctx.strokeRect(prevX, navY, prevW, prevH);

    ctx.textAlign = 'center';
    ctx.fillStyle = achievementsPage > 0 ? '#ffffff' : '#475569';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('◄ PREV [A]', prevX + prevW / 2, navY + 17);

    // Page Dots / Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '7.5px "Press Start 2P", monospace';
    ctx.fillText(`PAGE ${achievementsPage + 1} / ${totalPages}`, canvas.width / 2, navY + 17);

    // Next Button
    const nextX = canvas.width / 2 + 70;
    const nextW = 100;
    const nextH = 28;
    const nextHover = (typeof isHovering === 'function') && isHovering(nextX, navY, nextW, nextH);
    ctx.fillStyle = nextHover ? '#2563eb' : (achievementsPage < totalPages - 1 ? '#1e3a8a' : '#172033');
    ctx.fillRect(nextX, navY, nextW, nextH);
    ctx.strokeStyle = achievementsPage < totalPages - 1 ? '#3b82f6' : '#27354a';
    ctx.lineWidth = 1;
    ctx.strokeRect(nextX, navY, nextW, nextH);

    ctx.fillStyle = achievementsPage < totalPages - 1 ? '#ffffff' : '#475569';
    ctx.fillText('NEXT [D] ►', nextX + nextW / 2, navY + 17);

    // Back to Menu Button
    const backX = canvas.width / 2 - 100;
    const backY = 296;
    const backW = 200;
    const backH = 34;
    const backHover = (typeof isHovering === 'function') && isHovering(backX, backY, backW, backH);

    ctx.fillStyle = backHover ? '#374151' : '#1f2937';
    ctx.fillRect(backX, backY, backW, backH);
    ctx.strokeStyle = backHover ? '#9ca3af' : '#4b5563';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(backX, backY, backW, backH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    const returnLabel = (achievementsReturnState === 'PAUSED') ? 'KEMBALI KE PAUSE [ESC]' : 'KEMBALI KE MENU [ESC]';
    ctx.fillText(returnLabel, canvas.width / 2, backY + 21);

    // Hints
    ctx.fillStyle = '#64748b';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.fillText('Ganti Halaman: [A] / [D] atau Klik | Kembali: [ESC] / [Q]', canvas.width / 2, 348);
    ctx.fillText('Semua pencapaian tersimpan otomatis di perangkat Anda!', canvas.width / 2, 364);

    ctx.textAlign = 'left';
}

function handleAchievementsClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const navY = 258;
    const totalPages = Math.ceil(ACHIEVEMENTS_LIST.length / ACHIEVEMENTS_PER_PAGE);

    // Prev Button
    const prevX = canvas.width / 2 - 170;
    if (isHovering(prevX, navY, 100, 28, 6)) {
        if (achievementsPage > 0) {
            achievementsPage--;
            if (typeof playSound === 'function') playSound('slash');
        }
        return;
    }

    // Next Button
    const nextX = canvas.width / 2 + 70;
    if (isHovering(nextX, navY, 100, 28, 6)) {
        if (achievementsPage < totalPages - 1) {
            achievementsPage++;
            if (typeof playSound === 'function') playSound('slash');
        }
        return;
    }

    // Back Button
    const backX = canvas.width / 2 - 100;
    const backY = 296;
    if (isHovering(backX, backY, 200, 34, 8)) {
        closeAchievementsScreen();
        return;
    }
}

function closeAchievementsScreen() {
    if (typeof playSound === 'function') playSound('slash');
    gameState = achievementsReturnState || 'MAIN_MENU';
}

// --- HOW TO PLAY SCREEN OVERLAY ---
function drawHowToPlayOverlay(ctx, canvas) {
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText('PETUNJUK & TAKTIK BERMAIN', canvas.width / 2, 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('PANDUAN LENGKAP MENJELAJAHI 50 LANTAI DUNGEON', canvas.width / 2, 44);

    // 3 Guide Stone Panels
    const panelW = 186;
    const panelH = 216;
    const panelY = 58;
    const gap = 14;
    const totalW = 3 * panelW + 2 * gap;
    const startX = (canvas.width - totalW) / 2;

    // Panel 1: Tujuan & Progres
    ctx.fillStyle = '#111622';
    ctx.fillRect(startX, panelY, panelW, panelH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, panelY, panelW, panelH);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('🎯 TUJUAN', startX + panelW / 2, panelY + 22);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '6px "Press Start 2P", monospace';
    const linesP1 = [
        '• Taklukkan 50 lantai',
        '  dungeon labirin.',
        '',
        '• Kalahkan 3 Bos Besar:',
        '  - Dragon (Lantai 21)',
        '  - Warden (Lantai 35)',
        '  - Apex Mirror (Lt 50)',
        '',
        '• Kumpulkan 18 Trophy',
        '  Pencapaian rahasia!',
        '',
        '• Beli perlengkapan',
        '  legendaris di Toko.'
    ];
    linesP1.forEach((l, idx) => ctx.fillText(l, startX + 12, panelY + 44 + idx * 14));

    // Panel 2: Kontrol Tombol
    const p2X = startX + panelW + gap;
    ctx.fillStyle = '#111622';
    ctx.fillRect(p2X, panelY, panelW, panelH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(p2X, panelY, panelW, panelH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('🎮 KONTROL', p2X + panelW / 2, panelY + 22);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '6px "Press Start 2P", monospace';
    const linesP2 = [
        '• Gerak: [W][A][S][D] /',
        '  Tombol Panah Keyboard',
        '',
        '• Serang: [J] / [Spasi]',
        '',
        '• Skill Tempur:',
        '  Tombol [1], [2], [3]',
        '',
        '• Buka Toko Senjata: [B]',
        '  (saat gerbang terbuka)',
        '',
        '• Jeda / Pause: [ESC] / [P]'
    ];
    linesP2.forEach((l, idx) => ctx.fillText(l, p2X + 12, panelY + 44 + idx * 14));

    // Panel 3: Taktik Bertahan
    const p3X = startX + 2 * (panelW + gap);
    ctx.fillStyle = '#111622';
    ctx.fillRect(p3X, panelY, panelW, panelH);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(p3X, panelY, panelW, panelH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#34d399';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('🛡️ TAKTIK', p3X + panelW / 2, panelY + 22);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '6px "Press Start 2P", monospace';
    const linesP3 = [
        '• Perisai (Shield) menyerap',
        '  kerusakan lebih dulu.',
        '',
        '• Menjauhlah dari zona',
        '  merah bahaya Bos!',
        '',
        '• Di Ruang Event Gacha,',
        '  ada putaran Roulette',
        '  berhadiah gratis!',
        '',
        '• Perisai regenerasi',
        '  saat kamu mundur.'
    ];
    linesP3.forEach((l, idx) => ctx.fillText(l, p3X + 12, panelY + 44 + idx * 14));

    // Back Button
    ctx.textAlign = 'center';
    const backX = canvas.width / 2 - 100;
    const backY = 290;
    const backW = 200;
    const backH = 38;
    const backHover = (typeof isHovering === 'function') && isHovering(backX, backY, backW, backH);

    ctx.fillStyle = backHover ? '#16a34a' : '#15803d';
    ctx.fillRect(backX, backY, backW, backH);
    ctx.strokeStyle = backHover ? '#86efac' : '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(backX, backY, backW, backH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('KEMBALI KE MENU [ESC]', canvas.width / 2, backY + 24);

    ctx.fillStyle = '#64748b';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('Tekan [ESC] atau [ENTER] untuk kembali', canvas.width / 2, 350);

    ctx.textAlign = 'left';
}

function handleHowToPlayClick() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const backX = canvas.width / 2 - 100;
    const backY = 290;
    if (isHovering(backX, backY, 200, 38, 8)) {
        if (typeof playSound === 'function') playSound('slash');
        gameState = 'MAIN_MENU';
    }
}
