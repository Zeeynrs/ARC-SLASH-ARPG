// --- BOSS DIALOGUE & DETAILED PIXEL CLOSE-UP FACE PORTRAIT SYSTEM ---
// Handles dramatic intro cutscenes for Stage 22 Alter Ego Boss battle
// with high-detail procedural pixel-art face sprites, typewriter speech, and controls.

const bossDialogue = {
    isActive: false,
    boss: null,
    stepIndex: 0,
    lines: [],
    displayedText: '',
    charIndex: 0,
    typeTimer: 0,
    typeSpeed: 1, // ticks per character
    isTyping: false,
    faceParticles: [],
    hasSeenDialogue: false,
    cutsceneCompleteCallback: null
};

// --- DIALOGUE SCRIPTS PER MATCHUP ---
function getAlterEgoDialogueScript(bossRole, playerRole, isApex = false) {
    const pRole = (playerRole || 'knight').toLowerCase();
    const bRole = (bossRole || 'knight').toLowerCase();

    let bossMeta;
    if (isApex) {
        bossMeta = {
            knight: { name: 'APEX VOID DRAGON KNIGHT', gearBadge: 'SCULK ABYSSAL SET TIER 5', color: '#06b6d4' },
            mage: { name: 'APEX VOID ARCHMAGE', gearBadge: 'SCULK ABYSSAL SET TIER 5', color: '#22d3ee' },
            assassin: { name: 'APEX VOID REAPER', gearBadge: 'SCULK ABYSSAL SET TIER 5', color: '#0891b2' }
        }[bRole] || { name: 'APEX SCULK MIRROR', gearBadge: 'SCULK ABYSSAL SET TIER 5', color: '#06b6d4' };
    } else {
        bossMeta = {
            knight: { name: 'SHADOW DRAGON KNIGHT', gearBadge: 'DRAGON SCALE SET TIER 4', color: '#ef4444' },
            mage: { name: 'SHADOW COSMIC ARCHMAGE', gearBadge: 'ASTRAL ARCHMAGE SET TIER 4', color: '#c084fc' },
            assassin: { name: 'SHADOW PHANTOM REAPER', gearBadge: 'PHANTOM REAPER SET TIER 4', color: '#10b981' }
        }[bRole] || { name: 'ALTER EGO BOSS', gearBadge: 'TIER 4 SET', color: '#ef4444' };
    }

    const playerMeta = {
        knight: { name: 'HERO KNIGHT', gearBadge: 'LABYRINTH GUARDIAN', color: '#38bdf8' },
        mage: { name: 'HERO MAGE', gearBadge: 'ARCANE SCHOLAR', color: '#60a5fa' },
        assassin: { name: 'HERO ASSASSIN', gearBadge: 'SHADOW HUNTER', color: '#34d399' }
    }[pRole] || { name: 'HERO', gearBadge: 'LABYRINTH CHALLENGER', color: '#38bdf8' };

    const matchupKey = isApex ? `${pRole}_vs_${bRole}_apex` : `${pRole}_vs_${bRole}`;

    // Script lines tailored for every single (Player, Alter Ego) matchup
    const scripts = {
        // --- 1. PLAYER: KNIGHT ---
        'knight_vs_knight': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Look in the mirror, Knight! This dragon armor and blade are your true destiny once you forsake mercy!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'My blade is drawn for honor and to protect the innocent, not to be enslaved by labyrinth darkness!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Stubborn fool! Let us see whose armor shatters and whose blade breaks today!'
            }
        ],
        'knight_vs_mage': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Your iron armor and shield are powerless against the cosmic mysteries of the void, Knight!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'My shield withstood the breath of the ancient dragon! Your magic cannot crack my sacred vow!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'I will melt your steel beneath falling stars! Prepare to be reduced to cosmic ash!'
            }
        ],
        'knight_vs_assassin': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Your armor is heavy and slow, Knight. You are merely an easy target for my shadow daggers.'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Speed without strength cannot breach the stalwart defense of a true knight!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Every defense has a fatal flaw. Your throat will be slit before your shield can be raised!'
            }
        ],

        // --- 2. PLAYER: MAGE ---
        'mage_vs_knight': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Fragile sorcerer... Do you truly believe your muttered incantations can halt the rampage of dragon fury?!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Muscle and iron are mere mortal clay. Universal arcane law transcends your crude steel!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Step forward and feel my blade cleave every spell you cherish into dust!'
            }
        ],
        'mage_vs_mage': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'At last, the reflection of my soul... Gaze into me as you gaze into the endless cosmic abyss!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'You have been blinded by dark mana distortion! This labyrinth has poisoned your sanity!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Not blinded, but enlightened! Let the Cosmic Eclipse consume your very existence!'
            }
        ],
        'mage_vs_assassin': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'In the blink of an eye, your throat will be severed before you can utter a single incantation!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Shadows cannot hide from arcane radiance! My mana field detects your every breath!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Enjoy your final words before the venom of my daggers freezes the blood in your veins!'
            }
        ],

        // --- 3. PLAYER: ASSASSIN ---
        'assassin_vs_knight': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Deceitful shadow rat... Your daggers cannot pierce my dragon-scaled aegis!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Heavy armor always hides joint seams. You are far too slow to perceive your impending doom.'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Try approaching if you dare! My draconic inferno will incinerate every shadow you hide in!'
            }
        ],
        'assassin_vs_mage': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'You lurk in the darkness, yet my cosmic arcana illuminates and exposes every footprint you make!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'The grandest spell is useless if your heart is pierced before your lips can speak.'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'I shall shatter the dimension beneath your feet before your daggers ever brush my robe!'
            }
        ],
        'assassin_vs_assassin': [
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Two shadow reapers upon a single altar... Only one assassin walks out of this sanctuary alive.'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Your mask and daggers are cheap imitations. You are no match for your true self!'
            },
            {
                speaker: 'boss', role: bRole, ...bossMeta,
                text: 'Let us prove it in the darkness... whose blade is colder and quicker to claim life!'
            }
        ],

        // --- 4. APEX SCULK MIRROR (STAGE 50 DEEP DARK CORE) ---
        'knight_vs_knight_apex': [
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'Gaze into the lightless mirror, Knight! Here in the Deep Dark Core, your hollow oaths crumble. I am the void beneath your courage!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'The fire in my spirit does not fear the abyss! Even beneath crushed deepslate and sculk, my blade will cut true!'
            },
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'Then let your soul feed the ancient sculk catalysts! Only one Knight walks out of this mirror alive!'
            }
        ],
        'mage_vs_mage_apex': [
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'You tamper with celestial lights, yet the primordial Sculk frequencies govern the ultimate quietus of reality!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'Arcane truth penetrates even the deepest void! Your distorted acoustic frequencies end here!'
            },
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'Let the abyssal void collapse upon you! Drown in the silent cataclysm of the Deep Core!'
            }
        ],
        'assassin_vs_assassin_apex': [
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'You think you command the shadows? The Sculk perceives every heartbeat, every breath, every muscle twitch!'
            },
            {
                speaker: 'player', role: pRole, ...playerMeta,
                text: 'A true reaper becomes silence itself. Even your ancient sensors will never perceive the blow that shatters you!'
            },
            {
                speaker: 'boss', role: bRole, isApex: true, ...bossMeta,
                text: 'Boast while your lungs still draw air! The lightless mirror claims your reflection forever!'
            }
        ]
    };

    if (isApex) {
        return scripts[matchupKey] || scripts[`${pRole}_vs_${pRole}_apex`] || scripts['knight_vs_knight_apex'];
    }
    return scripts[matchupKey] || scripts['knight_vs_knight'];
}

// --- START CUTSCENE ---
function startAlterEgoCutscene(bossMob) {
    if (!bossMob) return;

    const isApex = (typeof currentStage !== 'undefined' && currentStage >= 50) || !!bossMob.isApexMirror;
    bossDialogue.isActive = true;
    bossDialogue.boss = bossMob;
    bossDialogue.stepIndex = 0;
    bossDialogue.lines = getAlterEgoDialogueScript(bossMob.alterEgoRole || 'knight', (player && player.characterRole) ? player.characterRole : 'knight', isApex);
    bossDialogue.displayedText = '';
    bossDialogue.charIndex = 0;
    bossDialogue.typeTimer = 0;
    bossDialogue.isTyping = true;
    bossDialogue.faceParticles = [];

    // Face each other
    if (typeof player !== 'undefined') {
        player.facing = 'right';
        player.isAttacking = false;
    }
    if (bossMob) {
        bossMob.facing = 'left';
        bossMob.isAttacking = false;
    }

    gameState = 'BOSS_DIALOGUE';
    playSound('shield');

    // Spawn dramatic entrance particles
    for (let i = 0; i < 40; i++) {
        const col = isApex ? '#06b6d4' : ((bossMob.alterEgoRole === 'mage') ? '#c084fc' : ((bossMob.alterEgoRole === 'assassin') ? '#10b981' : '#ef4444'));
        particles.push({
            x: bossMob.x + bossMob.w / 2 + (Math.random() - 0.5) * 40,
            y: bossMob.y + bossMob.h / 2 + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 3 + 2,
            color: col,
            life: 30
        });
    }
}

// --- START WARDEN CUTSCENE ---
function startWardenCutscene(wardenBoss) {
    if (!wardenBoss) return;

    bossDialogue.isActive = true;
    bossDialogue.boss = wardenBoss;
    bossDialogue.stepIndex = 0;
    const pRole = (player && player.characterRole) ? player.characterRole : 'knight';
    const playerResponse = (pRole === 'mage')
        ? 'Fascinating yet terrifying... An acoustic abomination forged by forgotten souls! Arcane magic, protect me!'
        : (pRole === 'assassin')
            ? 'It has no eyes, but senses every breath... Silence and precision will be my only salvation!'
            : 'A titan of pure sculk and souls... Stand firm! My blade will silence your roar!';

    bossDialogue.lines = [
        {
            speaker: 'warden', role: 'warden',
            name: 'THE WARDEN', gearBadge: 'TITAN OF DEEP DARK', color: '#06b6d4',
            text: 'GROOOOAAARRRGHHHH...!! 🔊💀 THE SCULK SENSORS RESONATE WITH TREMORS!'
        },
        {
            speaker: 'player', role: pRole,
            name: `HERO ${pRole.toUpperCase()}`, gearBadge: 'LABYRINTH CHAMPION', color: '#38bdf8',
            text: playerResponse
        },
        {
            speaker: 'warden', role: 'warden',
            name: 'THE WARDEN', gearBadge: 'TITAN OF DEEP DARK', color: '#22d3ee',
            text: 'HEAR THE ACOUSTIC ROAR OF A THOUSAND CONDEMNED SOULS... FALL BEFORE THE WARDEN!!'
        }
    ];
    bossDialogue.displayedText = '';
    bossDialogue.charIndex = 0;
    bossDialogue.typeTimer = 0;
    bossDialogue.isTyping = true;
    bossDialogue.faceParticles = [];

    if (typeof player !== 'undefined') {
        player.facing = 'right';
        player.isAttacking = false;
    }
    if (wardenBoss) {
        wardenBoss.facing = 'left';
        wardenBoss.isAttacking = false;
    }

    gameState = 'BOSS_DIALOGUE';
    screenShake = 22;
    playSound('explode');

    for (let i = 0; i < 40; i++) {
        particles.push({
            x: wardenBoss.x + wardenBoss.w / 2 + (Math.random() - 0.5) * 60,
            y: wardenBoss.y + wardenBoss.h / 2 + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#06b6d4' : '#22d3ee',
            life: 35
        });
    }
}

// --- UPDATE DIALOGUE (TYPEWRITER & AMBIENT PARTICLES) ---
function updateBossDialogue() {
    if (!bossDialogue.isActive) return;

    const currentLine = bossDialogue.lines[bossDialogue.stepIndex];
    if (!currentLine) return;

    // Typewriter update
    if (bossDialogue.isTyping) {
        bossDialogue.typeTimer++;
        if (bossDialogue.typeTimer >= bossDialogue.typeSpeed) {
            bossDialogue.typeTimer = 0;
            if (bossDialogue.charIndex < currentLine.text.length) {
                bossDialogue.charIndex++;
                bossDialogue.displayedText = currentLine.text.slice(0, bossDialogue.charIndex);
            } else {
                bossDialogue.isTyping = false;
            }
        }
    }

    // Portrait atmospheric particles
    const currentSpeaker = currentLine.speaker;
    const currentRole = currentLine.role;

    if (Math.random() < 0.45) {
        let pCol = '#f59e0b';
        let pVx = (Math.random() - 0.5) * 0.8;
        let pVy = -Math.random() * 1.5 - 0.5;

        if (currentSpeaker === 'boss') {
            if (currentRole === 'knight') {
                pCol = Math.random() < 0.6 ? '#ff3d00' : '#ffea00'; // magma embers
            } else if (currentRole === 'mage') {
                pCol = Math.random() < 0.5 ? '#c084fc' : '#38bdf8'; // stardust
                pVy = -Math.random() * 0.9 - 0.3;
            } else { // assassin
                pCol = Math.random() < 0.6 ? '#10b981' : '#4c1d95'; // shadow smoke
                pVy = -Math.random() * 1.1 - 0.4;
            }
        } else {
            pCol = '#38bdf8';
        }

        bossDialogue.faceParticles.push({
            x: 40 + Math.random() * 100,
            y: 330 + Math.random() * 10,
            vx: pVx,
            vy: pVy,
            size: Math.random() * 2.8 + 1.2,
            color: pCol,
            life: 35,
            maxLife: 35
        });
    }

    // Update particles
    for (let i = bossDialogue.faceParticles.length - 1; i >= 0; i--) {
        const p = bossDialogue.faceParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
            bossDialogue.faceParticles.splice(i, 1);
        }
    }
}

// --- ADVANCE DIALOGUE ---
function advanceBossDialogue() {
    if (!bossDialogue.isActive) return;

    const currentLine = bossDialogue.lines[bossDialogue.stepIndex];
    if (!currentLine) return;

    if (bossDialogue.isTyping) {
        // Skip typing, show full line immediately
        bossDialogue.displayedText = currentLine.text;
        bossDialogue.charIndex = currentLine.text.length;
        bossDialogue.isTyping = false;
        playSound('slash');
        return;
    }

    // Advance to next line
    bossDialogue.stepIndex++;
    if (bossDialogue.stepIndex >= bossDialogue.lines.length) {
        endBossDialogue();
    } else {
        bossDialogue.displayedText = '';
        bossDialogue.charIndex = 0;
        bossDialogue.typeTimer = 0;
        bossDialogue.isTyping = true;
        playSound('slash');
    }
}

// --- SKIP DIALOGUE ---
function skipBossDialogue() {
    if (!bossDialogue.isActive) return;
    endBossDialogue();
}

// --- END DIALOGUE & START COMBAT ---
function endBossDialogue() {
    bossDialogue.isActive = false;
    bossDialogue.hasSeenDialogue = true;
    bossDialogue.faceParticles = [];

    teleportFlashTimer = 22;
    screenShake = 12;
    playSound('explode');

    gameState = 'PLAYING';

    floatingTexts.push({
        x: 320,
        y: 110,
        text: '[BOSS BATTLE STARTED]',
        color: '#f43f5e',
        life: 90
    });
}

// --- HANDLE CLICK INSIDE DIALOGUE ---
function handleDialogueClick() {
    if (!bossDialogue.isActive) return;

    // Check if clicked the skip button at top right of dialogue box
    const canvas = document.getElementById('gameCanvas');
    const boxX = 20;
    const boxY = 224;
    const boxW = 600;
    const skipBtnX = boxX + boxW - 135;
    const skipBtnY = boxY + 10;
    const skipBtnW = 125;
    const skipBtnH = 22;

    if (mouseX >= skipBtnX - 10 && mouseX <= skipBtnX + skipBtnW + 10 && mouseY >= skipBtnY - 8 && mouseY <= skipBtnY + skipBtnH + 12) {
        skipBossDialogue();
        return;
    }

    advanceBossDialogue();
}

// --- MAIN DRAW FUNCTION FOR DIALOGUE ---
function drawBossDialogue(ctx) {
    if (!bossDialogue.isActive) return;

    const currentLine = bossDialogue.lines[bossDialogue.stepIndex];
    if (!currentLine) return;

    const canvas = document.getElementById('gameCanvas');
    const isBoss = (currentLine.speaker === 'boss' || currentLine.speaker === 'warden');
    const themeColor = currentLine.color || '#ef4444';

    // 1. Dialogue Panel Dimensions
    const boxW = 608;
    const boxH = 156;
    const boxX = (canvas.width - boxW) / 2;
    const boxY = canvas.height - boxH - 6;

    // 2. Main Box Background & Outer Borders (Matte Stone RPG Chassis)
    ctx.save();
    ctx.fillStyle = '#090d16';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Double Forged Border
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX + 3, boxY + 3, boxW - 6, boxH - 6);

    // Corner Ornaments
    ctx.fillStyle = themeColor;
    const corLen = 8;
    // Top-left
    ctx.fillRect(boxX, boxY, corLen, 3);
    ctx.fillRect(boxX, boxY, 3, corLen);
    // Top-right
    ctx.fillRect(boxX + boxW - corLen, boxY, corLen, 3);
    ctx.fillRect(boxX + boxW - 3, boxY, 3, corLen);
    // Bottom-left
    ctx.fillRect(boxX, boxY + boxH - 3, corLen, 3);
    ctx.fillRect(boxX, boxY + boxH - corLen, 3, corLen);
    // Bottom-right
    ctx.fillRect(boxX + boxW - corLen, boxY + boxH - 3, corLen, 3);
    ctx.fillRect(boxX + boxW - 3, boxY + boxH - corLen, 3, corLen);

    // 3. Portrait Frame on Left
    const portX = boxX + 14;
    const portY = boxY + 12;
    const portSize = 100;

    ctx.fillStyle = '#060810';
    ctx.fillRect(portX, portY, portSize, portSize);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(portX, portY, portSize, portSize);

    // Sub-border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(portX + 2, portY + 2, portSize - 4, portSize - 4);

    // Render Detailed Pixel Art Close-up Face Sprite
    if (currentLine.speaker === 'warden') {
        drawWardenFaceSprite(ctx, portX + 4, portY + 4, portSize - 8);
    } else if (isBoss) {
        drawAlterEgoFaceSprite(ctx, portX + 4, portY + 4, portSize - 8, currentLine.role, currentLine.isApex);
    } else {
        drawPlayerFaceSprite(ctx, portX + 4, portY + 4, portSize - 8, currentLine.role);
    }

    // Draw Portrait Ambient Particles (embers, stardust, smoke)
    bossDialogue.faceParticles.forEach(p => {
        if (p.x >= portX && p.x <= portX + portSize && p.y >= portY && p.y <= portY + portSize) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.restore();
        }
    });

    // Speaker Badge Underneath Portrait
    ctx.fillStyle = (currentLine.speaker === 'warden') ? '#0e7490' : (isBoss ? '#881337' : '#1e3a8a');
    ctx.fillRect(portX, portY + portSize + 4, portSize, 18);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(portX, portY + portSize + 4, portSize, 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = '6.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentLine.gearBadge || 'TIER 4 SET', portX + portSize / 2, portY + portSize + 16, portSize - 6);

    // 4. Content Area on the Right
    const textStartX = portX + portSize + 16;
    const textStartY = boxY + 14;
    const textMaxW = boxW - portSize - 44;

    // 5. Skip Button on Top-Right (Tactile 3D Bevel)
    const skipBtnX = boxX + boxW - 135;
    const skipBtnY = boxY + 10;
    const skipBtnW = 125;
    const skipBtnH = 22;
    const isSkipHover = (mouseX >= skipBtnX && mouseX <= skipBtnX + skipBtnW && mouseY >= skipBtnY && mouseY <= skipBtnY + skipBtnH);

    // Header: Speaker Name Tag (with clean retro badge prefix, no blurry emojis)
    ctx.textAlign = 'left';
    ctx.fillStyle = themeColor;
    ctx.font = '9px "Press Start 2P", monospace';
    const speakerPrefix = (currentLine.speaker === 'warden') ? '[TITAN]' : (isBoss ? '[ALTER EGO]' : '[HERO]');
    ctx.fillText(`${speakerPrefix} ${currentLine.name}`, textStartX, textStartY + 10, skipBtnX - textStartX - 12);

    // Subtle line under name
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(textStartX, textStartY + 18, textMaxW, 1);

    // Typewriter Dialogue Text with Auto-Wrapping
    ctx.fillStyle = '#f8fafc';
    ctx.font = '8px "Press Start 2P", monospace';
    wrapText(ctx, bossDialogue.displayedText, textStartX, textStartY + 34, textMaxW, 15);

    // Draw Skip Button (3D tactile stone arcade button)
    ctx.fillStyle = isSkipHover ? '#991b1b' : '#1e293b';
    ctx.fillRect(skipBtnX, skipBtnY, skipBtnW, skipBtnH);
    ctx.fillStyle = isSkipHover ? '#ef4444' : '#334155';
    ctx.fillRect(skipBtnX, skipBtnY, skipBtnW, 2);
    ctx.fillRect(skipBtnX, skipBtnY, 2, skipBtnH);
    ctx.fillStyle = isSkipHover ? '#450a0a' : '#0f172a';
    ctx.fillRect(skipBtnX, skipBtnY + skipBtnH - 2, skipBtnW, 2);
    ctx.fillRect(skipBtnX + skipBtnW - 2, skipBtnY, 2, skipBtnH);

    ctx.strokeStyle = isSkipHover ? '#fca5a5' : '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(skipBtnX, skipBtnY, skipBtnW, skipBtnH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SKIP [ESC] >>', skipBtnX + skipBtnW / 2, skipBtnY + 14);

    // 6. Bottom Prompts & Animated Next Arrow
    ctx.textAlign = 'right';
    const blink = Math.sin(Date.now() * 0.008) > 0;
    ctx.font = '7.5px "Press Start 2P", monospace';
    ctx.fillStyle = blink ? themeColor : '#64748b';
    ctx.fillText('[SPACE] CONTINUE >>', boxX + boxW - 14, boxY + boxH - 10);

    ctx.restore();
}

// Helper: Word-wrapping text on Canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

// =========================================================================
// --- HIGH-DETAIL PROCEDURAL PIXEL ART CLOSE-UP FACE SPRITE RENDERERS ---
// =========================================================================

// --- 1. ALTER EGO PIXEL FACE SPRITE (KNIGHT, MAGE, ASSASSIN) ---
function drawAlterEgoFaceSprite(ctx, x, y, size, role) {
    const gridSize = 32;
    const pxSize = size / gridSize;

    // Helper: fill pixel block on 32x32 grid
    function pr(gx, gy, gw, gh, col) {
        ctx.fillStyle = col;
        ctx.fillRect(
            Math.round(x + gx * pxSize),
            Math.round(y + gy * pxSize),
            Math.ceil(gw * pxSize),
            Math.ceil(gh * pxSize)
        );
    }

    ctx.save();

    if (role === 'knight') {
        // =================================================================
        // DRAGON KNIGHT ALTER EGO (Dragon Slayer Helmet, Magma Slit, Horns)
        // =================================================================
        const time = Date.now() * 0.007;
        const eyePulse = Math.sin(time) * 0.25 + 0.75;

        // Background dark gradient
        pr(0, 0, 32, 32, '#0c070a');

        // Cape behind neck / shoulders
        pr(3, 24, 26, 8, '#7f1d1d');
        pr(5, 23, 22, 9, '#991b1b');

        // Great Dragon Horns (Left Horn)
        pr(7, 13, 2, 3, '#78350f');
        pr(6, 11, 2, 3, '#92400e');
        pr(5, 9, 2, 3, '#b45309');
        pr(4, 7, 2, 3, '#d97706');
        pr(3, 5, 2, 3, '#f59e0b');
        pr(2, 3, 2, 3, '#fbbf24');
        pr(3, 2, 2, 2, '#fef08a'); // horn tip highlight
        pr(4, 3, 1, 2, '#ffffff'); // specular point

        // Great Dragon Horns (Right Horn)
        pr(23, 13, 2, 3, '#78350f');
        pr(24, 11, 2, 3, '#92400e');
        pr(25, 9, 2, 3, '#b45309');
        pr(26, 7, 2, 3, '#d97706');
        pr(27, 5, 2, 3, '#f59e0b');
        pr(28, 3, 2, 3, '#fbbf24');
        pr(27, 2, 2, 2, '#fef08a'); // horn tip highlight
        pr(27, 3, 1, 2, '#ffffff');

        // Central Crest Horn (Dragon Crest Fin)
        pr(15, 1, 2, 7, '#ef4444');
        pr(14, 3, 4, 5, '#dc2626');
        pr(13, 5, 6, 3, '#b91c1c');
        pr(15, 2, 2, 4, '#fbbf24'); // gold ridge

        // Dragon Slayer Helmet Dome (Obsidian & Crimson steel)
        pr(8, 7, 16, 7, '#1c1917');
        pr(9, 8, 14, 5, '#292524');
        pr(10, 7, 12, 6, '#450a0a');
        pr(11, 8, 10, 5, '#7f1d1d');
        pr(12, 8, 8, 4, '#991b1b');
        pr(13, 9, 6, 2, '#dc2626');

        // Golden Brow Filigree
        pr(8, 12, 16, 2, '#d97706');
        pr(9, 12, 14, 1, '#fbbf24');
        pr(14, 11, 4, 2, '#fef08a'); // center brow highlight

        // Central Dragon Gem on Forehead
        pr(14, 8, 4, 3, '#ff1744');
        pr(15, 8, 2, 2, '#ff616f');
        pr(15, 8, 1, 1, '#ffffff');

        // Angular Visor Shadow Cavity
        pr(7, 14, 18, 4, '#0c0a09');
        pr(8, 15, 16, 2, '#000000');

        // Magma Fiery Slit Eyes (Glowing & Pulsing)
        const glowCol = `rgba(255, 23, 68, ${0.4 * eyePulse})`;
        ctx.fillStyle = glowCol;
        ctx.fillRect(Math.round(x + 8 * pxSize), Math.round(y + 13 * pxSize), Math.ceil(16 * pxSize), Math.ceil(5 * pxSize));

        // Left Eye Slit
        pr(9, 15, 5, 1, '#dc2626');
        pr(10, 15, 4, 1, '#ff3d00');
        pr(11, 15, 2, 1, '#fbbf24');
        pr(11, 15, 1, 1, '#ffffff');

        // Right Eye Slit
        pr(18, 15, 5, 1, '#dc2626');
        pr(18, 15, 4, 1, '#ff3d00');
        pr(19, 15, 2, 1, '#fbbf24');
        pr(20, 15, 1, 1, '#ffffff');

        // Lower Mouthguard / Dragon Fanged Breath Grille
        pr(8, 18, 16, 7, '#1c1917');
        pr(9, 18, 14, 6, '#292524');
        pr(10, 19, 12, 5, '#44403c');
        pr(11, 20, 10, 4, '#57534e');

        // Dragon scale plating on cheeks
        pr(8, 17, 3, 6, '#7f1d1d');
        pr(21, 17, 3, 6, '#7f1d1d');
        pr(9, 18, 1, 4, '#dc2626');
        pr(22, 18, 1, 4, '#dc2626');

        // Breath Grille Vents (Molten Heat glow)
        pr(12, 21, 2, 2, '#ff6d00');
        pr(15, 22, 2, 2, '#ff9100');
        pr(18, 21, 2, 2, '#ff6d00');
        pr(12, 21, 1, 1, '#fbbf24');
        pr(15, 22, 1, 1, '#fef08a');
        pr(19, 21, 1, 1, '#fbbf24');

        // Chin spike
        pr(14, 25, 4, 2, '#292524');
        pr(15, 26, 2, 2, '#fbbf24');

        // Neck Gorget & Dragon Pauldrons
        pr(10, 26, 12, 5, '#450a0a');
        pr(11, 27, 10, 4, '#7f1d1d');
        pr(12, 28, 8, 3, '#991b1b');
        pr(10, 30, 12, 2, '#fbbf24'); // gold gorget trim

        // Left Spiked Pauldron
        pr(1, 25, 8, 7, '#450a0a');
        pr(2, 26, 6, 5, '#dc2626');
        pr(3, 27, 4, 3, '#ef4444');
        pr(0, 24, 3, 3, '#fbbf24'); // shoulder horn

        // Right Spiked Pauldron
        pr(23, 25, 8, 7, '#450a0a');
        pr(24, 26, 6, 5, '#dc2626');
        pr(25, 27, 4, 3, '#ef4444');
        pr(29, 24, 3, 3, '#fbbf24'); // shoulder horn

    } else if (role === 'mage') {
        // =================================================================
        // COSMIC ARCHMAGE ALTER EGO (Deep Void Cowl, Astral Crown, Cosmic Eyes)
        // =================================================================
        const time = Date.now() * 0.006;
        const starGlow = Math.sin(time) * 0.3 + 0.7;

        // Deep cosmos background with purple nebula
        pr(0, 0, 32, 32, '#060310');
        pr(2, 2, 28, 28, '#100726');
        pr(6, 6, 20, 20, '#1c0b3b');

        // Deep Void Cowl Hood Outlines
        pr(6, 3, 20, 25, '#1e0a3d');
        pr(7, 2, 18, 24, '#2e1065');
        pr(8, 2, 16, 22, '#3b0764');
        pr(9, 3, 14, 18, '#581c87');

        // Golden Astral Crown Circlet perched on brow
        pr(9, 6, 14, 3, '#b45309');
        pr(9, 6, 14, 2, '#f59e0b');
        pr(10, 6, 12, 1, '#fbbf24');
        // 5 Crown Starlight Peaks
        pr(10, 4, 2, 2, '#fef08a');
        pr(12, 3, 2, 3, '#fef08a');
        pr(15, 2, 2, 4, '#ffffff'); // highest center peak
        pr(18, 3, 2, 3, '#fef08a');
        pr(20, 4, 2, 2, '#fef08a');

        // Central Pulsar Astral Gem
        pr(14, 5, 4, 3, '#0e7490');
        pr(15, 5, 2, 2, '#00e5ff');
        pr(15, 5, 1, 1, '#ffffff'); // twinkle

        // Hood interior shadow (cast over face)
        pr(8, 9, 16, 14, '#090414');
        pr(9, 10, 14, 12, '#120726');

        // Ethereal Pale Visage emerging from shadow
        pr(10, 14, 12, 10, '#cbd5e1');
        pr(11, 15, 10, 9, '#e2e8f0');
        pr(12, 16, 8, 8, '#f8fafc');

        // Silver-Violet Hair Strands framing face
        pr(8, 12, 2, 9, '#a855f7');
        pr(9, 13, 2, 7, '#c084fc');
        pr(9, 15, 1, 5, '#e9d5ff');
        pr(22, 12, 2, 9, '#a855f7');
        pr(21, 13, 2, 7, '#c084fc');
        pr(22, 15, 1, 5, '#e9d5ff');

        // Cosmic Glowing Eyes (Piercing Magenta / Electric Blue)
        const eyeAura = `rgba(168, 85, 247, ${0.45 * starGlow})`;
        ctx.fillStyle = eyeAura;
        ctx.fillRect(Math.round(x + 9 * pxSize), Math.round(y + 13 * pxSize), Math.ceil(14 * pxSize), Math.ceil(5 * pxSize));

        // Left Eye
        pr(10, 14, 4, 2, '#7c3aed');
        pr(11, 14, 3, 2, '#c084fc');
        pr(11, 14, 2, 1, '#00e5ff');
        pr(12, 14, 1, 1, '#ffffff');

        // Right Eye
        pr(18, 14, 4, 2, '#7c3aed');
        pr(18, 14, 3, 2, '#c084fc');
        pr(19, 14, 2, 1, '#00e5ff');
        pr(19, 14, 1, 1, '#ffffff');

        // Arcane Constellation Runes on Cheeks
        pr(10, 18, 2, 1, '#38bdf8');
        pr(11, 19, 1, 2, '#38bdf8');
        pr(20, 18, 2, 1, '#38bdf8');
        pr(20, 19, 1, 2, '#38bdf8');

        // Elegant mystical lips
        pr(14, 21, 4, 1, '#9333ea');
        pr(15, 21, 2, 1, '#c084fc');

        // Cowl folds wrapping around chin and throat
        pr(9, 23, 14, 5, '#2e1065');
        pr(10, 24, 12, 4, '#3b0764');
        pr(12, 25, 8, 3, '#581c87');
        pr(11, 27, 10, 1, '#fbbf24'); // gold embroidered trim

        // Archmage Robe Mantle & Shoulders
        pr(2, 26, 28, 6, '#1e0a3d');
        pr(4, 27, 24, 5, '#2e1065');
        pr(6, 28, 20, 4, '#581c87');
        pr(13, 28, 6, 3, '#fbbf24'); // celestial brooch clasp
        pr(14, 29, 4, 2, '#00e5ff'); // jewel center

    } else {
        // =================================================================
        // SHADOW REAPER ASSASSIN ALTER EGO (Bone Oni Mask, Toxic Eyes, Cowl)
        // =================================================================
        const time = Date.now() * 0.009;
        const toxicFlicker = Math.sin(time) * 0.2 + 0.8;

        // Dark phantom shadow vignette
        pr(0, 0, 32, 32, '#050708');
        pr(2, 2, 28, 28, '#090d0e');

        // Frayed Specter Scarf & Mantle behind
        pr(2, 24, 28, 8, '#450a0a');
        pr(4, 23, 24, 9, '#7f1d1d');
        pr(6, 24, 20, 8, '#18181b');

        // Shinobi Shadow Cowl Hood
        pr(7, 3, 18, 16, '#09090b');
        pr(8, 2, 16, 16, '#18181b');
        pr(9, 3, 14, 14, '#27272a');
        pr(10, 4, 12, 12, '#3f3f46');

        // Headband Protector with Carved Blood-Red Skull Rune
        pr(9, 7, 14, 4, '#18181b');
        pr(9, 7, 14, 3, '#27272a');
        pr(10, 8, 12, 2, '#3f3f46');
        // Blood-red carved phantom seal
        pr(14, 8, 4, 2, '#dc2626');
        pr(15, 8, 2, 1, '#ef4444');
        pr(15, 9, 2, 1, '#991b1b');

        // Dark Shadow Eye Cavity (Pitch Black)
        pr(8, 11, 16, 4, '#000000');
        pr(9, 12, 14, 2, '#050507');

        // Toxic Venomous Emerald Eyes (Narrowed Slits with Eye Trail)
        const eyeAura = `rgba(16, 185, 129, ${0.45 * toxicFlicker})`;
        ctx.fillStyle = eyeAura;
        ctx.fillRect(Math.round(x + 7 * pxSize), Math.round(y + 11 * pxSize), Math.ceil(18 * pxSize), Math.ceil(5 * pxSize));

        // Left Eye (angled down sharply)
        pr(9, 12, 4, 2, '#047857');
        pr(10, 12, 3, 1, '#10b981');
        pr(11, 12, 2, 1, '#34d399');
        pr(11, 12, 1, 1, '#ffffff'); // white venom reflection
        pr(8, 13, 2, 1, '#059669'); // outer smoke streak

        // Right Eye
        pr(19, 12, 4, 2, '#047857');
        pr(19, 12, 3, 1, '#10b981');
        pr(19, 12, 2, 1, '#34d399');
        pr(20, 12, 1, 1, '#ffffff');
        pr(22, 13, 2, 1, '#059669'); // outer smoke streak

        // Bone Oni Half-Mask (Lower Face)
        pr(8, 15, 16, 11, '#44403c');
        pr(9, 15, 14, 10, '#78716c');
        pr(10, 16, 12, 9, '#a8a29e');
        pr(11, 16, 10, 8, '#d6d3d1');
        pr(12, 17, 8, 7, '#f5f5f4'); // ivory bone highlights

        // Oni Mask Nose Bridge Ridge
        pr(15, 15, 2, 5, '#78716c');
        pr(15, 15, 1, 4, '#e7e5e4');

        // Prominent Upper and Lower Demonic Fangs
        // Left Fangs
        pr(11, 20, 2, 4, '#ffffff');
        pr(11, 21, 1, 3, '#fef08a');
        pr(12, 19, 1, 2, '#a8a29e');
        // Right Fangs
        pr(19, 20, 2, 4, '#ffffff');
        pr(20, 21, 1, 3, '#fef08a');
        pr(19, 19, 1, 2, '#a8a29e');

        // Blood-Red War-Paint Demon Marks on Cheeks
        pr(10, 17, 3, 2, '#b91c1c');
        pr(11, 18, 2, 2, '#ef4444');
        pr(19, 17, 3, 2, '#b91c1c');
        pr(19, 18, 2, 2, '#ef4444');

        // Mask Ventilation Slits (Leaking Phantom Smoke)
        pr(9, 22, 2, 2, '#18181b');
        pr(21, 22, 2, 2, '#18181b');
        pr(9, 22, 1, 1, '#10b981'); // toxic vent glow
        pr(22, 22, 1, 1, '#10b981');

        // Chin & Shinobi Neck Scarf Wrap
        pr(12, 24, 8, 3, '#a8a29e');
        pr(13, 25, 6, 2, '#78716c');
        pr(9, 26, 14, 5, '#18181b');
        pr(10, 27, 12, 4, '#27272a');
        pr(11, 28, 10, 3, '#7f1d1d'); // crimson scarf layer
        pr(12, 29, 8, 2, '#991b1b');

        // Jagged stealth shoulder mantles
        pr(1, 26, 8, 6, '#18181b');
        pr(2, 27, 6, 5, '#27272a');
        pr(23, 26, 8, 6, '#18181b');
        pr(24, 27, 6, 5, '#27272a');
    }

    ctx.restore();
}

// --- 2. PLAYER PIXEL FACE SPRITE (KNIGHT, MAGE, ASSASSIN) ---
function drawPlayerFaceSprite(ctx, x, y, size, role) {
    const gridSize = 32;
    const pxSize = size / gridSize;

    function pr(gx, gy, gw, gh, col) {
        ctx.fillStyle = col;
        ctx.fillRect(
            Math.round(x + gx * pxSize),
            Math.round(y + gy * pxSize),
            Math.ceil(gw * pxSize),
            Math.ceil(gh * pxSize)
        );
    }

    ctx.save();

    if (role === 'knight') {
        // Royal Knight Helmet (Steel & Azure Visor)
        pr(0, 0, 32, 32, '#080d1a');
        // Crimson/Gold Plume
        pr(14, 1, 4, 7, '#ef4444');
        pr(15, 2, 2, 5, '#f87171');
        pr(13, 4, 6, 3, '#fbbf24'); // gold plume holder

        // Helmet Dome
        pr(8, 7, 16, 8, '#334155');
        pr(9, 8, 14, 6, '#64748b');
        pr(10, 8, 12, 5, '#94a3b8');
        pr(12, 8, 8, 4, '#cbd5e1');
        pr(13, 9, 6, 2, '#ffffff'); // highlight

        // Brow & Gold Crown Crest
        pr(8, 13, 16, 2, '#d97706');
        pr(9, 13, 14, 1, '#fbbf24');
        pr(14, 12, 4, 2, '#fef08a');

        // Dark Visor Cavity
        pr(8, 15, 16, 3, '#0f172a');
        pr(9, 15, 14, 2, '#020617');

        // Radiant Azure Eyes / Visor Slit
        pr(10, 15, 4, 1, '#0091ea');
        pr(11, 15, 3, 1, '#00e5ff');
        pr(12, 15, 1, 1, '#ffffff');

        pr(18, 15, 4, 1, '#0091ea');
        pr(18, 15, 3, 1, '#00e5ff');
        pr(19, 15, 1, 1, '#ffffff');

        // Lower Face Plate
        pr(8, 18, 16, 7, '#334155');
        pr(9, 18, 14, 6, '#64748b');
        pr(10, 19, 12, 5, '#94a3b8');
        pr(14, 20, 4, 3, '#cbd5e1');

        // Gorget & Pauldrons
        pr(9, 25, 14, 7, '#1e3a8a');
        pr(11, 26, 10, 5, '#3b82f6');
        pr(13, 27, 6, 3, '#60a5fa');
        pr(10, 30, 12, 2, '#fbbf24');

    } else if (role === 'mage') {
        // Royal Archmage Hat & Cowl
        pr(0, 0, 32, 32, '#0d071a');

        // Pointed Wizard Hat
        pr(14, 1, 4, 4, '#4c1d95');
        pr(13, 4, 6, 4, '#581c87');
        pr(11, 7, 10, 5, '#6b21a8');
        pr(9, 10, 14, 4, '#7c3aed');
        pr(6, 13, 20, 3, '#a855f7'); // hat brim
        pr(13, 11, 6, 2, '#fbbf24'); // gold star buckle
        pr(14, 11, 4, 2, '#fef08a');

        // Face & Hair
        pr(10, 14, 12, 9, '#e2e8f0');
        pr(11, 15, 10, 8, '#f8fafc');
        pr(8, 14, 2, 7, '#c084fc');
        pr(22, 14, 2, 7, '#c084fc');

        // Curious Bright Cyan Eyes
        pr(11, 16, 3, 2, '#0284c7');
        pr(12, 16, 2, 1, '#38bdf8');
        pr(12, 16, 1, 1, '#ffffff');

        pr(18, 16, 3, 2, '#0284c7');
        pr(18, 16, 2, 1, '#38bdf8');
        pr(19, 16, 1, 1, '#ffffff');

        // Mouth & Chin
        pr(14, 20, 4, 1, '#e879f9');
        pr(11, 23, 10, 4, '#4c1d95');
        pr(6, 26, 20, 6, '#581c87');
        pr(8, 27, 16, 5, '#7c3aed');

    } else {
        // Forest/Emerald Stealth Shinobi Cowl
        pr(0, 0, 32, 32, '#05120d');

        // Ninja Hood
        pr(8, 3, 16, 16, '#064e3b');
        pr(9, 4, 14, 14, '#047857');
        pr(10, 5, 12, 12, '#059669');

        // Brow Band
        pr(9, 8, 14, 3, '#1e293b');
        pr(10, 8, 12, 2, '#475569');
        pr(14, 8, 4, 2, '#10b981'); // emerald crest

        // Face & Golden Eyes
        pr(10, 11, 12, 6, '#f1f5f9');
        pr(11, 12, 3, 2, '#d97706');
        pr(12, 12, 2, 1, '#fbbf24');
        pr(12, 12, 1, 1, '#ffffff');

        pr(18, 12, 3, 2, '#d97706');
        pr(18, 12, 2, 1, '#fbbf24');
        pr(19, 12, 1, 1, '#ffffff');

        // Ninja Mask
        pr(9, 16, 14, 8, '#064e3b');
        pr(10, 17, 12, 7, '#047857');
        pr(11, 18, 10, 5, '#059669');
        pr(12, 19, 8, 3, '#10b981');

        // Collar & Mantle
        pr(6, 24, 20, 8, '#022c22');
        pr(8, 25, 16, 7, '#064e3b');
        pr(10, 26, 12, 6, '#047857');
    }

    ctx.restore();
}

// --- 3. THE WARDEN PIXEL FACE SPRITE (DEEP DARK TITAN) ---
function drawWardenFaceSprite(ctx, x, y, size) {
    const gridSize = 32;
    const pxSize = size / gridSize;

    function pr(gx, gy, gw, gh, col) {
        ctx.fillStyle = col;
        ctx.fillRect(
            Math.round(x + gx * pxSize),
            Math.round(y + gy * pxSize),
            Math.ceil(gw * pxSize),
            Math.ceil(gh * pxSize)
        );
    }

    ctx.save();

    const time = Date.now() * 0.006;
    const pulse = Math.sin(time) * 0.25 + 0.75;

    // 1. Abyssal deep dark background
    pr(0, 0, 32, 32, '#020617');
    pr(1, 1, 30, 30, '#050d1a');

    // 2. Vibrating Acoustic Sculk Horns
    // Left Horn
    pr(8, 10, 3, 3, '#0f766e');
    pr(7, 8, 3, 3, '#0d9488');
    pr(5, 6, 3, 3, '#0891b2');
    pr(4, 4, 3, 3, '#06b6d4');
    pr(3, 2, 3, 2, '#22d3ee');
    pr(2, 1, 2, 2, '#67e8f9');
    pr(1, 0, 2, 2, '#ecfeff'); // horn tip sensor
    if (pulse > 0.6) {
        pr(2, 3, 1, 3, '#a5f3fc');
        pr(5, 4, 1, 2, '#22d3ee');
    }

    // Right Horn
    pr(21, 10, 3, 3, '#0f766e');
    pr(22, 8, 3, 3, '#0d9488');
    pr(24, 6, 3, 3, '#0891b2');
    pr(25, 4, 3, 3, '#06b6d4');
    pr(26, 2, 3, 2, '#22d3ee');
    pr(28, 1, 2, 2, '#67e8f9');
    pr(29, 0, 2, 2, '#ecfeff'); // horn tip sensor
    if (pulse > 0.6) {
        pr(29, 3, 1, 3, '#a5f3fc');
        pr(26, 4, 1, 2, '#22d3ee');
    }

    // 3. Eyeless Deepslate Head & Forehead
    pr(8, 7, 16, 9, '#09101d');
    pr(9, 6, 14, 10, '#0f172a');
    pr(10, 7, 12, 8, '#1e293b');
    pr(11, 8, 10, 7, '#334155');

    // Sculk moss veins on head
    pr(10, 8, 3, 2, '#0f766e');
    pr(19, 8, 3, 2, '#0f766e');
    pr(13, 9, 6, 2, '#0891b2');
    pr(14, 10, 4, 2, '#06b6d4');
    pr(15, 11, 2, 1, '#22d3ee');

    // Eyeless brow ridge (Dark, blind indentation)
    pr(9, 12, 14, 3, '#020617');
    pr(10, 13, 12, 2, '#000000');

    // 4. Gaping Sculk Maw (Open Eyeless Jaw)
    pr(8, 16, 16, 9, '#020617');
    pr(9, 17, 14, 7, '#000000');

    // Upper Sculk Fangs
    pr(9, 16, 2, 2, '#67e8f9');
    pr(12, 16, 2, 3, '#e0f2fe');
    pr(15, 16, 2, 2, '#67e8f9');
    pr(18, 16, 2, 3, '#e0f2fe');
    pr(21, 16, 2, 2, '#67e8f9');

    // Lower Sculk Fangs
    pr(10, 22, 2, 3, '#67e8f9');
    pr(13, 21, 2, 3, '#e0f2fe');
    pr(17, 21, 2, 3, '#e0f2fe');
    pr(20, 22, 2, 3, '#67e8f9');

    // Pulsing Sculk Soul Core in Throat
    const soulGlow = `rgba(34, 211, 238, ${0.4 + pulse * 0.55})`;
    ctx.fillStyle = soulGlow;
    ctx.fillRect(
        Math.round(x + 13 * pxSize),
        Math.round(y + 18 * pxSize),
        Math.ceil(6 * pxSize),
        Math.ceil(4 * pxSize)
    );
    pr(14, 19, 4, 2, '#22d3ee');
    pr(15, 19, 2, 2, '#ecfeff');

    // 5. Massive Deepslate Shoulders & Bone Ribs
    pr(2, 25, 28, 7, '#0f172a');
    pr(4, 26, 24, 6, '#1e293b');
    pr(6, 27, 20, 5, '#334155');

    // Exposed Rib Claws over chest souls
    pr(8, 26, 3, 4, '#475569');
    pr(21, 26, 3, 4, '#475569');
    pr(11, 28, 2, 3, '#64748b');
    pr(19, 28, 2, 3, '#64748b');

    // Cyan Soul Veins trailing off shoulders
    pr(5, 29, 3, 2, '#06b6d4');
    pr(24, 29, 3, 2, '#06b6d4');

    ctx.restore();
}

