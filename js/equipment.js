// --- EQUIPMENT DATA & SPRITE DEFINITIONS ---
// Each equipment has unique visual properties and belongs to a specific character role

const EQUIPMENT_CATEGORIES = ['weapon', 'armor', 'helmet', 'shield', 'boots', 'cape'];

const EQUIPMENT_DB = [
    // ==========================================
    // ===== KNIGHT EQUIPMENT =====
    // ==========================================

    // --- Knight Weapons (Swords) ---
    {
        id: 'weapon_rusty_sword',
        role: 'knight',
        name: 'Rusty Broadsword',
        category: 'weapon',
        tier: 1,
        price: 0,
        stats: { atkBonus: 0 },
        description: 'A worn and rusted starter sword.',
        sprite: {
            bladeColor: '#94a3b8',
            bladeHighlight: '#cbd5e1',
            bladeShadow: '#64748b',
            crossguardColor: '#78350f',
            gripColor: '#6e4726',
            pommelColor: '#78350f',
            bladeLength: 26,
            glowColor: null,
            tipStyle: 'normal'
        }
    },
    {
        id: 'weapon_iron_sword',
        role: 'knight',
        name: 'Forged Iron Sword',
        category: 'weapon',
        tier: 1,
        price: 150,
        stats: { atkBonus: 10 },
        description: 'A sharp and sturdy tempered iron blade.',
        sprite: {
            bladeColor: '#e2e8f0',
            bladeHighlight: '#f8fafc',
            bladeShadow: '#94a3b8',
            crossguardColor: '#fbbf24',
            gripColor: '#78350f',
            pommelColor: '#e74c3c',
            bladeLength: 28,
            glowColor: null,
            tipStyle: 'normal'
        }
    },
    {
        id: 'weapon_flame_blade',
        role: 'knight',
        name: 'Blazing Fire Blade',
        category: 'weapon',
        tier: 2,
        price: 450,
        stats: { atkBonus: 24 },
        description: 'Engulfed in eternal flames that incinerate foes.',
        sprite: {
            bladeColor: '#ef4444',
            bladeHighlight: '#fbbf24',
            bladeShadow: '#b91c1c',
            crossguardColor: '#f59e0b',
            gripColor: '#451a03',
            pommelColor: '#ff6d00',
            bladeLength: 30,
            glowColor: '#ff6d00',
            tipStyle: 'flame'
        }
    },
    {
        id: 'weapon_ice_saber',
        role: 'knight',
        name: 'Ancient Frost Saber',
        category: 'weapon',
        tier: 2,
        price: 450,
        stats: { atkBonus: 20, speedBonus: 0.2 },
        description: 'A crystalline ice blade that chills enemies.',
        sprite: {
            bladeColor: '#67e8f9',
            bladeHighlight: '#ecfeff',
            bladeShadow: '#0891b2',
            crossguardColor: '#06b6d4',
            gripColor: '#164e63',
            pommelColor: '#22d3ee',
            bladeLength: 31,
            glowColor: '#00e5ff',
            tipStyle: 'crystal'
        }
    },
    {
        id: 'weapon_shadow_katana',
        role: 'knight',
        name: 'Shadow Greatsword',
        category: 'weapon',
        tier: 3,
        price: 1100,
        stats: { atkBonus: 40, speedBonus: 0.3 },
        description: 'A massive greatsword bathed in dark energy.',
        sprite: {
            bladeColor: '#1e1b4b',
            bladeHighlight: '#7c3aed',
            bladeShadow: '#0f0a2e',
            crossguardColor: '#7c3aed',
            gripColor: '#1e1b4b',
            pommelColor: '#a855f7',
            bladeLength: 35,
            glowColor: '#a855f7',
            tipStyle: 'sharp'
        }
    },
    {
        id: 'weapon_dragon_slayer',
        role: 'knight',
        name: 'Dragon Slayer',
        category: 'weapon',
        tier: 4,
        price: 1800,
        stats: { atkBonus: 75, maxHpBonus: 30 },
        description: 'A legendary greatsword forged to fell dragon kings.',
        sprite: {
            bladeColor: '#fbbf24',
            bladeHighlight: '#fef3c7',
            bladeShadow: '#d97706',
            crossguardColor: '#dc2626',
            gripColor: '#7f1d1d',
            pommelColor: '#f59e0b',
            bladeLength: 38,
            glowColor: '#fbbf24',
            tipStyle: 'dragon'
        }
    },
    {
        id: 'weapon_christmas_tree',
        role: 'knight',
        name: 'Xmas Tree Broadsword',
        category: 'weapon',
        tier: 4,
        price: 2000,
        isExclusive: true,
        stats: { atkBonus: 88, maxHpBonus: 45, defBonus: 10 },
        description: 'An exclusive Christmas pine blade with a shining gold star. Roulette exclusive!',
        sprite: {
            bladeColor: '#16a34a',
            bladeHighlight: '#86efac',
            bladeShadow: '#14532d',
            crossguardColor: '#b45309',
            gripColor: '#78350f',
            pommelColor: '#fbbf24',
            bladeLength: 38,
            glowColor: '#22c55e',
            tipStyle: 'christmas_tree'
        }
    },
    {
        id: 'weapon_sculk_greatsword',
        role: 'knight',
        name: 'Sculk Abyssal Greatsword',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3800,
        stats: { atkBonus: 135, maxHpBonus: 60, defBonus: 12 },
        description: 'A colossal blade carved from hardened deepslate infused with living sculk veins and warden souls.',
        sprite: {
            bladeColor: '#0891b2',
            bladeHighlight: '#22d3ee',
            bladeShadow: '#042f2e',
            crossguardColor: '#0e7490',
            gripColor: '#020617',
            pommelColor: '#00f5d4',
            bladeLength: 42,
            glowColor: '#00f5d4',
            tipStyle: 'sculk'
        }
    },
    {
        id: 'weapon_titan_breaker',
        role: 'knight',
        name: 'Titan-Breaker Colossus Sword',
        category: 'weapon',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2700,
        stats: { atkBonus: 125, maxHpBonus: 65, defBonus: 12 },
        description: 'A massive serrated broadsword forged from meteoric core, engineered to shatter boss armor.',
        sprite: {
            bladeColor: '#f59e0b',
            bladeHighlight: '#fef08a',
            bladeShadow: '#b45309',
            crossguardColor: '#78350f',
            gripColor: '#451a03',
            pommelColor: '#d97706',
            bladeLength: 40,
            glowColor: '#f59e0b',
            tipStyle: 'dragon'
        }
    },
    {
        id: 'weapon_godslayer_excalibur',
        role: 'knight',
        name: 'Divine Godslayer Excalibur',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5200,
        stats: { atkBonus: 195, maxHpBonus: 130, defBonus: 24 },
        description: 'The sacred blade of champions, radiating blinding solar brilliance that slays immortal behemoths.',
        sprite: {
            bladeColor: '#ffffff',
            bladeHighlight: '#fef08a',
            bladeShadow: '#eab308',
            crossguardColor: '#fbbf24',
            gripColor: '#1e3a8a',
            pommelColor: '#60a5fa',
            bladeLength: 44,
            glowColor: '#fbbf24',
            tipStyle: 'dragon'
        }
    },

    // --- Knight Armor (Chest) ---
    {
        id: 'armor_cloth',
        role: 'knight',
        name: 'Squire Tunic',
        category: 'armor',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'Basic cloth protection for novice knights.',
        sprite: {
            bodyColor: '#334155',
            plateColor: '#94a3b8',
            highlightColor: '#e2e8f0',
            trimColor: '#fbbf24',
            pauldronColor: '#64748b',
            pauldronHighlight: '#cbd5e1',
            crestStyle: 'cross'
        }
    },
    {
        id: 'armor_chainmail',
        role: 'knight',
        name: 'Steel Chainmail',
        category: 'armor',
        tier: 1,
        price: 180,
        stats: { defBonus: 3, maxHpBonus: 15 },
        description: 'Interlocking steel rings offering reliable defense.',
        sprite: {
            bodyColor: '#475569',
            plateColor: '#94a3b8',
            highlightColor: '#cbd5e1',
            trimColor: '#94a3b8',
            pauldronColor: '#64748b',
            pauldronHighlight: '#94a3b8',
            crestStyle: 'chain'
        }
    },
    {
        id: 'armor_knight_plate',
        role: 'knight',
        name: 'Knight Plate Armor',
        category: 'armor',
        tier: 2,
        price: 550,
        stats: { defBonus: 8, maxHpBonus: 30 },
        description: 'Heavy steel plate worn by the royal vanguard.',
        sprite: {
            bodyColor: '#1e3a5f',
            plateColor: '#60a5fa',
            highlightColor: '#93c5fd',
            trimColor: '#fbbf24',
            pauldronColor: '#3b82f6',
            pauldronHighlight: '#93c5fd',
            crestStyle: 'royal'
        }
    },
    {
        id: 'armor_dark_plate',
        role: 'knight',
        name: 'Dark Steel Plate',
        category: 'armor',
        tier: 3,
        price: 1300,
        stats: { defBonus: 16, maxHpBonus: 50 },
        description: 'Armor inlaid with curse-warding obsidian.',
        sprite: {
            bodyColor: '#1e1b4b',
            plateColor: '#6d28d9',
            highlightColor: '#a78bfa',
            trimColor: '#c084fc',
            pauldronColor: '#7c3aed',
            pauldronHighlight: '#a78bfa',
            crestStyle: 'skull'
        }
    },
    {
        id: 'armor_dragon_scale',
        role: 'knight',
        name: 'Elder Dragonscale Armor',
        category: 'armor',
        tier: 4,
        price: 1900,
        stats: { defBonus: 26, maxHpBonus: 90 },
        description: 'Forged from ancient dragon scales impervious to magma.',
        sprite: {
            bodyColor: '#7f1d1d',
            plateColor: '#dc2626',
            highlightColor: '#fca5a5',
            trimColor: '#f59e0b',
            pauldronColor: '#b91c1c',
            pauldronHighlight: '#f87171',
            crestStyle: 'dragon'
        }
    },
    {
        id: 'armor_sculk_plate',
        role: 'knight',
        name: 'Sculk Warden Carapace',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3700,
        stats: { defBonus: 38, maxHpBonus: 120, maxShieldBonus: 70 },
        description: 'Impenetrable reinforced abyssal plate forged from ancient warden ribs and pulsing sculk catalyst.',
        sprite: {
            bodyColor: '#020617',
            plateColor: '#083344',
            highlightColor: '#22d3ee',
            trimColor: '#00f5d4',
            pauldronColor: '#0e7490',
            pauldronHighlight: '#67e8f9',
            crestStyle: 'warden_heart'
        }
    },
    {
        id: 'armor_colossus_bastion',
        role: 'knight',
        name: 'Colossus Bastion Plate',
        category: 'armor',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { defBonus: 42, maxHpBonus: 160, maxShieldBonus: 40 },
        description: 'Reinforced plate armor that shrugs off catastrophic boss impacts.',
        sprite: {
            bodyColor: '#1e293b',
            plateColor: '#64748b',
            highlightColor: '#cbd5e1',
            trimColor: '#f59e0b',
            pauldronColor: '#475569',
            pauldronHighlight: '#94a3b8',
            crestStyle: 'cross'
        }
    },
    {
        id: 'armor_celestial_divine_cuirass',
        role: 'knight',
        name: 'Celestial Divine Cuirass',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5000,
        stats: { defBonus: 62, maxHpBonus: 250, maxShieldBonus: 85 },
        description: 'Impenetrable star-forged armor blessed by seraphim to grant immortal vitality.',
        sprite: {
            bodyColor: '#0f172a',
            plateColor: '#fbbf24',
            highlightColor: '#ffffff',
            trimColor: '#38bdf8',
            pauldronColor: '#eab308',
            pauldronHighlight: '#fef08a',
            crestStyle: 'dragon'
        }
    },

    // --- Knight Helmet ---
    {
        id: 'helmet_basic',
        role: 'knight',
        name: 'Knight Iron Helm',
        category: 'helmet',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'Standard iron helmet adorned with a red plume.',
        sprite: {
            domeColor: '#475569',
            domeHighlight: '#cbd5e1',
            visorColor: '#0f172a',
            eyeColor: '#00e5ff',
            plumeColor: '#ef4444',
            plumeHighlight: '#f87171',
            plumeStyle: 'feather'
        }
    },
    {
        id: 'helmet_viking',
        role: 'knight',
        name: 'Horned War Helmet',
        category: 'helmet',
        tier: 2,
        price: 380,
        stats: { defBonus: 5, atkBonus: 10 },
        description: 'A fierce horned helm worn by fearless warriors.',
        sprite: {
            domeColor: '#78350f',
            domeHighlight: '#92400e',
            visorColor: '#1c1917',
            eyeColor: '#fbbf24',
            plumeColor: null,
            plumeHighlight: null,
            plumeStyle: 'horns'
        }
    },
    {
        id: 'helmet_royal',
        role: 'knight',
        name: "King's Crowned Helm",
        category: 'helmet',
        tier: 3,
        price: 950,
        stats: { defBonus: 10, maxHpBonus: 25 },
        description: 'Sapphire-inlaid helm crowned with royal gold ornaments.',
        sprite: {
            domeColor: '#1e3a8a',
            domeHighlight: '#3b82f6',
            visorColor: '#0c0a09',
            eyeColor: '#fbbf24',
            plumeColor: '#fbbf24',
            plumeHighlight: '#fef3c7',
            plumeStyle: 'crown'
        }
    },
    {
        id: 'helmet_dragon_helm',
        role: 'knight',
        name: 'Blazing Dragon Visor',
        category: 'helmet',
        tier: 4,
        price: 1500,
        stats: { defBonus: 18, atkBonus: 10 },
        description: 'Carved in the visage of a dragon with glowing golden eyes.',
        sprite: {
            domeColor: '#991b1b',
            domeHighlight: '#dc2626',
            visorColor: '#450a0a',
            eyeColor: '#fbbf24',
            plumeColor: '#f59e0b',
            plumeHighlight: '#fbbf24',
            plumeStyle: 'dragon_horns'
        }
    },
    {
        id: 'helmet_sculk_warden_helm',
        role: 'knight',
        name: 'Warden Horned Greathelm',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3000,
        stats: { defBonus: 18, maxHpBonus: 65, maxShieldBonus: 40, atkBonus: 10 },
        description: 'A faceless dread helm adorned with vibrating sonic sensors that detect vibrations in the pitch dark.',
        sprite: {
            domeColor: '#041b2d',
            domeHighlight: '#0891b2',
            visorColor: '#020617',
            eyeColor: '#00f5d4',
            plumeColor: '#22d3ee',
            plumeHighlight: '#a5f3fc',
            plumeStyle: 'sculk_sensors'
        }
    },
    {
        id: 'helmet_titan_crown',
        role: 'knight',
        name: 'Titan King Warcrown',
        category: 'helmet',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2200,
        stats: { defBonus: 25, maxHpBonus: 80, atkBonus: 20 },
        description: 'Crown of ancient titan conquerors, inspiring relentless martial wrath.',
        sprite: {
            domeColor: '#334155',
            domeHighlight: '#94a3b8',
            visorColor: '#0f172a',
            eyeColor: '#fbbf24',
            plumeColor: '#f59e0b',
            plumeHighlight: '#fde047',
            plumeStyle: 'crown'
        }
    },
    {
        id: 'helmet_valkyrie_warcrest',
        role: 'knight',
        name: 'Valkyrie Solar Warcrest',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4200,
        stats: { defBonus: 38, maxHpBonus: 140, atkBonus: 32, maxShieldBonus: 50 },
        description: 'A radiant golden winged helm forged for champions who face god-level threats.',
        sprite: {
            domeColor: '#eab308',
            domeHighlight: '#ffffff',
            visorColor: '#0f172a',
            eyeColor: '#38bdf8',
            plumeColor: '#fde047',
            plumeHighlight: '#ffffff',
            plumeStyle: 'feather'
        }
    },

    // --- Knight Shield ---
    {
        id: 'shield_wooden',
        role: 'knight',
        name: 'Round Wooden Shield',
        category: 'shield',
        tier: 1,
        price: 0,
        stats: { maxShieldBonus: 0 },
        description: 'A wooden shield emblazoned with a golden cross.',
        sprite: {
            bodyColor: '#1e3a8a',
            borderColor: '#fbbf24',
            emblemColor: '#fbbf24',
            emblemStyle: 'cross',
            glowColor: null
        }
    },
    {
        id: 'shield_iron_kite',
        role: 'knight',
        name: 'Steel Kite Shield',
        category: 'shield',
        tier: 2,
        price: 320,
        stats: { maxShieldBonus: 25, defBonus: 3 },
        description: 'A pointed steel shield built to deflect spears and arrows.',
        sprite: {
            bodyColor: '#334155',
            borderColor: '#e2e8f0',
            emblemColor: '#e2e8f0',
            emblemStyle: 'chevron',
            glowColor: null
        }
    },
    {
        id: 'shield_crystal',
        role: 'knight',
        name: 'Azure Crystal Aegis',
        category: 'shield',
        tier: 3,
        price: 1000,
        stats: { maxShieldBonus: 55, defBonus: 8 },
        description: 'A crystalline shield projecting an arcane barrier.',
        sprite: {
            bodyColor: '#0e7490',
            borderColor: '#67e8f9',
            emblemColor: '#ecfeff',
            emblemStyle: 'diamond',
            glowColor: '#00e5ff'
        }
    },
    {
        id: 'shield_dragon_aegis',
        role: 'knight',
        name: 'Dragonbone Aegis',
        category: 'shield',
        tier: 4,
        price: 1600,
        stats: { maxShieldBonus: 85, defBonus: 15 },
        description: 'A legendary shield set with an unblinking dragon eye.',
        sprite: {
            bodyColor: '#7f1d1d',
            borderColor: '#f59e0b',
            emblemColor: '#fbbf24',
            emblemStyle: 'dragon_eye',
            glowColor: '#ff6d00'
        }
    },
    {
        id: 'shield_sculk_bulwark',
        role: 'knight',
        name: 'Sculk Abyssal Bulwark',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3300,
        stats: { maxShieldBonus: 130, defBonus: 25, maxHpBonus: 45 },
        description: 'A towering barrier carved of bedded sculk shrieker core, dampening incoming physical shockwaves.',
        sprite: {
            bodyColor: '#032130',
            borderColor: '#06b6d4',
            emblemColor: '#22d3ee',
            emblemStyle: 'warden_eye',
            glowColor: '#00f5d4'
        }
    },
    {
        id: 'shield_bastion_fortress',
        role: 'knight',
        name: 'Fortress Bastion Tower Shield',
        category: 'shield',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2400,
        stats: { maxShieldBonus: 175, defBonus: 22, atkBonus: 18 },
        description: 'A massive tower shield built to absorb devastating boss shockwaves.',
        sprite: {
            bodyColor: '#1e293b',
            borderColor: '#f59e0b',
            emblemColor: '#fbbf24',
            emblemStyle: 'cross',
            glowColor: '#f59e0b'
        }
    },
    {
        id: 'shield_aegis_of_the_gods',
        role: 'knight',
        name: 'Aegis of the Immortals',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4600,
        stats: { maxShieldBonus: 270, defBonus: 38, atkBonus: 30, maxHpBonus: 70 },
        description: 'Legendary divine buckler that turns aside even god-shattering impacts.',
        sprite: {
            bodyColor: '#0284c7',
            borderColor: '#fbbf24',
            emblemColor: '#ffffff',
            emblemStyle: 'diamond',
            glowColor: '#38bdf8'
        }
    },

    // --- Knight Boots ---
    {
        id: 'boots_leather',
        role: 'knight',
        name: 'Leather Boots',
        category: 'boots',
        tier: 1,
        price: 0,
        stats: { speedBonus: 0 },
        description: 'Comfortable standard leather travel boots.',
        sprite: {
            bootColor: '#1e293b',
            trimColor: '#475569',
            soleColor: '#0f172a',
            accentColor: null
        }
    },
    {
        id: 'boots_swift',
        role: 'knight',
        name: 'Emerald Stride Boots',
        category: 'boots',
        tier: 2,
        price: 350,
        stats: { speedBonus: 0.5 },
        description: 'Agile boots plated with polished emerald.',
        sprite: {
            bootColor: '#065f46',
            trimColor: '#10b981',
            soleColor: '#064e3b',
            accentColor: '#34d399'
        }
    },
    {
        id: 'boots_shadow_step',
        role: 'knight',
        name: 'Shadowstep Greaves',
        category: 'boots',
        tier: 3,
        price: 900,
        stats: { speedBonus: 0.9, defBonus: 4 },
        description: 'Obsidian-plated greaves that muffle all footsteps.',
        sprite: {
            bootColor: '#1e1b4b',
            trimColor: '#7c3aed',
            soleColor: '#0f0a2e',
            accentColor: '#a855f7'
        }
    },
    {
        id: 'boots_dragon_stride',
        role: 'knight',
        name: 'Dragon Knight Treads',
        category: 'boots',
        tier: 4,
        price: 1400,
        stats: { speedBonus: 1.2, atkBonus: 15 },
        description: 'Dragon-claw boots granting powerful thrust and speed.',
        sprite: {
            bootColor: '#7f1d1d',
            trimColor: '#f59e0b',
            soleColor: '#450a0a',
            accentColor: '#fbbf24'
        }
    },
    {
        id: 'boots_sculk_stompers',
        role: 'knight',
        name: 'Deepslate Warden Stompers',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { speedBonus: 0.75, defBonus: 14, maxHpBonus: 50 },
        description: 'Heavy greaves that crush the cavern floor while muting the wearers steps to subterranean predators.',
        sprite: {
            bootColor: '#041824',
            trimColor: '#0891b2',
            soleColor: '#020617',
            accentColor: '#22d3ee'
        }
    },
    {
        id: 'boots_war_striders',
        role: 'knight',
        name: 'Titan War Striders',
        category: 'boots',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2000,
        stats: { speedBonus: 0.8, defBonus: 18, maxHpBonus: 60, maxShieldBonus: 45 },
        description: 'Heavy plated sabatons with pneumatic pistons to maintain high combat mobility.',
        sprite: {
            bootColor: '#1e293b',
            trimColor: '#f59e0b',
            soleColor: '#0f172a',
            accentColor: '#fbbf24'
        }
    },
    {
        id: 'boots_paladin_crusaders',
        role: 'knight',
        name: 'Paladin Crusade Sabatons',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 3800,
        stats: { speedBonus: 1.1, defBonus: 28, maxHpBonus: 110, maxShieldBonus: 80, atkBonus: 20 },
        description: 'Golden crusade boots that allow the knight to dance around boss telegraphs.',
        sprite: {
            bootColor: '#eab308',
            trimColor: '#ffffff',
            soleColor: '#78350f',
            accentColor: '#fde047'
        }
    },

    // --- Knight Capes ---
    {
        id: 'cape_crimson',
        role: 'knight',
        name: 'Crimson Hero Cloak',
        category: 'cape',
        tier: 1,
        price: 0,
        stats: {},
        description: 'A flowing crimson cape symbolizing knightly valor.',
        sprite: {
            mainColor: '#991b1b',
            innerColor: '#dc2626',
            borderColor: null,
            particleColor: null
        }
    },
    {
        id: 'cape_royal_blue',
        role: 'knight',
        name: 'Royal Blue Mantle',
        category: 'cape',
        tier: 2,
        price: 280,
        stats: { defBonus: 3, maxHpBonus: 15 },
        description: 'A deep ocean-blue mantle embroidered with fine gold thread.',
        sprite: {
            mainColor: '#1e3a8a',
            innerColor: '#3b82f6',
            borderColor: '#fbbf24',
            particleColor: null
        }
    },
    {
        id: 'cape_dragon_wings',
        role: 'knight',
        name: 'Dragon Wing Mantle',
        category: 'cape',
        tier: 4,
        price: 1500,
        stats: { atkBonus: 25, defBonus: 10, speedBonus: 0.3 },
        description: 'A flaming dragon-wing cape shedding ember particles.',
        sprite: {
            mainColor: '#7f1d1d',
            innerColor: '#dc2626',
            borderColor: '#f59e0b',
            particleColor: '#ff6d00'
        }
    },
    {
        id: 'cape_sculk_soul_mantle',
        role: 'knight',
        name: 'Sculk Soul-Eater Mantle',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2900,
        stats: { atkBonus: 40, defBonus: 14, maxHpBonus: 55, maxShieldBonus: 35 },
        description: 'A billowing cloak woven from crystallized soul tendrils, feeding energy back into the bearer.',
        sprite: {
            mainColor: '#021e28',
            innerColor: '#0891b2',
            borderColor: '#00f5d4',
            particleColor: '#22d3ee'
        }
    },
    {
        id: 'cape_warlord_banner',
        role: 'knight',
        name: 'Grand Warlord Banner Mantle',
        category: 'cape',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2100,
        stats: { atkBonus: 35, defBonus: 18, maxHpBonus: 90 },
        description: 'A majestic heraldic war-banner cloak worn by kings who conquered ancient dragons.',
        sprite: {
            mainColor: '#7f1d1d',
            innerColor: '#dc2626',
            borderColor: '#fbbf24',
            particleColor: '#f59e0b'
        }
    },
    {
        id: 'cape_radiant_solar_wings',
        role: 'knight',
        name: 'Wings of the Solar Sovereign',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4200,
        stats: { atkBonus: 55, defBonus: 30, maxHpBonus: 140, maxShieldBonus: 70, speedBonus: 0.3 },
        description: 'Golden radiant wings woven of pure stellar energy, warding off death itself.',
        sprite: {
            mainColor: '#b45309',
            innerColor: '#fbbf24',
            borderColor: '#ffffff',
            particleColor: '#fde047'
        }
    },


    // ==========================================
    // ===== MAGE EQUIPMENT =====
    // ==========================================

    // --- Mage Weapons (Wands & Staves) ---
    {
        id: 'weapon_apprentice_wand',
        role: 'mage',
        name: 'Apprentice Wand',
        category: 'weapon',
        tier: 1,
        price: 0,
        stats: { atkBonus: 0 },
        description: 'A wooden focus wand for channeling basic spells.',
        sprite: {
            bladeColor: '#8b5cf6',
            bladeHighlight: '#c4b5fd',
            bladeShadow: '#6d28d9',
            crossguardColor: '#fbbf24',
            gripColor: '#581c87',
            pommelColor: '#a855f7',
            bladeLength: 25,
            glowColor: '#a855f7',
            tipStyle: 'crystal'
        }
    },
    {
        id: 'weapon_crystal_wand',
        role: 'mage',
        name: 'Sapphire Crystal Wand',
        category: 'weapon',
        tier: 1,
        price: 150,
        stats: { atkBonus: 12, maxShieldBonus: 10 },
        description: 'Topped with a mana-absorbing sapphire crystal.',
        sprite: {
            bladeColor: '#38bdf8',
            bladeHighlight: '#bae6fd',
            bladeShadow: '#0284c7',
            crossguardColor: '#0ea5e9',
            gripColor: '#0c4a6e',
            pommelColor: '#38bdf8',
            bladeLength: 27,
            glowColor: '#00e5ff',
            tipStyle: 'crystal'
        }
    },
    {
        id: 'weapon_fire_staff',
        role: 'mage',
        name: 'Inferno Staff',
        category: 'weapon',
        tier: 2,
        price: 480,
        stats: { atkBonus: 28 },
        description: 'Calls down searing meteor embers upon foes.',
        sprite: {
            bladeColor: '#f97316',
            bladeHighlight: '#fdba74',
            bladeShadow: '#c2410c',
            crossguardColor: '#ef4444',
            gripColor: '#7c2d12',
            pommelColor: '#ff6d00',
            bladeLength: 30,
            glowColor: '#ff3d00',
            tipStyle: 'flame'
        }
    },
    {
        id: 'weapon_thunder_staff',
        role: 'mage',
        name: 'Thunderbolt Staff',
        category: 'weapon',
        tier: 3,
        price: 1150,
        stats: { atkBonus: 45, speedBonus: 0.3 },
        description: 'Pulses with high-voltage electricity that shatters stone.',
        sprite: {
            bladeColor: '#fbbf24',
            bladeHighlight: '#fef08a',
            bladeShadow: '#d97706',
            crossguardColor: '#eab308',
            gripColor: '#713f12',
            pommelColor: '#fde047',
            bladeLength: 33,
            glowColor: '#facc15',
            tipStyle: 'sharp'
        }
    },
    {
        id: 'weapon_cosmic_archstaff',
        role: 'mage',
        name: 'Cosmic Archstaff',
        category: 'weapon',
        tier: 4,
        price: 1800,
        stats: { atkBonus: 80, maxHpBonus: 25 },
        description: 'A mythical weapon wielded by Archmages of time and space.',
        sprite: {
            bladeColor: '#ec4899',
            bladeHighlight: '#fbcfe8',
            bladeShadow: '#be185d',
            crossguardColor: '#c084fc',
            gripColor: '#4a044e',
            pommelColor: '#f472b6',
            bladeLength: 37,
            glowColor: '#e879f9',
            tipStyle: 'dragon'
        }
    },
    {
        id: 'weapon_frost_snow_staff',
        role: 'mage',
        name: 'Eternal Snow Staff',
        category: 'weapon',
        tier: 4,
        price: 2000,
        isExclusive: true,
        stats: { atkBonus: 92, maxShieldBonus: 45, speedBonus: 0.3 },
        description: 'Permafrost crystal staff that fires piercing frost snowballs! Roulette exclusive!',
        sprite: {
            bladeColor: '#bae6fd',
            bladeHighlight: '#ffffff',
            bladeShadow: '#38bdf8',
            crossguardColor: '#7dd3fc',
            gripColor: '#0284c7',
            pommelColor: '#0ea5e9',
            bladeLength: 36,
            glowColor: '#00e5ff',
            tipStyle: 'snow'
        }
    },
    {
        id: 'weapon_sculk_abyssal_staff',
        role: 'mage',
        name: 'Sculk Abyssal Sonic Staff',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3800,
        stats: { atkBonus: 145, maxShieldBonus: 85, maxHpBonus: 40 },
        description: 'Mounted with a pulsating Shrieker core, firing lethal concentrated sonic soul-bursts.',
        sprite: {
            bladeColor: '#0891b2',
            bladeHighlight: '#67e8f9',
            bladeShadow: '#042f2e',
            crossguardColor: '#0e7490',
            gripColor: '#020617',
            pommelColor: '#00f5d4',
            bladeLength: 40,
            glowColor: '#00f5d4',
            tipStyle: 'sculk_orb'
        }
    },
    {
        id: 'weapon_solar_annihilator',
        role: 'mage',
        name: 'Solar Flare Annihilator Staff',
        category: 'weapon',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2700,
        stats: { atkBonus: 135, maxShieldBonus: 55, defBonus: 12 },
        description: 'Channels thermonuclear solar flares that burn straight through boss defenses.',
        sprite: {
            bladeColor: '#f97316',
            bladeHighlight: '#fef08a',
            bladeShadow: '#c2410c',
            crossguardColor: '#ea580c',
            gripColor: '#431407',
            pommelColor: '#fbbf24',
            bladeLength: 40,
            glowColor: '#ff6d00',
            tipStyle: 'flame'
        }
    },
    {
        id: 'weapon_singularity_void_orb_staff',
        role: 'mage',
        name: 'Staff of the Void Singularity',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5400,
        stats: { atkBonus: 205, maxShieldBonus: 110, defBonus: 22, maxHpBonus: 60 },
        description: 'Houses a miniature black hole singularity at its crown, crushing boss matter into oblivion.',
        sprite: {
            bladeColor: '#7c3aed',
            bladeHighlight: '#38bdf8',
            bladeShadow: '#1e1b4b',
            crossguardColor: '#4f46e5',
            gripColor: '#0f172a',
            pommelColor: '#06b6d4',
            bladeLength: 44,
            glowColor: '#a855f7',
            tipStyle: 'crystal'
        }
    },

    // --- Mage Armor (Robes) ---
    {
        id: 'armor_apprentice_robe',
        role: 'mage',
        name: 'Apprentice Silk Robe',
        category: 'armor',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'A simple woven robe worn by academy initiates.',
        sprite: {
            bodyColor: '#4c1d95',
            plateColor: '#7c3aed',
            highlightColor: '#c4b5fd',
            trimColor: '#fbbf24',
            pauldronColor: '#6d28d9',
            pauldronHighlight: '#a78bfa',
            crestStyle: 'cross'
        }
    },
    {
        id: 'armor_mystic_robe',
        role: 'mage',
        name: 'Mystic Weave Robe',
        category: 'armor',
        tier: 2,
        price: 450,
        stats: { defBonus: 6, maxShieldBonus: 30 },
        description: 'Woven with protective wards against hostile incantations.',
        sprite: {
            bodyColor: '#0c4a6e',
            plateColor: '#0284c7',
            highlightColor: '#7dd3fc',
            trimColor: '#38bdf8',
            pauldronColor: '#0369a1',
            pauldronHighlight: '#bae6fd',
            crestStyle: 'royal'
        }
    },
    {
        id: 'armor_elemental_robe',
        role: 'mage',
        name: 'Elemental Sovereign Robe',
        category: 'armor',
        tier: 3,
        price: 1200,
        stats: { defBonus: 12, maxHpBonus: 35, atkBonus: 16 },
        description: 'Vibrates with primordial fire, water, and wind power.',
        sprite: {
            bodyColor: '#701a75',
            plateColor: '#c026d3',
            highlightColor: '#f0abfc',
            trimColor: '#fbbf24',
            pauldronColor: '#a21caf',
            pauldronHighlight: '#e879f9',
            crestStyle: 'chain'
        }
    },
    {
        id: 'armor_archmage_vestment',
        role: 'mage',
        name: 'Eternal Archmage Vestments',
        category: 'armor',
        tier: 4,
        price: 1900,
        stats: { defBonus: 22, maxHpBonus: 70, maxShieldBonus: 50 },
        description: 'Legendary vestments retrieved from the highest spire.',
        sprite: {
            bodyColor: '#312e81',
            plateColor: '#4338ca',
            highlightColor: '#a5b4fc',
            trimColor: '#f59e0b',
            pauldronColor: '#3730a3',
            pauldronHighlight: '#c7d2fe',
            crestStyle: 'dragon'
        }
    },
    {
        id: 'armor_sculk_void_robe',
        role: 'mage',
        name: 'Sculk Voidweaver Robe',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3700,
        stats: { defBonus: 28, maxShieldBonus: 140, maxHpBonus: 80 },
        description: 'Silken abyssal fabric entwined with living sculk veins that absorb hostile arcane impacts.',
        sprite: {
            bodyColor: '#021827',
            plateColor: '#083344',
            highlightColor: '#00f5d4',
            trimColor: '#22d3ee',
            pauldronColor: '#0e7490',
            pauldronHighlight: '#a5f3fc',
            crestStyle: 'warden_heart'
        }
    },
    {
        id: 'armor_archon_astral_vestment',
        role: 'mage',
        name: 'Vestment of the Astral Archon',
        category: 'armor',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { defBonus: 36, maxHpBonus: 130, maxShieldBonus: 110, atkBonus: 26 },
        description: 'Woven from compressed nebula dust to form an impenetrable arcane barrier.',
        sprite: {
            bodyColor: '#1e1b4b',
            plateColor: '#6366f1',
            highlightColor: '#a5b4fc',
            trimColor: '#f472b6',
            pauldronColor: '#4338ca',
            pauldronHighlight: '#818cf8',
            crestStyle: 'cross'
        }
    },
    {
        id: 'armor_chrono_god_robe',
        role: 'mage',
        name: 'Chrono Sovereign God-Robe',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5200,
        stats: { defBonus: 54, maxHpBonus: 210, maxShieldBonus: 180, atkBonus: 48 },
        description: 'Manipulates time dilation around the wearer, softening incoming boss strikes to a whisper.',
        sprite: {
            bodyColor: '#0f172a',
            plateColor: '#7c3aed',
            highlightColor: '#06b6d4',
            trimColor: '#fde047',
            pauldronColor: '#2e1065',
            pauldronHighlight: '#a855f7',
            crestStyle: 'dragon'
        }
    },

    // --- Mage Helmet (Hats & Cowls) ---
    {
        id: 'helmet_wizard_hat',
        role: 'mage',
        name: 'Pointed Wizard Hat',
        category: 'helmet',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'Traditional pointed hat of the academy scholars.',
        sprite: {
            domeColor: '#581c87',
            domeHighlight: '#9333ea',
            visorColor: '#1e1b4b',
            eyeColor: '#c084fc',
            plumeColor: '#fbbf24',
            plumeHighlight: '#fde047',
            plumeStyle: 'crown'
        }
    },
    {
        id: 'helmet_mystic_cowl',
        role: 'mage',
        name: 'Indigo Mist Cowl',
        category: 'helmet',
        tier: 2,
        price: 360,
        stats: { defBonus: 4, maxShieldBonus: 20 },
        description: 'A shrouded cowl warding off psychic assaults.',
        sprite: {
            domeColor: '#1e3a8a',
            domeHighlight: '#2563eb',
            visorColor: '#0f172a',
            eyeColor: '#38bdf8',
            plumeColor: '#60a5fa',
            plumeHighlight: '#93c5fd',
            plumeStyle: 'feather'
        }
    },
    {
        id: 'helmet_astral_crown',
        role: 'mage',
        name: 'Astral Star Tiara',
        category: 'helmet',
        tier: 4,
        price: 1500,
        stats: { defBonus: 15, atkBonus: 28 },
        description: 'A floating tiara crowned with brilliant diamonds.',
        sprite: {
            domeColor: '#831843',
            domeHighlight: '#db2777',
            visorColor: '#1f2937',
            eyeColor: '#fbbf24',
            plumeColor: '#f43f5e',
            plumeHighlight: '#fda4af',
            plumeStyle: 'dragon_horns'
        }
    },
    {
        id: 'helmet_sculk_sensor_crown',
        role: 'mage',
        name: 'Sculk Sensor Crown',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3000,
        stats: { atkBonus: 48, maxShieldBonus: 80, defBonus: 12 },
        description: 'A circlet of twitching tendril sensors that magnifies spell resonance across infinite dark caverns.',
        sprite: {
            domeColor: '#041f2d',
            domeHighlight: '#06b6d4',
            visorColor: '#020617',
            eyeColor: '#00f5d4',
            plumeColor: '#22d3ee',
            plumeHighlight: '#e0f2fe',
            plumeStyle: 'sculk_sensors'
        }
    },
    {
        id: 'helmet_solar_corona_diadem',
        role: 'mage',
        name: 'Diadem of the Solar Corona',
        category: 'helmet',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2200,
        stats: { defBonus: 22, maxShieldBonus: 75, atkBonus: 26, maxHpBonus: 40 },
        description: 'A fiery crown radiating high-temperature plasma to shield the caster mind.',
        sprite: {
            domeColor: '#ea580c',
            domeHighlight: '#fde047',
            visorColor: '#431407',
            eyeColor: '#fbbf24',
            plumeColor: '#f97316',
            plumeHighlight: '#fed7aa',
            plumeStyle: 'crown'
        }
    },
    {
        id: 'helmet_crown_of_supernova',
        role: 'mage',
        name: 'Supernova Sovereign Crown',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4300,
        stats: { defBonus: 36, maxShieldBonus: 135, atkBonus: 42, maxHpBonus: 80 },
        description: 'A cosmic diadem surging with the destructive energy of an exploding supernova.',
        sprite: {
            domeColor: '#4c1d95',
            domeHighlight: '#e879f9',
            visorColor: '#0f172a',
            eyeColor: '#00f5d4',
            plumeColor: '#c084fc',
            plumeHighlight: '#ffffff',
            plumeStyle: 'feather'
        }
    },

    // --- Mage Shield / Offhand (Orbs & Grimoires) ---
    {
        id: 'shield_magic_orb',
        role: 'mage',
        name: 'Novice Crystal Orb',
        category: 'shield',
        tier: 1,
        price: 0,
        stats: { maxShieldBonus: 0 },
        description: 'A focusing orb generating a protective arcane barrier.',
        sprite: {
            bodyColor: '#4338ca',
            borderColor: '#a5b4fc',
            emblemColor: '#818cf8',
            emblemStyle: 'diamond',
            glowColor: '#6366f1'
        }
    },
    {
        id: 'shield_ancient_grimoire',
        role: 'mage',
        name: 'Ancient Grimoire',
        category: 'shield',
        tier: 2,
        price: 380,
        stats: { maxShieldBonus: 30, atkBonus: 5 },
        description: 'A floating ancient spellbook warding its bearer.',
        sprite: {
            bodyColor: '#701a75',
            borderColor: '#f472b6',
            emblemColor: '#fbbf24',
            emblemStyle: 'cross',
            glowColor: '#d946ef'
        }
    },
    {
        id: 'shield_cosmic_nova_orb',
        role: 'mage',
        name: 'Cosmic Nova Relic',
        category: 'shield',
        tier: 4,
        price: 1600,
        stats: { maxShieldBonus: 80, atkBonus: 14, defBonus: 8 },
        description: 'A miniature singularity relic swallowing incoming attacks.',
        sprite: {
            bodyColor: '#0369a1',
            borderColor: '#38bdf8',
            emblemColor: '#fbbf24',
            emblemStyle: 'dragon_eye',
            glowColor: '#0ea5e9'
        }
    },
    {
        id: 'shield_sculk_soul_orb',
        role: 'mage',
        name: 'Sculk Resonance Soul Orb',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3300,
        stats: { maxShieldBonus: 160, defBonus: 20, atkBonus: 14 },
        description: 'An echoing sphere of trapped souls spinning in harmonic balance, generating impenetrable barriers.',
        sprite: {
            bodyColor: '#02202f',
            borderColor: '#06b6d4',
            emblemColor: '#00f5d4',
            emblemStyle: 'dragon_eye',
            glowColor: '#22d3ee'
        }
    },
    {
        id: 'shield_supernova_barrier',
        role: 'mage',
        name: 'Supernova Resonance Orb',
        category: 'shield',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2400,
        stats: { maxShieldBonus: 190, defBonus: 20, atkBonus: 25 },
        description: 'An orbiting miniature star that absorbs massive boss spells and unleashes shockwave ripples.',
        sprite: {
            bodyColor: '#ea580c',
            borderColor: '#fde047',
            emblemColor: '#ffffff',
            emblemStyle: 'diamond',
            glowColor: '#ff6d00'
        }
    },
    {
        id: 'shield_omniscient_void_matrix',
        role: 'mage',
        name: 'Matrix of the Void Architect',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4700,
        stats: { maxShieldBonus: 285, defBonus: 34, atkBonus: 45, maxHpBonus: 60 },
        description: 'An ancient artifact that creates a dimensional singularity barrier around the mage.',
        sprite: {
            bodyColor: '#3b0764',
            borderColor: '#06b6d4',
            emblemColor: '#e879f9',
            emblemStyle: 'diamond',
            glowColor: '#a855f7'
        }
    },

    // --- Mage Boots ---
    {
        id: 'boots_cloth_shoes',
        role: 'mage',
        name: 'Silken Slippers',
        category: 'boots',
        tier: 1,
        price: 0,
        stats: { speedBonus: 0 },
        description: 'Weightless footwear ensuring silent incantations.',
        sprite: {
            bootColor: '#2e1065',
            trimColor: '#7c3aed',
            soleColor: '#1e1b4b',
            accentColor: null
        }
    },
    {
        id: 'boots_dimension_stride',
        role: 'mage',
        name: 'Dimensional Striders',
        category: 'boots',
        tier: 3,
        price: 950,
        stats: { speedBonus: 1.0, maxShieldBonus: 20 },
        description: 'Boots enabling micro-teleportation with every stride.',
        sprite: {
            bootColor: '#0c4a6e',
            trimColor: '#0284c7',
            soleColor: '#082f49',
            accentColor: '#38bdf8'
        }
    },
    {
        id: 'boots_sculk_echo_treads',
        role: 'mage',
        name: 'Sculk Echo Treads',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { speedBonus: 0.85, maxShieldBonus: 65, defBonus: 10 },
        description: 'Footwear that converts footsteps into silent vibrations, allowing swift movement without aggroing creatures.',
        sprite: {
            bootColor: '#031c2b',
            trimColor: '#06b6d4',
            soleColor: '#010c14',
            accentColor: '#00f5d4'
        }
    },
    {
        id: 'boots_aether_gliders',
        role: 'mage',
        name: 'Aetherial Glider Slippers',
        category: 'boots',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2000,
        stats: { speedBonus: 1.1, maxShieldBonus: 65, defBonus: 15, atkBonus: 16 },
        description: 'Enables frictionless floating across hazardous boss arenas and telegraph zones.',
        sprite: {
            bootColor: '#312e81',
            trimColor: '#38bdf8',
            soleColor: '#1e1b4b',
            accentColor: '#67e8f9'
        }
    },
    {
        id: 'boots_astral_warp_walkers',
        role: 'mage',
        name: 'Astral Warp Striders',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 3900,
        stats: { speedBonus: 1.45, maxShieldBonus: 120, defBonus: 26, atkBonus: 30, maxHpBonus: 60 },
        description: 'Phase-shifts the mage across space, making boss telegraph avoidance effortless.',
        sprite: {
            bootColor: '#4c1d95',
            trimColor: '#fde047',
            soleColor: '#2e1065',
            accentColor: '#00f5d4'
        }
    },

    // --- Mage Capes ---
    {
        id: 'cape_mystic_cloak',
        role: 'mage',
        name: 'Violet Astral Cloak',
        category: 'cape',
        tier: 1,
        price: 0,
        stats: {},
        description: 'A billowing cloak scented with mystical incense.',
        sprite: {
            mainColor: '#4c1d95',
            innerColor: '#7c3aed',
            borderColor: '#c4b5fd',
            particleColor: '#a855f7'
        }
    },
    {
        id: 'cape_eternal_nebula',
        role: 'mage',
        name: 'Eternal Nebula Shawl',
        category: 'cape',
        tier: 4,
        price: 1500,
        stats: { defBonus: 10, atkBonus: 28, maxShieldBonus: 40 },
        description: 'Glows with the swirling starlight of falling nebulae.',
        sprite: {
            mainColor: '#1e1b4b',
            innerColor: '#4338ca',
            borderColor: '#a855f7',
            particleColor: '#00e5ff'
        }
    },
    {
        id: 'cape_sculk_tendril_cloak',
        role: 'mage',
        name: 'Sculk Tendril Cloak',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2900,
        stats: { atkBonus: 50, maxShieldBonus: 75, defBonus: 12 },
        description: 'Tendrils of deep sculk ripple across this mantle, continuously humming with high-frequency soul power.',
        sprite: {
            mainColor: '#011c27',
            innerColor: '#0e7490',
            borderColor: '#22d3ee',
            particleColor: '#00f5d4'
        }
    },
    {
        id: 'cape_celestial_aurora',
        role: 'mage',
        name: 'Aurora Borealis Shroud',
        category: 'cape',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2100,
        stats: { atkBonus: 38, defBonus: 18, maxShieldBonus: 85, maxHpBonus: 45 },
        description: 'A flowing cape of prismatic astral lights that reflects enemy projectiles.',
        sprite: {
            mainColor: '#0369a1',
            innerColor: '#06b6d4',
            borderColor: '#67e8f9',
            particleColor: '#a5f3fc'
        }
    },
    {
        id: 'cape_singularity_infinite_shroud',
        role: 'mage',
        name: 'Singularity Infinite Shroud',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4400,
        stats: { atkBonus: 62, defBonus: 30, maxShieldBonus: 150, maxHpBonus: 85, speedBonus: 0.3 },
        description: 'A mantle woven of raw event horizon ribbons, amplifying all spell destructive potency.',
        sprite: {
            mainColor: '#1e1b4b',
            innerColor: '#581c87',
            borderColor: '#f472b6',
            particleColor: '#c084fc'
        }
    },


    // ==========================================
    // ===== ASSASSIN EQUIPMENT =====
    // ==========================================

    // --- Assassin Weapons (Dual Daggers & Claws) ---
    {
        id: 'weapon_twin_daggers',
        role: 'assassin',
        name: 'Rusty Twin Daggers',
        category: 'weapon',
        tier: 1,
        price: 0,
        stats: { atkBonus: 0 },
        description: 'A pair of weathered daggers favored by novice rogues.',
        sprite: {
            bladeColor: '#64748b',
            bladeHighlight: '#cbd5e1',
            bladeShadow: '#334155',
            crossguardColor: '#1e293b',
            gripColor: '#0f172a',
            pommelColor: '#475569',
            bladeLength: 20,
            glowColor: null,
            tipStyle: 'sharp'
        }
    },
    {
        id: 'weapon_steel_stilettos',
        role: 'assassin',
        name: 'Black Steel Stilettos',
        category: 'weapon',
        tier: 1,
        price: 150,
        stats: { atkBonus: 10, speedBonus: 0.2 },
        description: 'Slender, piercing daggers crafted to slip between armor plates.',
        sprite: {
            bladeColor: '#94a3b8',
            bladeHighlight: '#f1f5f9',
            bladeShadow: '#475569',
            crossguardColor: '#0f172a',
            gripColor: '#1e293b',
            pommelColor: '#10b981',
            bladeLength: 22,
            glowColor: null,
            tipStyle: 'sharp'
        }
    },
    {
        id: 'weapon_venom_fang',
        role: 'assassin',
        name: 'Venomous Viper Fang',
        category: 'weapon',
        tier: 2,
        price: 460,
        stats: { atkBonus: 26, speedBonus: 0.3 },
        description: 'Coated in deadly viper venom that weakens prey.',
        sprite: {
            bladeColor: '#10b981',
            bladeHighlight: '#6ee7b7',
            bladeShadow: '#047857',
            crossguardColor: '#064e3b',
            gripColor: '#022c22',
            pommelColor: '#34d399',
            bladeLength: 23,
            glowColor: '#10b981',
            tipStyle: 'crystal'
        }
    },
    {
        id: 'weapon_shadow_claws',
        role: 'assassin',
        name: 'Phantom Shadow Claws',
        category: 'weapon',
        tier: 3,
        price: 1100,
        stats: { atkBonus: 45, speedBonus: 0.5 },
        description: 'Lethal claws that slice through the dark without a sound.',
        sprite: {
            bladeColor: '#4338ca',
            bladeHighlight: '#818cf8',
            bladeShadow: '#1e1b4b',
            crossguardColor: '#312e81',
            gripColor: '#0f172a',
            pommelColor: '#c084fc',
            bladeLength: 26,
            glowColor: '#818cf8',
            tipStyle: 'sharp'
        }
    },
    {
        id: 'weapon_phantom_deathblades',
        role: 'assassin',
        name: 'Phantom Deathblades',
        category: 'weapon',
        tier: 4,
        price: 1800,
        stats: { atkBonus: 78, speedBonus: 0.8 },
        description: 'Executioner blades forged in the deepest abyss.',
        sprite: {
            bladeColor: '#dc2626',
            bladeHighlight: '#f87171',
            bladeShadow: '#991b1b',
            crossguardColor: '#450a0a',
            gripColor: '#000000',
            pommelColor: '#ef4444',
            bladeLength: 28,
            glowColor: '#ef4444',
            tipStyle: 'dragon'
        }
    },
    {
        id: 'weapon_candy_cane_daggers',
        role: 'assassin',
        name: 'Candy Cane Daggers',
        category: 'weapon',
        tier: 4,
        price: 2000,
        isExclusive: true,
        stats: { atkBonus: 90, speedBonus: 0.9, defBonus: 6 },
        description: 'Pointed red-and-white striped festive daggers with sweet lethal sparks! Roulette exclusive!',
        sprite: {
            bladeColor: '#ef4444',
            bladeHighlight: '#ffffff',
            bladeShadow: '#b91c1c',
            crossguardColor: '#ffffff',
            gripColor: '#dc2626',
            pommelColor: '#ffffff',
            bladeLength: 26,
            glowColor: '#ff1744',
            tipStyle: 'candy_cane'
        }
    },
    {
        id: 'weapon_sculk_soul_daggers',
        role: 'assassin',
        name: 'Sculk Silent Twin Daggers',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3800,
        stats: { atkBonus: 140, speedBonus: 0.95, defBonus: 10 },
        description: 'Double daggers made from petrified deepslate dipped in sculk venom, striking with absolute silence.',
        sprite: {
            bladeColor: '#06b6d4',
            bladeHighlight: '#a5f3fc',
            bladeShadow: '#042f2e',
            crossguardColor: '#083344',
            gripColor: '#020617',
            pommelColor: '#00f5d4',
            bladeLength: 30,
            glowColor: '#00f5d4',
            tipStyle: 'sculk'
        }
    },
    {
        id: 'weapon_eclipse_twin_scythes',
        role: 'assassin',
        name: 'Eclipse Dread Twin Scythes',
        category: 'weapon',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2700,
        stats: { atkBonus: 130, speedBonus: 0.95, defBonus: 14, maxHpBonus: 45 },
        description: 'Curved crescent blades bathed in eclipse shadow that bypass tough boss carapaces.',
        sprite: {
            bladeColor: '#e11d48',
            bladeHighlight: '#fecdd3',
            bladeShadow: '#881337',
            crossguardColor: '#4c0519',
            gripColor: '#000000',
            pommelColor: '#fb7185',
            bladeLength: 30,
            glowColor: '#f43f5e',
            tipStyle: 'dragon'
        }
    },
    {
        id: 'weapon_god_slayer_daggers',
        role: 'assassin',
        name: 'God-Slayer Abyssal Fangs',
        category: 'weapon',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5300,
        stats: { atkBonus: 200, speedBonus: 1.35, defBonus: 22, maxHpBonus: 85 },
        description: 'Twin daggers forged from primordial venom glands capable of felling colossal deities in seconds.',
        sprite: {
            bladeColor: '#10b981',
            bladeHighlight: '#ecfdf5',
            bladeShadow: '#064e3b',
            crossguardColor: '#022c22',
            gripColor: '#0f172a',
            pommelColor: '#34d399',
            bladeLength: 32,
            glowColor: '#10b981',
            tipStyle: 'sharp'
        }
    },

    // --- Assassin Armor (Leather & Shadowsuits) ---
    {
        id: 'armor_leather_vest',
        role: 'assassin',
        name: 'Light Leather Vest',
        category: 'armor',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'Flexible leather vest tailored for maximum agility.',
        sprite: {
            bodyColor: '#18181b',
            plateColor: '#27272a',
            highlightColor: '#52525b',
            trimColor: '#10b981',
            pauldronColor: '#3f3f46',
            pauldronHighlight: '#71717a',
            crestStyle: 'skull'
        }
    },
    {
        id: 'armor_night_stalker',
        role: 'assassin',
        name: 'Nightstalker Garb',
        category: 'armor',
        tier: 2,
        price: 420,
        stats: { defBonus: 5, speedBonus: 0.3, maxHpBonus: 20 },
        description: 'Carbon-weave leather treated to absorb all reflected light.',
        sprite: {
            bodyColor: '#064e3b',
            plateColor: '#047857',
            highlightColor: '#34d399',
            trimColor: '#6ee7b7',
            pauldronColor: '#065f46',
            pauldronHighlight: '#10b981',
            crestStyle: 'chain'
        }
    },
    {
        id: 'armor_phantom_suit',
        role: 'assassin',
        name: 'Phantom Shadowsuit',
        category: 'armor',
        tier: 4,
        price: 1900,
        stats: { defBonus: 18, atkBonus: 28, speedBonus: 0.6, maxHpBonus: 60 },
        description: 'Conceals the heartbeat and physical silhouette of its wearer.',
        sprite: {
            bodyColor: '#1e1b4b',
            plateColor: '#312e81',
            highlightColor: '#6366f1',
            trimColor: '#ef4444',
            pauldronColor: '#4338ca',
            pauldronHighlight: '#818cf8',
            crestStyle: 'skull'
        }
    },
    {
        id: 'armor_sculk_stalker_vest',
        role: 'assassin',
        name: 'Sculk Stalker Stealthsuit',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3700,
        stats: { defBonus: 28, speedBonus: 0.8, maxHpBonus: 90, maxShieldBonus: 55 },
        description: 'Lightweight chitinous armor that dampens all auditory and visual footprint in pitch darkness.',
        sprite: {
            bodyColor: '#031926',
            plateColor: '#083344',
            highlightColor: '#22d3ee',
            trimColor: '#00f5d4',
            pauldronColor: '#0e7490',
            pauldronHighlight: '#67e8f9',
            crestStyle: 'skull'
        }
    },
    {
        id: 'armor_dread_shadow_carapace',
        role: 'assassin',
        name: 'Dread Shadow Phantom Garb',
        category: 'armor',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { defBonus: 38, maxHpBonus: 150, maxShieldBonus: 65, atkBonus: 32, speedBonus: 0.6 },
        description: 'Flexible shadowweave weave that absorbs crushing blows and converts them into kinetic speed.',
        sprite: {
            bodyColor: '#18181b',
            plateColor: '#3f3f46',
            highlightColor: '#a1a1aa',
            trimColor: '#ef4444',
            pauldronColor: '#27272a',
            pauldronHighlight: '#71717a',
            crestStyle: 'skull'
        }
    },
    {
        id: 'armor_abyssal_reaper_shroud',
        role: 'assassin',
        name: 'Abyssal Reaper Exoskeleton',
        category: 'armor',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 5100,
        stats: { defBonus: 56, maxHpBonus: 230, maxShieldBonus: 120, atkBonus: 55, speedBonus: 0.9 },
        description: 'Biomechanical chitin of the void reaper that provides unmatched defense without slowing movement.',
        sprite: {
            bodyColor: '#09090b',
            plateColor: '#10b981',
            highlightColor: '#6ee7b7',
            trimColor: '#f43f5e',
            pauldronColor: '#064e3b',
            pauldronHighlight: '#34d399',
            crestStyle: 'skull'
        }
    },

    // --- Assassin Helmet (Masks & Hoods) ---
    {
        id: 'helmet_ninja_mask',
        role: 'assassin',
        name: 'Shadow Shinobi Mask',
        category: 'helmet',
        tier: 1,
        price: 0,
        stats: { defBonus: 0 },
        description: 'A black face-covering revealing only piercing eyes.',
        sprite: {
            domeColor: '#18181b',
            domeHighlight: '#27272a',
            visorColor: '#09090b',
            eyeColor: '#10b981',
            plumeColor: '#10b981',
            plumeHighlight: '#34d399',
            plumeStyle: 'feather'
        }
    },
    {
        id: 'helmet_shadow_hood',
        role: 'assassin',
        name: 'Dark Night Hood',
        category: 'helmet',
        tier: 2,
        price: 350,
        stats: { defBonus: 4, speedBonus: 0.2 },
        description: 'A shadowy hood obscuring the outline of the head.',
        sprite: {
            domeColor: '#022c22',
            domeHighlight: '#065f46',
            visorColor: '#000000',
            eyeColor: '#34d399',
            plumeColor: null,
            plumeHighlight: null,
            plumeStyle: 'horns'
        }
    },
    {
        id: 'helmet_reaper_mask',
        role: 'assassin',
        name: 'Grim Reaper Mask',
        category: 'helmet',
        tier: 4,
        price: 1500,
        stats: { defBonus: 14, atkBonus: 24, speedBonus: 0.4 },
        description: 'A blood-etched skull mask radiating sheer dread.',
        sprite: {
            domeColor: '#450a0a',
            domeHighlight: '#991b1b',
            visorColor: '#000000',
            eyeColor: '#ef4444',
            plumeColor: '#dc2626',
            plumeHighlight: '#f87171',
            plumeStyle: 'dragon_horns'
        }
    },
    {
        id: 'helmet_sculk_blindfold_mask',
        role: 'assassin',
        name: 'Sculk Blind Hunter Mask',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3000,
        stats: { atkBonus: 50, speedBonus: 0.5, defBonus: 14 },
        description: 'Replaces normal sight with sculk-echolocation, pinpointing enemy weaknesses instantly in combat.',
        sprite: {
            domeColor: '#021724',
            domeHighlight: '#0e7490',
            visorColor: '#000000',
            eyeColor: '#00f5d4',
            plumeColor: '#06b6d4',
            plumeHighlight: '#22d3ee',
            plumeStyle: 'sculk_sensors'
        }
    },
    {
        id: 'helmet_phantom_executioner_cowl',
        role: 'assassin',
        name: 'Executioner Phantom Cowl',
        category: 'helmet',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2200,
        stats: { defBonus: 24, maxHpBonus: 75, atkBonus: 30, speedBonus: 0.4 },
        description: 'Cowl inscribed with assassination marks, revealing boss weak points.',
        sprite: {
            domeColor: '#18181b',
            domeHighlight: '#3f3f46',
            visorColor: '#09090b',
            eyeColor: '#ef4444',
            plumeColor: '#b91c1c',
            plumeHighlight: '#f87171',
            plumeStyle: 'horns'
        }
    },
    {
        id: 'helmet_crown_of_the_abyss',
        role: 'assassin',
        name: 'Crown of the Abyssal Assassin',
        category: 'helmet',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4300,
        stats: { defBonus: 38, maxHpBonus: 125, atkBonus: 52, speedBonus: 0.6, maxShieldBonus: 45 },
        description: 'Spiked obsidian mask that grants true supernatural executioner instincts.',
        sprite: {
            domeColor: '#09090b',
            domeHighlight: '#10b981',
            visorColor: '#022c22',
            eyeColor: '#34d399',
            plumeColor: '#059669',
            plumeHighlight: '#6ee7b7',
            plumeStyle: 'crown'
        }
    },

    // --- Assassin Shield / Offhand (Parrying Daggers & Armguards) ---
    {
        id: 'shield_parrying_dagger',
        role: 'assassin',
        name: 'Left Parrying Dagger',
        category: 'shield',
        tier: 1,
        price: 0,
        stats: { maxShieldBonus: 0 },
        description: 'An off-hand dagger designed to deflect enemy strikes.',
        sprite: {
            bodyColor: '#18181b',
            borderColor: '#10b981',
            emblemColor: '#34d399',
            emblemStyle: 'chevron',
            glowColor: null
        }
    },
    {
        id: 'shield_steel_shuriken',
        role: 'assassin',
        name: 'Steel Deflector Shuriken',
        category: 'shield',
        tier: 2,
        price: 360,
        stats: { maxShieldBonus: 20, atkBonus: 6 },
        description: 'A heavy bladed star used to parry and riposte.',
        sprite: {
            bodyColor: '#1e293b',
            borderColor: '#94a3b8',
            emblemColor: '#f1f5f9',
            emblemStyle: 'diamond',
            glowColor: null
        }
    },
    {
        id: 'shield_shadow_guard',
        role: 'assassin',
        name: 'Phantom Claw Aegis',
        category: 'shield',
        tier: 4,
        price: 1600,
        stats: { maxShieldBonus: 75, atkBonus: 12, defBonus: 8 },
        description: 'Armguard fitted with curved razor claws for high deflection.',
        sprite: {
            bodyColor: '#0f172a',
            borderColor: '#dc2626',
            emblemColor: '#ef4444',
            emblemStyle: 'dragon_eye',
            glowColor: '#ef4444'
        }
    },
    {
        id: 'shield_sculk_sonic_claw',
        role: 'assassin',
        name: 'Sculk Sonic Deflector Claw',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 3300,
        stats: { maxShieldBonus: 95, defBonus: 22, speedBonus: 0.45, atkBonus: 14 },
        description: 'Armguard equipped with vibrating sculk blades capable of parrying strikes and discharging sonic bursts.',
        sprite: {
            bodyColor: '#041f2d',
            borderColor: '#06b6d4',
            emblemColor: '#22d3ee',
            emblemStyle: 'dragon_eye',
            glowColor: '#00f5d4'
        }
    },
    {
        id: 'shield_void_parry_buckler',
        role: 'assassin',
        name: 'Void Deflector Buckler',
        category: 'shield',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2400,
        stats: { maxShieldBonus: 180, defBonus: 22, atkBonus: 30, speedBonus: 0.4 },
        description: 'A razor-edged parrying buckler designed to counter heavy boss swings.',
        sprite: {
            bodyColor: '#27272a',
            borderColor: '#ef4444',
            emblemColor: '#f87171',
            emblemStyle: 'chevron',
            glowColor: '#ef4444'
        }
    },
    {
        id: 'shield_eclipse_death_matrix',
        role: 'assassin',
        name: 'Eclipse Phantom Death-Matrix',
        category: 'shield',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4700,
        stats: { maxShieldBonus: 260, defBonus: 36, atkBonus: 50, speedBonus: 0.7, maxHpBonus: 55 },
        description: 'Floating array of nanoblade deflectors that completely dissipates boss shockwaves.',
        sprite: {
            bodyColor: '#064e3b',
            borderColor: '#10b981',
            emblemColor: '#a7f3d0',
            emblemStyle: 'diamond',
            glowColor: '#10b981'
        }
    },

    // --- Assassin Boots ---
    {
        id: 'boots_ninja_tabi',
        role: 'assassin',
        name: 'Silent Tabi Boots',
        category: 'boots',
        tier: 1,
        price: 0,
        stats: { speedBonus: 0 },
        description: 'Soft-soled traditional split-toe footwear for silent movement.',
        sprite: {
            bootColor: '#18181b',
            trimColor: '#27272a',
            soleColor: '#09090b',
            accentColor: '#10b981'
        }
    },
    {
        id: 'boots_lightning_striders',
        role: 'assassin',
        name: 'Lightning Striders',
        category: 'boots',
        tier: 3,
        price: 950,
        stats: { speedBonus: 1.3, atkBonus: 12 },
        description: 'Agile boots moving fast as midnight lightning.',
        sprite: {
            bootColor: '#022c22',
            trimColor: '#059669',
            soleColor: '#064e3b',
            accentColor: '#34d399'
        }
    },
    {
        id: 'boots_sculk_silent_tabi',
        role: 'assassin',
        name: 'Sculk Shadow Tabi',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2800,
        stats: { speedBonus: 1.2, defBonus: 12, maxHpBonus: 45 },
        description: 'Split-toe stealth boots layered with sound-absorbing sculk moss, giving unmatched dash speeds.',
        sprite: {
            bootColor: '#021825',
            trimColor: '#0891b2',
            soleColor: '#010e17',
            accentColor: '#00f5d4'
        }
    },
    {
        id: 'boots_ghost_treads',
        role: 'assassin',
        name: 'Ghost Whisper Treads',
        category: 'boots',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2000,
        stats: { speedBonus: 1.45, defBonus: 16, maxHpBonus: 55, maxShieldBonus: 40, atkBonus: 20 },
        description: 'Lightweight shadow boots allowing instantaneous dodging of boss attack telegraphs.',
        sprite: {
            bootColor: '#18181b',
            trimColor: '#ef4444',
            soleColor: '#09090b',
            accentColor: '#f87171'
        }
    },
    {
        id: 'boots_abyssal_dimension_dashes',
        role: 'assassin',
        name: 'Abyssal Voidwalkers',
        category: 'boots',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 3900,
        stats: { speedBonus: 1.85, defBonus: 26, maxHpBonus: 90, maxShieldBonus: 75, atkBonus: 38 },
        description: 'Treads that step through folded shadows, granting unmatched agility in boss encounters.',
        sprite: {
            bootColor: '#022c22',
            trimColor: '#10b981',
            soleColor: '#064e3b',
            accentColor: '#34d399'
        }
    },

    // --- Assassin Capes ---
    {
        id: 'cape_shadow_mantle',
        role: 'assassin',
        name: 'Shadow Mist Mantle',
        category: 'cape',
        tier: 1,
        price: 0,
        stats: {},
        description: 'A pitch-black mantle that dissolves into the shadows.',
        sprite: {
            mainColor: '#18181b',
            innerColor: '#27272a',
            borderColor: '#10b981',
            particleColor: '#10b981'
        }
    },
    {
        id: 'cape_blood_specter',
        role: 'assassin',
        name: 'Blood Specter Cloak',
        category: 'cape',
        tier: 4,
        price: 1500,
        stats: { defBonus: 8, atkBonus: 26, speedBonus: 0.6 },
        description: 'A ragged cloak drenched in crimson phantom mist.',
        sprite: {
            mainColor: '#450a0a',
            innerColor: '#991b1b',
            borderColor: '#ef4444',
            particleColor: '#dc2626'
        }
    },
    {
        id: 'cape_sculk_shadow_shroud',
        role: 'assassin',
        name: 'Sculk Shadow Shroud',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2900,
        stats: { atkBonus: 50, speedBonus: 0.5, maxHpBonus: 50 },
        description: 'A smoky veil forged from condensed soul darkness that billows silently with eerie cyan luminescence.',
        sprite: {
            mainColor: '#011520',
            innerColor: '#083344',
            borderColor: '#06b6d4',
            particleColor: '#22d3ee'
        }
    },
    {
        id: 'cape_void_reaper_shroud',
        role: 'assassin',
        name: 'Void Reaper Phantom Cloak',
        category: 'cape',
        tier: 4,
        minStage: 23,
        biomeName: 'DEEP DARK',
        price: 2100,
        stats: { atkBonus: 42, defBonus: 18, maxHpBonus: 75, speedBonus: 0.5 },
        description: 'A ragged cloak that dissipates into dark smoke, confounding enemy boss targeting.',
        sprite: {
            mainColor: '#1c1917',
            innerColor: '#44403c',
            borderColor: '#ef4444',
            particleColor: '#dc2626'
        }
    },
    {
        id: 'cape_deathshade_god_mantle',
        role: 'assassin',
        name: 'Deathshade God-Mantle',
        category: 'cape',
        tier: 5,
        minStage: 23,
        biomeName: 'DEEP DARK',
        isGodTier: true,
        price: 4300,
        stats: { atkBonus: 68, defBonus: 30, maxHpBonus: 130, maxShieldBonus: 65, speedBonus: 0.8 },
        description: 'A flowing shroud infused with the spirits of assassinated demigods, granting lethality to every strike.',
        sprite: {
            mainColor: '#022c22',
            innerColor: '#064e3b',
            borderColor: '#34d399',
            particleColor: '#10b981'
        }
    }
];

// Helper function to get equipment by id
function getEquipmentById(id) {
    return EQUIPMENT_DB.find(e => e.id === id);
}

// Helper function to get equipment by category and role
function getEquipmentByCategory(category, role) {
    if (!role) {
        role = (typeof player !== 'undefined' && player.characterRole) ? player.characterRole : 'knight';
    }
    return EQUIPMENT_DB.filter(e => e.category === category && (e.role === role || e.role === 'all'));
}

// Get the default starting equipment set for each role
function getDefaultEquipment(role = 'knight') {
    if (role === 'mage') {
        return {
            weapon: 'weapon_apprentice_wand',
            armor: 'armor_apprentice_robe',
            helmet: 'helmet_wizard_hat',
            shield: 'shield_magic_orb',
            boots: 'boots_cloth_shoes',
            cape: 'cape_mystic_cloak'
        };
    } else if (role === 'assassin') {
        return {
            weapon: 'weapon_twin_daggers',
            armor: 'armor_leather_vest',
            helmet: 'helmet_ninja_mask',
            shield: 'shield_parrying_dagger',
            boots: 'boots_ninja_tabi',
            cape: 'cape_shadow_mantle'
        };
    }
    return {
        weapon: 'weapon_rusty_sword',
        armor: 'armor_cloth',
        helmet: 'helmet_basic',
        shield: 'shield_wooden',
        boots: 'boots_leather',
        cape: 'cape_crimson'
    };
}

// Calculate total stat bonuses from equipped items
function calculateEquipmentStats(equipped) {
    const totals = {
        atkBonus: 0,
        defBonus: 0,
        maxHpBonus: 0,
        maxShieldBonus: 0,
        speedBonus: 0
    };

    if (!equipped) return totals;

    for (const category of EQUIPMENT_CATEGORIES) {
        const itemId = equipped[category];
        if (itemId) {
            const item = getEquipmentById(itemId);
            if (item && item.stats) {
                for (const [stat, val] of Object.entries(item.stats)) {
                    if (totals.hasOwnProperty(stat)) {
                        totals[stat] += val;
                    }
                }
            }
        }
    }

    return totals;
}

// Get the sprite data for an equipped item
function getEquippedSprite(equipped, category) {
    if (!equipped) return null;
    const itemId = equipped[category];
    if (itemId) {
        const item = getEquipmentById(itemId);
        if (item) return item.sprite;
    }
    return null;
}

// Get Mage Mana Aura Configuration based on equipped weapon
function getMageAuraConfig(weaponId) {
    if (!weaponId) {
        weaponId = (typeof player !== 'undefined' && player && player.equipped) ? player.equipped.weapon : 'weapon_apprentice_wand';
    }

    switch (weaponId) {
        case 'weapon_crystal_wand':
            return {
                id: 'crystal',
                name: 'Sapphire Crystal Aura',
                primaryColor: '#00e5ff',
                secondaryColor: '#bae6fd',
                glowColor: '#0284c7',
                icon: '💎',
                sound: 'shield',
                radius: 46
            };
        case 'weapon_fire_staff':
            return {
                id: 'fire',
                name: 'Infernal Flame Aura',
                primaryColor: '#ff3d00',
                secondaryColor: '#fde047',
                glowColor: '#f97316',
                icon: '🔥',
                sound: 'explode',
                radius: 48
            };
        case 'weapon_thunder_staff':
            return {
                id: 'thunder',
                name: 'Lightning Thunder Aura',
                primaryColor: '#facc15',
                secondaryColor: '#ffffff',
                glowColor: '#eab308',
                icon: '⚡',
                sound: 'skill',
                radius: 47
            };
        case 'weapon_cosmic_archstaff':
            return {
                id: 'cosmic',
                name: 'Galactic Cosmic Aura',
                primaryColor: '#ec4899',
                secondaryColor: '#a855f7',
                glowColor: '#f43f5e',
                icon: '🌌',
                sound: 'skill',
                radius: 50
            };
        case 'weapon_frost_snow_staff':
            return {
                id: 'snow',
                name: 'Eternal Snow Aura',
                primaryColor: '#38bdf8',
                secondaryColor: '#ffffff',
                glowColor: '#e0f2fe',
                icon: '❄️',
                sound: 'shield',
                radius: 48
            };
        case 'weapon_solar_annihilator':
            return {
                id: 'solar',
                name: 'Solar Corona Aura',
                primaryColor: '#ff9100',
                secondaryColor: '#ffee58',
                glowColor: '#ff6d00',
                icon: '☀️',
                sound: 'explode',
                radius: 54
            };
        case 'weapon_singularity_void_orb_staff':
            return {
                id: 'singularity',
                name: 'Void Singularity Aura',
                primaryColor: '#7c3aed',
                secondaryColor: '#06b6d4',
                glowColor: '#c084fc',
                icon: '🌀',
                sound: 'skill',
                radius: 58
            };
        case 'weapon_sculk_abyssal_staff':
            return {
                id: 'sculk',
                name: 'Abyssal Sculk Aura',
                primaryColor: '#06b6d4',
                secondaryColor: '#042f2e',
                glowColor: '#22d3ee',
                icon: '🔊',
                sound: 'skill',
                radius: 52
            };
        case 'weapon_apprentice_wand':
        default:
            return {
                id: 'arcane',
                name: 'Novice Arcane Aura',
                primaryColor: '#a855f7',
                secondaryColor: '#c4b5fd',
                glowColor: '#9333ea',
                icon: '🔮',
                sound: 'skill',
                radius: 44
            };
    }
}
