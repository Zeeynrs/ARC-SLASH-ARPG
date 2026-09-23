// --- EVENT ROOM & ROULETTE GACHA SYSTEM ---
// Random Event Chamber with Interactive Roulette Plot for Exclusive Weapons & Treasures

const eventRoom = {
    isActive: false,
    targetNextStage: 2,
    freeSpinAvailable: true,
    paidSpins: 0,
    spinCost: 75,
    
    // Altar Table & Roulette Position
    table: {
        x: 320,
        y: 165,
        radius: 76
    },

    // Exit Portal on the Right
    exitPortal: {
        x: 585,
        y: 175,
        w: 42,
        h: 60,
        swirlTimer: 0
    },

    // Roulette State
    roulette: {
        angle: 0,
        speed: 0,
        friction: 0.968,
        isSpinning: false,
        lastTickAngle: 0,
        result: null,
        bannerTimer: 0,
        bannerText: '',
        bannerSubText: '',
        bannerColor: '#f1c40f'
    },

    // Confetti & Sparks in Event Room
    particles: [],

    // Slices for Roulette (8 segments)
    slices: [
        { id: 'zonk1', name: 'ZONK', icon: 'X', color: '#1e293b', textColor: '#f87171', type: 'zonk' },
        { id: 'gold100', name: '+100 G', icon: 'G', color: '#b45309', textColor: '#ffffff', type: 'gold', amount: 100 },
        { id: 'potion', name: 'ELIXIR', icon: 'HP', color: '#047857', textColor: '#ffffff', type: 'potion' },
        { id: 'zonk2', name: 'ZONK', icon: 'X', color: '#334155', textColor: '#f87171', type: 'zonk' },
        { id: 'gold250', name: '+250 G', icon: 'G', color: '#92400e', textColor: '#ffffff', type: 'gold', amount: 250 },
        { id: 'gear', name: 'ARMOR', icon: 'DEF', color: '#6d28d9', textColor: '#ffffff', type: 'gear' },
        { id: 'gold400', name: '+400 G', icon: 'G', color: '#0369a1', textColor: '#ffffff', type: 'gold', amount: 400 },
        { id: 'exclusive', name: 'RELIC', icon: 'EX', color: '#b91c1c', textColor: '#fef08a', type: 'exclusive' }
    ]
};

// Progressive Roulette Spin Cost calculation
// Spins become progressively more expensive within the same event room.
function getRouletteSpinCost(paidSpinCount = 0) {
    // 0 paid spins (1st paid spin after Free Spin): 75
    // 1 paid spin: 150
    // 2 paid spins: 250
    // 3 paid spins: 400
    // 4 paid spins: 600
    // 5 paid spins: 850
    // 6+ paid spins: +300 each
    const costs = [75, 150, 250, 400, 600, 850];
    if (paidSpinCount < costs.length) {
        return costs[paidSpinCount];
    }
    return costs[costs.length - 1] + (paidSpinCount - (costs.length - 1)) * 300;
}

// Reset Event Room state and roulette cost progression back to beginning
function resetEventRoomState() {
    eventRoom.freeSpinAvailable = true;
    eventRoom.paidSpins = 0;
    eventRoom.spinCost = getRouletteSpinCost(0); // Resets to base 75
    eventRoom.roulette.isSpinning = false;
    eventRoom.roulette.speed = 0;
    eventRoom.roulette.bannerTimer = 0;
    eventRoom.particles = [];
}

// Initialize Event Room
function initEventRoom(nextStageNumber) {
    eventRoom.isActive = true;
    eventRoom.targetNextStage = nextStageNumber || (currentStage + 1);
    resetEventRoomState();

    // Position player inside Event Room on the left
    player.x = 75;
    player.y = 180;
    player.facing = 'right';
    player.isAttacking = false;

    gameState = 'EVENT_ROOM';
    playSound('teleport');

    floatingTexts.push({
        x: 320,
        y: 60,
        text: '[MYSTERIOUS EVENT CHAMBER]',
        color: '#f59e0b',
        life: 70
    });
}

// Exit Event Room into Dungeon Stage (resets roulette price progression for next event)
function leaveEventRoom() {
    eventRoom.isActive = false;
    resetEventRoomState();
    playSound('teleport');
    teleportFlashTimer = 25;
    loadStage(eventRoom.targetNextStage);
    if (gameState !== 'BOSS_DIALOGUE') {
        gameState = 'PLAYING';
    }
}

// Spin Roulette Action with Progressive Cost Scaling
function spinRoulette() {
    if (eventRoom.roulette.isSpinning) return;

    if (eventRoom.freeSpinAvailable) {
        eventRoom.freeSpinAvailable = false;
        eventRoom.paidSpins = 0;
        eventRoom.spinCost = getRouletteSpinCost(0); // 75 for the next spin
        
        floatingTexts.push({
            x: eventRoom.table.x,
            y: eventRoom.table.y - 25,
            text: `FREE SPIN! (Next: ${eventRoom.spinCost} G)`,
            color: '#4ade80',
            life: 50
        });
    } else {
        const currentCost = eventRoom.spinCost;
        if (player.gold < currentCost) {
            floatingTexts.push({
                x: eventRoom.table.x,
                y: eventRoom.table.y - 40,
                text: `NOT ENOUGH GOLD! NEED ${currentCost} G`,
                color: '#ef4444',
                life: 40
            });
            playSound('error');
            return;
        }
        player.gold -= currentCost;
        playSound('coin');

        // Increase price progressively for next spin in this event chamber
        eventRoom.paidSpins = (eventRoom.paidSpins || 0) + 1;
        eventRoom.spinCost = getRouletteSpinCost(eventRoom.paidSpins);

        floatingTexts.push({
            x: eventRoom.table.x,
            y: eventRoom.table.y - 25,
            text: `-${currentCost} G (Next: ${eventRoom.spinCost} G)`,
            color: '#fbbf24',
            life: 50
        });
    }

    eventRoom.roulette.isSpinning = true;
    if (typeof achievementTracker !== 'undefined') {
        achievementTracker.onRouletteSpin();
    }
    eventRoom.roulette.bannerTimer = 0;
    // Faster, punchier initial spin speed
    eventRoom.roulette.speed = 0.75 + Math.random() * 0.30;
    eventRoom.roulette.lastTickAngle = eventRoom.roulette.angle;
    playSound('skill');
}

// Award Prize when Roulette Stops
function awardRoulettePrize(slice) {
    const role = player.characterRole || 'knight';

    if (slice.type === 'exclusive') {
        // === EXCLUSIVE WEAPONS PER ROLE ===
        let exclusiveId = 'weapon_christmas_tree';
        let weaponTitle = 'Xmas Tree Broadsword';

        if (role === 'mage') {
            exclusiveId = 'weapon_frost_snow_staff';
            weaponTitle = 'Eternal Snow Staff';
        } else if (role === 'assassin') {
            exclusiveId = 'weapon_candy_cane_daggers';
            weaponTitle = 'Sharp Candy Cane Daggers';
        }

        const alreadyOwned = player.inventory.includes(exclusiveId) || player.equipped.weapon === exclusiveId;

        if (alreadyOwned) {
            player.gold += 800;
            player.hp = player.maxHp;
            player.shield = player.maxShield;
            eventRoom.roulette.bannerText = 'REPEAT JACKPOT: +800 GOLD & FULL HP!';
            eventRoom.roulette.bannerSubText = 'Weapon duplicate converted to gold & restoration.';
            eventRoom.roulette.bannerColor = '#fbbf24';
        } else {
            if (!player.inventory.includes(exclusiveId)) {
                player.inventory.push(exclusiveId);
            }
            equipItem(exclusiveId);

            eventRoom.roulette.bannerText = 'EXCLUSIVE WEAPON JACKPOT!';
            eventRoom.roulette.bannerSubText = weaponTitle;
            eventRoom.roulette.bannerColor = '#22c55e';
        }

        playSound('victory');

        // Confetti explosion
        for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 5 + 2;
            eventRoom.particles.push({
                x: eventRoom.table.x,
                y: eventRoom.table.y,
                vx: Math.cos(angle) * dist,
                vy: Math.sin(angle) * dist - 2,
                size: Math.random() * 4 + 2,
                color: ['#ef4444', '#22c55e', '#fbbf24', '#38bdf8', '#ffffff', '#ec4899'][Math.floor(Math.random() * 6)],
                life: 60
            });
        }

    } else if (slice.type === 'gold') {
        player.gold += slice.amount;
        playSound('coin');
        eventRoom.roulette.bannerText = `OBTAINED +${slice.amount} GOLD!`;
        eventRoom.roulette.bannerSubText = 'Your coin pouch grows heavier!';
        eventRoom.roulette.bannerColor = '#f59e0b';

        // Coin burst particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            eventRoom.particles.push({
                x: eventRoom.table.x,
                y: eventRoom.table.y,
                vx: Math.cos(angle) * (Math.random() * 3 + 1),
                vy: Math.sin(angle) * (Math.random() * 3 + 1) - 1.5,
                size: 3,
                color: '#fbbf24',
                life: 35
            });
        }

    } else if (slice.type === 'potion') {
        player.hp = player.maxHp;
        player.shield = player.maxShield;
        playSound('heal');
        playSound('shield');
        eventRoom.roulette.bannerText = 'FULL HP & SHIELD RESTORED!';
        eventRoom.roulette.bannerSubText = 'Vitality and armor returned to maximum!';
        eventRoom.roulette.bannerColor = '#10b981';

        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            eventRoom.particles.push({
                x: eventRoom.table.x,
                y: eventRoom.table.y,
                vx: Math.cos(angle) * 2.5,
                vy: -Math.random() * 3 - 1,
                size: 3.5,
                color: Math.random() > 0.5 ? '#10b981' : '#00e5ff',
                life: 40
            });
        }

    } else if (slice.type === 'gear') {
        // Give a powerful role-specific armor from EQUIPMENT_DB
        const pool = (role === 'mage') 
            ? ['armor_mystic_robe', 'armor_elemental_robe', 'armor_archmage_vestment']
            : (role === 'assassin')
                ? ['armor_night_stalker', 'armor_phantom_suit']
                : ['armor_knight_plate', 'armor_dark_plate', 'armor_dragon_scale'];

        const chosenGearId = pool[Math.floor(Math.random() * pool.length)];
        const gearItem = getEquipmentById(chosenGearId);

        if (!player.inventory.includes(chosenGearId)) {
            player.inventory.push(chosenGearId);
            equipItem(chosenGearId);
            eventRoom.roulette.bannerText = `OBTAINED ${gearItem ? gearItem.name.toUpperCase() : 'RARE GEAR'}!`;
            eventRoom.roulette.bannerSubText = 'Equipment equipped to character!';
        } else {
            player.gold += 300;
            eventRoom.roulette.bannerText = 'GEAR DUPLICATE: +300 GOLD!';
            eventRoom.roulette.bannerSubText = 'Converted into 300 gold coins.';
        }

        playSound('buy');
        eventRoom.roulette.bannerColor = '#8b5cf6';

    } else {
        // === ZONK ===
        player.gold += 10; // Pity reward
        playSound('error');
        eventRoom.roulette.bannerText = 'UNFORTUNATE: ZONK!';
        eventRoom.roulette.bannerSubText = 'Unlucky roll! Received 10 consolation coins.';
        eventRoom.roulette.bannerColor = '#94a3b8';

        for (let i = 0; i < 15; i++) {
            eventRoom.particles.push({
                x: eventRoom.table.x,
                y: eventRoom.table.y,
                vx: (Math.random() - 0.5) * 2.5,
                vy: (Math.random() - 0.5) * 2.5,
                size: 2.5,
                color: '#64748b',
                life: 25
            });
        }
    }

    eventRoom.roulette.bannerTimer = 180; // 3 seconds at 60fps
}

// Update Event Room Loop
function updateEventRoom() {
    // Torch & magic smoke particles
    if (Math.random() < 0.25) {
        eventRoom.particles.push({
            x: 80 + (Math.random() - 0.5) * 6,
            y: 50,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.6 - Math.random() * 0.3,
            size: 2.5,
            color: '#a855f7',
            life: 25
        });
        eventRoom.particles.push({
            x: 560 + (Math.random() - 0.5) * 6,
            y: 50,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.6 - Math.random() * 0.3,
            size: 2.5,
            color: '#38bdf8',
            life: 25
        });
    }

    // Update Particles
    for (let i = eventRoom.particles.length - 1; i >= 0; i--) {
        const p = eventRoom.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) eventRoom.particles.splice(i, 1);
    }

    // Portal Swirl Animation
    eventRoom.exitPortal.swirlTimer += 0.08;

    // Roulette Rotation Physics
    const r = eventRoom.roulette;
    if (r.isSpinning) {
        r.angle += r.speed;
        r.speed *= r.friction;

        // Sound clicks when passing slice pegs
        const sliceAngle = (Math.PI * 2) / eventRoom.slices.length;
        if (Math.abs(r.angle - r.lastTickAngle) >= sliceAngle) {
            playSound('hit');
            r.lastTickAngle = r.angle;
        }

        // Fast rotation sparks on outer rim
        if (r.speed > 0.06 && Math.random() < 0.5) {
            const sparkAng = Math.random() * Math.PI * 2;
            eventRoom.particles.push({
                x: eventRoom.table.x + Math.cos(sparkAng) * (eventRoom.table.radius + 6),
                y: eventRoom.table.y + Math.sin(sparkAng) * (eventRoom.table.radius + 6),
                vx: Math.cos(sparkAng + Math.PI / 2) * (Math.random() * 2 + 1),
                vy: Math.sin(sparkAng + Math.PI / 2) * (Math.random() * 2 + 1),
                size: Math.random() * 2.5 + 1.2,
                color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
                life: 10
            });
        }

        // Wheel stopped
        if (r.speed < 0.006) {
            r.isSpinning = false;
            r.speed = 0;

            // Determine which slice landed on pointer (pointer at top = -Math.PI / 2)
            // Normalized angle
            const numSlices = eventRoom.slices.length;
            let normAngle = (r.angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            // Pointer is at -Math.PI / 2 (or 3 * Math.PI / 2)
            // The slice under pointer is:
            let pointerAngle = (Math.PI * 1.5 - normAngle) % (Math.PI * 2);
            if (pointerAngle < 0) pointerAngle += Math.PI * 2;
            const sliceIndex = Math.floor(pointerAngle / sliceAngle) % numSlices;

            r.result = eventRoom.slices[sliceIndex];
            awardRoulettePrize(r.result);
        }
    }

    if (r.bannerTimer > 0) r.bannerTimer--;

    // Player Movement in Event Room
    let moveDx = 0;
    let moveDy = 0;
    if (keys['w'] || keys['arrowup']) { moveDy -= 1; player.facing = 'up'; }
    if (keys['s'] || keys['arrowdown']) { moveDy += 1; player.facing = 'down'; }
    if (keys['a'] || keys['arrowleft']) { moveDx -= 1; player.facing = 'left'; }
    if (keys['d'] || keys['arrowright']) { moveDx += 1; player.facing = 'right'; }

    if (moveDx !== 0 && moveDy !== 0) {
        moveDx *= 0.7071;
        moveDy *= 0.7071;
    }

    const stepSpeed = player.isAttacking ? player.speed * 0.45 : player.speed;
    const nextX = player.x + moveDx * stepSpeed;
    const nextY = player.y + moveDy * stepSpeed;

    // Room boundaries (walls)
    const minX = 24;
    const maxX = 640 - 24 - player.w;
    const minY = 58;
    const maxY = 384 - 24 - player.h;

    // Circular table collision with slide support
    const tx = eventRoom.table.x;
    const ty = eventRoom.table.y;
    const tableCollRadius = eventRoom.table.radius + 12;

    const curDist = Math.hypot((player.x + player.w / 2) - tx, (player.y + player.h / 2) - ty);
    const newDistX = Math.hypot((nextX + player.w / 2) - tx, (player.y + player.h / 2) - ty);
    const newDistY = Math.hypot((player.x + player.w / 2) - tx, (nextY + player.h / 2) - ty);

    // Allow X movement if outside table or moving away from table center
    if (newDistX >= tableCollRadius || newDistX > curDist) {
        if (nextX >= minX && nextX <= maxX) player.x = nextX;
    }
    // Allow Y movement if outside table or moving away from table center
    if (newDistY >= tableCollRadius || newDistY > curDist) {
        if (nextY >= minY && nextY <= maxY) player.y = nextY;
    }

    // Combat update (allows player to attack / test weapons in event room!)
    if (typeof updateCombat === 'function') updateCombat();

    // Skills update
    if (typeof updateSkills === 'function') updateSkills();

    // Game particles update
    if (typeof updateParticles === 'function') updateParticles();

    // Check interaction with Exit Portal
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const portalX = eventRoom.exitPortal.x + eventRoom.exitPortal.w / 2;
    const portalY = eventRoom.exitPortal.y + eventRoom.exitPortal.h / 2;

    if (Math.hypot(px - portalX, py - portalY) < 32) {
        leaveEventRoom();
    }

    // Update Floating Texts
    updateFloatingTexts();
}

// Handle Mouse Clicks in Event Room
function handleEventRoomClick() {
    const canvas = document.getElementById('gameCanvas');
    const rx = eventRoom.table.x;
    const ry = eventRoom.table.y;

    // Click on Roulette Wheel
    if (Math.hypot(mouseX - rx, mouseY - ry) <= eventRoom.table.radius + 12) {
        spinRoulette();
        return;
    }

    // Click on SPIN Button below table
    const btnW = 160;
    const btnH = 34;
    const btnX = rx - btnW / 2;
    const btnY = ry + eventRoom.table.radius + 16;
    if (isHovering(btnX, btnY, btnW, btnH)) {
        spinRoulette();
        return;
    }

    // Click on Exit Portal
    const p = eventRoom.exitPortal;
    if (isHovering(p.x, p.y, p.w, p.h)) {
        leaveEventRoom();
    }
}

// Draw Event Room
function drawEventRoom(ctx) {
    const canvas = document.getElementById('gameCanvas');
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    // 1. Cozy Festive Mystic Background & Tiles
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stone labyrinth tiles with checkered soft tones
    const tileSize = 32;
    for (let x = 20; x < canvas.width - 20; x += tileSize) {
        for (let y = 50; y < canvas.height - 20; y += tileSize) {
            const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
            ctx.fillStyle = isAlt ? '#111827' : '#0f172a';
            ctx.fillRect(x, y, tileSize, tileSize);

            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }

    // Royal Red Runner Carpet in center
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(40, 140, canvas.width - 80, 70);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(40, 145, canvas.width - 80, 60);
    // Gold Carpet Fringe
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(40, 138, canvas.width - 80, 2);
    ctx.fillRect(40, 210, canvas.width - 80, 2);

    // Decorative Wall Borders with Carved Runes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, 50); // Top wall
    ctx.fillRect(0, 0, 20, canvas.height); // Left wall
    ctx.fillRect(canvas.width - 20, 0, 20, canvas.height); // Right wall
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // Bottom wall

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 50, canvas.width - 40, canvas.height - 70);

    // Wall Sconces & Torches
    drawEventWallTorch(ctx, 80, 36, '#a855f7');
    drawEventWallTorch(ctx, 220, 36, '#fbbf24');
    drawEventWallTorch(ctx, 420, 36, '#fbbf24');
    drawEventWallTorch(ctx, 560, 36, '#38bdf8');

    // Title Banner (Carved Stone Plaque)
    const cx = canvas.width / 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 210, 16, 420, 24);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 210, 16, 420, 24);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 208, 18, 416, 20);

    // 1px crisp drop shadow for title
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText('EVENT CHAMBER: ALTAR OF FORTUNE', cx + 1, 33);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('EVENT CHAMBER: ALTAR OF FORTUNE', cx, 32);

    // 2. Exit Portal on the Right
    const p = eventRoom.exitPortal;
    ctx.save();

    // Portal base shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h - 4, p.w * 0.7, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Swirling portal body
    const grad = ctx.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 4, p.x + p.w / 2, p.y + p.h / 2, p.w / 2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(0.7, '#0284c7');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rotating rune rings
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
    ctx.rotate(p.swirlTimer);
    ctx.beginPath();
    ctx.arc(0, 0, p.w * 0.42, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();

    // Portal Prompt
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#bae6fd';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT PORTAL', p.x + p.w / 2, p.y - 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('NEXT >>', p.x + p.w / 2, p.y + p.h + 16);
    ctx.restore();

    // 3. Central Roulette Altar Table
    const tx = eventRoom.table.x;
    const ty = eventRoom.table.y;
    const tr = eventRoom.table.radius;

    // Large shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(tx, ty + 12, tr + 12, 0, Math.PI * 2);
    ctx.fill();

    // Outer Stone & Iron Rim
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(tx, ty, tr + 10, 0, Math.PI * 2);
    ctx.fill();

    // Forged Bronze Rim
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(tx, ty, tr + 8, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Accent Ring
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(tx, ty, tr + 1, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Roulette Wheel Segments
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(eventRoom.roulette.angle);

    const slices = eventRoom.slices;
    const sliceAngle = (Math.PI * 2) / slices.length;

    slices.forEach((slice, idx) => {
        const startAng = idx * sliceAngle;
        const endAng = startAng + sliceAngle;

        // Slice wedge
        ctx.fillStyle = slice.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, tr, startAng, endAng);
        ctx.closePath();
        ctx.fill();

        // Slice border divider
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rivet dot on outer edge
        const pegX = Math.cos(startAng) * (tr - 3);
        const pegY = Math.sin(startAng) * (tr - 3);
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(pegX, pegY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Slice Text & Icon
        ctx.save();
        ctx.rotate(startAng + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = slice.textColor;
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(slice.icon, tr - 8, 3);
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(slice.name, tr - 24, 2.5);
        ctx.restore();
    });

    // Center Forged Spindle Hub
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // restore rotation

    // Golden Pointer at Top pointing DOWN into wheel
    ctx.save();
    ctx.translate(tx, ty - tr - 2);
    // Pixel shadow
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(-9, -11);
    ctx.lineTo(9, -11);
    ctx.lineTo(0, 11);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-9, -12);
    ctx.lineTo(9, -12);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-5, -10);
    ctx.lineTo(5, -10);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Interactive SPIN Button Below Table (Tactile Retro 3D Arcade Bevel)
    const btnW = 160;
    const btnH = 34;
    const btnX = tx - btnW / 2;
    const btnY = ty + tr + 16;
    const isBtnHover = isHovering(btnX, btnY, btnW, btnH);

    ctx.save();
    if (eventRoom.roulette.isSpinning) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SPINNING...', tx, btnY + 21);
    } else if (eventRoom.freeSpinAvailable) {
        ctx.fillStyle = isBtnHover ? '#16a34a' : '#15803d';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        // Bevel highlight
        ctx.fillStyle = isBtnHover ? '#4ade80' : '#22c55e';
        ctx.fillRect(btnX, btnY, btnW, 2);
        ctx.fillRect(btnX, btnY, 2, btnH);
        ctx.fillStyle = '#052e16';
        ctx.fillRect(btnX, btnY + btnH - 2, btnW, 2);
        ctx.fillRect(btnX + btnW - 2, btnY, 2, btnH);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1;
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FREE SPIN', tx, btnY + 21);
    } else {
        const canAfford = player.gold >= eventRoom.spinCost;
        if (canAfford) {
            ctx.fillStyle = isBtnHover ? '#d97706' : '#b45309';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = isBtnHover ? '#fbbf24' : '#f59e0b';
            ctx.fillRect(btnX, btnY, btnW, 2);
            ctx.fillRect(btnX, btnY, 2, btnH);
            ctx.fillStyle = '#451a03';
            ctx.fillRect(btnX, btnY + btnH - 2, btnW, 2);
            ctx.fillRect(btnX + btnW - 2, btnY, 2, btnH);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);

            ctx.fillStyle = '#ffffff';
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`SPIN [${eventRoom.spinCost} G]`, tx, btnY + 21);
        } else {
            ctx.fillStyle = '#450a0a';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.strokeStyle = '#991b1b';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);

            ctx.fillStyle = '#fca5a5';
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`NEED ${eventRoom.spinCost} G`, tx, btnY + 21);
        }
    }
    ctx.restore();

    // Interaction Hint Tooltip
    const distToTable = Math.hypot(px - tx, py - ty);
    if (distToTable < 115 && !eventRoom.roulette.isSpinning) {
        ctx.save();
        const costPrompt = eventRoom.freeSpinAvailable ? 'FREE SPIN' : `${eventRoom.spinCost} G`;
        const hintText = `[SPACE / E] SPIN (${costPrompt})`;
        ctx.font = '7.5px "Press Start 2P", monospace';
        const hintW = ctx.measureText(hintText).width + 16;
        
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tx - hintW / 2, ty - tr - 26, hintW, 16);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx - hintW / 2, ty - tr - 26, hintW, 16);

        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText(hintText, tx, ty - tr - 15);
        ctx.restore();
    }

    // 5. Draw Particles in Room
    eventRoom.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });

    // 6. Draw Player Projectiles, Slash Arc, and Model
    if (typeof drawPlayerProjectiles === 'function') drawPlayerProjectiles(ctx);

    if (typeof drawSlashArc === 'function') drawSlashArc(ctx, px, py);

    const isVisible = player.invulnerableTimer % 6 < 3;
    if (isVisible) {
        if (player.facing === 'up') drawSword(ctx, px, py);
        drawPlayerModel(ctx, px, py);
        if (player.facing !== 'up') drawSword(ctx, px, py);
    }

    if (typeof drawSkillEffects === 'function') drawSkillEffects(ctx);
    if (typeof drawParticles === 'function') drawParticles(ctx);

    // Skill HUD in Event Room
    if (typeof drawSkillHUD === 'function') drawSkillHUD(ctx, canvas);

    // 7. Prize Banner Overlay (Solid Dark Stone Chassis)
    const r = eventRoom.roulette;
    if (r.bannerTimer > 0) {
        ctx.save();
        const bannerH = 58;
        const bannerY = canvas.height / 2 - bannerH / 2;

        ctx.fillStyle = '#090d16';
        ctx.fillRect(20, bannerY, canvas.width - 40, bannerH);
        ctx.strokeStyle = r.bannerColor || '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, bannerY, canvas.width - 40, bannerH);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(23, bannerY + 3, canvas.width - 46, bannerH - 6);

        // Header Title
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(r.bannerText, canvas.width / 2 + 1, bannerY + 25);
        ctx.fillStyle = r.bannerColor || '#fbbf24';
        ctx.fillText(r.bannerText, canvas.width / 2, bannerY + 24);

        // Subtext in clean retro pixel font
        ctx.font = '7.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(r.bannerSubText, canvas.width / 2, bannerY + 44);
        ctx.restore();
    }

    // Draw Floating Texts
    drawFloatingTexts(ctx);
}

// Helper to draw wall torch with flame in Event Room
function drawEventWallTorch(ctx, x, y, flameColor) {
    ctx.save();
    // Metal bracket
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 2, y, 4, 10);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 4, y - 2, 8, 4);

    // Glowing flame
    const flicker = Math.sin(Date.now() * 0.01 + x) * 2;
    ctx.shadowColor = flameColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.arc(x, y - 6 + flicker * 0.5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y - 6 + flicker * 0.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
