// --- SHOP SYSTEM WITH SMOOTH SCROLLING & CLASS FILTERING ---

let shopSelectedCategory = 0;
let shopScrollOffset = 0;
let shopMessage = '';
let shopMessageTimer = 0;

function handleShopScroll(deltaY) {
    const category = EQUIPMENT_CATEGORIES[shopSelectedCategory];
    const items = getEquipmentByCategory(category, player.characterRole);
    const itemH = 50;
    const visibleH = 210;
    const maxScroll = Math.max(0, items.length * itemH - visibleH);
    
    shopScrollOffset = Math.max(0, Math.min(maxScroll, shopScrollOffset + Math.sign(deltaY) * 36));
}

function handleShopClick() {
    const canvas = document.getElementById('gameCanvas');
    const cx = canvas.width / 2;
    
    // Close button [X] in top-right corner
    const closeBtnX = canvas.width - 48;
    const closeBtnY = 14;
    const closeBtnW = 32;
    const closeBtnH = 26;
    if (isHovering(closeBtnX - 12, closeBtnY - 10, closeBtnW + 24, closeBtnH + 20)) {
        playSound('slash');
        gameState = (typeof eventRoom !== 'undefined' && eventRoom.isActive) ? 'EVENT_ROOM' : 'PLAYING';
        return;
    }
    
    // Category tabs at top of shop
    const tabY = 54;
    const tabW = 88;
    const tabH = 24;
    const startX = cx - (EQUIPMENT_CATEGORIES.length * tabW) / 2;
    
    for (let i = 0; i < EQUIPMENT_CATEGORIES.length; i++) {
        const tx = startX + i * tabW;
        if (isHovering(tx - 2, tabY - 8, tabW + 4, tabH + 16)) {
            shopSelectedCategory = i;
            shopScrollOffset = 0;
            playSound('slash');
            return;
        }
    }
    
    // Scroll Up button (▲)
    const scrollUpX = canvas.width - 38;
    const scrollUpY = 88;
    if (isHovering(scrollUpX - 12, scrollUpY - 10, 48, 44)) {
        handleShopScroll(-1);
        return;
    }
    
    // Scroll Down button (▼)
    const scrollDownX = canvas.width - 38;
    const scrollDownY = canvas.height - 76;
    if (isHovering(scrollDownX - 12, scrollDownY - 10, 48, 44)) {
        handleShopScroll(1);
        return;
    }
    
    // Item list
    const category = EQUIPMENT_CATEGORIES[shopSelectedCategory];
    const items = getEquipmentByCategory(category, player.characterRole);
    const itemStartY = 88;
    const itemH = 50;
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const iy = itemStartY + i * itemH - shopScrollOffset;
        
        if (iy < 80 || iy > canvas.height - 60) continue;
        
        // Buy/Equip button area (right side of item row)
        const btnX = cx + 115;
        const btnY = iy + 6;
        const btnW = 82;
        const btnH = 30;
        
        if (isHovering(btnX - 10, btnY - 6, btnW + 20, btnH + 12)) {
            const owned = player.inventory.includes(item.id);
            const equipped = player.equipped[item.category] === item.id;
            
            if (equipped) {
                shopMessage = 'Already equipped!';
                shopMessageTimer = 60;
            } else if (owned) {
                equipItem(item.id);
                shopMessage = `${item.name} equipped!`;
                shopMessageTimer = 60;
                playSound('buy');
            } else if (item.minStage && (typeof currentStage === 'undefined' || currentStage < item.minStage)) {
                shopMessage = `[LOCKED] Requires Stage ${item.minStage} (${item.biomeName || 'DEEP DARK'})`;
                shopMessageTimer = 90;
                playSound('error');
            } else if (item.isExclusive) {
                shopMessage = '[EXCLUSIVE] Obtained only from Event Roulette!';
                shopMessageTimer = 90;
                playSound('error');
            } else {
                if (player.gold >= item.price) {
                    player.gold -= item.price;
                    player.inventory.push(item.id);
                    equipItem(item.id);
                    if (typeof achievementTracker !== 'undefined') {
                        achievementTracker.onItemPurchased(item);
                    }
                    shopMessage = `Purchased ${item.name}!`;
                    shopMessageTimer = 90;
                    playSound('buy');
                } else {
                    shopMessage = 'Not enough Gold!';
                    shopMessageTimer = 60;
                    playSound('error');
                }
            }
            return;
        }
    }
    
}

function drawShopOverlay() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    
    if (shopMessageTimer > 0) shopMessageTimer--;
    
    // Solid dark backdrop with forged frame
    ctx.fillStyle = 'rgba(8, 10, 15, 0.96)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative outer stone rim
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(13, 13, canvas.width - 26, canvas.height - 26);
    
    // Role title badge
    const roleInfo = (typeof CHARACTER_ROLES !== 'undefined' && CHARACTER_ROLES[player.characterRole])
        ? CHARACTER_ROLES[player.characterRole]
        : { name: 'Knight', color: '#f1c40f' };
        
    // Shop title
    ctx.textAlign = 'center';
    ctx.fillStyle = roleInfo.color;
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillText(`${roleInfo.name.toUpperCase()} ARMORY`, cx, 30, 300);
    
    // Gold display with solid retro badge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(26, 17, 135, 20);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 17, 135, 20);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(`GOLD: ${player.gold} G`, 34, 31, 120);
    
    // Close button [X] in top-right corner with 3D retro arcade bevel
    const closeBtnX = canvas.width - 48;
    const closeBtnY = 14;
    const closeBtnW = 32;
    const closeBtnH = 26;
    const hClose = isHovering(closeBtnX, closeBtnY, closeBtnW, closeBtnH);
    
    ctx.fillStyle = hClose ? '#b91c1c' : '#991b1b';
    ctx.fillRect(closeBtnX, closeBtnY, closeBtnW, closeBtnH);
    // Bevel highlights
    ctx.fillStyle = hClose ? '#f87171' : '#dc2626';
    ctx.fillRect(closeBtnX, closeBtnY, closeBtnW, 2);
    ctx.fillRect(closeBtnX, closeBtnY, 2, closeBtnH);
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(closeBtnX, closeBtnY + closeBtnH - 2, closeBtnW, 2);
    ctx.fillRect(closeBtnX + closeBtnW - 2, closeBtnY, 2, closeBtnH);
    
    ctx.strokeStyle = hClose ? '#fca5a5' : '#ef4444';
    ctx.lineWidth = 1;
    ctx.strokeRect(closeBtnX, closeBtnY, closeBtnW, closeBtnH);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X', closeBtnX + closeBtnW / 2, closeBtnY + 17);
    
    // Category tabs with authentic 16-bit RPG naming (no emojis)
    const tabY = 54;
    const tabW = 88;
    const tabH = 24;
    const startX = cx - (EQUIPMENT_CATEGORIES.length * tabW) / 2;
    
    let catLabels = ['WEAPONS', 'ARMORS', 'HELMETS', 'SHIELDS', 'BOOTS', 'CAPES'];
    if (player.characterRole === 'mage') {
        catLabels = ['STAVES', 'ROBES', 'HATS', 'ORBS', 'BOOTS', 'CLOAKS'];
    } else if (player.characterRole === 'assassin') {
        catLabels = ['BLADES', 'VESTS', 'MASKS', 'PARRIERS', 'TABI', 'SHROUDS'];
    }
    
    for (let i = 0; i < EQUIPMENT_CATEGORIES.length; i++) {
        const tx = startX + i * tabW;
        const isActive = i === shopSelectedCategory;
        const hover = isHovering(tx, tabY, tabW - 2, tabH);
        
        if (isActive) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(tx, tabY, tabW - 2, tabH);
            // Active tab top indicator
            ctx.fillStyle = roleInfo.color || '#eab308';
            ctx.fillRect(tx, tabY, tabW - 2, 3);
            ctx.strokeStyle = roleInfo.color || '#eab308';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx, tabY, tabW - 2, tabH);
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = hover ? '#182030' : '#0d111a';
            ctx.fillRect(tx, tabY, tabW - 2, tabH);
            ctx.strokeStyle = hover ? '#475569' : '#1e293b';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx, tabY, tabW - 2, tabH);
            ctx.fillStyle = hover ? '#cbd5e1' : '#64748b';
        }
        
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(catLabels[i], tx + tabW / 2 - 1, tabY + 16, tabW - 8);
    }
    
    // Item list
    const category = EQUIPMENT_CATEGORIES[shopSelectedCategory];
    const items = getEquipmentByCategory(category, player.characterRole);
    const itemStartY = 88;
    const itemH = 50;
    const visibleH = 215;
    const maxScroll = Math.max(0, items.length * itemH - visibleH);
    
    // Clipping area for items list
    ctx.save();
    ctx.beginPath();
    ctx.rect(30, 84, canvas.width - 75, visibleH);
    ctx.clip();
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const iy = itemStartY + i * itemH - shopScrollOffset;
        
        if (iy < 40 || iy > canvas.height - 30) continue;
        
        const owned = player.inventory.includes(item.id);
        const equipped = player.equipped[item.category] === item.id;
        const isStageLocked = !owned && !equipped && item.minStage && (typeof currentStage === 'undefined' || currentStage < item.minStage);
        
        // Item background row (Matte dark fantasy stone chassis)
        if (equipped) {
            ctx.fillStyle = '#0a2318';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.5;
        } else if (owned) {
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;
        } else if (isStageLocked) {
            ctx.fillStyle = '#0a0d14';
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
        } else if (item.isExclusive) {
            ctx.fillStyle = '#260d14';
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 1.5;
        } else if (item.tier === 5) {
            ctx.fillStyle = item.isGodTier ? '#231505' : (item.id.includes('sculk') ? '#08202d' : '#231505');
            ctx.strokeStyle = item.isGodTier ? '#f59e0b' : (item.id.includes('sculk') ? '#06b6d4' : '#f59e0b');
            ctx.lineWidth = 1.5;
        } else {
            ctx.fillStyle = '#111622';
            ctx.strokeStyle = '#263248';
            ctx.lineWidth = 1;
        }
        ctx.fillRect(35, iy, canvas.width - 85, itemH - 4);
        ctx.strokeRect(35, iy, canvas.width - 85, itemH - 4);

        // Subtle top bevel highlight for equipped / high tier items
        if (equipped) {
            ctx.fillStyle = '#059669';
            ctx.fillRect(36, iy + 1, canvas.width - 87, 1);
        } else if (item.tier === 5 && !isStageLocked) {
            ctx.fillStyle = item.isGodTier ? '#f59e0b' : (item.id.includes('sculk') ? '#0891b2' : '#f59e0b');
            ctx.fillRect(36, iy + 1, canvas.width - 87, 1);
        }
        
        // Tier badges (crisp retro tags, no unicode stars)
        const tierNames = ['BASIC', 'FORGED', 'ELITE', 'MYTHIC', 'ABYSSAL'];
        const tierColors = ['#94a3b8', '#60a5fa', '#a855f7', '#f59e0b', '#22d3ee'];
        
        if (isStageLocked) {
            ctx.fillStyle = '#64748b';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`[LOCKED: STAGE ${item.minStage} - ${item.biomeName || 'DEEP DARK'}]`, 44, iy + 14);
        } else if (item.isExclusive) {
            ctx.fillStyle = '#fb7185';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'left';
            ctx.fillText('[EXCLUSIVE EVENT RELIC]', 44, iy + 14);
        } else if (item.tier === 5) {
            ctx.fillStyle = item.isGodTier ? '#f59e0b' : (item.id.includes('sculk') ? '#22d3ee' : '#f59e0b');
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(item.isGodTier ? '[TIER V - GOD-SLAYER RELIC]' : (item.id.includes('sculk') ? '[TIER V - ABYSSAL RELIC]' : '[TIER V - GOD-SLAYER RELIC]'), 44, iy + 14);
        } else {
            ctx.fillStyle = tierColors[item.tier - 1] || '#94a3b8';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'left';
            const tierRoman = ['I', 'II', 'III', 'IV', 'V'][item.tier - 1] || `${item.tier}`;
            ctx.fillText(`[TIER ${tierRoman} - ${tierNames[item.tier - 1] || 'GEAR'}]`, 44, iy + 14);
        }
        
        // Item name
        ctx.fillStyle = isStageLocked ? '#64748b' : (item.tier === 5 ? (item.isGodTier ? '#fef08a' : (item.id.includes('sculk') ? '#67e8f9' : '#fef08a')) : (item.isExclusive ? '#fef08a' : '#f8fafc'));
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(item.name, 44, iy + 28, 330);
        
        // Stats text
        ctx.fillStyle = isStageLocked ? '#475569' : (item.tier === 5 ? (item.isGodTier ? '#fde047' : (item.id.includes('sculk') ? '#38bdf8' : '#fde047')) : '#94a3b8');
        ctx.font = '7px "Press Start 2P", monospace';
        let statParts = [];
        if (item.stats.atkBonus) statParts.push(`ATK +${item.stats.atkBonus}`);
        if (item.stats.defBonus) statParts.push(`DEF +${item.stats.defBonus}`);
        if (item.stats.maxHpBonus) statParts.push(`HP +${item.stats.maxHpBonus}`);
        if (item.stats.maxShieldBonus) statParts.push(`SHD +${item.stats.maxShieldBonus}`);
        if (item.stats.speedBonus) statParts.push(`SPD +${item.stats.speedBonus}`);
        ctx.fillText(statParts.join('  ') || 'Standard Gear', 44, iy + 40, 330);
        
        // Item preview sprite icon with recessed frame
        const iconBgX = cx + 71;
        const iconBgY = iy + 5;
        ctx.fillStyle = '#090d16';
        ctx.fillRect(iconBgX, iconBgY, 36, 36);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(iconBgX, iconBgY, 36, 36);
        
        if (isStageLocked) ctx.globalAlpha = 0.4;
        drawShopItemPreview(ctx, item, cx + 74, iy + 8, 30);
        if (isStageLocked) ctx.globalAlpha = 1.0;
        
        // Buy / Equip button with tactile retro 3D bevels
        const btnX = cx + 115;
        const btnY = iy + 6;
        const btnW = 82;
        const btnH = 30;
        const hBtn = isHovering(btnX, btnY, btnW, btnH);
        
        if (equipped) {
            ctx.fillStyle = '#064e3b';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = '#059669';
            ctx.fillRect(btnX, btnY, btnW, 2);
            ctx.fillRect(btnX, btnY, 2, btnH);
            ctx.fillStyle = '#022c22';
            ctx.fillRect(btnX, btnY + btnH - 2, btnW, 2);
            ctx.fillRect(btnX + btnW - 2, btnY, 2, btnH);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = '#34d399';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('EQUIPPED', btnX + btnW / 2, btnY + 19);
        } else if (owned) {
            ctx.fillStyle = hBtn ? '#2563eb' : '#1e3a8a';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = hBtn ? '#60a5fa' : '#3b82f6';
            ctx.fillRect(btnX, btnY, btnW, 2);
            ctx.fillRect(btnX, btnY, 2, btnH);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(btnX, btnY + btnH - 2, btnW, 2);
            ctx.fillRect(btnX + btnW - 2, btnY, 2, btnH);
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('EQUIP', btnX + btnW / 2, btnY + 19);
        } else if (isStageLocked) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = '#475569';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`LV.${item.minStage}`, btnX + btnW / 2, btnY + 19);
        } else if (item.isExclusive) {
            ctx.fillStyle = hBtn ? '#881337' : '#4c0519';
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);
            ctx.fillStyle = '#fda4af';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('ROULETTE', btnX + btnW / 2, btnY + 19);
        } else {
            const canAfford = player.gold >= item.price;
            if (canAfford) {
                const isSculk = item.tier === 5 && !item.isGodTier && item.id.includes('sculk');
                const isGodTier = item.tier === 5 && (item.isGodTier || !item.id.includes('sculk'));
                const baseCol = isSculk ? (hBtn ? '#0891b2' : '#0e7490') : (isGodTier ? (hBtn ? '#ea580c' : '#c2410c') : (hBtn ? '#d97706' : '#b45309'));
                const highCol = isSculk ? '#22d3ee' : (isGodTier ? '#fde047' : '#f59e0b');
                const shadCol = isSculk ? '#164e63' : (isGodTier ? '#7c2d12' : '#78350f');
                ctx.fillStyle = baseCol;
                ctx.fillRect(btnX, btnY, btnW, btnH);
                ctx.fillStyle = highCol;
                ctx.fillRect(btnX, btnY, btnW, 2);
                ctx.fillRect(btnX, btnY, 2, btnH);
                ctx.fillStyle = shadCol;
                ctx.fillRect(btnX, btnY + btnH - 2, btnW, 2);
                ctx.fillRect(btnX + btnW - 2, btnY, 2, btnH);
                ctx.strokeStyle = highCol;
                ctx.lineWidth = 1;
                ctx.strokeRect(btnX, btnY, btnW, btnH);
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#450a0a';
                ctx.fillRect(btnX, btnY, btnW, btnH);
                ctx.strokeStyle = '#991b1b';
                ctx.lineWidth = 1;
                ctx.strokeRect(btnX, btnY, btnW, btnH);
                ctx.fillStyle = '#fca5a5';
            }
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.price} G`, btnX + btnW / 2, btnY + 19);
        }
    }
    
    ctx.restore();
    
    // --- SCROLLBAR ON THE RIGHT (ARCADE STONE STYLING) ---
    const scrollBarX = canvas.width - 38;
    const scrollUpY = 88;
    const scrollDownY = canvas.height - 76;
    const trackY = scrollUpY + 26;
    const trackH = scrollDownY - trackY - 4;
    
    // Scroll Up Button [▲]
    const hUp = isHovering(scrollBarX, scrollUpY, 24, 24);
    ctx.fillStyle = hUp ? '#263248' : '#111622';
    ctx.fillRect(scrollBarX, scrollUpY, 24, 24);
    ctx.fillStyle = hUp ? '#475569' : '#1e293b';
    ctx.fillRect(scrollBarX, scrollUpY, 24, 2);
    ctx.fillRect(scrollBarX, scrollUpY, 2, 24);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(scrollBarX, scrollUpY, 24, 24);
    ctx.fillStyle = hUp ? '#f8fafc' : '#94a3b8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▲', scrollBarX + 12, scrollUpY + 16);
    
    // Scroll Down Button [▼]
    const hDown = isHovering(scrollBarX, scrollDownY, 24, 24);
    ctx.fillStyle = hDown ? '#263248' : '#111622';
    ctx.fillRect(scrollBarX, scrollDownY, 24, 24);
    ctx.fillStyle = hDown ? '#475569' : '#1e293b';
    ctx.fillRect(scrollBarX, scrollDownY, 24, 2);
    ctx.fillRect(scrollBarX, scrollDownY, 2, 24);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(scrollBarX, scrollDownY, 24, 24);
    ctx.fillStyle = hDown ? '#f8fafc' : '#94a3b8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▼', scrollBarX + 12, scrollDownY + 16);
    
    // Track background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(scrollBarX + 8, trackY, 8, trackH);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(scrollBarX + 8, trackY, 8, trackH);
    
    // Thumb indicator
    if (items.length > 0) {
        const thumbH = Math.max(18, (visibleH / (items.length * itemH)) * trackH);
        const scrollRatio = maxScroll > 0 ? (shopScrollOffset / maxScroll) : 0;
        const thumbY = trackY + scrollRatio * (trackH - thumbH);
        
        ctx.fillStyle = '#2c394b';
        ctx.fillRect(scrollBarX + 8, thumbY, 8, thumbH);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(scrollBarX + 8, thumbY, 8, 2);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(scrollBarX + 8, thumbY, 8, thumbH);
    }
    
    // Shop message notification banner
    if (shopMessageTimer > 0 && shopMessage) {
        const msgAlpha = Math.min(1, shopMessageTimer / 20);
        ctx.fillStyle = `rgba(11, 15, 25, ${0.96 * msgAlpha})`;
        ctx.fillRect(cx - 170, canvas.height - 48, 340, 26);
        ctx.strokeStyle = `rgba(234, 179, 8, ${msgAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 170, canvas.height - 48, 340, 26);
        ctx.fillStyle = `rgba(255, 255, 255, ${msgAlpha})`;
        ctx.font = '7.5px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(shopMessage, cx, canvas.height - 31, 330);
    }
    
    // Hint at bottom
    ctx.fillStyle = '#475569';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Scroll Wheel / Buttons ▲▼ to view gear | Press [B] or [X] to exit', cx, canvas.height - 10, 620);
    ctx.textAlign = 'left';
}

function drawShopItemPreview(ctx, item, x, y, size) {
    ctx.save();
    const s = item.sprite;
    if (!s) { ctx.restore(); return; }
    
    if (item.category === 'weapon') {
        ctx.fillStyle = s.bladeColor;
        ctx.fillRect(x + 4, y + size/2 - 2, size - 8, 4);
        ctx.fillStyle = s.crossguardColor;
        ctx.fillRect(x + 6, y + size/2 - 5, 4, 10);
        ctx.fillStyle = s.pommelColor;
        ctx.beginPath();
        ctx.arc(x + 4, y + size/2, 3, 0, Math.PI * 2);
        ctx.fill();
        if (s.glowColor) {
            ctx.shadowColor = s.glowColor;
            ctx.shadowBlur = 6;
            ctx.fillStyle = s.glowColor;
            ctx.fillRect(x + size - 6, y + size/2 - 1, 4, 2);
            ctx.shadowBlur = 0;
        }
    } else if (item.category === 'armor') {
        ctx.fillStyle = s.bodyColor;
        ctx.fillRect(x + 6, y + 4, size - 12, size - 8);
        ctx.fillStyle = s.plateColor;
        ctx.fillRect(x + 8, y + 6, size - 16, size - 12);
        ctx.fillStyle = s.trimColor;
        ctx.fillRect(x + size/2 - 2, y + 8, 4, 6);
    } else if (item.category === 'helmet') {
        ctx.fillStyle = s.domeColor;
        ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
        ctx.fillStyle = s.domeHighlight;
        ctx.fillRect(x + 7, y + 6, size - 14, 4);
        ctx.fillStyle = s.visorColor;
        ctx.fillRect(x + 8, y + 14, size - 16, 5);
        ctx.fillStyle = s.eyeColor;
        ctx.fillRect(x + 10, y + 15, 3, 2);
        ctx.fillRect(x + 17, y + 15, 3, 2);
    } else if (item.category === 'shield') {
        ctx.fillStyle = s.bodyColor;
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + 2);
        ctx.lineTo(x + size - 4, y + 8);
        ctx.lineTo(x + size - 4, y + size/2);
        ctx.quadraticCurveTo(x + size/2, y + size - 2, x + size/2, y + size - 2);
        ctx.quadraticCurveTo(x + size/2, y + size - 2, x + 4, y + size/2);
        ctx.lineTo(x + 4, y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = s.borderColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    } else if (item.category === 'boots') {
        ctx.fillStyle = s.bootColor;
        ctx.fillRect(x + 6, y + 10, 8, 14);
        ctx.fillRect(x + 16, y + 10, 8, 14);
        ctx.fillStyle = s.trimColor;
        ctx.fillRect(x + 6, y + 10, 8, 4);
        ctx.fillRect(x + 16, y + 10, 8, 4);
    } else if (item.category === 'cape') {
        ctx.fillStyle = s.mainColor;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 4);
        ctx.quadraticCurveTo(x + size/2, y + size - 2, x + size - 8, y + 4);
        ctx.lineTo(x + size - 8, y + size - 6);
        ctx.quadraticCurveTo(x + size/2, y + size + 4, x + 8, y + size - 6);
        ctx.closePath();
        ctx.fill();
        if (s.borderColor) {
            ctx.strokeStyle = s.borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    ctx.restore();
}
