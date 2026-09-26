// --- PLAYER RENDERING WITH EQUIPMENT SPRITES (KNIGHT, MAGE, ASSASSIN) ---

function drawPlayerModel(ctx, px, py) {
    ctx.save();
    
    // Contact Shadow (Classic Retro Style)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(player.x + player.w / 2, player.y + player.h - 1, player.w * 0.45, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Immunity Frame & Dash Ghost Trails / Shield Aura
    if (player.iFrames > 0 || player.isDashing) {
        const pulse = Math.sin(Date.now() * 0.015) * 0.2 + 0.35;
        ctx.fillStyle = `rgba(34, 211, 238, ${pulse * 0.45})`;
        ctx.beginPath();
        ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(103, 232, 249, ${pulse})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    const role = (player && player.characterRole) ? player.characterRole : 'knight';
    const capeSprite = getEquippedSprite(player.equipped, 'cape');
    const armorSprite = getEquippedSprite(player.equipped, 'armor');
    const helmetSprite = getEquippedSprite(player.equipped, 'helmet');
    const bootsSprite = getEquippedSprite(player.equipped, 'boots');
    const shieldSprite = getEquippedSprite(player.equipped, 'shield');
    
    if (role === 'mage') {
        drawMageModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite);
    } else if (role === 'assassin') {
        drawAssassinModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite);
    } else {
        drawKnightModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite);
    }
    
    ctx.restore();
}

// 1. KNIGHT MODEL (Ksatria)
function drawKnightModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite) {
    const time = Date.now() * 0.006;
    const capeWave = Math.sin(time) * 3.5;

    const capeMain = capeSprite ? capeSprite.mainColor : '#991b1b';
    const capeInner = capeSprite ? capeSprite.innerColor : '#dc2626';
    const capeBorder = capeSprite ? capeSprite.borderColor : null;

    // Cape
    ctx.fillStyle = capeMain;
    ctx.beginPath();
    if (player.facing === 'down') {
        ctx.moveTo(player.x + 3, player.y + 10);
        ctx.quadraticCurveTo(player.x - 4 + capeWave, player.y + player.h + 6, player.x + 4, player.y + player.h + 8);
        ctx.lineTo(player.x + player.w - 4, player.y + player.h + 8);
        ctx.quadraticCurveTo(player.x + player.w + 4 - capeWave, player.y + player.h + 6, player.x + player.w - 3, player.y + 10);
    } else if (player.facing === 'up') {
        ctx.moveTo(player.x + 1, player.y + 6);
        ctx.quadraticCurveTo(player.x - 8 + capeWave, player.y + player.h + 7, player.x - 2, player.y + player.h + 9);
        ctx.lineTo(player.x + player.w + 2, player.y + player.h + 9);
        ctx.quadraticCurveTo(player.x + player.w + 8 - capeWave, player.y + player.h + 7, player.x - 1, player.y + 6);
    } else if (player.facing === 'right') {
        ctx.moveTo(player.x + 4, player.y + 6);
        ctx.quadraticCurveTo(player.x - 12 + capeWave, player.y + player.h / 2, player.x - 8 + capeWave * 0.5, player.y + player.h + 6);
        ctx.lineTo(player.x + 6, player.y + player.h + 3);
    } else {
        ctx.moveTo(player.x + player.w - 4, player.y + 6);
        ctx.quadraticCurveTo(player.x + player.w + 12 - capeWave, player.y + player.h / 2, player.x + player.w + 8 - capeWave * 0.5, player.y + player.h + 6);
        ctx.lineTo(player.x + player.w - 6, player.y + player.h + 3);
    }
    ctx.closePath();
    ctx.fill();
    if (capeBorder) {
        ctx.strokeStyle = capeBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.fillStyle = capeInner;
    ctx.beginPath();
    if (player.facing === 'right' || player.facing === 'left') {
        ctx.ellipse(player.x + player.w / 2, player.y + player.h, 6, 3, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Boots
    const bootColor = bootsSprite ? bootsSprite.bootColor : '#1e293b';
    const bootTrim = bootsSprite ? bootsSprite.trimColor : '#475569';
    ctx.fillStyle = bootColor;
    ctx.fillRect(player.x + 3, player.y + player.h - 6, 6, 6);
    ctx.fillRect(player.x + player.w - 9, player.y + player.h - 6, 6, 6);
    ctx.fillStyle = bootTrim;
    ctx.fillRect(player.x + 4, player.y + player.h - 6, 4, 3);
    ctx.fillRect(player.x + player.w - 8, player.y + player.h - 6, 4, 3);

    // Armor
    const armorBody = armorSprite ? armorSprite.bodyColor : '#334155';
    const armorPlate = armorSprite ? armorSprite.plateColor : '#94a3b8';
    const armorHighlight = armorSprite ? armorSprite.highlightColor : '#e2e8f0';
    const armorTrim = armorSprite ? armorSprite.trimColor : '#fbbf24';
    const pauldronColor = armorSprite ? armorSprite.pauldronColor : '#64748b';
    const pauldronHighlight = armorSprite ? armorSprite.pauldronHighlight : '#cbd5e1';

    ctx.fillStyle = armorBody;
    ctx.fillRect(player.x + 2, player.y + 8, player.w - 4, player.h - 14);
    ctx.fillStyle = armorPlate;
    ctx.fillRect(player.x + 4, player.y + 9, player.w - 8, player.h - 16);
    ctx.fillStyle = armorHighlight;
    ctx.fillRect(player.x + 5, player.y + 9, 3, player.h - 16);

    ctx.fillStyle = armorTrim;
    ctx.fillRect(player.x + player.w / 2 - 2, player.y + 11, 4, 6);
    ctx.fillRect(player.x + player.w / 2 - 4, player.y + 13, 8, 2);

    // Pauldrons
    ctx.fillStyle = pauldronColor;
    ctx.fillRect(player.x - 2, player.y + 7, 5, 7);
    ctx.fillRect(player.x + player.w - 3, player.y + 7, 5, 7);
    ctx.fillStyle = pauldronHighlight;
    ctx.fillRect(player.x - 2, player.y + 7, 5, 2);
    ctx.fillRect(player.x + player.w - 3, player.y + 7, 5, 2);

    // Shield (offhand)
    if (player.facing !== 'right') {
        const sx = player.facing === 'left' ? player.x + 10 : player.x - 5;
        const sy = player.y + 9;
        const shieldBody = shieldSprite ? shieldSprite.bodyColor : '#1e3a8a';
        const shieldBorder = shieldSprite ? shieldSprite.borderColor : '#fbbf24';
        const shieldEmblem = shieldSprite ? shieldSprite.emblemColor : '#fbbf24';

        ctx.fillStyle = shieldBody;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 10, sy);
        ctx.lineTo(sx + 10, sy + 10);
        ctx.quadraticCurveTo(sx + 5, sy + 16, sx + 5, sy + 17);
        ctx.quadraticCurveTo(sx + 5, sy + 16, sx, sy + 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = shieldBorder;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = shieldEmblem;
        ctx.fillRect(sx + 4, sy + 3, 2, 8);
        ctx.fillRect(sx + 2, sy + 5, 6, 2);
    }

    // Helmet
    const headY = player.y - 3;
    const helmDome = helmetSprite ? helmetSprite.domeColor : '#475569';
    const helmHighlight = helmetSprite ? helmetSprite.domeHighlight : '#cbd5e1';
    const helmVisor = helmetSprite ? helmetSprite.visorColor : '#0f172a';
    const helmEyes = helmetSprite ? helmetSprite.eyeColor : '#00e5ff';
    const plumeColor = helmetSprite ? helmetSprite.plumeColor : '#ef4444';

    if (plumeColor) {
        ctx.fillStyle = plumeColor;
        ctx.beginPath();
        ctx.ellipse(player.x + player.w / 2, headY - 3, 3, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = helmDome;
    ctx.fillRect(player.x + 2, headY, player.w - 4, 12);
    ctx.fillStyle = helmHighlight;
    ctx.fillRect(player.x + 3, headY, player.w - 6, 3);
    ctx.fillStyle = helmVisor;
    ctx.fillRect(player.x + 3, headY + 5, player.w - 6, 4);

    ctx.fillStyle = helmEyes;
    if (player.facing === 'right') {
        ctx.fillRect(player.x + 10, headY + 6, 4, 2);
    } else if (player.facing === 'left') {
        ctx.fillRect(player.x + 4, headY + 6, 4, 2);
    } else if (player.facing === 'down') {
        ctx.fillRect(player.x + 5, headY + 6, 3, 2);
        ctx.fillRect(player.x + 10, headY + 6, 3, 2);
    } else {
        ctx.fillStyle = helmDome;
        ctx.fillRect(player.x + 3, headY + 4, player.w - 6, 7);
    }
}

// 2. MAGE MODEL (Penyihir)
function drawMageModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite) {
    const time = Date.now() * 0.006;
    const robeWave = Math.sin(time) * 2.5;

    const capeMain = capeSprite ? capeSprite.mainColor : '#4c1d95';
    const capeInner = capeSprite ? capeSprite.innerColor : '#7c3aed';
    const armorBody = armorSprite ? armorSprite.bodyColor : '#312e81';
    const armorPlate = armorSprite ? armorSprite.plateColor : '#6366f1';
    const armorTrim = armorSprite ? armorSprite.trimColor : '#fbbf24';

    // Flowing Astral Robe Back
    ctx.fillStyle = capeMain;
    ctx.beginPath();
    ctx.moveTo(player.x + 2, player.y + 8);
    ctx.quadraticCurveTo(player.x - 6 + robeWave, player.y + player.h + 8, player.x + 2, player.y + player.h + 9);
    ctx.lineTo(player.x + player.w - 2, player.y + player.h + 9);
    ctx.quadraticCurveTo(player.x + player.w + 6 - robeWave, player.y + player.h + 8, player.x + player.w - 2, player.y + 8);
    ctx.closePath();
    ctx.fill();

    // Robe hem trim
    ctx.strokeStyle = capeInner;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Slippers / Sandals
    const bootColor = bootsSprite ? bootsSprite.bootColor : '#1e1b4b';
    ctx.fillStyle = bootColor;
    ctx.fillRect(player.x + 4, player.y + player.h - 4, 5, 4);
    ctx.fillRect(player.x + player.w - 9, player.y + player.h - 4, 5, 4);

    // Wizard Robe Body
    ctx.fillStyle = armorBody;
    ctx.fillRect(player.x + 3, player.y + 8, player.w - 6, player.h - 11);
    
    // Mystical Center Sash & Runes
    ctx.fillStyle = armorPlate;
    ctx.fillRect(player.x + player.w / 2 - 3, player.y + 9, 6, player.h - 12);
    ctx.fillStyle = armorTrim;
    ctx.fillRect(player.x + player.w / 2 - 1, player.y + 12, 2, 4);
    ctx.fillRect(player.x + player.w / 2 - 2, player.y + 17, 4, 2);
    ctx.fillRect(player.x + player.w / 2 - 1, player.y + 20, 2, 3);

    // Floating Mana Orb in offhand
    if (player.facing !== 'right') {
        const ox = player.facing === 'left' ? player.x + 12 : player.x - 7;
        const oy = player.y + 11 + Math.sin(time * 2) * 2;
        const orbColor = shieldSprite && shieldSprite.glowColor ? shieldSprite.glowColor : '#a855f7';

        ctx.save();
        ctx.fillStyle = orbColor;
        ctx.beginPath();
        ctx.arc(ox + 4, oy + 4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox + 3, oy + 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Wizard Pointed Hat / Cowl
    const headY = player.y - 3;
    const hatColor = helmetSprite ? helmetSprite.domeColor : '#581c87';
    const hatHighlight = helmetSprite ? helmetSprite.domeHighlight : '#9333ea';
    const hatBrim = helmetSprite ? helmetSprite.plumeColor : '#fbbf24';

    // Face / Shadow
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(player.x + 3, headY + 3, player.w - 6, 8);

    // Glowing Magic Eyes
    const eyeColor = helmetSprite ? helmetSprite.eyeColor : '#c084fc';
    ctx.fillStyle = eyeColor;
    if (player.facing === 'right') {
        ctx.fillRect(player.x + 10, headY + 5, 3, 2);
    } else if (player.facing === 'left') {
        ctx.fillRect(player.x + 4, headY + 5, 3, 2);
    } else if (player.facing === 'down') {
        ctx.fillRect(player.x + 5, headY + 5, 2.5, 2);
        ctx.fillRect(player.x + 10, headY + 5, 2.5, 2);
    } else {
        ctx.fillStyle = hatColor;
        ctx.fillRect(player.x + 3, headY + 4, player.w - 6, 7);
    }

    // Wizard Hat Brim
    ctx.fillStyle = hatBrim || '#fbbf24';
    ctx.fillRect(player.x - 2, headY + 3, player.w + 4, 2);

    // Pointed Hat Cone
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.moveTo(player.x, headY + 3);
    ctx.lineTo(player.x + player.w, headY + 3);
    ctx.lineTo(player.x + player.w / 2 - 3, headY - 10);
    ctx.lineTo(player.x + player.w / 2 - 6, headY - 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = hatHighlight;
    ctx.fillRect(player.x + player.w / 2 - 2, headY - 1, 4, 3);
}

// 3. ASSASSIN MODEL (Pembunuh)
function drawAssassinModel(ctx, px, py, capeSprite, armorSprite, helmetSprite, bootsSprite, shieldSprite) {
    const time = Date.now() * 0.008;
    const scarfWave = Math.sin(time) * 3;

    const capeMain = capeSprite ? capeSprite.mainColor : '#18181b';
    const capeInner = capeSprite ? capeSprite.innerColor : '#27272a';
    const armorBody = armorSprite ? armorSprite.bodyColor : '#18181b';
    const armorPlate = armorSprite ? armorSprite.plateColor : '#27272a';
    const armorTrim = armorSprite ? armorSprite.trimColor : '#10b981';

    // Agile Scarf / Shadow Cloak
    ctx.fillStyle = capeMain;
    ctx.beginPath();
    if (player.facing === 'right') {
        ctx.moveTo(player.x + 2, player.y + 6);
        ctx.quadraticCurveTo(player.x - 14 + scarfWave, player.y + 12, player.x - 10, player.y + player.h + 4);
        ctx.lineTo(player.x + 4, player.y + player.h - 2);
    } else if (player.facing === 'left') {
        ctx.moveTo(player.x + player.w - 2, player.y + 6);
        ctx.quadraticCurveTo(player.x + player.w + 14 - scarfWave, player.y + 12, player.x + player.w + 10, player.y + player.h + 4);
        ctx.lineTo(player.x + player.w - 4, player.y + player.h - 2);
    } else {
        ctx.moveTo(player.x + 2, player.y + 6);
        ctx.quadraticCurveTo(player.x - 8 + scarfWave, player.y + player.h + 4, player.x + 3, player.y + player.h + 6);
        ctx.lineTo(player.x + player.w - 3, player.y + player.h + 6);
        ctx.quadraticCurveTo(player.x + player.w + 8 - scarfWave, player.y + player.h + 4, player.x + player.w - 2, player.y + 6);
    }
    ctx.closePath();
    ctx.fill();

    // Ninja Tabi Boots
    const bootColor = bootsSprite ? bootsSprite.bootColor : '#09090b';
    const bootTrim = bootsSprite ? bootsSprite.trimColor : '#10b981';
    ctx.fillStyle = bootColor;
    ctx.fillRect(player.x + 4, player.y + player.h - 6, 5, 6);
    ctx.fillRect(player.x + player.w - 9, player.y + player.h - 6, 5, 6);
    ctx.fillStyle = bootTrim;
    ctx.fillRect(player.x + 4, player.y + player.h - 6, 5, 2);
    ctx.fillRect(player.x + player.w - 9, player.y + player.h - 6, 5, 2);

    // Slim Stealth Leather Vest
    ctx.fillStyle = armorBody;
    ctx.fillRect(player.x + 3, player.y + 8, player.w - 6, player.h - 13);
    ctx.fillStyle = armorPlate;
    ctx.fillRect(player.x + 5, player.y + 9, player.w - 10, player.h - 15);

    // Crossed throwing knife harness
    ctx.fillStyle = armorTrim;
    ctx.fillRect(player.x + 4, player.y + 10, 2, 8);
    ctx.fillRect(player.x + player.w - 6, player.y + 10, 2, 8);
    ctx.fillRect(player.x + 5, player.y + 13, player.w - 10, 2);

    // Parrying Dagger / Claw in Left Hand
    if (player.facing !== 'right') {
        const dx = player.facing === 'left' ? player.x + 11 : player.x - 4;
        const dy = player.y + 9;
        ctx.fillStyle = '#64748b';
        ctx.fillRect(dx, dy, 3, 7);
        ctx.fillStyle = armorTrim;
        ctx.fillRect(dx - 1, dy + 2, 5, 2);
    }

    // Ninja Mask & Hood
    const headY = player.y - 3;
    const hoodColor = helmetSprite ? helmetSprite.domeColor : '#18181b';
    const maskColor = helmetSprite ? helmetSprite.visorColor : '#09090b';
    const eyeColor = helmetSprite ? helmetSprite.eyeColor : '#10b981';

    // Hood dome
    ctx.fillStyle = hoodColor;
    ctx.fillRect(player.x + 2, headY, player.w - 4, 11);
    ctx.fillRect(player.x + 4, headY - 2, player.w - 8, 3);

    // Lower face mask
    ctx.fillStyle = maskColor;
    ctx.fillRect(player.x + 3, headY + 5, player.w - 6, 6);

    // Piercing glowing assassin eyes
    ctx.fillStyle = eyeColor;
    if (player.facing === 'right') {
        ctx.fillRect(player.x + 9, headY + 4, 4, 1.8);
    } else if (player.facing === 'left') {
        ctx.fillRect(player.x + 4, headY + 4, 4, 1.8);
    } else if (player.facing === 'down') {
        ctx.fillRect(player.x + 5, headY + 4, 3, 1.8);
        ctx.fillRect(player.x + 9, headY + 4, 3, 1.8);
    } else {
        ctx.fillStyle = hoodColor;
        ctx.fillRect(player.x + 3, headY + 3, player.w - 6, 8);
    }
}

// WEAPON DRAWING (SWORD, STAFF, OR DUAL DAGGERS)
function drawSword(ctx, px, py) {
    ctx.save();
    ctx.translate(px, py);

    const role = (player && player.characterRole) ? player.characterRole : 'knight';
    const weaponSprite = getEquippedSprite(player.equipped, 'weapon');
    const bladeColor = weaponSprite ? weaponSprite.bladeColor : '#f8fafc';
    const bladeHighlight = weaponSprite ? weaponSprite.bladeHighlight : '#ffffff';
    const bladeShadow = weaponSprite ? weaponSprite.bladeShadow : '#94a3b8';
    const crossguardColor = weaponSprite ? weaponSprite.crossguardColor : '#fbbf24';
    const gripColor = weaponSprite ? weaponSprite.gripColor : '#78350f';
    const pommelColor = weaponSprite ? weaponSprite.pommelColor : '#e74c3c';
    const swordLength = weaponSprite ? weaponSprite.bladeLength : 26;
    const glowColor = weaponSprite ? weaponSprite.glowColor : null;
    const tipStyle = weaponSprite ? weaponSprite.tipStyle : 'normal';

    const baseAngle = getFacingAngle(player.facing);
    let weaponAngle = baseAngle;

    if (role === 'mage') {
        weaponAngle = player.isAttacking ? (baseAngle + Math.sin(player.slashArcProgress * Math.PI) * 0.15) : (baseAngle + 0.35);
    } else if (role === 'assassin') {
        weaponAngle = player.isAttacking ? (baseAngle - 0.35 + player.slashArcProgress * 0.7) : (baseAngle + 0.25);
    } else {
        if (player.isAttacking) {
            const sweepSpan = Math.PI * 0.85;
            weaponAngle = baseAngle - sweepSpan / 2 + sweepSpan * player.slashArcProgress;
        } else {
            weaponAngle = baseAngle + 0.35;
        }
    }

    ctx.rotate(weaponAngle);

    if (role === 'mage') {
        // --- MAGE STAFF / WAND ---
        const staffLen = player.isAttacking ? swordLength + 8 : swordLength;

        if (tipStyle === 'snow') {
            // === EXCLUSIVE: SNOW STAFF (Tongkat Salju Bersalju Abadi) ===
            // Frosty ice-blue staff shaft
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(2, -2, staffLen - 10, 4);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillRect(4, -1, staffLen - 14, 2);

            // Frosted crystal brackets / crossguard
            ctx.fillStyle = '#bae6fd';
            ctx.fillRect(staffLen - 12, -5, 3, 10);
            ctx.fillRect(staffLen - 10, -7, 2, 4);
            ctx.fillRect(staffLen - 10, 3, 2, 4);

            // Glowing Frosted Orb
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.arc(staffLen - 3, 0, 6.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(staffLen - 4, -1.5, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // 6-Pointed Snowflake Crystals on head
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.4;
            for (let a = 0; a < 6; a++) {
                const sAngle = (Math.PI / 3) * a;
                const sx = staffLen - 3 + Math.cos(sAngle) * 9;
                const sy = Math.sin(sAngle) * 9;
                ctx.beginPath();
                ctx.moveTo(staffLen - 3, 0);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }

            // Expanding frost ring on cast
            if (player.isAttacking) {
                ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(staffLen + 4, 0, 7 + player.slashArcProgress * 8, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // Standard Staff Shaft
            ctx.fillStyle = gripColor;
            ctx.fillRect(2, -2, staffLen - 8, 4);
            ctx.fillStyle = crossguardColor;
            ctx.fillRect(staffLen - 10, -3, 3, 6);
            // Crystal Gem Head
            ctx.fillStyle = bladeColor;
            ctx.beginPath();
            ctx.arc(staffLen - 2, 0, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = bladeHighlight;
            ctx.beginPath();
            ctx.arc(staffLen - 3, -1, 2, 0, Math.PI * 2);
            ctx.fill();
            // Radiating rings during cast
            if (player.isAttacking) {
                ctx.strokeStyle = glowColor || '#c084fc';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(staffLen + 4, 0, 6 + player.slashArcProgress * 6, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

    } else if (role === 'assassin') {
        // --- ASSASSIN DUAL DAGGERS ---
        const dLen = player.isAttacking ? swordLength + 4 : swordLength;

        if (tipStyle === 'candy_cane') {
            // === EXCLUSIVE: CANDY CANE STILETTO (Belati Permen Runcing) ===
            const drawCandyCane = (len) => {
                // Peppermint drop pommel
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(2, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(1, -1, 2, 2);

                // Pure white sugar guard
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(7, -4, 2, 8);

                // Candy cane blade body (white base)
                const caneW = 4;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(9, -caneW / 2, len - 11, caneW);

                // Diagonal peppermint red stripes
                ctx.fillStyle = '#dc2626';
                for (let sx = 10; sx < len - 4; sx += 5) {
                    ctx.beginPath();
                    ctx.moveTo(sx, -caneW / 2);
                    ctx.lineTo(sx + 2.5, -caneW / 2);
                    ctx.lineTo(sx + 0.5, caneW / 2);
                    ctx.lineTo(sx - 2, caneW / 2);
                    ctx.closePath();
                    ctx.fill();
                }

                // Sharp hook / needle point tip
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(len - 2, -caneW / 2);
                ctx.lineTo(len + 4, -caneW / 2 - 2); // razor-sharp hook needle
                ctx.lineTo(len - 1, caneW / 2);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(len + 3, -caneW / 2 - 1.5, 1, 0, Math.PI * 2);
                ctx.fill();
            };

            // Main Hand Dagger
            drawCandyCane(dLen);

            // Offhand Dagger (Reverse Grip)
            if (player.isAttacking) {
                ctx.save();
                ctx.rotate(-0.85);
                drawCandyCane(dLen - 3);
                ctx.restore();
            }
        } else {
            // Standard Dual Daggers
            // Main Dagger
            ctx.fillStyle = pommelColor;
            ctx.fillRect(2, -2, 3, 4);
            ctx.fillStyle = gripColor;
            ctx.fillRect(5, -1.5, 5, 3);
            ctx.fillStyle = crossguardColor;
            ctx.fillRect(10, -4, 2, 8);
            ctx.fillStyle = bladeColor;
            ctx.fillRect(12, -2, dLen - 12, 4);
            ctx.fillStyle = bladeHighlight;
            ctx.beginPath();
            ctx.moveTo(dLen, -2); ctx.lineTo(dLen + 4, 0); ctx.lineTo(dLen, 2);
            ctx.closePath();
            ctx.fill();

            // Offhand Second Dagger (Reverse Grip)
            if (player.isAttacking) {
                ctx.save();
                ctx.rotate(-0.85);
                ctx.fillStyle = bladeColor;
                ctx.fillRect(6, 6, dLen - 8, 3.5);
                ctx.fillStyle = bladeHighlight;
                ctx.beginPath();
                ctx.moveTo(dLen - 2, 6); ctx.lineTo(dLen + 3, 7.5); ctx.lineTo(dLen - 2, 9.5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

    } else {
        // --- KNIGHT BROADSWORD ---
        const len = player.isAttacking ? swordLength + 8 : swordLength;

        if (tipStyle === 'christmas_tree') {
            // === EXCLUSIVE: CHRISTMAS TREE BLADE (Pedang Pohon Cemara) ===
            // Tree trunk wood hilt
            ctx.fillStyle = '#5c2d16';
            ctx.beginPath(); ctx.arc(2, 0, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#78350f'; ctx.fillRect(4, -2.5, 5, 5);

            // Festive gold pot crossguard
            ctx.fillStyle = '#b45309'; ctx.fillRect(8, -6, 4, 12);
            ctx.fillStyle = '#fbbf24'; ctx.fillRect(9, -5, 2, 10);

            // Christmas Tree pine foliage layers
            // Tier 1 (Base wide branch tier)
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.moveTo(12, -7); ctx.lineTo(21, -3); ctx.lineTo(21, 3); ctx.lineTo(12, 7);
            ctx.closePath(); ctx.fill();

            // Tier 2 (Middle branch tier)
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.moveTo(19, -6); ctx.lineTo(29, -2.5); ctx.lineTo(29, 2.5); ctx.lineTo(19, 6);
            ctx.closePath(); ctx.fill();

            // Tier 3 (Top needle tier tapering to point)
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(27, -5); ctx.lineTo(len, 0); ctx.lineTo(27, 5);
            ctx.closePath(); ctx.fill();

            // Pine needle highlight ridge
            ctx.fillStyle = '#86efac';
            ctx.fillRect(14, -0.6, len - 16, 1.2);

            // Christmas Ornaments / Holiday Light Baubles
            const ornaments = [
                { x: 15, y: -4, c: '#ef4444' }, // red
                { x: 16, y: 4, c: '#fbbf24' },  // gold
                { x: 23, y: -3.5, c: '#38bdf8' }, // blue
                { x: 24, y: 3.5, c: '#ec4899' }, // pink
                { x: 30, y: -2, c: '#ffffff' }, // white
                { x: 31, y: 2, c: '#f59e0b' }   // orange
            ];
            ornaments.forEach(o => {
                if (o.x < len - 2) {
                    ctx.fillStyle = o.c;
                    ctx.beginPath();
                    ctx.arc(o.x, o.y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Glowing Golden Star on Tree Tip!
            ctx.save();
            ctx.fillStyle = '#fde047';
            const starX = len + 1;
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
                const sAng = (Math.PI * 2 / 5) * s - Math.PI / 2;
                const innerAng = sAng + Math.PI / 5;
                const sx1 = starX + Math.cos(sAng) * 4.5;
                const sy1 = Math.sin(sAng) * 4.5;
                const sx2 = starX + Math.cos(innerAng) * 2;
                const sy2 = Math.sin(innerAng) * 2;
                if (s === 0) ctx.moveTo(sx1, sy1);
                else ctx.lineTo(sx1, sy1);
                ctx.lineTo(sx2, sy2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else {
            // Standard Knight Broadsword
            ctx.fillStyle = pommelColor;
            ctx.beginPath(); ctx.arc(2, 0, 3, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = gripColor; ctx.fillRect(4, -2.5, 5, 5);
            ctx.fillStyle = crossguardColor; ctx.fillRect(8, -6, 4, 12);
            ctx.fillStyle = bladeShadow; ctx.fillRect(10, -6, 2, 12);

            ctx.fillStyle = bladeColor; ctx.fillRect(12, -3.5, len - 12, 7);
            ctx.fillStyle = bladeShadow; ctx.fillRect(12, 0, len - 12, 3.5);

            ctx.fillStyle = bladeHighlight;
            ctx.beginPath();
            ctx.moveTo(len, -3.5); ctx.lineTo(len + 5, 0); ctx.lineTo(len, 3.5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = bladeHighlight; ctx.fillRect(12, -0.6, len - 10, 1.2);
        }
    }

    ctx.restore();
}

function drawSlashArc(ctx, px, py) {
    if (!player.isAttacking) return;

    const role = (player && player.characterRole) ? player.characterRole : 'knight';
    const weaponSprite = getEquippedSprite(player.equipped, 'weapon');
    const tipStyle = weaponSprite ? weaponSprite.tipStyle : 'normal';

    let slashColor = weaponSprite && weaponSprite.glowColor ? weaponSprite.glowColor : '#f1c40f';
    if (role === 'mage') slashColor = weaponSprite && weaponSprite.glowColor ? weaponSprite.glowColor : '#c084fc';
    if (role === 'assassin') slashColor = weaponSprite && weaponSprite.glowColor ? weaponSprite.glowColor : '#10b981';

    const baseAngle = getFacingAngle(player.facing);

    if (role === 'mage') {
        const auraConfig = (typeof getMageAuraConfig === 'function')
            ? getMageAuraConfig(player.equipped ? player.equipped.weapon : null)
            : { id: 'arcane', primaryColor: '#a855f7', secondaryColor: '#c4b5fd', glowColor: '#9333ea', icon: '🔮', radius: 44 };

        const progress = player.slashArcProgress; // 0.0 -> 1.0
        // Eased radius expansion
        const currentRadius = auraConfig.radius * Math.min(1, progress * 1.25 + 0.15);
        // Alpha peaks around progress 0.4-0.5 and fades smoothly out
        const auraAlpha = Math.sin(progress * Math.PI);

        ctx.save();

        // 1. MANA AURA AMBIENT RADIAL GLOW AROUND MAGE BODY
        const auraGrad = ctx.createRadialGradient(px, py, 4, px, py, currentRadius);
        auraGrad.addColorStop(0, auraConfig.primaryColor + '55');
        auraGrad.addColorStop(0.6, auraConfig.secondaryColor + '33');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Outer aura perimeter ring
        ctx.strokeStyle = auraConfig.primaryColor;
        ctx.globalAlpha = auraAlpha * 0.85;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing mana pulse wave
        ctx.strokeStyle = auraConfig.secondaryColor;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = auraAlpha * 0.7;
        ctx.beginPath();
        ctx.arc(px, py, currentRadius * 0.55, 0, Math.PI * 2);
        ctx.stroke();

        // 2. DISTINCT VISUAL PATTERN PER WEAPON
        ctx.save();
        ctx.translate(px, py);

        if (auraConfig.id === 'snow') {
            // === FROST / BLIZZARD SNOWFLAKE MANDALA ===
            const spin = progress * 0.6;
            ctx.rotate(spin);
            ctx.strokeStyle = `rgba(255, 255, 255, ${auraAlpha * 0.95})`;
            ctx.lineWidth = 1.8;

            // 6-pointed crystalline snowflake branches
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                const rEnd = currentRadius * 0.92;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(cosA * rEnd, sinA * rEnd);
                ctx.stroke();

                // Ice crystal side-spikes (barbs) along each branch
                const barbDist = rEnd * 0.62;
                const barbLen = 7;
                ctx.beginPath();
                ctx.moveTo(cosA * barbDist, sinA * barbDist);
                ctx.lineTo(cosA * barbDist + Math.cos(angle + 0.7) * barbLen, sinA * barbDist + Math.sin(angle + 0.7) * barbLen);
                ctx.moveTo(cosA * barbDist, sinA * barbDist);
                ctx.lineTo(cosA * barbDist + Math.cos(angle - 0.7) * barbLen, sinA * barbDist + Math.sin(angle - 0.7) * barbLen);
                ctx.stroke();

                // Diamond tip at each branch
                ctx.fillStyle = '#bae6fd';
                ctx.fillRect(cosA * rEnd - 2, sinA * rEnd - 2, 4, 4);
            }

            // Hexagonal inner ice shield
            ctx.strokeStyle = `rgba(56, 189, 248, ${auraAlpha * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = Math.cos(angle) * (currentRadius * 0.45);
                const hy = Math.sin(angle) * (currentRadius * 0.45);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();

        } else if (auraConfig.id === 'fire') {
            // === INFERNAL MAGMA FLARES & SOLAR SPIKES ===
            const spin = progress * 0.4;
            ctx.rotate(spin);

            // 8 radiating flame tongues / solar flares
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i;
                const fLen = currentRadius * 0.95;
                const flareBaseR = currentRadius * 0.65;

                ctx.fillStyle = (i % 2 === 0) ? `rgba(255, 61, 0, ${auraAlpha * 0.85})` : `rgba(253, 224, 71, ${auraAlpha * 0.9})`;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle - 0.15) * flareBaseR, Math.sin(angle - 0.15) * flareBaseR);
                ctx.lineTo(Math.cos(angle) * fLen, Math.sin(angle) * fLen);
                ctx.lineTo(Math.cos(angle + 0.15) * flareBaseR, Math.sin(angle + 0.15) * flareBaseR);
                ctx.closePath();
                ctx.fill();
            }

            // Turbulent jagged inner magma core
            ctx.strokeStyle = `rgba(254, 240, 138, ${auraAlpha * 0.9})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI / 6) * i;
                const r = currentRadius * 0.4 + (i % 2 === 0 ? 5 : -4);
                const ix = Math.cos(angle) * r;
                const iy = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(ix, iy);
                else ctx.lineTo(ix, iy);
            }
            ctx.closePath();
            ctx.stroke();

        } else if (auraConfig.id === 'thunder') {
            // === HIGH VOLTAGE LIGHTNING DISCHARGE & ZIGZAG RING ===
            const spin = -progress * 0.5;
            ctx.rotate(spin);

            // 12-point jagged electric shockwave ring
            ctx.strokeStyle = `rgba(250, 204, 21, ${auraAlpha * 0.95})`;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            const points = 12;
            for (let i = 0; i < points; i++) {
                const angle = (Math.PI * 2 / points) * i;
                const r = currentRadius * (i % 2 === 0 ? 0.96 : 0.74);
                const zx = Math.cos(angle) * r;
                const zy = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(zx, zy);
                else ctx.lineTo(zx, zy);
            }
            ctx.closePath();
            ctx.stroke();

            // 4 crackling lightning bolts branching outward
            ctx.strokeStyle = `rgba(255, 255, 255, ${auraAlpha * 0.95})`;
            ctx.lineWidth = 1.8;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i + 0.3;
                const midR = currentRadius * 0.5;
                const outR = currentRadius * 0.88;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle + 0.2) * midR, Math.sin(angle + 0.2) * midR);
                ctx.lineTo(Math.cos(angle - 0.1) * outR, Math.sin(angle - 0.1) * outR);
                ctx.stroke();
            }

        } else if (auraConfig.id === 'crystal') {
            // === SAPPHIRE CRYSTAL FACETED BARRIER ===
            const spin = progress * 0.25;
            ctx.rotate(spin);

            // Outer Octagon Facet Shield
            ctx.strokeStyle = `rgba(0, 229, 255, ${auraAlpha * 0.95})`;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            const sides = 8;
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI / 4) * i;
                const cx = Math.cos(angle) * (currentRadius * 0.92);
                const cy = Math.sin(angle) * (currentRadius * 0.92);
                if (i === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx, cy);
            }
            ctx.closePath();
            ctx.stroke();

            // Inner Octagon with radial facet connectors
            ctx.strokeStyle = `rgba(186, 230, 253, ${auraAlpha * 0.75})`;
            ctx.lineWidth = 1.4;
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI / 4) * i;
                const outX = Math.cos(angle) * (currentRadius * 0.92);
                const outY = Math.sin(angle) * (currentRadius * 0.92);
                const inX = Math.cos(angle) * (currentRadius * 0.48);
                const inY = Math.sin(angle) * (currentRadius * 0.48);
                ctx.beginPath();
                ctx.moveTo(inX, inY);
                ctx.lineTo(outX, outY);
                ctx.stroke();
            }

            // 4 Diamond crystals at cardinal corners
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i + Math.PI / 4;
                const dx = Math.cos(angle) * (currentRadius * 0.92);
                const dy = Math.sin(angle) * (currentRadius * 0.92);
                ctx.beginPath();
                ctx.moveTo(dx, dy - 4);
                ctx.lineTo(dx + 4, dy);
                ctx.lineTo(dx, dy + 4);
                ctx.lineTo(dx - 4, dy);
                ctx.closePath();
                ctx.fill();
            }

        } else if (auraConfig.id === 'cosmic') {
            // === COSMIC NEBULA SPIRAL ARMS & ORBITING STARS ===
            const spin = progress * 1.2;
            ctx.rotate(spin);

            // Dual Spiral Arms
            ctx.lineWidth = 2.6;
            for (let arm = 0; arm < 2; arm++) {
                const armOffset = arm * Math.PI;
                ctx.strokeStyle = (arm === 0) ? `rgba(236, 72, 153, ${auraAlpha * 0.9})` : `rgba(168, 85, 247, ${auraAlpha * 0.9})`;
                ctx.beginPath();
                for (let s = 0; s <= 20; s++) {
                    const theta = (s / 20) * Math.PI * 1.2 + armOffset;
                    const r = (s / 20) * (currentRadius * 0.94);
                    const sx = Math.cos(theta) * r;
                    const sy = Math.sin(theta) * r;
                    if (s === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }

            // 4 Orbiting Celestial Stars
            for (let i = 0; i < 4; i++) {
                const sAngle = (Math.PI / 2) * i - spin * 1.5;
                const orbR = currentRadius * 0.72;
                const starX = Math.cos(sAngle) * orbR;
                const starY = Math.sin(sAngle) * orbR;

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(starX, starY, 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#f472b6';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(starX, starY, 5, 0, Math.PI * 2);
                ctx.stroke();
            }

        } else {
            // === ARCANE PULSE: MYSTIC RUNE RING & CARDINAL GLYPHS ===
            const spin = progress * 0.35;
            ctx.rotate(spin);

            // Arcane dashed rune circle
            ctx.strokeStyle = `rgba(168, 85, 247, ${auraAlpha * 0.95})`;
            ctx.lineWidth = 2.2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius * 0.85, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 4 Cardinal Mystic Glyph Marks
            ctx.fillStyle = `rgba(196, 181, 253, ${auraAlpha * 0.95})`;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i;
                const gx = Math.cos(angle) * (currentRadius * 0.85);
                const gy = Math.sin(angle) * (currentRadius * 0.85);

                // Small diamond node
                ctx.beginPath();
                ctx.moveTo(gx, gy - 3.5);
                ctx.lineTo(gx + 3.5, gy);
                ctx.lineTo(gx, gy + 3.5);
                ctx.lineTo(gx - 3.5, gy);
                ctx.closePath();
                ctx.fill();
            }

            // Inner spinning triangle rune
            ctx.strokeStyle = `rgba(255, 255, 255, ${auraAlpha * 0.7})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const tAngle = (Math.PI * 2 / 3) * i - spin * 2;
                const tx = Math.cos(tAngle) * (currentRadius * 0.42);
                const ty = Math.sin(tAngle) * (currentRadius * 0.42);
                if (i === 0) ctx.moveTo(tx, ty);
                else ctx.lineTo(tx, ty);
            }
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore(); // restore translated px, py

        // 3. STAFF-TIP CASTING SEAL
        const tipDist = 26;
        const tipX = px + Math.cos(baseAngle) * tipDist;
        const tipY = py + Math.sin(baseAngle) * tipDist;
        const tipRingRadius = 6 + progress * 14;
        const tipAlpha = Math.max(0, 1 - progress);

        ctx.strokeStyle = auraConfig.primaryColor;
        ctx.globalAlpha = tipAlpha;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(tipX, tipY, tipRingRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = auraConfig.secondaryColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(tipX, tipY, tipRingRadius * 0.55, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
        return;
    }

    if (role === 'assassin') {
        // ASSASSIN TWIN CROSS-SLASH (X-Cut)
        ctx.save();
        const progress = player.slashArcProgress;
        const slashLen = 18 * progress;
        const cx = px + Math.cos(baseAngle) * 22;
        const cy = py + Math.sin(baseAngle) * 22;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(baseAngle);
        
        if (tipStyle === 'candy_cane') {
            // Sweet peppermint candy red & white twin slashes
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.75, -slashLen);
            ctx.lineTo(slashLen * 0.75, slashLen);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.75, slashLen);
            ctx.lineTo(slashLen * 0.75, -slashLen);
            ctx.stroke();

            // Sparkling red candy center line
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.4, 0);
            ctx.lineTo(slashLen * 0.4, 0);
            ctx.stroke();
        } else {
            // Standard Assassin Dagger 1 slash line
            ctx.strokeStyle = slashColor;
            ctx.lineWidth = 3.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.7, -slashLen);
            ctx.lineTo(slashLen * 0.7, slashLen);
            ctx.stroke();

            // Dagger 2 slash line
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.7, slashLen);
            ctx.lineTo(slashLen * 0.7, -slashLen);
            ctx.stroke();

            // Bright white core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-slashLen * 0.3, 0);
            ctx.lineTo(slashLen * 0.3, 0);
            ctx.stroke();
        }

        ctx.restore();
        ctx.restore();
        return;
    }

    // KNIGHT HEAVY CLEAVE ARC
    const sweepSpan = Math.PI * 0.85;
    const startAngle = baseAngle - sweepSpan / 2;
    const currentAngle = startAngle + sweepSpan * player.slashArcProgress;
    const radius = 46;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, radius, startAngle, currentAngle, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = (tipStyle === 'christmas_tree') ? '#16a34a' : slashColor;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, radius, startAngle + (currentAngle - startAngle) * 0.25, currentAngle, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = (tipStyle === 'christmas_tree') ? '#fde047' : '#ffffff';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
}
