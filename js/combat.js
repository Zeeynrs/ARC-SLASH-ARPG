// --- COMBAT SYSTEM (DISTINCT BASIC ATTACKS PER CLASS & ENEMY SCALING) ---

function getFacingAngle(facing) {
    if (facing === 'right') return 0;
    if (facing === 'down') return Math.PI / 2;
    if (facing === 'left') return Math.PI;
    if (facing === 'up') return -Math.PI / 2;
    return 0;
}

// --- TELEGRAPH DANGER ZONE SYSTEM ---
let telegraphZones = [];

function clearTelegraphZones() {
    telegraphZones = [];
}

function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

function addTelegraphCircle({ x, y, radius = 35, duration = 40, dmg = 35, color = '#ef4444', fillColor = 'rgba(239, 68, 68, 0.25)', icon = '⚠️', onDetonate = null, effectType = 'meteor', isBoss = true }) {
    telegraphZones.push({
        id: Math.random(),
        type: 'circle',
        x, y,
        radius,
        timer: duration,
        maxTimer: duration,
        dmg,
        color,
        fillColor,
        icon,
        onDetonate,
        effectType,
        isBoss
    });
}

function addTelegraphLine({ x1, y1, x2, y2, width = 24, duration = 35, dmg = 32, color = '#dc2626', icon = '🗡️', onDetonate = null, effectType = 'slash', isBoss = true }) {
    telegraphZones.push({
        id: Math.random(),
        type: 'line',
        x1, y1, x2, y2,
        width,
        timer: duration,
        maxTimer: duration,
        dmg,
        color,
        icon,
        onDetonate,
        effectType,
        isBoss
    });
}

function updateTelegraphZones() {
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    for (let i = telegraphZones.length - 1; i >= 0; i--) {
        const zone = telegraphZones[i];
        zone.timer--;

        if (zone.timer <= 0) {
            // DETONATE!
            if (zone.type === 'circle') {
                const dist = Math.hypot(px - zone.x, py - zone.y);
                if (dist <= zone.radius + 6) {
                    damagePlayer(zone.dmg, zone.icon || '💥', zone.isBoss !== false);
                }

                // Effect particle burst based on effectType
                if (zone.effectType === 'meteor') {
                    playSound('explode');
                    screenShake = Math.max(screenShake, 10);
                    for (let p = 0; p < 24; p++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 4 + 2;
                        particles.push({
                            x: zone.x, y: zone.y,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                            size: Math.random() * 4 + 2,
                            color: Math.random() > 0.4 ? '#ec4899' : (Math.random() > 0.5 ? '#f59e0b' : '#a855f7'),
                            life: 20
                        });
                    }
                } else if (zone.effectType === 'magma') {
                    playSound('explode');
                    screenShake = Math.max(screenShake, 11);
                    for (let p = 0; p < 26; p++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 4.5 + 1.5;
                        particles.push({
                            x: zone.x, y: zone.y,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 2,
                            size: Math.random() * 4 + 2.5,
                            color: Math.random() > 0.4 ? '#ef4444' : '#fbbf24',
                            life: 22
                        });
                    }
                } else if (zone.effectType === 'dragon_boulder') {
                    playSound('explode');
                    screenShake = Math.max(screenShake, 14);
                    for (let p = 0; p < 32; p++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 5 + 2;
                        particles.push({
                            x: zone.x, y: zone.y,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 1.5,
                            size: Math.random() * 5 + 3,
                            color: Math.random() > 0.5 ? '#dc2626' : (Math.random() > 0.5 ? '#f59e0b' : '#7f1d1d'),
                            life: 25
                        });
                    }
                } else if (zone.effectType === 'stardust_mine') {
                    playSound('skill');
                    screenShake = Math.max(screenShake, 7);
                    for (let p = 0; p < 18; p++) {
                        const a = Math.random() * Math.PI * 2;
                        particles.push({
                            x: zone.x, y: zone.y,
                            vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
                            size: 3,
                            color: Math.random() > 0.5 ? '#c084fc' : '#38bdf8',
                            life: 16
                        });
                    }
                } else if (zone.effectType === 'sonic_wave' || zone.effectType === 'sculk_spikes') {
                    playSound('explode');
                    screenShake = Math.max(screenShake, 12);
                    for (let p = 0; p < 28; p++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = Math.random() * 4.5 + 2;
                        particles.push({
                            x: zone.x, y: zone.y,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                            size: Math.random() * 4 + 2,
                            color: Math.random() > 0.4 ? '#06b6d4' : (Math.random() > 0.5 ? '#22d3ee' : '#0e7490'),
                            life: 22
                        });
                    }
                }

                if (typeof zone.onDetonate === 'function') {
                    zone.onDetonate(zone);
                }
            } else if (zone.type === 'line') {
                const dist = distToSegment(px, py, zone.x1, zone.y1, zone.x2, zone.y2);
                if (dist <= zone.width / 2 + 6) {
                    damagePlayer(zone.dmg, zone.icon || '🗡️', zone.isBoss !== false);
                }

                playSound((zone.effectType === 'flame_line' || zone.effectType === 'sonic_boom') ? 'explode' : 'slash');
                screenShake = Math.max(screenShake, zone.effectType === 'sonic_boom' ? 14 : 8);

                const steps = 16;
                for (let s = 0; s <= steps; s++) {
                    const t = s / steps;
                    const lx = zone.x1 + (zone.x2 - zone.x1) * t;
                    const ly = zone.y1 + (zone.y2 - zone.y1) * t;
                    particles.push({
                        x: lx + (Math.random() - 0.5) * 8,
                        y: ly + (Math.random() - 0.5) * 8,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        size: zone.effectType === 'sonic_boom' ? 4 : 3,
                        color: zone.effectType === 'sonic_boom' ? (Math.random() > 0.5 ? '#22d3ee' : '#ecfeff') : (zone.effectType === 'flame_line' ? '#f59e0b' : '#a855f7'),
                        life: 20
                    });
                }

                if (typeof zone.onDetonate === 'function') {
                    zone.onDetonate(zone);
                }
            }

            telegraphZones.splice(i, 1);
        }
    }
}

let lastDefeatedAlterEgo = null;

function damageMob(mob, dmg) {
    if (mob.isInvulnerable) {
        floatingTexts.push({
            x: mob.x + mob.w / 2, y: mob.y - 18,
            text: 'IMMUNE! 🛡️', color: '#fbbf24', life: 25
        });
        playSound('shield');
        for (let s = 0; s < 5; s++) {
            particles.push({
                x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                size: 2.5, color: '#fbbf24', life: 12
            });
        }
        return 0;
    }

    // Alter Ego Parry Riposte Counter: reflect damage if hit during parry
    if (mob.isParrying) {
        playSound('shield');
        playSound('slash');
        screenShake = 12;
        floatingTexts.push({
            x: mob.x + mob.w / 2, y: mob.y - 20,
            text: 'PARRY RIPOSTE! ⚡', color: '#f43f5e', life: 40
        });
        const currentStageVal = (typeof currentStage !== 'undefined') ? currentStage : 22;
        damagePlayer(Math.round(48 + currentStageVal * 2.2), '⚡', true);
        mob.isParrying = false;
        mob.parryTimer = 0;
        return 0;
    }

    // Knight Alter Ego Frontal Shield Block (-30% damage)
    if (mob.species === 'alter_ego' && mob.alterEgoRole === 'knight' && mob.isShieldGuarding) {
        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const mx = mob.x + mob.w / 2;
        const my = mob.y + mob.h / 2;
        const angleToPlayer = Math.atan2(py - my, px - mx);
        const facingAngle = getFacingAngle(mob.facing || 'left');
        let diff = Math.abs(angleToPlayer - facingAngle);
        while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

        if (diff < Math.PI * 0.32) {
            dmg = Math.max(1, Math.round(dmg * 0.70));
            floatingTexts.push({
                x: mx, y: mob.y - 20,
                text: 'BLOCKED! 🛡️ (-30%)', color: '#f59e0b', life: 28
            });
            playSound('shield');
        }
    }

    // Assassin Alter Ego Counter-Dash Smoke Evasion (25% chance)
    if (mob.species === 'alter_ego' && mob.alterEgoRole === 'assassin' && !mob.isInvulnerable) {
        if (Math.random() < 0.25 && (!mob.evasionCooldown || mob.evasionCooldown <= 0)) {
            mob.evasionCooldown = 75;
            const dodgeAngle = Math.random() * Math.PI * 2;
            const dodgeDist = 48;
            const dx = mob.x + Math.cos(dodgeAngle) * dodgeDist;
            const dy = mob.y + Math.sin(dodgeAngle) * dodgeDist;
            if (!checkWallCollision(dx, dy, mob.w, mob.h)) {
                mob.x = dx;
                mob.y = dy;
            }
            floatingTexts.push({
                x: mob.x + mob.w / 2, y: mob.y - 18,
                text: 'EVADED! 💨', color: '#10b981', life: 25
            });
            for (let s = 0; s < 12; s++) {
                particles.push({
                    x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                    vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                    size: 3.5, color: '#334155', life: 18
                });
            }
            playSound('slash');
            return 0;
        }
    }

    let finalDmg = dmg;
    if (mob.shield && mob.shield > 0) {
        const absorbed = Math.min(mob.shield, finalDmg);
        mob.shield -= absorbed;
        finalDmg -= absorbed;
        floatingTexts.push({
            x: mob.x + mob.w / 2, y: mob.y - 18,
            text: `-${absorbed} 🛡️`, color: '#00e5ff', life: 26
        });
        playSound('shield');
    }
    if (finalDmg > 0) {
        mob.hp -= finalDmg;
    }
    return finalDmg;
}

function startBossUltimate(mob, phaseName) {
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    if (mob.species === 'alter_ego') {
        const role = mob.alterEgoRole || 'knight';

        if (role === 'mage') {
            mob.isInvulnerable = true;
            mob.ultimateType = 'mage_meteor';
            mob.ultimateTimer = 260;
            mob.ultimateMaxTimer = 260;

            // Teleport to corner furthest from player
            const corners = [
                { x: 90, y: 90 },
                { x: 520, y: 90 },
                { x: 90, y: 300 },
                { x: 520, y: 300 }
            ];
            let bestCorner = corners[0];
            let maxDist = -1;
            corners.forEach(c => {
                const d = Math.hypot(px - c.x, py - c.y);
                if (d > maxDist) {
                    maxDist = d;
                    bestCorner = c;
                }
            });

            // Teleport particles at old spot
            for (let p = 0; p < 16; p++) {
                particles.push({
                    x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                    size: 3.5, color: '#c084fc', life: 20
                });
            }

            mob.x = bestCorner.x;
            mob.y = bestCorner.y;

            // Teleport particles at new spot
            for (let p = 0; p < 20; p++) {
                particles.push({
                    x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                    size: 4, color: '#ec4899', life: 24
                });
            }

            playSound('teleport');
            screenShake = 12;
            floatingTexts.push({
                x: 320, y: 130,
                text: '⚠️ MAGE: COSMIC METEOR SHOWER! 🔮',
                color: '#c084fc',
                life: 80
            });

            // Initial meteor shower volley (slower telegraph, high damage)
            addTelegraphCircle({
                x: px + (Math.random() - 0.5) * 20,
                y: py + (Math.random() - 0.5) * 20,
                radius: 38, duration: 85, dmg: 125,
                color: '#ec4899', fillColor: 'rgba(236, 72, 153, 0.28)', icon: '☄️', effectType: 'meteor', isBoss: true
            });
            addTelegraphCircle({
                x: 100 + Math.random() * 440,
                y: 85 + Math.random() * 220,
                radius: 42, duration: 90, dmg: 125,
                color: '#a855f7', fillColor: 'rgba(168, 85, 247, 0.28)', icon: '☄️', effectType: 'meteor', isBoss: true
            });

        } else if (role === 'knight') {
            mob.isInvulnerable = true;
            mob.ultimateType = 'knight_earthshatter';
            mob.ultimateTimer = 260;
            mob.ultimateMaxTimer = 260;

            // Leap to arena center
            mob.x = 320 - mob.w / 2;
            mob.y = 190 - mob.h / 2;

            playSound('shield');
            screenShake = 14;
            floatingTexts.push({
                x: 320, y: 130,
                text: '⚠️ KNIGHT: DRAGON FORTRESS & MAGMA FISSURES! 🛡️🔥',
                color: '#f59e0b',
                life: 80
            });

            // Initial center ground slam shockwave particles
            for (let p = 0; p < 28; p++) {
                const a = (Math.PI * 2 / 28) * p;
                particles.push({
                    x: 320, y: 190,
                    vx: Math.cos(a) * 4, vy: Math.sin(a) * 4,
                    size: 4, color: '#fbbf24', life: 22
                });
            }

            // Initial magma fissure eruptions (slower telegraph, high damage)
            for (let k = 0; k < 3; k++) {
                const offA = (Math.PI * 2 / 3) * k + Math.random() * 0.5;
                const offD = (k === 0) ? 0 : 50 + Math.random() * 30;
                addTelegraphCircle({
                    x: Math.max(40, Math.min(600, px + Math.cos(offA) * offD)),
                    y: Math.max(80, Math.min(330, py + Math.sin(offA) * offD)),
                    radius: 40, duration: 85, dmg: 130,
                    color: '#ef4444', fillColor: 'rgba(239, 68, 68, 0.3)', icon: '🔥', effectType: 'magma', isBoss: true
                });
            }

        } else if (role === 'assassin') {
            mob.isInvulnerable = true;
            mob.isInvisible = true;
            mob.ultimateType = 'assassin_omnislash';
            mob.ultimateTimer = 250;
            mob.ultimateMaxTimer = 250;

            playSound('slash');
            screenShake = 12;
            floatingTexts.push({
                x: 320, y: 130,
                text: '⚠️ ASSASSIN: SHADOW 8-WAY OMNISLASH! 🗡️💨',
                color: '#10b981',
                life: 80
            });

            // Dark smoke bomb explosion
            for (let p = 0; p < 25; p++) {
                particles.push({
                    x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                    vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                    size: Math.random() * 5 + 3,
                    color: Math.random() > 0.5 ? '#1e293b' : '#4c1d95',
                    life: 25
                });
            }

            // Initial shadow slash lines (slower telegraph line, high damage)
            const angle1 = Math.random() * Math.PI;
            const d = 260;
            addTelegraphLine({
                x1: px - Math.cos(angle1) * d, y1: py - Math.sin(angle1) * d,
                x2: px + Math.cos(angle1) * d, y2: py + Math.sin(angle1) * d,
                width: 26, duration: 75, dmg: 116,
                color: '#dc2626', icon: '🗡️', effectType: 'slash', isBoss: true
            });
            const angle2 = angle1 + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            addTelegraphLine({
                x1: px - Math.cos(angle2) * d, y1: py - Math.sin(angle2) * d,
                x2: px + Math.cos(angle2) * d, y2: py + Math.sin(angle2) * d,
                width: 26, duration: 75, dmg: 116,
                color: '#a855f7', icon: '🗡️', effectType: 'slash', isBoss: true
            });

        }

    } else if (mob.species === 'dragon') {
        mob.isInvulnerable = true;
        mob.isFlying = true;
        mob.flyZ = 65;
        mob.ultimateType = 'dragon_air_raid';
        mob.ultimateTimer = 270;
        mob.ultimateMaxTimer = 270;

        playSound('explode');
        screenShake = 16;
        floatingTexts.push({
            x: 320, y: 130,
            text: '[ANCIENT DRAGON: MAGMA INFERNO]',
            color: '#ef4444',
            life: 85
        });

        // Flame burst when taking flight
        for (let p = 0; p < 30; p++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
                x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                vx: Math.cos(a) * 4.5, vy: Math.sin(a) * 4.5,
                size: 4, color: Math.random() > 0.5 ? '#ef4444' : '#f59e0b',
                life: 25
            });
        }

        // Initial magma boulder drops
        addTelegraphCircle({
            x: px + (Math.random() - 0.5) * 35,
            y: py + (Math.random() - 0.5) * 35,
            radius: 44, duration: 44, dmg: 58,
            color: '#ea580c', fillColor: 'rgba(234, 88, 12, 0.32)', icon: '☄️', effectType: 'dragon_boulder', isBoss: true
        });
        addTelegraphCircle({
            x: 120 + Math.random() * 400,
            y: 90 + Math.random() * 200,
            radius: 44, duration: 44, dmg: 58,
            color: '#dc2626', fillColor: 'rgba(220, 38, 38, 0.32)', icon: '☄️', effectType: 'dragon_boulder', isBoss: true
        });
    } else if (mob.species === 'warden') {
        mob.isInvulnerable = true;
        mob.ultimateType = 'warden_sonic_cataclysm';
        mob.ultimateTimer = 280;
        mob.ultimateMaxTimer = 280;

        // Roar leap to arena center
        mob.x = 320 - mob.w / 2;
        mob.y = 190 - mob.h / 2;

        playSound('explode');
        screenShake = 18;
        floatingTexts.push({
            x: 320, y: 130,
            text: '⚠️ THE WARDEN: ACOUSTIC SONIC CATACLYSM! 🔊💀',
            color: '#22d3ee',
            life: 85
        });

        // Soul eruption particles
        for (let p = 0; p < 36; p++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
                x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                vx: Math.cos(a) * 4.5, vy: Math.sin(a) * 4.5,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? '#06b6d4' : '#22d3ee',
                life: 25
            });
        }

        // Initial 4-way cross acoustic blast lines
        addTelegraphLine({
            x1: 40, y1: 190, x2: 600, y2: 190,
            width: 34, duration: 60, dmg: 126,
            color: '#22d3ee', icon: '🔊', effectType: 'sonic_boom', isBoss: true
        });
        addTelegraphLine({
            x1: 320, y1: 65, x2: 320, y2: 335,
            width: 34, duration: 60, dmg: 126,
            color: '#22d3ee', icon: '🔊', effectType: 'sonic_boom', isBoss: true
        });
    }
}

function damagePlayer(rawAmount, icon = '💥', isBossAttack = false) {
    if (player.invulnerableTimer > 0 || (player.isDashing && player.iFrames > 0)) return;

    // Defense Calculation:
    // Regular attacks: flat player defense subtraction (min 2)
    // Boss attacks: 65% Armor Penetration (only 35% of player defense is effective, min 15 damage)
    const playerDef = getPlayerDefense();
    const effectiveDef = isBossAttack ? Math.round(playerDef * 0.35) : playerDef;
    let finalDmg = Math.max(isBossAttack ? 15 : 2, rawAmount - effectiveDef);

    // Hit Immunity Frames: 42 ticks for boss hit, 32 ticks for normal mob hit
    player.iFrames = isBossAttack ? 42 : 32;
    player.maxIFrames = player.iFrames;
    player.invulnerableTimer = player.iFrames;
    player.shieldRechargeTimer = isBossAttack ? 360 : 240; // 6s delay on boss hit
    screenShake = isBossAttack ? Math.max(screenShake, 14) : Math.max(screenShake, 8);

    // Armor / Shield Damage:
    // Boss attacks deal 2.2x SHIELD SHREDDING bonus damage to armor/shield!
    if (player.shield > 0) {
        const shieldShredMultiplier = isBossAttack ? 2.2 : 1.0;
        const shieldDmgNeeded = finalDmg * shieldShredMultiplier;
        const absorbedShield = Math.min(player.shield, shieldDmgNeeded);

        player.shield -= absorbedShield;
        // Remaining unabsorbed damage pierces through into HP
        const unabsorbedRatio = Math.max(0, (shieldDmgNeeded - absorbedShield) / shieldShredMultiplier);
        finalDmg = Math.round(unabsorbedRatio);

        player.shieldHitFlashTimer = 20;

        if (typeof achievementTracker !== 'undefined') {
            achievementTracker.onDamageShielded(absorbedShield);
        }

        const isBroken = player.shield <= 0;
        floatingTexts.push({
            x: player.x + player.w / 2,
            y: player.y - 18,
            text: isBroken ? `💥 ARMOR SHATTERED! -${Math.round(absorbedShield)} 🛡️` : `-${Math.round(absorbedShield)} 🛡️`,
            color: isBossAttack ? '#f43f5e' : '#00e5ff',
            life: isBroken ? 45 : 28
        });

        playSound('shield');
        if (isBroken && isBossAttack) playSound('explode');

        for (let s = 0; s < (isBossAttack ? 14 : 8); s++) {
            particles.push({
                x: player.x + player.w / 2,
                y: player.y + player.h / 2,
                vx: (Math.random() - 0.5) * (isBossAttack ? 7 : 5),
                vy: (Math.random() - 0.5) * (isBossAttack ? 7 : 5),
                size: isBossAttack ? 4 : 3,
                color: isBossAttack ? '#fbbf24' : '#00e5ff',
                life: 16
            });
        }
    }

    // Direct HP Damage:
    if (finalDmg > 0) {
        player.hp -= finalDmg;
        if (typeof tookDamageInStage !== 'undefined') {
            tookDamageInStage = true;
        }
        playSound('hit');
        floatingTexts.push({
            x: player.x + player.w / 2,
            y: player.y - 8,
            text: `-${finalDmg} HP ${icon}`,
            color: '#ff1744',
            life: 30
        });

        for (let p = 0; p < (isBossAttack ? 12 : 6); p++) {
            particles.push({
                x: player.x + player.w / 2,
                y: player.y + player.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: 3,
                color: '#ef4444',
                life: 14
            });
        }

        if (player.hp <= 0) {
            player.hp = 0;
            gameState = 'GAMEOVER';
        }
    }
}

function updateCombat() {
    const canvas = document.getElementById('gameCanvas');
    const role = player.characterRole || 'knight';
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const baseAngle = getFacingAngle(player.facing);
    
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.invulnerableTimer > 0) player.invulnerableTimer--;
    if (player.iFrames > 0) player.iFrames--;
    if (player.dashCooldown > 0) player.dashCooldown--;

    // Update Player Dash / Dodge movement
    if (player.isDashing) {
        player.dashTimer--;
        const dashSpeed = player.speed * 2.5;
        const dashNextX = player.x + player.dashDx * dashSpeed;
        const dashNextY = player.y + player.dashDy * dashSpeed;
        if (!checkWallCollision(dashNextX, player.y, player.w, player.h)) player.x = dashNextX;
        if (!checkWallCollision(player.x, dashNextY, player.w, player.h)) player.y = dashNextY;

        if (Math.random() < 0.7) {
            particles.push({
                x: player.x + player.w / 2,
                y: player.y + player.h / 2,
                vx: -player.dashDx * 1.5,
                vy: -player.dashDy * 1.5,
                size: 3,
                color: '#38bdf8',
                life: 10
            });
        }
        if (player.dashTimer <= 0) {
            player.isDashing = false;
        }
    }

    // Update Toxic Slime Puddles
    if (typeof slimePuddles !== 'undefined') {
        for (let pIdx = slimePuddles.length - 1; pIdx >= 0; pIdx--) {
            const puddle = slimePuddles[pIdx];
            puddle.life--;
            const distToPuddle = Math.hypot(px - puddle.x, py - puddle.y);
            if (distToPuddle < puddle.radius && (!player.iFrames || player.iFrames <= 0)) {
                if (!puddle.tickCooldown || puddle.tickCooldown <= 0) {
                    puddle.tickCooldown = 28;
                    damagePlayer(puddle.dmg || 5, '☣️', false);
                } else {
                    puddle.tickCooldown--;
                }
            }
            if (puddle.life <= 0) {
                slimePuddles.splice(pIdx, 1);
            }
        }
    }

    // Start Basic Attack (support isActionActive('attack'))
    const isAttackingKey = (typeof isActionActive === 'function')
        ? isActionActive('attack')
        : (keys['j'] || keys[' ']);

    if (isAttackingKey && player.attackCooldown === 0 && !player.isAttacking && !player.isDashing) {
        player.isAttacking = true;
        player.attackTime = 0;
        player.hitMobsThisSwing.clear();

        if (role === 'mage') {
            // === MAGE BASIC ATTACK: RANGED MAGIC BOLT / FROST SNOWBALL + SURROUNDING MANA AURA ===
            player.attackDuration = 9;
            
            const auraConfig = (typeof getMageAuraConfig === 'function')
                ? getMageAuraConfig(player.equipped ? player.equipped.weapon : null)
                : { id: 'arcane', primaryColor: '#a855f7', secondaryColor: '#c4b5fd', glowColor: '#9333ea', icon: '🔮', sound: 'skill', radius: 46 };

            const isSnowStaff = (player.equipped && player.equipped.weapon === 'weapon_frost_snow_staff');
            const boltColor = isSnowStaff ? '#e0f2fe' : auraConfig.primaryColor;
            const boltSpeed = 7.0;
            
            playerProjectiles.push({
                x: px + Math.cos(baseAngle) * 16,
                y: py + Math.sin(baseAngle) * 16,
                vx: Math.cos(baseAngle) * boltSpeed,
                vy: Math.sin(baseAngle) * boltSpeed,
                angle: baseAngle,
                type: isSnowStaff ? 'snowball' : 'magic_bolt',
                dmg: Math.floor(Math.random() * 4) + Math.round(getPlayerDamage() * 1.0) + 1,
                color: boltColor,
                life: 30
            });
            
            playSound(isSnowStaff ? 'shield' : (auraConfig.sound || 'skill'));
            
        } else if (role === 'assassin') {
            // === ASSASSIN BASIC ATTACK: RAPID DUAL CROSS-SLASH & MINI-LUNGE ===
            player.attackDuration = 8;
            
            // Mini forward lunge
            const lungeX = player.x + Math.cos(baseAngle) * 4;
            const lungeY = player.y + Math.sin(baseAngle) * 4;
            if (!checkWallCollision(lungeX, player.y, player.w, player.h)) player.x = lungeX;
            if (!checkWallCollision(player.x, lungeY, player.w, player.h)) player.y = lungeY;
            
            playSound('slash');
            
        } else {
            // === KNIGHT BASIC ATTACK: FAST CRISP CLEAVE ARC ===
            player.attackDuration = 11;
            playSound('slash');
        }
    }

    // Process Melee Attacks (Knight & Assassin)
    if (player.isAttacking) {
        player.attackTime++;
        player.slashArcProgress = player.attackTime / player.attackDuration;

        const playerDmgBase = getPlayerDamage();

        if (role === 'knight') {
            // --- KNIGHT: HEAVY CLEAVE ARC ---
            const sweepSpan = Math.PI * 0.85;
            const currentAngle = baseAngle - sweepSpan / 2 + sweepSpan * player.slashArcProgress;
            const arcRadius = 46;

            const isXmasTree = (player.equipped && player.equipped.weapon === 'weapon_christmas_tree');
            const sparkX = px + Math.cos(currentAngle) * (arcRadius - 2 + Math.random() * 4);
            const sparkY = py + Math.sin(currentAngle) * (arcRadius - 2 + Math.random() * 4);

            if (isXmasTree) {
                // Festive holiday pine needle & bauble light sparks
                const xmasColors = ['#16a34a', '#86efac', '#ef4444', '#fbbf24', '#38bdf8', '#ffffff'];
                particles.push({
                    x: sparkX, y: sparkY,
                    vx: (Math.random() - 0.5) * 1.6,
                    vy: (Math.random() - 0.5) * 1.6,
                    size: Math.random() * 3 + 2,
                    color: xmasColors[Math.floor(Math.random() * xmasColors.length)],
                    life: 14
                });
            } else {
                particles.push({
                    x: sparkX, y: sparkY,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    size: Math.random() * 3 + 1.5,
                    color: Math.random() > 0.3 ? '#fbbf24' : '#fff',
                    life: 12
                });
            }

            mobs.forEach(mob => {
                if (player.hitMobsThisSwing.has(mob.id)) return;
                const mx = mob.x + mob.w / 2;
                const my = mob.y + mob.h / 2;
                const dist = Math.hypot(mx - px, my - py);

                if (dist <= arcRadius + mob.w / 2) {
                    let angleToMob = Math.atan2(my - py, mx - px);
                    let diffAngle = angleToMob - baseAngle;
                    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;

                    if (Math.abs(diffAngle) < sweepSpan / 1.5) {
                        player.hitMobsThisSwing.add(mob.id);
                        const dmg = Math.floor(playerDmgBase * 1.05) + Math.floor(Math.random() * 5) + 1;
                        damageMob(mob, dmg);
                        playSound('hit');
                        screenShake = 3;

                        // Heavy knockback for knight
                        const kx = mob.x + Math.cos(angleToMob) * 18;
                        const ky = mob.y + Math.sin(angleToMob) * 18;
                        if (!checkWallCollision(kx, mob.y, mob.w, mob.h)) mob.x = kx;
                        if (!checkWallCollision(mob.x, ky, mob.w, mob.h)) mob.y = ky;

                        floatingTexts.push({
                            x: mob.x + mob.w / 2, y: mob.y - 8,
                            text: isXmasTree ? `${dmg} 🎄` : `${dmg}`,
                            color: isXmasTree ? '#4ade80' : '#ffeb3b',
                            life: 26
                        });

                        const particleColors = isXmasTree ? ['#16a34a', '#fbbf24', '#ef4444', '#ffffff', '#86efac'] : ['#fbbf24'];
                        for (let i = 0; i < (isXmasTree ? 8 : 5); i++) {
                            particles.push({
                                x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                                vx: (Math.random() - 0.5) * 4.5, vy: (Math.random() - 0.5) * 4.5,
                                size: 3,
                                color: particleColors[Math.floor(Math.random() * particleColors.length)],
                                life: 16
                            });
                        }
                    }
                }
            });

        } else if (role === 'assassin') {
            // --- ASSASSIN: RAPID TWIN-BLADE DOUBLE STRIKE ---
            const sweepSpan = Math.PI * 0.65;
            const currentAngle = baseAngle - sweepSpan / 2 + sweepSpan * player.slashArcProgress;
            const arcRadius = 38;

            const isCandyCane = (player.equipped && player.equipped.weapon === 'weapon_candy_cane_daggers');

            if (isCandyCane) {
                // Sweet candy cane red and white sugar dust
                particles.push({
                    x: px + Math.cos(currentAngle) * (arcRadius + (Math.random() - 0.5) * 6),
                    y: py + Math.sin(currentAngle) * (arcRadius + (Math.random() - 0.5) * 6),
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: 2.8,
                    color: Math.random() > 0.5 ? '#ef4444' : '#ffffff',
                    life: 12
                });
            } else {
                particles.push({
                    x: px + Math.cos(currentAngle) * (arcRadius + (Math.random() - 0.5) * 6),
                    y: py + Math.sin(currentAngle) * (arcRadius + (Math.random() - 0.5) * 6),
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: 2.5,
                    color: Math.random() > 0.4 ? '#10b981' : '#34d399',
                    life: 10
                });
            }

            mobs.forEach(mob => {
                if (player.hitMobsThisSwing.has(mob.id)) return;
                const mx = mob.x + mob.w / 2;
                const my = mob.y + mob.h / 2;
                const dist = Math.hypot(mx - px, my - py);

                if (dist <= arcRadius + mob.w / 2) {
                    let angleToMob = Math.atan2(my - py, mx - px);
                    let diffAngle = angleToMob - baseAngle;
                    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;

                    if (Math.abs(diffAngle) < sweepSpan / 1.4) {
                        player.hitMobsThisSwing.add(mob.id);

                        const isCrit1 = Math.random() < 0.35;
                        let dmg1 = Math.floor(playerDmgBase * 0.55) + Math.floor(Math.random() * 3);
                        if (isCrit1) dmg1 = Math.round(dmg1 * 1.75);

                        const isCrit2 = Math.random() < 0.35;
                        let dmg2 = Math.floor(playerDmgBase * 0.55) + Math.floor(Math.random() * 3);
                        if (isCrit2) dmg2 = Math.round(dmg2 * 1.75);

                        damageMob(mob, dmg1 + dmg2);
                        playSound('hit');

                        // Quick slice knockback
                        const kx = mob.x + Math.cos(angleToMob) * 8;
                        const ky = mob.y + Math.sin(angleToMob) * 8;
                        if (!checkWallCollision(kx, mob.y, mob.w, mob.h)) mob.x = kx;
                        if (!checkWallCollision(mob.x, ky, mob.w, mob.h)) mob.y = ky;

                        // Display twin damage numbers
                        floatingTexts.push({
                            x: mob.x + mob.w / 2 - 8, y: mob.y - 12,
                            text: isCandyCane ? (isCrit1 ? `${dmg1}! 🍬` : `${dmg1} 🍬`) : (isCrit1 ? `${dmg1}!` : `${dmg1}`),
                            color: isCandyCane ? '#ff4d6d' : (isCrit1 ? '#ef4444' : '#10b981'),
                            life: 24
                        });
                        floatingTexts.push({
                            x: mob.x + mob.w / 2 + 8, y: mob.y - 4,
                            text: isCandyCane ? (isCrit2 ? `${dmg2}! 🍭` : `${dmg2}`) : (isCrit2 ? `${dmg2}!` : `${dmg2}`),
                            color: isCandyCane ? '#ffffff' : (isCrit2 ? '#ef4444' : '#34d399'),
                            life: 24
                        });

                        const candyColors = ['#ef4444', '#ffffff', '#fb7185', '#f43f5e'];
                        for (let i = 0; i < (isCandyCane ? 8 : 4); i++) {
                            particles.push({
                                x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                                vx: (Math.random() - 0.5) * 3.5, vy: (Math.random() - 0.5) * 3.5,
                                size: 2.8,
                                color: isCandyCane ? candyColors[Math.floor(Math.random() * candyColors.length)] : '#10b981',
                                life: 14
                            });
                        }
                    }
                }
            });

        } else if (role === 'mage') {
            // --- MAGE: SURROUNDING MANA AURA (DEALS 60% DAMAGE TO ALL ENEMIES IN RADIUS) ---
            const auraConfig = (typeof getMageAuraConfig === 'function')
                ? getMageAuraConfig(player.equipped ? player.equipped.weapon : null)
                : { id: 'arcane', primaryColor: '#a855f7', secondaryColor: '#c4b5fd', glowColor: '#9333ea', icon: '🔮', sound: 'skill', radius: 46 };

            // Ambient radiating mana particles swirling around the Mage body
            for (let p = 0; p < 2; p++) {
                const auraAngle = Math.random() * Math.PI * 2;
                const auraDist = Math.random() * (auraConfig.radius * 0.9) + 4;
                particles.push({
                    x: px + Math.cos(auraAngle) * auraDist,
                    y: py + Math.sin(auraAngle) * auraDist,
                    vx: Math.cos(auraAngle) * 1.2 + (Math.random() - 0.5) * 0.8,
                    vy: Math.sin(auraAngle) * 1.2 + (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 2.6 + 1.4,
                    color: Math.random() > 0.4 ? auraConfig.primaryColor : auraConfig.secondaryColor,
                    life: 14
                });
            }

            // Detect and damage mobs within aura radius
            mobs.forEach(mob => {
                if (player.hitMobsThisSwing.has(mob.id)) return;
                const mx = mob.x + mob.w / 2;
                const my = mob.y + mob.h / 2;
                const dist = Math.hypot(mx - px, my - py);

                if (dist <= auraConfig.radius + mob.w / 2) {
                    player.hitMobsThisSwing.add(mob.id);

                    const auraDmg = Math.max(1, Math.round(playerDmgBase * 0.40));
                    damageMob(mob, auraDmg);
                    playSound('hit');
                    screenShake = 1.5;

                    // Light radial knockback from Mage body (reduced from 15px to 5.5px)
                    const angleToMob = Math.atan2(my - py, mx - px);
                    const kx = mob.x + Math.cos(angleToMob) * 5.5;
                    const ky = mob.y + Math.sin(angleToMob) * 5.5;
                    if (!checkWallCollision(kx, mob.y, mob.w, mob.h)) mob.x = kx;
                    if (!checkWallCollision(mob.x, ky, mob.w, mob.h)) mob.y = ky;

                    // Floating text with weapon's unique aura icon and color
                    floatingTexts.push({
                        x: mob.x + mob.w / 2,
                        y: mob.y - 10,
                        text: `${auraDmg} ${auraConfig.icon}`,
                        color: auraConfig.primaryColor,
                        life: 26
                    });

                    // Burst of weapon-themed mana particles at enemy
                    const burstCount = 6;
                    for (let i = 0; i < burstCount; i++) {
                        const bAngle = Math.random() * Math.PI * 2;
                        const bSpeed = Math.random() * 3.5 + 1.2;
                        particles.push({
                            x: mob.x + mob.w / 2,
                            y: mob.y + mob.h / 2,
                            vx: Math.cos(bAngle) * bSpeed,
                            vy: Math.sin(bAngle) * bSpeed,
                            size: Math.random() * 2.8 + 1.5,
                            color: Math.random() > 0.5 ? auraConfig.primaryColor : auraConfig.secondaryColor,
                            life: 15
                        });
                    }
                }
            });
        }

        if (player.attackTime >= player.attackDuration) {
            player.isAttacking = false;
            // Cooldown pemulihan cepat dan responsif antar serangan
            if (role === 'knight') player.attackCooldown = 12;
            else if (role === 'assassin') player.attackCooldown = 9;
            else if (role === 'mage') player.attackCooldown = 11;
            else player.attackCooldown = 12;
        }
    }

    // === UPDATE PLAYER PROJECTILES (MAGE MAGIC BOLTS / SNOWBALLS) ===
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        const p = playerProjectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Trailing sparkle or frost trail
        if (p.type === 'snowball') {
            if (Math.random() < 0.7) {
                particles.push({
                    x: p.x + (Math.random() - 0.5) * 6,
                    y: p.y + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 2.8 + 1.5,
                    color: Math.random() > 0.4 ? '#bae6fd' : '#ffffff',
                    life: 14
                });
            }
        } else {
            if (Math.random() < 0.6) {
                particles.push({
                    x: p.x + (Math.random() - 0.5) * 4,
                    y: p.y + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1,
                    size: Math.random() * 2.5 + 1.2,
                    color: p.color,
                    life: 10
                });
            }
        }

        // Wall collision
        if (checkWallCollision(p.x - 3, p.y - 3, 6, 6) || p.life <= 0) {
            const burstColor = (p.type === 'snowball') ? '#7dd3fc' : p.color;
            for (let k = 0; k < (p.type === 'snowball' ? 8 : 5); k++) {
                particles.push({
                    x: p.x, y: p.y,
                    vx: (Math.random() - 0.5) * 2.8, vy: (Math.random() - 0.5) * 2.8,
                    size: 2.5,
                    color: Math.random() > 0.4 ? burstColor : '#ffffff',
                    life: 12
                });
            }
            playerProjectiles.splice(i, 1);
            continue;
        }

        // Mob collision
        let hitMob = false;
        for (let m = 0; m < mobs.length; m++) {
            const mob = mobs[m];
            const mx = mob.x + mob.w / 2;
            const my = mob.y + mob.h / 2;
            if (Math.hypot(mx - p.x, my - p.y) <= mob.w / 2 + 5) {
                damageMob(mob, p.dmg);
                playSound('hit');
                if (p.type === 'snowball') playSound('shield');

                floatingTexts.push({
                    x: mx, y: mob.y - 8,
                    text: (p.type === 'snowball') ? `${p.dmg} ❄️` : `${p.dmg} ✨`,
                    color: (p.type === 'snowball') ? '#38bdf8' : p.color,
                    life: 26
                });

                // Spark burst or ice splash on hit
                const count = (p.type === 'snowball') ? 14 : 8;
                const iceColors = ['#e0f2fe', '#7dd3fc', '#38bdf8', '#ffffff', '#0284c7'];
                for (let k = 0; k < count; k++) {
                    const angle = Math.random() * Math.PI * 2;
                    const spd = Math.random() * 4 + 1.5;
                    particles.push({
                        x: p.x, y: p.y,
                        vx: Math.cos(angle) * spd,
                        vy: Math.sin(angle) * spd,
                        size: Math.random() * 3 + 2,
                        color: (p.type === 'snowball') ? iceColors[Math.floor(Math.random() * iceColors.length)] : p.color,
                        life: (p.type === 'snowball') ? 18 : 14
                    });
                }

                // Slight gentle knockback
                const kx = mob.x + Math.cos(p.angle) * 4;
                const ky = mob.y + Math.sin(p.angle) * 4;
                if (!checkWallCollision(kx, mob.y, mob.w, mob.h)) mob.x = kx;
                if (!checkWallCollision(mob.x, ky, mob.w, mob.h)) mob.y = ky;

                hitMob = true;
                break;
            }
        }

        if (hitMob) {
            playerProjectiles.splice(i, 1);
        }
    }

    // Mob AI & Collision with Player (Enemy Level Scaling Applied!)
    for (let i = mobs.length - 1; i >= 0; i--) {
        const mob = mobs[i];

        if (mob.hp <= 0) {
            if (mob.species === 'alter_ego') {
                lastDefeatedAlterEgo = mob.alterEgoRole || 'knight';
                score += (mob.isApexMirror || currentStage >= 50) ? 10000 : 3000;
                createSlimeExplosion(mob.x + mob.w / 2, mob.y + mob.h / 2, (mob.isApexMirror || currentStage >= 50) ? '#22d3ee' : '#ec4899', true, 'alter_ego');
                floatingTexts.push({
                    x: mob.x + mob.w / 2,
                    y: mob.y - 20,
                    text: (mob.isApexMirror || currentStage >= 50) ? 'APEX SCULK MIRROR SHATTERED! 👑💎' : 'ALTER EGO HAS BEEN DEFEATED! 🏆',
                    color: (mob.isApexMirror || currentStage >= 50) ? '#22d3ee' : '#fbbf24',
                    life: 120
                });
                screenShake = 18;
            } else if (mob.species === 'warden') {
                score += 6000;
                createSlimeExplosion(mob.x + mob.w / 2, mob.y + mob.h / 2, '#06b6d4', true, 'warden');
                floatingTexts.push({
                    x: mob.x + mob.w / 2,
                    y: mob.y - 20,
                    text: 'THE WARDEN HAS FALLEN! 🔊💀',
                    color: '#22d3ee',
                    life: 120
                });
                screenShake = 18;
            } else if (mob.species === 'dragon' && (mob.type === 'boss' || currentStage === 21)) {
                score += 4000;
                createSlimeExplosion(mob.x + mob.w / 2, mob.y + mob.h / 2, '#ef4444', true, 'dragon');
                floatingTexts.push({
                    x: mob.x + mob.w / 2,
                    y: mob.y - 20,
                    text: 'ANCIENT DRAGON SLAIN! 🐉🔥',
                    color: '#f59e0b',
                    life: 120
                });
                // Full HP & Armor Regeneration upon defeating dragon boss in Stage 21
                if (typeof player !== 'undefined') {
                    player.hp = player.maxHp;
                    player.shield = player.maxShield;
                    if (typeof playSound === 'function') {
                        playSound('heal');
                    }
                    if (typeof floatingTexts !== 'undefined') {
                        floatingTexts.push({
                            x: player.x + (player.w || 20) / 2,
                            y: player.y - 30,
                            text: 'FULL HP & ARMOR RESTORED! 💖🛡️',
                            color: '#10b981',
                            life: 120
                        });
                    }
                    if (typeof particles !== 'undefined') {
                        for (let k = 0; k < 28; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 1.2 + Math.random() * 2.8;
                            particles.push({
                                x: player.x + (player.w || 20) / 2,
                                y: player.y + (player.h || 20) / 2,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed - 1.2,
                                size: 3 + Math.random() * 3,
                                color: (k % 2 === 0) ? '#10b981' : '#38bdf8',
                                life: 35 + Math.floor(Math.random() * 20)
                            });
                        }
                    }
                }
                screenShake = 18;
            } else {
                createSlimeExplosion(mob.x + mob.w / 2, mob.y + mob.h / 2, mob.color, mob.type === 'boss', mob.species);
                score += (mob.type === 'boss' ? 500 : 100);
            }
            if (typeof achievementTracker !== 'undefined') {
                achievementTracker.onKill(mob);
            }
            mobs.splice(i, 1);
            continue;
        }

        // Anti-stuck resolution: de-penetrate mob if overlapping geometry
        if (typeof resolveMobStuck === 'function') {
            resolveMobStuck(mob);
        }

        mob.hopTimer = (mob.hopTimer || Math.random() * Math.PI * 2) + 0.14 * (mob.speed || 1);

        const mx = mob.x + mob.w / 2;
        const my = mob.y + mob.h / 2;

        const dist = Math.hypot(px - mx, py - my);

        // --- BOSS TIMED ULTIMATE PHASE TRIGGERS (AT 60% AND 30% HP) ---
        const hpPercent = mob.hp / mob.maxHp;
        if (mob.species === 'alter_ego' || (mob.species === 'dragon' && mob.type === 'boss') || mob.species === 'warden') {
            if (hpPercent <= 0.60 && !mob.phase60Triggered && !mob.isInvulnerable) {
                mob.phase60Triggered = true;
                startBossUltimate(mob, 'phase60');
            } else if (hpPercent <= 0.30 && !mob.phase30Triggered && !mob.isInvulnerable) {
                mob.phase30Triggered = true;
                startBossUltimate(mob, 'phase30');
            }
        }

        // --- ACTIVE BOSS ULTIMATE CHANNELING (INVULNERABLE SKILL PHASE) ---
        if (mob.isInvulnerable) {
            if (mob.ultimateTimer > 0) mob.ultimateTimer--;

            // 1. MAGE ULTIMATE: Cataclysmic Cosmic Meteor Shower
            if (mob.ultimateType === 'mage_meteor') {
                if (Math.random() < 0.75) {
                    const pA = Math.random() * Math.PI * 2;
                    particles.push({
                        x: mx + Math.cos(pA) * 36,
                        y: my + Math.sin(pA) * 36,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5 - 1.0,
                        size: 3,
                        color: Math.random() > 0.5 ? '#ec4899' : '#c084fc',
                        life: 18
                    });
                }

                if (mob.ultimateTimer % 48 === 0 && mob.ultimateTimer > 35) {
                    // Circle targeting player's predicted area (slower timed attack, heavy damage)
                    addTelegraphCircle({
                        x: px + (Math.random() - 0.5) * 25,
                        y: py + (Math.random() - 0.5) * 25,
                        radius: 38,
                        duration: 85,
                        dmg: 125,
                        color: '#ec4899',
                        fillColor: 'rgba(236, 72, 153, 0.28)',
                        icon: '☄️',
                        effectType: 'meteor',
                        isBoss: true
                    });
                    // Random circle in arena
                    addTelegraphCircle({
                        x: 100 + Math.random() * 440,
                        y: 85 + Math.random() * 220,
                        radius: 42,
                        duration: 90,
                        dmg: 125,
                        color: '#a855f7',
                        fillColor: 'rgba(168, 85, 247, 0.28)',
                        icon: '☄️',
                        effectType: 'meteor',
                        isBoss: true
                    });
                }

                if (mob.ultimateTimer <= 0) {
                    mob.isInvulnerable = false;
                    mob.ultimateType = null;
                    playSound('shield');
                    floatingTexts.push({
                        x: mx, y: my - 24,
                        text: 'SHIELD BROKEN! ATTACK! ⚔️',
                        color: '#2ecc71',
                        life: 60
                    });
                }
                continue;
            }

            // 2. KNIGHT ULTIMATE: Dragon Fortress & Magma Eruptions
            else if (mob.ultimateType === 'knight_earthshatter') {
                if (Math.random() < 0.75) {
                    particles.push({
                        x: mx + (Math.random() - 0.5) * 38,
                        y: my + (Math.random() - 0.5) * 38,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: -Math.random() * 2.5 - 1.0,
                        size: 3.5,
                        color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                        life: 20
                    });
                }

                if (mob.ultimateTimer === 230 || mob.ultimateTimer === 150) {
                    for (let k = 0; k < 3; k++) {
                        const offA = (Math.PI * 2 / 3) * k + Math.random() * 0.5;
                        const offD = (k === 0) ? 0 : 45 + Math.random() * 30;
                        addTelegraphCircle({
                            x: Math.max(40, Math.min(600, px + Math.cos(offA) * offD)),
                            y: Math.max(80, Math.min(330, py + Math.sin(offA) * offD)),
                            radius: 40,
                            duration: 85,
                            dmg: 130,
                            color: '#ef4444',
                            fillColor: 'rgba(239, 68, 68, 0.3)',
                            icon: '🔥',
                            effectType: 'magma',
                            isBoss: true
                        });
                    }
                }

                if (mob.ultimateTimer === 105) {
                    addTelegraphCircle({
                        x: 320,
                        y: 190,
                        radius: 125,
                        duration: 95,
                        dmg: 165,
                        color: '#f59e0b',
                        fillColor: 'rgba(245, 158, 11, 0.28)',
                        icon: '💥',
                        effectType: 'magma',
                        isBoss: true
                    });
                    floatingTexts.push({
                        x: 320, y: 130,
                        text: '⚠️ EARTHSHATTER SLAM: RETREAT TO THE EDGE! 💥',
                        color: '#fbbf24',
                        life: 65
                    });
                }

                if (mob.ultimateTimer <= 0) {
                    mob.isInvulnerable = false;
                    mob.ultimateType = null;
                    playSound('shield');
                    floatingTexts.push({
                        x: mx, y: my - 24,
                        text: 'DRAGON SHIELD DOWN! ATTACK! ⚔️',
                        color: '#2ecc71',
                        life: 60
                    });
                }
                continue;
            }

            // 3. ASSASSIN ULTIMATE: Shadow 8-Way Omnislash
            else if (mob.ultimateType === 'assassin_omnislash') {
                if (Math.random() < 0.6) {
                    particles.push({
                        x: mx + (Math.random() - 0.5) * 20,
                        y: my + (Math.random() - 0.5) * 20,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5,
                        size: 3,
                        color: '#334155',
                        life: 20
                    });
                }

                if (mob.ultimateTimer % 50 === 0 && mob.ultimateTimer > 35) {
                    const angle1 = Math.random() * Math.PI;
                    const d = 260;
                    addTelegraphLine({
                        x1: px - Math.cos(angle1) * d,
                        y1: py - Math.sin(angle1) * d,
                        x2: px + Math.cos(angle1) * d,
                        y2: py + Math.sin(angle1) * d,
                        width: 26,
                        duration: 75,
                        dmg: 116,
                        color: '#dc2626',
                        icon: '🗡️',
                        effectType: 'slash',
                        isBoss: true
                    });

                    const angle2 = angle1 + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
                    const randX = 120 + Math.random() * 400;
                    const randY = 100 + Math.random() * 200;
                    addTelegraphLine({
                        x1: randX - Math.cos(angle2) * d,
                        y1: randY - Math.sin(angle2) * d,
                        x2: randX + Math.cos(angle2) * d,
                        y2: randY + Math.sin(angle2) * d,
                        width: 26,
                        duration: 75,
                        dmg: 116,
                        color: '#a855f7',
                        icon: '🗡️',
                        effectType: 'slash',
                        isBoss: true
                    });
                }

                if (mob.ultimateTimer === 30) {
                    const pFacingAngle = getFacingAngle(player.facing || 'left');
                    const ambushX = player.x - Math.cos(pFacingAngle) * 36;
                    const ambushY = player.y - Math.sin(pFacingAngle) * 36;
                    if (!checkWallCollision(ambushX, ambushY, mob.w, mob.h)) {
                        mob.x = ambushX;
                        mob.y = ambushY;
                    }
                    mob.isInvisible = false;
                    playSound('slash');
                    damagePlayer(132, '🗡️', true);
                    screenShake = 11;
                    floatingTexts.push({
                        x: mob.x + mob.w / 2, y: mob.y - 20,
                        text: 'SHADOW AMBUSH! 🗡️',
                        color: '#f43f5e',
                        life: 45
                    });
                }

                if (mob.ultimateTimer <= 0) {
                    mob.isInvulnerable = false;
                    mob.isInvisible = false;
                    mob.ultimateType = null;
                    floatingTexts.push({
                        x: mx, y: my - 24,
                        text: 'ASSASSIN REAPPEARED! ⚔️',
                        color: '#2ecc71',
                        life: 60
                    });
                }
                continue;
            }

            // 4. ANCIENT DRAGON ULTIMATE: Aerial Firestorm Bombardment
            else if (mob.ultimateType === 'dragon_air_raid') {
                if (mob.ultimateTimer % 28 === 0 && mob.ultimateTimer > 40) {
                    addTelegraphCircle({
                        x: px + (Math.random() - 0.5) * 35,
                        y: py + (Math.random() - 0.5) * 35,
                        radius: 44,
                        duration: 44,
                        dmg: 58,
                        color: '#ea580c',
                        fillColor: 'rgba(234, 88, 12, 0.32)',
                        icon: '☄️',
                        effectType: 'dragon_boulder',
                        isBoss: true
                    });
                    addTelegraphCircle({
                        x: 120 + Math.random() * 400,
                        y: 90 + Math.random() * 200,
                        radius: 44,
                        duration: 44,
                        dmg: 58,
                        color: '#dc2626',
                        fillColor: 'rgba(220, 38, 38, 0.32)',
                        icon: '☄️',
                        effectType: 'dragon_boulder',
                        isBoss: true
                    });
                }

                if (mob.ultimateTimer === 150) {
                    addTelegraphLine({
                        x1: 40, y1: py,
                        x2: 600, y2: py,
                        width: 44,
                        duration: 40,
                        dmg: 52,
                        color: '#ea580c',
                        icon: '🔥',
                        effectType: 'flame_line',
                        isBoss: true
                    });
                    floatingTexts.push({
                        x: 320, y: 130,
                        text: '⚠️ TRANSVERSE FIREBREATH: AVOID THE FLAME PATH! 🔥',
                        color: '#f59e0b',
                        life: 60
                    });
                }

                if (mob.ultimateTimer === 25) {
                    mob.flyZ = 16;
                    screenShake = 18;
                    playSound('explode');
                    for (let p = 0; p < 32; p++) {
                        const a = (Math.PI * 2 / 32) * p;
                        particles.push({
                            x: mx, y: my,
                            vx: Math.cos(a) * 5, vy: Math.sin(a) * 5,
                            size: 4.5, color: '#ef4444', life: 25
                        });
                    }
                }

                if (mob.ultimateTimer <= 0) {
                    mob.isFlying = false;
                    mob.isInvulnerable = false;
                    mob.ultimateType = null;
                    floatingTexts.push({
                        x: mx, y: my - 24,
                        text: 'DRAGON HAS LANDED! ATTACK! ⚔️',
                        color: '#2ecc71',
                        life: 60
                    });
                }
                continue;
            }
            // 5. WARDEN ULTIMATE: Acoustic Sonic Cataclysm
            else if (mob.ultimateType === 'warden_sonic_cataclysm') {
                if (Math.random() < 0.75) {
                    particles.push({
                        x: mx + (Math.random() - 0.5) * 55,
                        y: my + (Math.random() - 0.5) * 55,
                        vx: (Math.random() - 0.5) * 2.5,
                        vy: (Math.random() - 0.5) * 2.5 - 0.5,
                        size: Math.random() * 4 + 2,
                        color: Math.random() > 0.5 ? '#06b6d4' : '#22d3ee',
                        life: 20
                    });
                }

                if (mob.ultimateTimer % 18 === 0) {
                    screenShake = Math.max(screenShake, 8);
                    playSound('skill');
                }

                if (mob.ultimateTimer % 45 === 0 && mob.ultimateTimer > 35) {
                    const angleToP = Math.atan2(py - my, px - mx);
                    const reach = 320;
                    addTelegraphLine({
                        x1: mx, y1: my,
                        x2: mx + Math.cos(angleToP) * reach,
                        y2: my + Math.sin(angleToP) * reach,
                        width: 38, duration: 42, dmg: 130,
                        color: '#06b6d4', icon: '🔊', effectType: 'sonic_boom', isBoss: true
                    });
                    addTelegraphCircle({
                        x: mx, y: my,
                        radius: 75 + (280 - mob.ultimateTimer) * 0.25,
                        duration: 38, dmg: 121,
                        color: '#22d3ee', fillColor: 'rgba(6, 182, 212, 0.3)',
                        icon: '💀', effectType: 'sonic_wave', isBoss: true
                    });
                    playSound('explode');
                }

                if (mob.ultimateTimer === 160 || mob.ultimateTimer === 75) {
                    addTelegraphCircle({
                        x: px, y: py,
                        radius: 45, duration: 42, dmg: 126,
                        color: '#0891b2', fillColor: 'rgba(8, 145, 178, 0.35)',
                        icon: '⚡', effectType: 'sculk_spikes', isBoss: true
                    });
                }

                if (mob.ultimateTimer <= 0) {
                    mob.isInvulnerable = false;
                    mob.ultimateType = null;
                    floatingTexts.push({
                        x: mx, y: my - 24,
                        text: 'WARDEN ROAR SUBSIDES! STRIKE NOW! ⚔️',
                        color: '#22d3ee',
                        life: 60
                    });
                }
                continue;
            }
        }

        // --- NORMAL MOVEMENT AI ---
        if (mob.species === 'skeleton') {
            // Skeleton Archer AI: Mundur / menjauh ketika didekati oleh pemain!
            const kiteDistance = 125;
            if (dist < kiteDistance) {
                const retreatSpeed = mob.speed * 0.65;
                const awayX = -((px - mx) / dist);
                const awayY = -((py - my) / dist);
                const stepX = mob.x + awayX * retreatSpeed;
                const stepY = mob.y + awayY * retreatSpeed;

                let moved = false;
                if (!checkWallCollision(stepX, mob.y, mob.w, mob.h)) { mob.x = stepX; moved = true; }
                if (!checkWallCollision(mob.x, stepY, mob.w, mob.h)) { mob.y = stepY; moved = true; }

                if (!moved) {
                    const perpX = -awayY;
                    const perpY = awayX;
                    const strafeX = mob.x + perpX * retreatSpeed;
                    const strafeY = mob.y + perpY * retreatSpeed;
                    if (!checkWallCollision(strafeX, mob.y, mob.w, mob.h)) mob.x = strafeX;
                    if (!checkWallCollision(mob.x, strafeY, mob.w, mob.h)) mob.y = strafeY;
                }
            } else if (dist > 250 && dist < 340) {
                const stepMobX = mob.x + ((px - mx) / dist) * (mob.speed * 0.85);
                const stepMobY = mob.y + ((py - my) / dist) * (mob.speed * 0.85);
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) mob.x = stepMobX;
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) mob.y = stepMobY;
            }
        } else if (mob.species === 'alter_ego' && mob.alterEgoRole === 'assassin') {
            // Assassin Flanking Movement: orbital arc around player rather than head-on charge
            if (dist > 50 && dist < 250) {
                const toAngle = Math.atan2(py - my, px - mx);
                const orbitAngle = toAngle + Math.PI * 0.45;
                const moveSpd = mob.speed * 1.15;
                const flankX = mob.x + (Math.cos(toAngle) * 0.5 + Math.cos(orbitAngle) * 0.85) * moveSpd;
                const flankY = mob.y + (Math.sin(toAngle) * 0.5 + Math.sin(orbitAngle) * 0.85) * moveSpd;
                if (!checkWallCollision(flankX, mob.y, mob.w, mob.h)) mob.x = flankX;
                if (!checkWallCollision(mob.x, flankY, mob.w, mob.h)) mob.y = flankY;
            }
        } else if (mob.species === 'alter_ego' && mob.alterEgoRole === 'mage') {
            // Mage Spacing: backs away if < 75px, moves closer if > 230px
            if (dist < 75) {
                const fleeX = mob.x - ((px - mx) / dist) * (mob.speed * 1.35);
                const fleeY = mob.y - ((py - my) / dist) * (mob.speed * 1.35);
                if (!checkWallCollision(fleeX, mob.y, mob.w, mob.h)) mob.x = fleeX;
                if (!checkWallCollision(mob.x, fleeY, mob.w, mob.h)) mob.y = fleeY;
            } else if (dist > 230) {
                const stepMobX = mob.x + ((px - mx) / dist) * mob.speed;
                const stepMobY = mob.y + ((py - my) / dist) * mob.speed;
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) mob.x = stepMobX;
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) mob.y = stepMobY;
            }
        } else if (mob.species === 'sculk_spitter') {
            const kiteDistance = 140;
            if (dist < kiteDistance) {
                const retreatSpeed = mob.speed * 0.9;
                const awayX = -((px - mx) / dist);
                const awayY = -((py - my) / dist);
                const stepX = mob.x + awayX * retreatSpeed;
                const stepY = mob.y + awayY * retreatSpeed;
                if (!checkWallCollision(stepX, mob.y, mob.w, mob.h)) mob.x = stepX;
                if (!checkWallCollision(mob.x, stepY, mob.w, mob.h)) mob.y = stepY;
            } else if (dist > 230) {
                const stepMobX = mob.x + ((px - mx) / dist) * mob.speed;
                const stepMobY = mob.y + ((py - my) / dist) * mob.speed;
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) mob.x = stepMobX;
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) mob.y = stepMobY;
            }
        } else if (mob.species === 'sculk_phantom') {
            // Flying sculk phantom sweeps gracefully through walls
            const stepMobX = mob.x + ((px - mx) / dist) * (mob.speed * 1.05);
            const waveOffset = Math.sin((mob.hopTimer || 0) * 1.8) * 1.8;
            const perpX = -((py - my) / dist) * waveOffset;
            const perpY = ((px - mx) / dist) * waveOffset;
            const targetX = stepMobX + perpX;
            const targetY = mob.y + ((py - my) / dist) * (mob.speed * 1.05) + perpY;
            mob.x = Math.max(38, Math.min(602 - mob.w, targetX));
            mob.y = Math.max(72, Math.min(340 - mob.h, targetY));
        } else if (mob.species === 'warden') {
            if (dist > 24) {
                const stepMobX = mob.x + ((px - mx) / dist) * mob.speed;
                const stepMobY = mob.y + ((py - my) / dist) * mob.speed;
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) mob.x = stepMobX;
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) mob.y = stepMobY;
            }
        } else if (mob.species === 'sculk_crawler') {
            if (dist > 10) {
                const jitter = (Math.random() - 0.5) * 0.4;
                const angle = Math.atan2(py - my, px - mx) + jitter;
                const stepMobX = mob.x + Math.cos(angle) * mob.speed;
                const stepMobY = mob.y + Math.sin(angle) * mob.speed;
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) mob.x = stepMobX;
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) mob.y = stepMobY;
            }
        } else {
            // Normal movement: mendekati pemain dengan smart wall/corner sliding
            if (dist < 270 && dist > 12) {
                const stepMobX = mob.x + ((px - mx) / dist) * mob.speed;
                const stepMobY = mob.y + ((py - my) / dist) * mob.speed;

                let movedX = false;
                let movedY = false;
                if (!checkWallCollision(stepMobX, mob.y, mob.w, mob.h)) { mob.x = stepMobX; movedX = true; }
                if (!checkWallCollision(mob.x, stepMobY, mob.w, mob.h)) { mob.y = stepMobY; movedY = true; }

                // Fallback smart sliding around obstacles and corners
                if (!movedX && !movedY) {
                    const slideX1 = mob.x + Math.sign(px - mx) * mob.speed * 0.75;
                    const slideY1 = mob.y - Math.sign(py - my) * mob.speed * 0.75;
                    const slideX2 = mob.x - Math.sign(px - mx) * mob.speed * 0.75;
                    const slideY2 = mob.y + Math.sign(py - my) * mob.speed * 0.75;
                    if (!checkWallCollision(slideX1, slideY1, mob.w, mob.h)) {
                        mob.x = slideX1; mob.y = slideY1;
                    } else if (!checkWallCollision(slideX2, slideY2, mob.w, mob.h)) {
                        mob.x = slideX2; mob.y = slideY2;
                    }
                }
            }
        }

        // --- 1. SLIME ATTACK PATTERNS (LEAP SLAM & TOXIC PUDDLES) ---
        if (mob.species === 'slime') {
            if (mob.leapCooldown > 0) mob.leapCooldown--;
            if (mob.leapCooldown <= 0 && dist > 55 && dist < 220) {
                mob.leapCooldown = 120 + Math.floor(Math.random() * 50);
                mob.leapTimer = 24;
                mob.leapTargetX = px;
                mob.leapTargetY = py;

                addTelegraphCircle({
                    x: px, y: py,
                    radius: (mob.type === 'boss' ? 52 : 30),
                    duration: 24,
                    dmg: Math.round(20 + currentStage * 1.6),
                    color: '#10b981',
                    fillColor: 'rgba(16, 185, 129, 0.28)',
                    icon: '🟢',
                    effectType: 'slime_slam',
                    isBoss: mob.type === 'boss'
                });
            }
            if (mob.leapTimer > 0) {
                mob.leapTimer--;
                if (mob.leapTimer === 0 && mob.leapTargetX !== undefined) {
                    const leapSafe = (typeof findSafeSpawn === 'function')
                        ? findSafeSpawn(mob.leapTargetX - mob.w / 2, mob.leapTargetY - mob.h / 2, mob.w, mob.h, 4)
                        : { x: mob.leapTargetX - mob.w / 2, y: mob.leapTargetY - mob.h / 2 };
                    mob.x = leapSafe.x;
                    mob.y = leapSafe.y;
                    playSound('hit');
                    if (typeof slimePuddles !== 'undefined') {
                        slimePuddles.push({
                            x: mob.x + mob.w / 2,
                            y: mob.y + mob.h / 2,
                            radius: (mob.type === 'boss' ? 36 : 22),
                            life: 180,
                            dmg: Math.round(4 + currentStage * 0.4),
                            tickCooldown: 0
                        });
                    }
                }
            }

            // Slime King (Stage 10 Boss) Royal Tremor Slam
            if (mob.type === 'boss' && currentStage === 10) {
                if (mob.royalTremorCooldown > 0) mob.royalTremorCooldown--;
                if (mob.royalTremorCooldown <= 0) {
                    mob.royalTremorCooldown = 110;
                    playSound('explode');
                    screenShake = 12;
                    floatingTexts.push({ x: mx, y: my - 24, text: 'ROYAL SLIME SLAM! 👑', color: '#10b981', life: 45 });
                    // 8-Way radial projectile burst
                    const radialSpd = 3.6;
                    for (let p = 0; p < 8; p++) {
                        const rA = (Math.PI * 2 / 8) * p;
                        enemyProjectiles.push({
                            x: mx, y: my,
                            vx: Math.cos(rA) * radialSpd,
                            vy: Math.sin(rA) * radialSpd,
                            angle: rA,
                            type: 'slime_ball',
                            dmg: Math.round(26 + currentStage * 1.5),
                            isBoss: true,
                            life: 100
                        });
                    }
                }
            }
        }

        // --- 2. ZOMBIE ATTACK PATTERNS (BLOODLUST FRENZY & WARLORD WHIRLWIND) ---
        if (mob.species === 'zombie' || mob.species === 'sculk_zombie') {
            if (!mob.isEnraged && mob.hp < mob.maxHp * 0.5) {
                mob.isEnraged = true;
                mob.speed *= 1.35;
                floatingTexts.push({ x: mx, y: my - 16, text: 'FRENZY! 🩸', color: '#ef4444', life: 40 });
            }

            if (mob.type === 'boss' && currentStage === 15) {
                if (mob.whirlwindCooldown > 0) mob.whirlwindCooldown--;
                if (mob.whirlwindCooldown <= 0 && dist < 170) {
                    mob.whirlwindTimer = 45;
                    mob.whirlwindCooldown = 140;
                    playSound('slash');
                    floatingTexts.push({ x: mx, y: my - 24, text: 'WHIRLWIND CLEAVE! ⚔️', color: '#f59e0b', life: 45 });
                }
                if (mob.whirlwindTimer > 0) {
                    mob.whirlwindTimer--;
                    for (let p = 0; p < 2; p++) {
                        const sAngle = Math.random() * Math.PI * 2;
                        particles.push({
                            x: mx + Math.cos(sAngle) * 26,
                            y: my + Math.sin(sAngle) * 26,
                            vx: Math.cos(sAngle) * 3,
                            vy: Math.sin(sAngle) * 3,
                            size: 3.5,
                            color: '#dc2626',
                            life: 12
                        });
                    }
                    if (dist < 46) {
                        damagePlayer(Math.round(44 + currentStage * 2.2), '⚔️', true);
                    }
                }
            }
        }

        // --- 3. SKELETON BOW SHOOTING & VOLLEY AI ---
        if (mob.species === 'skeleton') {
            mob.shootTimer = (mob.shootTimer || Math.floor(Math.random() * 40)) + 1;
            mob.shotCount = mob.shotCount || 0;
            const shootInterval = mob.type === 'boss' ? 55 : 85;
            if (mob.shootTimer >= shootInterval && dist < 300) {
                mob.shootTimer = 0;
                mob.shotCount++;
                const angle = Math.atan2(py - my, px - mx);
                const arrowSpeed = 4.6;
                const scaledArrowDmg = Math.round((mob.type === 'boss' ? 22 : 12) + (currentStage - 1) * (mob.type === 'boss' ? 1.4 : 1.5));

                // Every 3rd shot: 3-way fan volley
                if (mob.shotCount % 3 === 0) {
                    [-0.24, 0, 0.24].forEach(spread => {
                        enemyProjectiles.push({
                            x: mx, y: my,
                            vx: Math.cos(angle + spread) * arrowSpeed,
                            vy: Math.sin(angle + spread) * arrowSpeed,
                            angle: angle + spread,
                            type: 'arrow',
                            dmg: scaledArrowDmg,
                            isBoss: mob.type === 'boss',
                            life: 110
                        });
                    });
                    playSound('slash');
                } else {
                    enemyProjectiles.push({
                        x: mx, y: my,
                        vx: Math.cos(angle) * arrowSpeed,
                        vy: Math.sin(angle) * arrowSpeed,
                        angle: angle,
                        type: 'arrow',
                        dmg: scaledArrowDmg,
                        isBoss: mob.type === 'boss',
                        life: 110
                    });
                    playSound('slash');
                }
            }

            // Skeleton King (Stage 20 Boss) Necrotic Ring of Bones
            if (mob.type === 'boss' && currentStage === 20) {
                if (mob.necroticRingCooldown > 0) mob.necroticRingCooldown--;
                if (mob.necroticRingCooldown <= 0) {
                    mob.necroticRingCooldown = 135;
                    playSound('skill');
                    screenShake = 8;
                    floatingTexts.push({ x: mx, y: my - 24, text: 'NECROTIC BONE RING! 💀', color: '#c084fc', life: 45 });
                    const numProjectiles = 10;
                    for (let p = 0; p < numProjectiles; p++) {
                        const rAngle = (Math.PI * 2 / numProjectiles) * p;
                        enemyProjectiles.push({
                            x: mx, y: my,
                            vx: Math.cos(rAngle) * 3.2,
                            vy: Math.sin(rAngle) * 3.2,
                            angle: rAngle,
                            type: 'arrow',
                            dmg: Math.round(28 + currentStage * 1.5),
                            isBoss: true,
                            life: 110
                        });
                    }
                }
            }
        }

        // --- 4. SCULK CRAWLER POUNCE DASH ---
        if (mob.species === 'sculk_crawler') {
            if (mob.pounceCooldown > 0) mob.pounceCooldown--;
            if (mob.pounceCooldown <= 0 && dist > 40 && dist < 140) {
                mob.pounceCooldown = 90 + Math.floor(Math.random() * 40);
                const pAngle = Math.atan2(py - my, px - mx);
                const pDist = Math.min(dist, 80);
                const pounceX = mob.x + Math.cos(pAngle) * pDist;
                const pounceY = mob.y + Math.sin(pAngle) * pDist;
                if (!checkWallCollision(pounceX, pounceY, mob.w, mob.h)) {
                    mob.x = pounceX;
                    mob.y = pounceY;
                    playSound('slash');
                    for (let p = 0; p < 8; p++) {
                        particles.push({
                            x: mob.x + mob.w / 2, y: mob.y + mob.h / 2,
                            vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                            size: 3, color: '#06b6d4', life: 12
                        });
                    }
                    if (Math.hypot(px - (mob.x + mob.w / 2), py - (mob.y + mob.h / 2)) < 28) {
                        damagePlayer(Math.round(24 + currentStage * 1.4), '⚡', false);
                    }
                }
            }
        }

        // --- 5. ALTER EGO PARRY STANCE ---
        if (mob.species === 'alter_ego') {
            if (mob.parryCooldown > 0) mob.parryCooldown--;
            if (mob.parryCooldown <= 0 && !mob.isInvulnerable && dist < 120 && Math.random() < 0.35) {
                mob.isParrying = true;
                mob.parryTimer = 35;
                mob.parryCooldown = 150;
                floatingTexts.push({ x: mx, y: my - 24, text: 'PARRY STANCE! 🛡️', color: '#38bdf8', life: 35 });
            }
            if (mob.parryTimer > 0) {
                mob.parryTimer--;
                if (Math.random() < 0.6) {
                    particles.push({
                        x: mx + (Math.random() - 0.5) * 24,
                        y: my + (Math.random() - 0.5) * 24,
                        vx: 0, vy: -1,
                        size: 3, color: '#38bdf8', life: 10
                    });
                }
                if (mob.parryTimer <= 0) {
                    mob.isParrying = false;
                }
            }
        }

        // --- SMARTER ANCIENT DRAGON NORMAL COMBAT AI ---
        if (mob.species === 'dragon') {
            mob.dragonTimer = (mob.dragonTimer || 0) + 1;
            mob.clawTimer = Math.max(0, (mob.clawTimer || 0) - 1);
            mob.tailWhipCooldown = Math.max(0, (mob.tailWhipCooldown || 0) - 1);

            // Smarter: Instant Tail Whip if player tries to flank behind the dragon!
            if (dist < 68 && mob.tailWhipCooldown === 0) {
                const isBehind = (mob.facing === 'left' && px > mx + 15) || (mob.facing === 'right' && px < mx - 15);
                if (isBehind) {
                    mob.tailWhipCooldown = 130;
                    playSound('slash');
                    screenShake = 9;
                    damagePlayer(48, '🐉', true);
                    floatingTexts.push({ x: mx, y: my - 22, text: 'TAIL WHIP!', color: '#f59e0b', life: 35 });
                    const whipA = Math.atan2(py - my, px - mx);
                    const wkX = player.x + Math.cos(whipA) * 35;
                    const wkY = player.y + Math.sin(whipA) * 35;
                    if (!checkWallCollision(wkX, player.y, player.w, player.h)) player.x = wkX;
                    if (!checkWallCollision(player.x, wkY, player.w, player.h)) player.y = wkY;
                }
            }

            // Smarter: Sweeping 5-way flame fan
            if (dist >= 70 && dist < 320) {
                if (mob.dragonTimer >= 65) {
                    mob.dragonTimer = 0;
                    const angle = Math.atan2(py - my, px - mx);
                    const speed = 4.6;
                    const scaledFireDmg = Math.round((mob.type === 'boss' ? 18 : 14) + (currentStage - 1) * (mob.type === 'boss' ? 1.1 : 1.5));

                    [-0.32, -0.16, 0, 0.16, 0.32].forEach(spread => {
                        enemyProjectiles.push({
                            x: mx, y: my - 16,
                            vx: Math.cos(angle + spread) * speed,
                            vy: Math.sin(angle + spread) * speed,
                            angle: angle + spread,
                            type: 'fireball',
                            dmg: scaledFireDmg,
                            isBoss: mob.type === 'boss',
                            life: 95
                        });
                    });
                    playSound('explode');
                }
            } else if (dist < 70) {
                if (mob.dragonTimer >= 38) {
                    mob.dragonTimer = 0;
                    mob.clawTimer = 18;
                    damagePlayer(Math.round(30 + currentStage * 1.6), '🐾', true);
                    screenShake = 11;
                }
            }
        }

        // ===============================================
        // === ALTER EGO FINAL BOSS AI & ATTACKS (STAGE 22) ===
        // ===============================================
        if (mob.species === 'alter_ego') {
            mob.aiTimer = (mob.aiTimer || 0) + 1;
            mob.specialTimer = (mob.specialTimer || 0) + 1;
            mob.attackCooldown = Math.max(0, (mob.attackCooldown || 0) - 1);

            // Facing direction towards player
            const dx = px - mx;
            const dy = py - my;
            if (Math.abs(dx) > Math.abs(dy)) {
                mob.facing = dx > 0 ? 'right' : 'left';
            } else {
                mob.facing = dy > 0 ? 'down' : 'up';
            }

            // Dark shadowy aura particles trailing behind Alter Ego
            if (Math.random() < 0.45) {
                particles.push({
                    x: mx + (Math.random() - 0.5) * 20,
                    y: my + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5 - 0.6,
                    size: Math.random() * 3.5 + 2,
                    color: Math.random() > 0.5 ? '#7c3aed' : '#dc2626',
                    life: 18
                });
            }

            const aRole = mob.alterEgoRole || 'knight';

            // --- 1. ALTER EGO: KNIGHT (SMART TACTICAL AI) ---
            if (aRole === 'knight') {
                // Active shield guard stance: blocks frontal damage by 30%
                // Shield is lowered when preparing or executing attacks, providing clear counter-attack openings!
                mob.isShieldGuarding = (!mob.isAttacking && (mob.attackCooldown > 12) && !mob.isInvulnerable);

                // Ability 1: Heavy Dragon Cleave (slower swing wind-up, high damage)
                if (dist < 52 && mob.attackCooldown === 0) {
                    mob.attackCooldown = 85;
                    mob.isAttacking = true;
                    mob.isShieldGuarding = false;
                    mob.attackTime = 0;
                    mob.attackDuration = 22;
                    playSound('slash');

                    damagePlayer(125, '⚔️', true);
                    const kAngle = Math.atan2(py - my, px - mx);
                    const kx = player.x + Math.cos(kAngle) * 22;
                    const ky = player.y + Math.sin(kAngle) * 22;
                    if (!checkWallCollision(kx, player.y, player.w, player.h)) player.x = kx;
                    if (!checkWallCollision(player.x, ky, player.w, player.h)) player.y = ky;
                    screenShake = 10;
                }

                // Ability 2: Predictive Dragon Shield Rush (telegraphed charge path, high damage)
                if (mob.specialTimer >= 320 && dist > 60 && dist < 260) {
                    mob.specialTimer = 0;
                    playSound('shield');
                    floatingTexts.push({ x: mx, y: my - 24, text: 'PREDICTIVE SHIELD CHARGE! 🛡️', color: '#f59e0b', life: 45 });

                    let pVx = 0, pVy = 0;
                    if (keys['w'] || keys['arrowup']) pVy -= 1;
                    if (keys['s'] || keys['arrowdown']) pVy += 1;
                    if (keys['a'] || keys['arrowleft']) pVx -= 1;
                    if (keys['d'] || keys['arrowright']) pVx -= 1;
                    const predPx = px + pVx * 35;
                    const predPy = py + pVy * 35;

                    const rushAngle = Math.atan2(predPy - my, predPx - mx);
                    const rushDist = Math.min(dist - 20, 150);
                    const targetX = mob.x + Math.cos(rushAngle) * rushDist;
                    const targetY = mob.y + Math.sin(rushAngle) * rushDist;

                    addTelegraphLine({
                        x1: mob.x + mob.w / 2, y1: mob.y + mob.h / 2,
                        x2: targetX + mob.w / 2, y2: targetY + mob.h / 2,
                        width: 32, duration: 45, dmg: 126, isBoss: true,
                        color: '#f59e0b', icon: '🛡️', effectType: 'flame_line',
                        onDetonate: () => {
                            if (!checkWallCollision(targetX, mob.y, mob.w, mob.h)) mob.x = targetX;
                            if (!checkWallCollision(mob.x, targetY, mob.w, mob.h)) mob.y = targetY;
                            screenShake = 12;
                            playSound('explode');
                        }
                    });
                }

                // Ability 3: Whirlwind Slash (Pusaran Naga - telegraphed circle, slower timer, high damage)
                if (mob.aiTimer >= 380 && dist < 100) {
                    mob.aiTimer = 0;
                    playSound('skill');
                    floatingTexts.push({ x: mx, y: my - 24, text: 'DRAGON WHIRLWIND! 🌀🔥', color: '#ef4444', life: 55 });

                    addTelegraphCircle({
                        x: mx, y: my, radius: 95, duration: 60, dmg: 145, isBoss: true,
                        color: '#ef4444', fillColor: 'rgba(239, 68, 68, 0.32)', icon: '🌀', effectType: 'magma'
                    });
                }
            }

            // --- 2. ALTER EGO: MAGE (SMART TACTICAL AI) ---
            else if (aRole === 'mage') {
                mob.isShieldGuarding = false;

                // Corner escape detection: If cornered near borders/walls, instant dimension blink!
                const isNearWall = (mob.x < 75 || mob.x > 565 || mob.y < 95 || mob.y > 310);
                if (isNearWall && dist < 90 && (mob.blinkCooldown || 0) <= 0) {
                    mob.blinkCooldown = 170;
                    playSound('teleport');

                    let oppX = 320, oppY = 190;
                    for (let attempt = 0; attempt < 10; attempt++) {
                        const candX = (mob.x < 320) ? 300 + Math.random() * 210 : 80 + Math.random() * 210;
                        const candY = 90 + Math.random() * 190;
                        if (!checkWallCollision(candX, candY, mob.w, mob.h)) {
                            oppX = candX;
                            oppY = candY;
                            break;
                        }
                    }

                    // Drop a stardust trap mine at old spot (slower timer, high damage)
                    addTelegraphCircle({
                        x: mx, y: my, radius: 30, duration: 130, dmg: 116, isBoss: true,
                        color: '#c084fc', fillColor: 'rgba(192, 132, 252, 0.3)', icon: '✨', effectType: 'stardust_mine'
                    });
                    mob.x = oppX;
                    mob.y = oppY;
                    floatingTexts.push({ x: oppX, y: oppY - 20, text: 'CORNER BLINK! ✨', color: '#c084fc', life: 35 });
                }
                if (mob.blinkCooldown > 0) mob.blinkCooldown--;

                // Ability 1: Curving Cosmic Magic Bolts (slower cooldown & slower velocity, high damage)
                if (mob.attackCooldown === 0 && dist < 320) {
                    mob.attackCooldown = 80;
                    mob.isAttacking = true;
                    mob.attackTime = 0;
                    mob.attackDuration = 18;
                    playSound('skill');

                    const angle = Math.atan2(py - my, px - mx);
                    const boltSpeed = 3.4;
                    [-0.18, 0.18].forEach(spread => {
                        enemyProjectiles.push({
                            x: mx, y: my,
                            vx: Math.cos(angle + spread) * boltSpeed,
                            vy: Math.sin(angle + spread) * boltSpeed,
                            angle: angle + spread,
                            type: 'cosmic_bolt',
                            dmg: 120,
                            isBoss: true,
                            life: 110,
                            isHoming: true
                        });
                    });
                }

                // Ability 2: Surrounding Cosmic Mana Aura Pulse (telegraphed circle, high damage)
                if (dist < 65 && mob.specialTimer >= 240) {
                    mob.specialTimer = 0;
                    playSound('shield');
                    floatingTexts.push({ x: mx, y: my - 24, text: 'COSMIC AURA! 🌌', color: '#ec4899', life: 50 });

                    addTelegraphCircle({
                        x: mx, y: my, radius: 68, duration: 50, dmg: 125, isBoss: true,
                        color: '#ec4899', fillColor: 'rgba(236, 72, 153, 0.3)', icon: '🌌', effectType: 'meteor'
                    });
                }

                // Ability 3: Stardust Mine Traps on floor (slower timer, high damage)
                if (mob.aiTimer >= 260) {
                    mob.aiTimer = 0;
                    addTelegraphCircle({
                        x: mx, y: my, radius: 30, duration: 140, dmg: 116, isBoss: true,
                        color: '#c084fc', fillColor: 'rgba(192, 132, 252, 0.3)', icon: '✨', effectType: 'stardust_mine'
                    });
                }
            }

            // --- 3. ALTER EGO: ASSASSIN (SMART TACTICAL AI) ---
            else { // assassin
                mob.isShieldGuarding = false;
                if (mob.evasionCooldown > 0) mob.evasionCooldown--;

                // Ability 1: Rapid Phantom Twin-Strike (slower cooldown & wind-up, high damage)
                if (dist < 48 && mob.attackCooldown === 0) {
                    mob.attackCooldown = 65;
                    mob.isAttacking = true;
                    mob.attackTime = 0;
                    mob.attackDuration = 18;
                    playSound('slash');

                    damagePlayer(86, '🗡️', true);
                    setTimeout(() => {
                        if (player.hp > 0 && gameState === 'PLAYING') damagePlayer(92, '🗡️', true);
                    }, 140);
                    screenShake = 8;
                }

                // Ability 2: Shadow Step (Teleport Behind Player, slower interval)
                if (mob.specialTimer >= 280 && dist > 70) {
                    mob.specialTimer = 0;
                    playSound('teleport');
                    floatingTexts.push({ x: mx, y: my - 24, text: 'SHADOW STEP! 💨', color: '#10b981', life: 35 });

                    for (let p = 0; p < 12; p++) {
                        particles.push({
                            x: mx + (Math.random() - 0.5) * 16,
                            y: my + (Math.random() - 0.5) * 16,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2,
                            size: 4,
                            color: '#1e293b',
                            life: 18
                        });
                    }

                    const pAngle = getFacingAngle(player.facing || 'left');
                    const behindX = player.x - Math.cos(pAngle) * 34;
                    const behindY = player.y - Math.sin(pAngle) * 34;
                    if (!checkWallCollision(behindX, behindY, mob.w, mob.h)) {
                        mob.x = behindX;
                        mob.y = behindY;
                    }
                }

                // Ability 3: Fan of 3 Poison Kunais (slower speed, high damage)
                if (mob.aiTimer >= 260 && dist >= 65 && dist < 290) {
                    mob.aiTimer = 0;
                    playSound('slash');
                    const baseAngle = Math.atan2(py - my, px - mx);
                    const daggerSpeed = 3.8;

                    [-0.26, 0, 0.26].forEach(off => {
                        enemyProjectiles.push({
                            x: mx, y: my,
                            vx: Math.cos(baseAngle + off) * daggerSpeed,
                            vy: Math.sin(baseAngle + off) * daggerSpeed,
                            angle: baseAngle + off,
                            type: 'phantom_dagger',
                            dmg: 106,
                            isBoss: true,
                            life: 95
                        });
                    });
                }
            }

            // Attack animation progress
            if (mob.isAttacking) {
                mob.attackTime = (mob.attackTime || 0) + 1;
                mob.slashArcProgress = mob.attackTime / mob.attackDuration;
                if (mob.attackTime >= mob.attackDuration) {
                    mob.isAttacking = false;
                }
            }
        }

        // ===============================================
        // === DEEP DARK MOBS & THE WARDEN COMBAT AI ===
        // ===============================================

        // 1. SCULK CRAWLER: Fast skittering bite lunge
        if (mob.species === 'sculk_crawler') {
            mob.lungeCooldown = Math.max(0, (mob.lungeCooldown || 0) - 1);
            if (dist < 42 && mob.lungeCooldown === 0) {
                mob.lungeCooldown = 65;
                const lungeAngle = Math.atan2(py - my, px - mx);
                const lx = mob.x + Math.cos(lungeAngle) * 22;
                const ly = mob.y + Math.sin(lungeAngle) * 22;
                if (!checkWallCollision(lx, ly, mob.w, mob.h)) {
                    mob.x = lx;
                    mob.y = ly;
                }
                damagePlayer(Math.round(28 + currentStage * 1.5), '👾', false);
                playSound('slash');
            }
        }

        // 2. SCULK SPITTER: Acoustic sonic dart sniper
        if (mob.species === 'sculk_spitter') {
            mob.spitTimer = (mob.spitTimer || Math.floor(Math.random() * 30)) + 1;
            if (mob.spitTimer >= 75 && dist < 320) {
                mob.spitTimer = 0;
                const angle = Math.atan2(py - my, px - mx);
                const dartSpeed = 4.2;
                enemyProjectiles.push({
                    x: mx, y: my,
                    vx: Math.cos(angle) * dartSpeed,
                    vy: Math.sin(angle) * dartSpeed,
                    angle: angle,
                    type: 'sonic_dart',
                    dmg: Math.round(26 + currentStage * 1.4),
                    isBoss: false,
                    life: 105
                });
                playSound('skill');
            }
        }

        // 3. SCULK PHANTOM: Aerial acoustic swoop dive
        if (mob.species === 'sculk_phantom') {
            mob.swoopTimer = (mob.swoopTimer || 0) + 1;
            if (mob.swoopTimer >= 90 && dist < 65) {
                mob.swoopTimer = 0;
                damagePlayer(Math.round(30 + currentStage * 1.5), '🦇', false);
                playSound('slash');
                screenShake = 6;
            }
        }

        // 4. THE WARDEN BOSS AI & ABILITIES (STAGE 35)
        if (mob.species === 'warden') {
            mob.wardenAiTimer = (mob.wardenAiTimer || 0) + 1;
            mob.wardenSpecialTimer = (mob.wardenSpecialTimer || 0) + 1;
            mob.attackCooldown = Math.max(0, (mob.attackCooldown || 0) - 1);

            // Facing direction
            const dx = px - mx;
            const dy = py - my;
            mob.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

            // Soul particles in chest
            if (Math.random() < 0.5) {
                particles.push({
                    x: mx + (Math.random() - 0.5) * 28,
                    y: my + (Math.random() - 0.5) * 28,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 - 0.8,
                    size: Math.random() * 3 + 2,
                    color: Math.random() > 0.5 ? '#06b6d4' : '#22d3ee',
                    life: 20
                });
            }

            // Ability 1: Heavy Melee Claw Strike
            if (dist < 56 && mob.attackCooldown === 0) {
                mob.attackCooldown = 65;
                playSound('explode');
                damagePlayer(112, '🐾', true);
                screenShake = 12;
                const kAngle = Math.atan2(py - my, px - mx);
                const kx = player.x + Math.cos(kAngle) * 28;
                const ky = player.y + Math.sin(kAngle) * 28;
                if (!checkWallCollision(kx, player.y, player.w, player.h)) player.x = kx;
                if (!checkWallCollision(player.x, ky, player.w, player.h)) player.y = ky;
                floatingTexts.push({ x: mx, y: my - 24, text: 'WARDEN CLAW! 💀', color: '#06b6d4', life: 35 });
            }

            // Ability 2: Sonic Boom Beam (Linear Telegraph)
            if (mob.wardenSpecialTimer >= 210 && dist > 50 && dist < 340) {
                mob.wardenSpecialTimer = 0;
                playSound('skill');
                floatingTexts.push({ x: mx, y: my - 26, text: 'SONIC BOOM! 🔊', color: '#22d3ee', life: 48 });

                const beamAngle = Math.atan2(py - my, px - mx);
                const beamReach = 300;
                addTelegraphLine({
                    x1: mx, y1: my,
                    x2: mx + Math.cos(beamAngle) * beamReach,
                    y2: my + Math.sin(beamAngle) * beamReach,
                    width: 36, duration: 48, dmg: 126, isBoss: true,
                    color: '#22d3ee', icon: '🔊', effectType: 'sonic_boom'
                });
            }

            // Ability 3: Ground Stomp Shockwave (Radial Telegraph)
            if (mob.wardenAiTimer >= 300 && dist < 115) {
                mob.wardenAiTimer = 0;
                playSound('explode');
                screenShake = 10;
                floatingTexts.push({ x: mx, y: my - 26, text: 'GROUND STOMP! 💥💀', color: '#06b6d4', life: 45 });

                addTelegraphCircle({
                    x: mx, y: my, radius: 85, duration: 46, dmg: 117, isBoss: true,
                    color: '#06b6d4', fillColor: 'rgba(6, 182, 212, 0.32)', icon: '💀', effectType: 'sonic_wave'
                });
            }

            // Ability 4: Sculk Tendril Spikes under player's feet
            if (mob.wardenAiTimer % 170 === 85 && dist >= 75 && dist < 300) {
                playSound('skill');
                addTelegraphCircle({
                    x: px, y: py, radius: 44, duration: 42, dmg: 112, isBoss: true,
                    color: '#0891b2', fillColor: 'rgba(8, 145, 178, 0.35)', icon: '⚡', effectType: 'sculk_spikes'
                });
            }
        }

        // Contact Damage
        if (dist < 16 && player.invulnerableTimer === 0) {
            const isBoss = (mob.type === 'boss' || mob.species === 'alter_ego' || mob.species === 'dragon' || mob.species === 'warden');
            const baseMobDmg = isBoss ? 58 : 14;
            const stageScale = isBoss ? 2.7 : 1.2;
            const rawMobDmg = Math.round(baseMobDmg + (currentStage - 1) * stageScale);
            const icon = (mob.species === 'alter_ego' || mob.type === 'boss') ? '👑' : (mob.species === 'dragon' ? '🐲' : (mob.species === 'warden' ? '🔊' : '👾'));
            damagePlayer(rawMobDmg, icon, isBoss);
        }
    }

    // Enemy Projectiles Update
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const arr = enemyProjectiles[i];

        // Homing projectile steering for Mage's cosmic magic bolts
        if (arr.isHoming) {
            const toP = Math.atan2(py - arr.y, px - arr.x);
            let diff = toP - arr.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            arr.angle += Math.max(-0.035, Math.min(0.035, diff));
            const spd = Math.hypot(arr.vx, arr.vy);
            arr.vx = Math.cos(arr.angle) * spd;
            arr.vy = Math.sin(arr.angle) * spd;
        }

        arr.x += arr.vx;
        arr.y += arr.vy;
        arr.life--;

        if (checkWallCollision(arr.x - 3, arr.y - 3, 6, 6) || arr.life <= 0) {
            for (let p = 0; p < 4; p++) {
                particles.push({
                    x: arr.x, y: arr.y,
                    vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                    size: 2, color: '#b45309', life: 10
                });
            }
            enemyProjectiles.splice(i, 1);
            continue;
        }

        const distToPlayer = Math.hypot(px - arr.x, py - arr.y);

        if (distToPlayer < 14 && player.invulnerableTimer === 0) {
            const isBossProj = !!arr.isBoss || currentStage >= 21;
            const icon = arr.type === 'fireball' ? '🔥' : (arr.type === 'cosmic_bolt' ? '🔮' : (arr.type === 'phantom_dagger' ? '🗡️' : (arr.type === 'sonic_dart' ? '🔊' : '🏹')));
            damagePlayer(arr.dmg, icon, isBossProj);
            enemyProjectiles.splice(i, 1);
        }
    }

    // Update Danger Telegraph Zones
    updateTelegraphZones();
}
