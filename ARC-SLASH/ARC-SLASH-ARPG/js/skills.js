// --- SKILL SYSTEM (ROLE-BASED) ---

const ROLE_SKILLS = {
    knight: [
        {
            id: 'skill_whirlwind',
            name: 'Whirlwind Slash',
            description: 'Spinning slash that damages all nearby enemies.',
            icon: '🌀',
            cooldown: 300,
            damage: 45,
            radius: 80,
            duration: 20,
            type: 'aoe',
            unlockStage: 1,
            color: '#f1c40f'
        },
        {
            id: 'skill_iron_bastion',
            name: 'Iron Bastion',
            description: 'Instantly restores Armor and grants an impenetrable shield.',
            icon: '🛡️',
            cooldown: 540,
            healShield: 40,
            duration: 120,
            type: 'shield_buff',
            unlockStage: 3,
            color: '#00e5ff'
        },
        {
            id: 'skill_shield_bash',
            name: 'Shield Bash',
            description: 'Charges forward pushing enemies with steel shield & massive knockback.',
            icon: '🛡️💥',
            cooldown: 420,
            damage: 60,
            type: 'shield_bash',
            unlockStage: 5,
            color: '#00e5ff'
        }
    ],
    mage: [
        {
            id: 'skill_fireball_blast',
            name: 'Infernal Fireball',
            description: 'Hurls a massive fireball that explodes into an area of flame.',
            icon: '🔥',
            cooldown: 270,
            damage: 50,
            radius: 90,
            type: 'fireball_aoe',
            unlockStage: 1,
            color: '#ff5722'
        },
        {
            id: 'skill_radiant_heal',
            name: 'Radiant Heal',
            description: 'Channels restoration magic regenerating 60 HP.',
            icon: '💚',
            cooldown: 600,
            healAmount: 45,
            type: 'heal',
            unlockStage: 3,
            color: '#2ecc71'
        },
        {
            id: 'skill_arcane_storm',
            name: 'Cosmic Thunderstorm',
            description: 'Summons cosmic lightning bolts striking all enemies in the chamber.',
            icon: '⚡',
            cooldown: 480,
            damage: 65,
            radius: 200,
            maxTargets: 7,
            type: 'storm',
            unlockStage: 5,
            color: '#c084fc'
        }
    ],
    assassin: [
        {
            id: 'skill_shadow_dash',
            name: 'Shadow Dash',
            description: 'Dashes forward like lightning slashing all enemies in path.',
            icon: '🗡️',
            cooldown: 240,
            damage: 45,
            type: 'dash_slash',
            unlockStage: 1,
            color: '#10b981'
        },
        {
            id: 'skill_smoke_bomb',
            name: 'Phantom Smoke Bomb',
            description: 'Throws a smoke bomb: 3s invulnerability & massive sprint speed boost.',
            icon: '💨',
            cooldown: 540,
            duration: 180,
            type: 'stealth',
            unlockStage: 3,
            color: '#94a3b8'
        },
        {
            id: 'skill_poison_fan',
            name: 'Poison Dagger Fan',
            description: 'Fires 8 poisoned daggers outward in a full circle.',
            icon: '☠️',
            cooldown: 420,
            damage: 30,
            daggerCount: 8,
            type: 'dagger_fan',
            unlockStage: 5,
            color: '#34d399'
        }
    ]
};

// Currently active 3 skill slots
let currentRoleSkills = ROLE_SKILLS.knight;
const skillSlots = [
    { skillIndex: 0, cooldownTimer: 0, isActive: false, activeTimer: 0 },
    { skillIndex: 1, cooldownTimer: 0, isActive: false, activeTimer: 0 },
    { skillIndex: 2, cooldownTimer: 0, isActive: false, activeTimer: 0 }
];

function initSkillsForRole(role) {
    if (!ROLE_SKILLS[role]) role = 'knight';
    currentRoleSkills = ROLE_SKILLS[role];
    resetSkillCooldowns();
}

function getSkillData(param) {
    if (typeof param === 'number') {
        return currentRoleSkills[param] || null;
    }
    if (typeof param === 'string') {
        const found = currentRoleSkills.find(s => s.id === param);
        if (found) return found;
        for (const role in ROLE_SKILLS) {
            const s = ROLE_SKILLS[role].find(x => x.id === param);
            if (s) return s;
        }
    }
    return null;
}

function isSkillUnlocked(slotIndex) {
    const skill = getSkillData(slotIndex);
    if (!skill) return false;
    return (typeof currentStage !== 'undefined' ? currentStage : 1) >= skill.unlockStage;
}

function activateSkill(slotIndex) {
    if (gameState !== 'PLAYING') return;
    
    const slot = skillSlots[slotIndex];
    if (!slot) return;
    
    if (!isSkillUnlocked(slotIndex)) {
        floatingTexts.push({
            x: player.x + player.w / 2,
            y: player.y - 20,
            text: 'LOCKED!',
            color: '#ff4d4d',
            life: 30
        });
        playSound('error');
        return;
    }
    
    if (slot.cooldownTimer > 0) {
        floatingTexts.push({
            x: player.x + player.w / 2,
            y: player.y - 20,
            text: 'COOLDOWN!',
            color: '#ff9800',
            life: 24
        });
        playSound('error');
        return;
    }
    
    const skill = getSkillData(slotIndex);
    if (!skill) return;
    
    playSound('skill');
    slot.cooldownTimer = skill.cooldown;
    if (typeof achievementTracker !== 'undefined') {
        achievementTracker.onSkillUsed(skill);
    }
    
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const atkBonus = (typeof calculateEquipmentStats === 'function') ? (calculateEquipmentStats(player.equipped).atkBonus || 0) : 0;
    const playerAtk = (typeof getPlayerDamage === 'function') ? getPlayerDamage() : (player.baseDamage + atkBonus);
    
    // Skill Implementations
    if (skill.type === 'aoe') {
        // Knight: Whirlwind
        slot.isActive = true;
        slot.activeTimer = skill.duration;
        const totalDmg = Math.round(skill.damage + playerAtk * 0.9);
        
        mobs.forEach(mob => {
            const mx = mob.x + mob.w / 2;
            const my = mob.y + mob.h / 2;
            const dist = Math.hypot(mx - px, my - py);
            
            if (dist <= skill.radius) {
                if (typeof damageMob === 'function') damageMob(mob, totalDmg);
                else mob.hp -= totalDmg;
                floatingTexts.push({
                    x: mob.x + mob.w / 2, y: mob.y - 8,
                    text: `${totalDmg} 🌀`, color: skill.color, life: 28
                });
                const angle = Math.atan2(my - py, mx - px);
                const kx = mob.x + Math.cos(angle) * 22;
                const ky = mob.y + Math.sin(angle) * 22;
                if (!checkWallCollision(kx, mob.y, mob.w, mob.h)) mob.x = kx;
                if (!checkWallCollision(mob.x, ky, mob.w, mob.h)) mob.y = ky;
            }
        });
        
        for (let i = 0; i < 28; i++) {
            const angle = (Math.PI * 2 / 28) * i;
            const dist = skill.radius * 0.4 + Math.random() * skill.radius * 0.6;
            particles.push({
                x: px + Math.cos(angle) * dist,
                y: py + Math.sin(angle) * dist,
                vx: Math.cos(angle + Math.PI / 2) * 3.5,
                vy: Math.sin(angle + Math.PI / 2) * 3.5,
                size: 3 + Math.random() * 3,
                color: Math.random() > 0.5 ? skill.color : '#fff',
                life: 20
            });
        }
        screenShake = 8;
        
    } else if (skill.type === 'shield_buff') {
        // Knight: Iron Bastion
        player.shield = Math.min(player.maxShield, player.shield + skill.healShield);
        player.invulnerableTimer = 60; // 1 second absolute invuln
        player.shieldHitFlashTimer = 30;
        
        floatingTexts.push({
            x: px, y: py - 20,
            text: `+${skill.healShield} ARMOR 🛡️`, color: '#00e5ff', life: 35
        });
        
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            particles.push({
                x: px + Math.cos(angle) * 22,
                y: py + Math.sin(angle) * 22,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                size: 3 + Math.random() * 2,
                color: '#00e5ff',
                life: 25
            });
        }
        playSound('shield');
        
    } else if (skill.type === 'shield_bash') {
        const totalDmg = Math.round(skill.damage + playerAtk * 1.1);
        const facingAngle = (typeof getFacingAngle === 'function') ? getFacingAngle(player.facing) : 0;
        
        // Knight charges forward with shield
        const chargeDist = 70;
        const targetX = player.x + Math.cos(facingAngle) * chargeDist;
        const targetY = player.y + Math.sin(facingAngle) * chargeDist;
        
        if (!checkWallCollision(targetX, player.y, player.w, player.h)) player.x = targetX;
        if (!checkWallCollision(player.x, targetY, player.w, player.h)) player.y = targetY;
        
        const newPx = player.x + player.w / 2;
        const newPy = player.y + player.h / 2;
        
        // Invulnerability & shield glow flash
        player.invulnerableTimer = 35;
        player.shieldHitFlashTimer = 25;
        
        // Push and damage all mobs in front of the shield rush
        mobs.forEach(mob => {
            const mx = mob.x + mob.w / 2;
            const my = mob.y + mob.h / 2;
            const dist = Math.hypot(mx - newPx, my - newPy);
            
            if (dist <= 80) {
                let angleToMob = Math.atan2(my - newPy, mx - newPx);
                let diffAngle = angleToMob - facingAngle;
                while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                
                if (Math.abs(diffAngle) < Math.PI * 0.55 || dist < 35) {
                    if (typeof damageMob === 'function') damageMob(mob, totalDmg);
                    else mob.hp -= totalDmg;
                    
                    // Violent push / knockback (55px in facing direction!)
                    const pushDist = 55;
                    const pushX = mob.x + Math.cos(facingAngle) * pushDist;
                    const pushY = mob.y + Math.sin(facingAngle) * pushDist;
                    
                    let hitWall = false;
                    if (!checkWallCollision(pushX, mob.y, mob.w, mob.h)) {
                        mob.x = pushX;
                    } else {
                        hitWall = true;
                    }
                    if (!checkWallCollision(mob.x, pushY, mob.w, mob.h)) {
                        mob.y = pushY;
                    } else {
                        hitWall = true;
                    }
                    
                    // Extra smash damage if slammed into a wall
                    if (hitWall) {
                        const wallSmashDmg = Math.floor(totalDmg * 0.35);
                        if (typeof damageMob === 'function') damageMob(mob, wallSmashDmg);
                        else mob.hp -= wallSmashDmg;
                        floatingTexts.push({
                            x: mx, y: my - 22,
                            text: `WALL SMASH! +${wallSmashDmg}`, color: '#ff3d00', life: 30
                        });
                    }
                    
                    floatingTexts.push({
                        x: mx, y: my - 8,
                        text: `${totalDmg} 🛡️💥`, color: '#00e5ff', life: 30
                    });
                    
                    for (let p = 0; p < 12; p++) {
                        const a = Math.random() * Math.PI * 2;
                        particles.push({
                            x: mx, y: my,
                            vx: Math.cos(a) * (Math.random() * 4 + 2),
                            vy: Math.sin(a) * (Math.random() * 4 + 2),
                            size: Math.random() * 3 + 2,
                            color: Math.random() > 0.4 ? '#00e5ff' : '#ffffff',
                            life: 16
                        });
                    }
                }
            }
        });
        
        // Shield shockwave particles in charging direction
        for (let s = 0; s < 18; s++) {
            const spread = (Math.random() - 0.5) * 35;
            const orthoAngle = facingAngle + Math.PI / 2;
            particles.push({
                x: newPx + Math.cos(facingAngle) * 15 + Math.cos(orthoAngle) * spread,
                y: newPy + Math.sin(facingAngle) * 15 + Math.sin(orthoAngle) * spread,
                vx: Math.cos(facingAngle) * (Math.random() * 4 + 3),
                vy: Math.sin(facingAngle) * (Math.random() * 4 + 3),
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.3 ? '#00e5ff' : '#ffeb3b',
                life: 18
            });
        }
        
        screenShake = 12;
        playSound('shield');
        playSound('hit');
        
    } else if (skill.type === 'fireball_aoe') {
        const totalDmg = Math.round(skill.damage + playerAtk * 1.0);
        const facingAngle = (typeof getFacingAngle === 'function') ? getFacingAngle(player.facing) : 0;
        const blastX = px + Math.cos(facingAngle) * 55;
        const blastY = py + Math.sin(facingAngle) * 55;
        
        mobs.forEach(mob => {
            const mx = mob.x + mob.w / 2;
            const my = mob.y + mob.h / 2;
            if (Math.hypot(mx - blastX, my - blastY) <= skill.radius) {
                if (typeof damageMob === 'function') damageMob(mob, totalDmg);
                else mob.hp -= totalDmg;
                floatingTexts.push({
                    x: mx, y: my - 8,
                    text: `${totalDmg} 🔥`, color: skill.color, life: 30
                });
            }
        });
        
        // Massive fiery explosion particles
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 4 + 1.5;
            particles.push({
                x: blastX, y: blastY,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                size: Math.random() * 5 + 2,
                color: Math.random() > 0.4 ? '#ff5722' : '#ffeb3b',
                life: 25
            });
        }
        playSound('explode');
        screenShake = 10;
        
    } else if (skill.type === 'heal') {
        // Mage: Radiant Heal
        player.hp = Math.min(player.maxHp, player.hp + skill.healAmount);
        player.shield = Math.min(player.maxShield, player.shield + 25);
        floatingTexts.push({
            x: px, y: py - 20,
            text: `+${skill.healAmount} HP 💚`, color: skill.color, life: 35
        });
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: px + (Math.random() - 0.5) * 26,
                y: py + (Math.random() - 0.5) * 26,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -2 - Math.random() * 2,
                size: 3 + Math.random() * 3,
                color: Math.random() > 0.3 ? '#2ecc71' : '#a7f3d0',
                life: 25
            });
        }
        playSound('heal');
        
    } else if (skill.type === 'storm') {
        const totalDmg = Math.round(skill.damage + playerAtk * 1.2);
        mobs.forEach(mob => {
            if (typeof damageMob === 'function') damageMob(mob, totalDmg);
            else mob.hp -= totalDmg;
            floatingTexts.push({
                x: mob.x + mob.w / 2, y: mob.y - 12,
                text: `${totalDmg} ⚡`, color: skill.color, life: 32
            });
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: mob.x + mob.w / 2 + (Math.random() - 0.5) * 10,
                    y: mob.y - 30 + i * 4,
                    vx: (Math.random() - 0.5) * 2,
                    vy: 4,
                    size: 3,
                    color: '#c084fc',
                    life: 14
                });
            }
        });
        screenShake = 12;
        playSound('explode');
        
    } else if (skill.type === 'dash_slash') {
        const totalDmg = Math.round(skill.damage + playerAtk * 1.0);
        const facingAngle = (typeof getFacingAngle === 'function') ? getFacingAngle(player.facing) : 0;
        const dashDist = 80;
        const targetX = player.x + Math.cos(facingAngle) * dashDist;
        const targetY = player.y + Math.sin(facingAngle) * dashDist;
        
        // Check line collision against mobs
        mobs.forEach(mob => {
            const mx = mob.x + mob.w / 2;
            const my = mob.y + mob.h / 2;
            const dist = Math.hypot(mx - px, my - py);
            if (dist < dashDist + 20) {
                if (typeof damageMob === 'function') damageMob(mob, totalDmg);
                else mob.hp -= totalDmg;
                floatingTexts.push({
                    x: mx, y: my - 8,
                    text: `${totalDmg} 🗡️`, color: skill.color, life: 28
                });
            }
        });
        
        // Shadow trail
        for (let s = 0; s < 12; s++) {
            const t = s / 12;
            particles.push({
                x: player.x + (targetX - player.x) * t,
                y: player.y + (targetY - player.y) * t,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: 4,
                color: '#10b981',
                life: 18
            });
        }
        
        if (!checkWallCollision(targetX, targetY, player.w, player.h)) {
            player.x = targetX;
            player.y = targetY;
        }
        player.invulnerableTimer = 25;
        playSound('slash');
        
    } else if (skill.type === 'stealth') {
        // Assassin: Smoke Bomb
        player.invulnerableTimer = skill.duration;
        player.speed = player.baseSpeed * 1.5;
        setTimeout(() => { if (player) player.speed = player.baseSpeed; }, 3000);
        
        floatingTexts.push({
            x: px, y: py - 20,
            text: 'STEALTH! 💨', color: '#94a3b8', life: 35
        });
        
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            particles.push({
                x: px, y: py,
                vx: Math.cos(angle) * (Math.random() * 3 + 1),
                vy: Math.sin(angle) * (Math.random() * 3 + 1),
                size: Math.random() * 5 + 3,
                color: '#475569',
                life: 30
            });
        }
        playSound('teleport');
        
    } else if (skill.type === 'dagger_fan') {
        const totalDmg = Math.round(skill.damage + playerAtk * 0.55);
        const count = skill.daggerCount || 8;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const daggerDist = 75;
            const dx = px + Math.cos(angle) * daggerDist;
            const dy = py + Math.sin(angle) * daggerDist;
            
            // Visual particles for each flying dagger
            for (let s = 0; s < 5; s++) {
                const t = s / 5;
                particles.push({
                    x: px + Math.cos(angle) * (daggerDist * t),
                    y: py + Math.sin(angle) * (daggerDist * t),
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    size: 3,
                    color: '#10b981',
                    life: 15
                });
            }
            
            mobs.forEach(mob => {
                const mx = mob.x + mob.w / 2;
                const my = mob.y + mob.h / 2;
                if (Math.hypot(mx - dx, my - dy) < 26) {
                    if (typeof damageMob === 'function') damageMob(mob, totalDmg);
                    else mob.hp -= totalDmg;
                    floatingTexts.push({
                        x: mx, y: my - 8,
                        text: `${totalDmg} ☠️`, color: skill.color, life: 28
                    });
                }
            });
        }
        screenShake = 6;
        playSound('slash');
    }
}

function updateSkills() {
    skillSlots.forEach(slot => {
        if (slot.cooldownTimer > 0) slot.cooldownTimer--;
        if (slot.activeTimer > 0) {
            slot.activeTimer--;
            if (slot.activeTimer <= 0) slot.isActive = false;
        }
    });
}

function resetSkillCooldowns() {
    skillSlots.forEach(slot => {
        slot.cooldownTimer = 0;
        slot.isActive = false;
        slot.activeTimer = 0;
    });
}
