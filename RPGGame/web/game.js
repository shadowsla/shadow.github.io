// Shadow's Tower RPG - Web Version (JavaScript/Canvas)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Logical canvas size (game coordinate system)
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

function resizeCanvas() {
    // Keep internal resolution fixed to BASE_* and let CSS scale the canvas
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    // Ensure canvas fills its container responsively
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
}

function getCanvasPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x: x, y: y };
}

function setMobileKey(name, down) {
    switch (name) {
        case 'left': keys['ArrowLeft'] = down; keys['a'] = down; break;
        case 'right': keys['ArrowRight'] = down; keys['d'] = down; break;
        case 'up': keys['ArrowUp'] = down; keys['w'] = down; break;
        case 'down': keys['ArrowDown'] = down; keys['s'] = down; break;
        case 'attack': if (down) player.isAttacking = true; break;
    }
}

function setupMobileControls() {
    const ids = ['up','down','left','right','attack'];
    ids.forEach(id => {
        const el = document.getElementById('btn-' + id);
        if (!el) return;
        el.addEventListener('touchstart', function(e) { e.preventDefault(); setMobileKey(id, true); }, { passive: false });
        el.addEventListener('touchend', function(e) { e.preventDefault(); setMobileKey(id, false); }, { passive: false });
        el.addEventListener('mousedown', function(e) { e.preventDefault(); setMobileKey(id, true); });
        el.addEventListener('mouseup', function(e) { e.preventDefault(); setMobileKey(id, false); });
        el.addEventListener('mouseleave', function(e) { setMobileKey(id, false); });
    });
}
const WEAPON_SKILLS_MAP = {
    LONG_SWORD: [
        { key: 'Q', name: 'Slash', type: 'damage', power: 30, cooldown: 1.5, radius: 60 },
        { key: 'E', name: 'Heavy Strike', type: 'damage', power: 60, cooldown: 6 },
        { key: 'R', name: 'Blade Dance', type: 'aoe', power: 45, cooldown: 10, radius: 100 }
    ],
    DAGGER: [
        { key: 'Q', name: 'Quick Stab', type: 'damage', power: 18, cooldown: 0.8 },
        { key: 'E', name: 'Backstab', type: 'damage', power: 50, cooldown: 7 },
        { key: 'R', name: 'Shadow Step', type: 'buff', power: 0, cooldown: 12 }
    ],
    KATANA: [
        { key: 'Q', name: 'Iai Slash', type: 'damage', power: 35, cooldown: 1.2 },
        { key: 'E', name: 'Wind Cut', type: 'aoe', power: 40, cooldown: 8, radius: 90 },
        { key: 'R', name: 'Blade Fury', type: 'aoe', power: 70, cooldown: 12, radius: 120 }
    ],
    BOW: [
        { key: 'Q', name: 'Piercing Shot', type: 'ranged', power: 28, cooldown: 1.4, range: 500 },
        { key: 'E', name: 'Rain of Arrows', type: 'aoe', power: 40, cooldown: 10, radius: 140 },
        { key: 'R', name: 'Snipe', type: 'ranged', power: 80, cooldown: 12, range: 700 }
    ],
    STAFF: [
        { key: 'Q', name: 'Magic Bolt', type: 'damage', power: 22, cooldown: 1.0, magic: true },
        { key: 'E', name: 'Heal', type: 'heal', power: 60, cooldown: 8 },
        { key: 'R', name: 'Arcane Storm', type: 'aoe', power: 70, cooldown: 12, radius: 140, magic: true }
    ],
    AXE: [
        { key: 'Q', name: 'Cleave', type: 'damage', power: 36, cooldown: 1.6, radius: 50 },
        { key: 'E', name: 'Stomp', type: 'aoe', power: 55, cooldown: 9, radius: 100 },
        { key: 'R', name: 'Berserk', type: 'buff', power: 0, cooldown: 14 }
    ]
};

const POSSIBLE_DROPS = [
    { name: 'Herb', desc: 'A common herb used in crafting.', rarity: 0 },
    { name: 'Metal Scrap', desc: 'Scrap metal useful for crafting weapons.', rarity: 0 },
    { name: 'Mana Crystal', desc: 'Concentrated mana for casting spells.', rarity: 1 },
    { name: 'Healing Potion', desc: 'Restores a moderate amount of health.', rarity: 1 },
    { name: 'Rare Gem', desc: 'A precious gem used for high tier crafting.', rarity: 3 }
];

// Items dropped on the ground
let itemsOnGround = [];

// Class definitions (Tank, Healer, DPS, Rogue, Mage)
const CLASS_DEFINITIONS = {
    TANK: {
        display: 'Tank',
        description: 'Heavily armored frontliner who soaks damage and controls enemies.',
        modifiers: { maxHealth: 70, armor: 12, magicPower: -5 },
        preferredWeapons: ['HALBERD','WARHAMMER','BATTLEAXE','AXE'],
        skillPool: [
            { name: 'Heavy Armor', desc: 'Wear heavy armor to reduce incoming damage.' },
            { name: 'Shield Bash', desc: 'Stun or interrupt nearby enemies.' },
            { name: 'Taunt', desc: 'Force enemies to attack you.' },
            { name: 'Fortitude', desc: 'Increase maximum health.' },
            { name: 'Resilience', desc: 'Gain resistance to physical damage.' }
        ]
    },
    HEALER: {
        display: 'Healer',
        description: 'Support caster who heals allies and protects them from harm.',
        modifiers: { maxMana: 60, maxHealth: 10, magicPower: 10 },
        preferredWeapons: ['STAFF','WAND','SCEPTER'],
        skillPool: [
            { name: 'Restoration', desc: 'Improves healing and mana regeneration.' },
            { name: 'Heal', desc: 'Cast direct healing spells.' },
            { name: 'Warding', desc: 'Temporary damage barriers.' },
            { name: 'Herbalism', desc: 'Better potion yields and craftables.' },
            { name: 'Holy Magic', desc: 'Increase restorative effects.' }
        ]
    },
    DPS: {
        display: 'DPS',
        description: 'Focused on dealing high damage quickly with weapons or spells.',
        modifiers: { magicPower: 0, maxHealth: 10, attackSpeed: 0.12 },
        preferredWeapons: ['LONG_SWORD','KATANA','DAGGER','BATTLEAXE'],
        skillPool: [
            { name: 'One-Handed', desc: 'Specialize in one-handed weapons.' },
            { name: 'Two-Handed', desc: 'Specialize in two-handed weapons.' },
            { name: 'Cleave', desc: 'Deal damage to multiple nearby enemies.' },
            { name: 'Critical Strike', desc: 'Chance to deal extra critical damage.' },
            { name: 'Whirlwind', desc: 'Spin attack that hits nearby foes.' }
        ]
    },
    ROGUE: {
        display: 'Rogue',
        description: 'Stealthy attacker that relies on agility, stealth, and precision.',
        modifiers: { agility: 12, maxHealth: -5, criticalChance: 0.08 },
        preferredWeapons: ['DAGGER','SHORT_SWORD','WHIP'],
        skillPool: [
            { name: 'Sneak', desc: 'Move quietly and avoid detection.' },
            { name: 'Backstab', desc: 'Massively increased damage when attacking from stealth.' },
            { name: 'Lockpicking', desc: 'Open locked chests and doors.' },
            { name: 'Pickpocketing', desc: 'Steal small amounts of gold from enemies.' },
            { name: 'Acrobatics', desc: 'Improve mobility and evasion.' }
        ]
    },
    MAGE: {
        display: 'Mage',
        description: 'Master of the elements and arcane study, high magic power and versatility.',
        modifiers: { magicPower: 25, maxMana: 50, maxHealth: -10 },
        preferredWeapons: ['STAFF','WAND','SCEPTER'],
        skillPool: [
            { name: 'Destruction', desc: 'Increase damage for offensive spells.' },
            { name: 'Conjuration', desc: 'Summon minions or temporary allies.' },
            { name: 'Elemental Magic', desc: 'Enhance elemental abilities like fire and ice.' },
            { name: 'Arcane Storm', desc: 'Large-area magical attack.' },
            { name: 'Mysticism', desc: 'Improve mana efficiency and magic resistance.' }
        ]
    }
};

// Player class state
player.className = null;
player.unlockedClassSkills = [];
player.appliedSkills = {};

// Save data key
const SAVE_KEY = 'shadow_rpg_save_v1';

function openClassSelect() {
    const panel = document.getElementById('classSelectPanel');
    if (panel) panel.style.display = 'block';
}

function closeClassSelect() {
    const panel = document.getElementById('classSelectPanel');
    if (panel) panel.style.display = 'none';
}

let _selectedClassKey = null;
function showClassDetails(key) {
    if (key === 'RANDOM') {
        const keys = Object.keys(CLASS_DEFINITIONS);
        key = keys[Math.floor(Math.random() * keys.length)];
    }
    _selectedClassKey = key;
    const def = CLASS_DEFINITIONS[key];
    const nameEl = document.getElementById('className');
    const descEl = document.getElementById('classDesc');
    if (nameEl) nameEl.textContent = def.display;
    if (descEl) descEl.textContent = def.description + '\n' + 'Preferred weapons: ' + (def.preferredWeapons || []).join(', ');
}

function confirmClassSelection() {
    if (!_selectedClassKey) return;
    player.className = _selectedClassKey;
    // apply class modifiers
    const def = CLASS_DEFINITIONS[_selectedClassKey];
    if (def && def.modifiers) {
        if (def.modifiers.maxHealth) {
            player.maxHealth += def.modifiers.maxHealth;
            player.health = player.maxHealth;
        }
        if (def.modifiers.maxMana) {
            player.maxMana += def.modifiers.maxMana;
            player.mana = player.maxMana;
        }
        if (def.modifiers.magicPower) player.magicPower = (player.magicPower || 0) + def.modifiers.magicPower;
        if (def.modifiers.armor) player.armor.defense = (player.armor.defense || 0) + def.modifiers.armor;
        if (def.modifiers.agility) player.agility = (player.agility || 0) + def.modifiers.agility;
    }

    // pick some random starting class skills (3)
    const pool = def.skillPool || [];
    const chosen = [];
    const picks = Math.min(3, pool.length);
    const poolCopy = pool.slice();
    for (let i = 0; i < picks; i++) {
        const idx = Math.floor(Math.random() * poolCopy.length);
        const s = poolCopy.splice(idx, 1)[0];
        if (s) chosen.push(s.name);
    }
    player.unlockedClassSkills = chosen.slice();
    for (let sName of player.unlockedClassSkills) applySkillEffects(sName);

    closeClassSelect();
    // open weapon selection next
    openWeaponSelect();
    updateSidebarUI();
}

function applySkillEffects(skillName) {
    if (!skillName) return;
    if (!player.appliedSkills) player.appliedSkills = {};
    if (player.appliedSkills[skillName]) return; // already applied
    player.appliedSkills[skillName] = true;
    switch (skillName) {
        case 'Heavy Armor':
            player.armor.defense = (player.armor.defense || 0) + 12;
            break;
        case 'Light Armor':
            player.armor.defense = (player.armor.defense || 0) + 4;
            player.agility = (player.agility || 0) + 3;
            break;
        case 'Sneak':
            player.sneak = true; player.backstabBonus = (player.backstabBonus || 1.5);
            break;
        case 'Backstab':
            player.backstab = true; player.backstabMultiplier = 2.0;
            break;
        case 'Restoration':
            player.manaRegenBonus = (player.manaRegenBonus || 0) + 0.4;
            break;
        case 'Destruction':
            player.magicPower = (player.magicPower || 0) + 10;
            break;
        case 'Archery':
            player.archeryBonus = (player.archeryBonus || 0) + 0.2;
            break;
        case 'One-Handed':
            player.oneHanded = true;
            break;
        case 'Two-Handed':
            player.twoHanded = true;
            break;
        case 'Critical Strike':
            player.critChance = (player.critChance || 0) + 0.08;
            break;
        case 'Heal':
            player.manaRegenBonus = (player.manaRegenBonus || 0) + 0.2;
            break;
        default:
            // generic: no immediate effect, but can grant future mechanics
            break;
    }
}

function unlockClassSkill(skillName) {
    if (!player.className) return false;
    if (player.unlockedClassSkills && player.unlockedClassSkills.includes(skillName)) return false;
    const cost = 100; // flat gold cost for now
    if (player.gold < cost) return false;
    player.gold -= cost;
    player.unlockedClassSkills.push(skillName);
    applySkillEffects(skillName);
    saveGame();
    updateSidebarUI();
    return true;
}

function getWeaponKeyByName(name) {
    for (let k of Object.keys(WEAPON_TYPES)) {
        if (WEAPON_TYPES[k].name === name) return k;
    }
    return null;
}

function saveGame() {
    try {
        const save = {
            timestamp: Date.now(),
            player: {
                x: player.x, y: player.y, health: player.health, maxHealth: player.maxHealth,
                mana: player.mana, maxMana: player.maxMana, level: player.level, rank: player.rank,
                experience: player.experience, experienceToNextRank: player.experienceToNextRank,
                gold: player.gold, inventory: player.inventory, currentWeaponKey: getWeaponKeyByName(player.currentWeapon.name),
                className: player.className, affinity: player.affinity, unlockedClassSkills: player.unlockedClassSkills || [], appliedSkills: player.appliedSkills || {}
            },
            enemies: enemies.map(e => ({ x: e.x, y: e.y, width: e.width, height: e.height, health: e.health, maxHealth: e.maxHealth, damage: e.damage, experience: e.experience, velocityX: e.velocityX, velocityY: e.velocityY, attackTimer: e.attackTimer, attackCooldown: e.attackCooldown, type: e.type && e.type.name })),
            itemsOnGround: itemsOnGround,
            gameState: gameState,
            currentTowerIndex: currentTowerIndex,
            currentFloor: currentFloor
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        return true;
    } catch (e) {
        console.warn('Save failed', e);
        return false;
    }
}

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const save = JSON.parse(raw);
        if (!save || !save.player) return false;
        const p = save.player;
        player.x = p.x || player.x; player.y = p.y || player.y;
        player.health = p.health || player.health; player.maxHealth = p.maxHealth || player.maxHealth;
        player.mana = p.mana || player.mana; player.maxMana = p.maxMana || player.maxMana;
        player.level = p.level || player.level; player.rank = p.rank || player.rank;
        player.experience = p.experience || player.experience; player.experienceToNextRank = p.experienceToNextRank || player.experienceToNextRank;
        player.gold = p.gold || player.gold; player.inventory = p.inventory || player.inventory;
        player.className = p.className || player.className; player.affinity = p.affinity || player.affinity;
        player.unlockedClassSkills = p.unlockedClassSkills || player.unlockedClassSkills || [];
        player.appliedSkills = p.appliedSkills || player.appliedSkills || {};
        if (p.currentWeaponKey && WEAPON_TYPES[p.currentWeaponKey]) player.currentWeapon = WEAPON_TYPES[p.currentWeaponKey];
        // restore enemies
        enemies = (save.enemies || []).map(e => ({ x: e.x, y: e.y, width: e.width, height: e.height, health: e.health, maxHealth: e.maxHealth, damage: e.damage, experience: e.experience, velocityX: e.velocityX, velocityY: e.velocityY, attackTimer: e.attackTimer, attackCooldown: e.attackCooldown, type: { name: e.type } }));
        itemsOnGround = save.itemsOnGround || [];
        gameState = save.gameState || gameState;
        currentTowerIndex = save.currentTowerIndex || currentTowerIndex;
        currentFloor = save.currentFloor || currentFloor;

        // re-apply skill effects for unlocked class skills
        for (let s of player.unlockedClassSkills || []) applySkillEffects(s);

        return true;
    } catch (e) {
        console.warn('Load failed', e);
        return false;
    }
}

function resumeSavedGame() {
    if (loadGame()) {
        const overlay = document.getElementById('overlay'); if (overlay) overlay.style.display = 'none';
        const panel = document.getElementById('classSelectPanel'); if (panel) panel.style.display = 'none';
        const wpanel = document.getElementById('weaponSelectPanel'); if (wpanel) wpanel.style.display = 'none';
        updateSidebarUI();
    } else {
        alert('No saved game found.');
    }
}

// Game state
let gameState = GAME_STATES.MAIN_MENU;
let currentTowerIndex = 0;
let currentFloor = 1;
let allTowersComplete = false;
let seventhTowerSpawned = false;

// Player object
let player = {
    x: 640,
    y: 360,
    width: 40,
    height: 40,
    name: 'Adventurer',
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    level: 1,
    rank: 0,
    experience: 0,
    experienceToNextRank: 500,
    currentWeapon: WEAPON_TYPES.LONG_SWORD,
    synchronization: { LONG_SWORD: 10 },
    armor: { defense: 10, maxHealthBonus: 0 },
    gold: 0,
    inventory: [],
    maxInventory: 50,
    velocityX: 0,
    velocityY: 0,
    isAttacking: false,
    attackCooldown: 1.0,
    attackTimer: 0,
    attackDirection: { x: 1, y: 0 }
};
// Add magic and skills
player.magicPower = 20; // increases skill damage
player.skills = [
    { name: 'Fireball', key: 'Q', cooldown: 5, lastUsed: -9999, type: 'damage', power: 70, radius: 120 },
    { name: 'Heal', key: 'E', cooldown: 8, lastUsed: -9999, type: 'heal', power: 60 },
    { name: 'Whirlwind', key: 'R', cooldown: 10, lastUsed: -9999, type: 'aoe', power: 45, radius: 80 }
];

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    handleKeyPress(e.key);
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function handleKeyPress(key) {
    switch(key.toUpperCase()) {
        case 'ENTER':
            if (gameState === GAME_STATES.MAIN_MENU) {
                openWeaponSelect();
            }
            break;
        case 'I':
            toggleInventory();
            break;
        case 'G':
            toggleGuild();
            break;
        case 'S':
            toggleSkillTree();
            break;
        case 'C':
            toggleCrafting();
            break;
        case 'ESCAPE':
            // Close any open overlays first
            if (typeof UISystem !== 'undefined') {
                UISystem.inventory.isOpen = false;
                UISystem.skillTree.isOpen = false;
                UISystem.guild.isOpen = false;
                UISystem.crafting.isOpen = false;
                if (UISystem.stats) UISystem.stats.isOpen = false;
            } else {
                gameState = GAME_STATES.MAIN_MENU;
            }
            break;
        case '1': case '2': case '3': case '4': case '5': case '6': case '7':
            if (gameState === GAME_STATES.TOWER_SELECTION) {
                let towerIndex = parseInt(key) - 1;
                if (towerIndex < TOWERS.length || (allTowersComplete && seventhTowerSpawned)) {
                    selectTower(towerIndex);
                }
            }
            break;
        case ' ':
            if (gameState === GAME_STATES.TOWER_FLOOR) {
                player.isAttacking = true;
            }
            break;
        case 'Q': case 'E': case 'R':
            // Skill keys (Q/E/R) when in a tower floor
            if (gameState === GAME_STATES.TOWER_FLOOR) {
                castSkillByKey(key);
            }
            break;
            break;
    }
}

// Tower selection
function selectTower(index) {
    if (index >= 0 && index < TOWERS.length) {
        currentTowerIndex = index;
        currentFloor = 1;
        gameState = GAME_STATES.TOWER_FLOOR;
        generateFloorEnemies();
    }
}

// Enemy management
let enemies = [];

function generateFloorEnemies() {
    enemies = [];
    const tower = TOWERS[currentTowerIndex];
    const enemyCount = 3 + currentFloor * 2;
    
    for (let i = 0; i < enemyCount; i++) {
        const enemyType = Math.floor(Math.random() * Math.min(3 + currentTowerIndex, ENEMY_TYPES.length));
        const enemy = {
            x: 150 + Math.random() * 1000,
            y: 200 + Math.random() * 400,
            width: 35,
            height: 35,
            type: ENEMY_TYPES[enemyType],
            health: ENEMY_TYPES[enemyType].health + (currentFloor * 5) + (currentTowerIndex * 10),
            maxHealth: ENEMY_TYPES[enemyType].health + (currentFloor * 5) + (currentTowerIndex * 10),
            damage: ENEMY_TYPES[enemyType].damage + currentFloor + currentTowerIndex * 2,
            experience: ENEMY_TYPES[enemyType].exp * (currentFloor + currentTowerIndex),
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            attackTimer: 0,
            attackCooldown: 1.5
        };
        enemies.push(enemy);
    }
    
    // Add mini-boss every 3 floors
    if (currentFloor > 2 && currentFloor % 3 === 0) {
        const miniBoss = {
            x: 600,
            y: 300,
            width: 50,
            height: 50,
            type: { name: 'Mini Boss', health: 150, damage: 30, exp: 300 },
            health: 150 + (currentFloor * 20) + (currentTowerIndex * 30),
            maxHealth: 150 + (currentFloor * 20) + (currentTowerIndex * 30),
            damage: 30 + currentFloor * 5 + currentTowerIndex * 5,
            experience: 300 * (currentFloor + currentTowerIndex),
            velocityX: 0,
            velocityY: 0,
            attackTimer: 0,
            attackCooldown: 1.0,
            isMiniBoss: true
        };
        enemies.push(miniBoss);
    }
}

// Game loop
let lastTime = Date.now();
let frameCount = 0;
let fps = 0;

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Update FPS
    frameCount++;
    if (frameCount % 10 === 0) {
        fps = Math.round(1 / deltaTime);
    }
    
    // Update game logic
    update(deltaTime);
    
    // Render
    render();
    
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Handle player input
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= 5;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += 5;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= 5;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += 5;
    
    // Boundary checking
    player.x = Math.max(100, Math.min(1180, player.x));
    player.y = Math.max(150, Math.min(650, player.y));
    
    // Update player cooldowns
    if (player.attackTimer < player.attackCooldown) {
        player.attackTimer += deltaTime;
    }
    
    // Regenerate health and mana
    if (player.health < player.maxHealth) {
        player.health = Math.min(player.maxHealth, player.health + 0.5 * deltaTime);
    }
    if (player.mana < player.maxMana) {
        player.mana = Math.min(player.maxMana, player.mana + 0.3 * deltaTime);
    }
    
    // Update enemies
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        
        // Enemy movement
        enemy.x += enemy.velocityX;
        enemy.y += enemy.velocityY;
        
        // Boundary checking
        if (enemy.x < 100) enemy.velocityX = Math.abs(enemy.velocityX);
        if (enemy.x > 1180) enemy.velocityX = -Math.abs(enemy.velocityX);
        if (enemy.y < 150) enemy.velocityY = Math.abs(enemy.velocityY);
        if (enemy.y > 650) enemy.velocityY = -Math.abs(enemy.velocityY);
        
        // Random direction change
        if (Math.random() < 0.01) {
            enemy.velocityX = (Math.random() - 0.5) * 4;
            enemy.velocityY = (Math.random() - 0.5) * 4;
        }
        
        // Enemy attack cooldown
        enemy.attackTimer += deltaTime;
        
        // Check collision with player
        if (isColliding(player, enemy)) {
            if (enemy.attackTimer >= enemy.attackCooldown) {
                player.health = Math.max(0, player.health - enemy.damage);
                enemy.attackTimer = 0;
            }
        }
    }
        // Remove defeated enemies and award rewards
        if (enemies.length > 0) {
            let survivors = [];
            for (let i = 0; i < enemies.length; i++) {
                const e = enemies[i];
                if (e.health <= 0) {
                    player.experience += e.experience || 0;
                    player.gold += Math.max(1, Math.floor((e.experience || 0) / 10));
                } else {
                    survivors.push(e);
                }
            }
            enemies = survivors;
        }
    
    // Check if all enemies defeated
    if (gameState === GAME_STATES.TOWER_FLOOR && enemies.length === 0) {
        if (currentFloor < TOWERS[currentTowerIndex].floors) {
            currentFloor++;
            generateFloorEnemies();
        } else {
            // Tower complete
            if (currentTowerIndex < TOWERS.length - 1) {
                currentTowerIndex++;
                currentFloor = 1;
                generateFloorEnemies();
            } else {
                allTowersComplete = true;
                if (!seventhTowerSpawned) {
                    seventhTowerSpawned = true;
                    TOWERS.push({ name: 'The Seventh Tower', floors: 15, difficulty: 7 });
                }
                gameState = GAME_STATES.MAIN_MENU;
            }
        }
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Skill handling
function castSkillByKey(key) {
    const idx = player.skills.findIndex(s => s.key === key.toUpperCase());
    if (idx >= 0) castSkill(idx);
}

function castSkill(index) {
    const skill = player.skills[index];
    if (!skill) return;
    const now = Date.now() / 1000;
    if (now - (skill.lastUsed || 0) < skill.cooldown) {
        // still on cooldown
        return;
    }
    skill.lastUsed = now;

    switch (skill.type) {
        case 'damage':
        case 'aoe':
            const radius = skill.radius || 80;
            for (let i = 0; i < enemies.length; i++) {
                const e = enemies[i];
                const dx = (e.x + e.width/2) - (player.x + player.width/2);
                const dy = (e.y + e.height/2) - (player.y + player.height/2);
                const dist2 = dx*dx + dy*dy;
                if (dist2 <= radius*radius) {
                    e.health -= (skill.power || 20) + (player.magicPower || 0);
                }
            }
            break;
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + (skill.power || 30));
            break;
        default:
            break;
    }
}

// Perform a melee/ranged attack based on current weapon and facing
function getWeaponRange(weapon) {
    if (!weapon) return 80;
    const n = (weapon.name || '').toLowerCase();
    if (n.includes('spear') || n.includes('halberd')) return 140;
    if (n.includes('bow') || n.includes('crossbow')) return 450;
    if (n.includes('dagger')) return 60;
    if (n.includes('staff') || weapon.magic) return 220;
    return 90;
}

function performAttack() {
    const weapon = player.currentWeapon || WEAPON_TYPES.LONG_SWORD;
    const range = getWeaponRange(weapon);
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        const ex = e.x + e.width / 2;
        const ey = e.y + e.height / 2;
        const dx = ex - px;
        const dy = ey - py;
        const dist2 = dx*dx + dy*dy;
        if (dist2 <= range * range) {
            // Optionally enforce frontal arc
            const dir = player.attackDirection || { x: 1, y: 0 };
            const dot = (dx * dir.x + dy * dir.y) / (Math.sqrt(dist2) || 1);
            if (dot >= -0.2) { // allow hits in most directions; narrow if desired
                const magicBonus = (weapon.magic ? (player.magicPower || 0) : 0);
                let damage = Math.max(1, Math.floor((weapon.damage || 10) + (player.level || 1) * 2 + magicBonus));

                // One/Two handed bonuses
                const wname = (weapon.name || '').toLowerCase();
                if (player.oneHanded && (wname.includes('sword') || wname.includes('dagger') || wname.includes('short'))) {
                    damage += 6;
                }
                if (player.twoHanded && (wname.includes('axe') || wname.includes('battle') || wname.includes('hammer') || wname.includes('halberd'))) {
                    damage += 10;
                }

                // Archery bonus
                if ((wname.includes('bow') || wname.includes('crossbow')) && player.archeryBonus) {
                    damage = Math.floor(damage * (1 + (player.archeryBonus || 0)));
                }

                // Critical chance
                if (player.critChance && Math.random() < (player.critChance || 0)) {
                    damage = Math.floor(damage * 1.8);
                }

                // Backstab: attacking from behind gives extra damage
                if (player.backstab) {
                    const dirNormLen = Math.sqrt(dir.x*dir.x + dir.y*dir.y) || 1;
                    const dirNx = dir.x / dirNormLen; const dirNy = dir.y / dirNormLen;
                    const toEnemyLen = Math.sqrt(dist2) || 1;
                    const toEx = dx / toEnemyLen; const toEy = dy / toEnemyLen;
                    const facingDot = dirNx * toEx + dirNy * toEy;
                    if (facingDot < -0.4) {
                        damage = Math.floor(damage * (player.backstabMultiplier || 2.0));
                    }
                }

                e.health = Math.max(0, e.health - damage);
            }
        }
    }
}

function spawnDrop(enemy) {
    // 60% chance to drop something, rare gem small chance
    const chance = Math.random();
    if (chance < 0.1) {
        // rare gem
        const drop = POSSIBLE_DROPS.find(d => d.name === 'Rare Gem');
        if (drop) itemsOnGround.push({ x: enemy.x, y: enemy.y, name: drop.name, desc: drop.desc, quantity: 1, rarity: drop.rarity });
        return;
    }
    if (chance < 0.6) {
        const idx = Math.floor(Math.random() * (POSSIBLE_DROPS.length - 1));
        const drop = POSSIBLE_DROPS[idx];
        if (drop) itemsOnGround.push({ x: enemy.x, y: enemy.y, name: drop.name, desc: drop.desc, quantity: 1, rarity: drop.rarity });
    }
}

// Item interaction panels
let _selectedGroundItem = null;
function openItemPanel(index) {
    const panel = document.getElementById('itemPanel');
    const nameEl = document.getElementById('itemName');
    const descEl = document.getElementById('itemDesc');
    const pickupBtn = document.getElementById('pickupBtn');
    if (!panel || !nameEl || !descEl || !pickupBtn) return;
    const item = itemsOnGround[index];
    if (!item) return;
    _selectedGroundItem = index;
    nameEl.textContent = item.name;
    descEl.textContent = item.desc || 'An item.';
    pickupBtn.onclick = function() { pickupSelectedItem(); };
    panel.style.display = 'block';
}

function closeItemPanel() {
    const panel = document.getElementById('itemPanel');
    if (panel) panel.style.display = 'none';
    _selectedGroundItem = null;
}

function pickupSelectedItem() {
    if (_selectedGroundItem == null) return;
    const item = itemsOnGround[_selectedGroundItem];
    if (!item) return;
    addToInventory({ name: item.name, quantity: item.quantity || 1, rarity: item.rarity || 0 });
    // remove from ground
    itemsOnGround.splice(_selectedGroundItem, 1);
    updateSidebarUI();
    closeItemPanel();
}

// Weapon selection and starting setup
function openWeaponSelect() {
    const panel = document.getElementById('weaponSelectPanel');
    if (panel) panel.style.display = 'block';
}

function closeWeaponSelect() {
    const panel = document.getElementById('weaponSelectPanel');
    if (panel) panel.style.display = 'none';
}

function selectStartingWeapon(key) {
    closeWeaponSelect();
    let chosenKey = key;
    if (key === 'RANDOM') {
        const keys = Object.keys(WEAPON_TYPES);
        chosenKey = keys[Math.floor(Math.random() * keys.length)];
    }
    const weaponObj = WEAPON_TYPES[chosenKey] || WEAPON_TYPES.LONG_SWORD;
    player.currentWeapon = weaponObj;
    // set attack cooldown from weapon speed
    player.attackCooldown = 1.0 / (weaponObj.speed || 1.0);
    // affinity chance
    player.affinity = AFFINITIES[Math.floor(Math.random() * AFFINITIES.length)];
    setSkillsForWeapon(chosenKey);
    // close overlay and go to tower selection
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
    gameState = GAME_STATES.TOWER_SELECTION;
    updateSidebarUI();
}

function setSkillsForWeapon(weaponKey) {
    const base = WEAPON_SKILLS_MAP[weaponKey] || WEAPON_SKILLS_MAP['LONG_SWORD'];
    let combined = base.map(s => Object.assign({}, s));
    // include unlocked class skills as additional abilities (non-keyed)
    if (player.className && player.unlockedClassSkills && player.unlockedClassSkills.length > 0) {
        const def = CLASS_DEFINITIONS[player.className];
        if (def && def.skillPool) {
            for (let skillDef of def.skillPool) {
                if (player.unlockedClassSkills.includes(skillDef.name)) {
                    combined.push({ name: skillDef.name, key: null, type: 'class', desc: skillDef.desc });
                }
            }
        }
    }
    player.skills = combined;
    // affinity modifies some skills randomly
    for (let i = 0; i < player.skills.length; i++) {
        const s = player.skills[i];
        if (s.type === 'damage' || s.type === 'aoe') {
            if (Math.random() < 0.4) {
                s.name = s.name + ' (' + player.affinity + ')';
                s.power = (s.power || 20) + 12;
            }
            if (s.magic && player.affinity === 'Arcane') {
                s.power = (s.power || 20) + 10;
            }
        }
    }
}

// Toggle UI helpers (safe if ui functions exist in ui.js)
function toggleInventory() { if (typeof UISystem !== 'undefined') UISystem.inventory.isOpen = !UISystem.inventory.isOpen; else gameState = (gameState === GAME_STATES.INVENTORY) ? GAME_STATES.TOWER_FLOOR : GAME_STATES.INVENTORY; }
function toggleSkillTree() { if (typeof UISystem !== 'undefined') UISystem.skillTree.isOpen = !UISystem.skillTree.isOpen; else gameState = (gameState === GAME_STATES.SKILL_TREE) ? GAME_STATES.TOWER_FLOOR : GAME_STATES.SKILL_TREE; }
function toggleGuild() { if (typeof UISystem !== 'undefined') UISystem.guild.isOpen = !UISystem.guild.isOpen; else gameState = (gameState === GAME_STATES.GUILD) ? GAME_STATES.TOWER_FLOOR : GAME_STATES.GUILD; }
function toggleCrafting() { if (typeof UISystem !== 'undefined') UISystem.crafting.isOpen = !UISystem.crafting.isOpen; else gameState = (gameState === GAME_STATES.CRAFTING) ? GAME_STATES.TOWER_FLOOR : GAME_STATES.CRAFTING; }

// Canvas click picks up or inspects ground items
canvas.addEventListener('click', function(evt) {
    const pos = getCanvasPos(evt);
    // Skill tree clickable areas (canvas-based buttons)
    try {
        if (typeof UISystem !== 'undefined' && UISystem.skillTree.isOpen && typeof _skillTreeClickableAreas !== 'undefined') {
            for (let area of _skillTreeClickableAreas) {
                if (pos.x >= area.x && pos.x <= area.x + area.w && pos.y >= area.y && pos.y <= area.y + area.h) {
                    if (area.action === 'unlock') {
                        unlockClassSkill(area.skillName);
                    }
                    return;
                }
            }
        }
    } catch (e) {}

    for (let i = 0; i < itemsOnGround.length; i++) {
        const it = itemsOnGround[i];
        if (pos.x >= it.x && pos.x <= it.x + 18 && pos.y >= it.y && pos.y <= it.y + 18) {
            openItemPanel(i);
            return;
        }
    }
});

function render() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    switch(gameState) {
        case GAME_STATES.MAIN_MENU:
            renderMainMenu();
            break;
        case GAME_STATES.TOWER_SELECTION:
            renderTowerSelection();
            break;
        case GAME_STATES.TOWER_FLOOR:
            renderTower();
            break;
        case GAME_STATES.GUILD:
            renderGuild();
            break;
        case GAME_STATES.INVENTORY:
            renderInventory();
            break;
        case GAME_STATES.SKILL_TREE:
            renderSkillTree();
            break;
        case GAME_STATES.CRAFTING:
            renderCrafting();
            break;
    }
    
    // Render HUD
    renderHUD();
    // Draw UI overlays (inventory, skill tree, guild, crafting, stats)
    if (typeof drawAllUI === 'function') drawAllUI(ctx);
}

function renderMainMenu() {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("SHADOW'S TOWER RPG", canvas.width / 2, 100);
    
    ctx.font = '24px Arial';
    ctx.fillText('Press ENTER to start', canvas.width / 2, 250);
    ctx.fillText('Press I for Inventory', canvas.width / 2, 300);
    ctx.fillText('Press G for Guild', canvas.width / 2, 350);
    ctx.fillText('Press S for Skill Tree', canvas.width / 2, 400);
}

function renderTowerSelection() {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT TOWER', canvas.width / 2, 50);
    
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < TOWERS.length; i++) {
        ctx.fillText((i + 1) + '. ' + TOWERS[i].name, 100, 150 + i * 60);
    }
    
    if (seventhTowerSpawned) {
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('7. ' + TOWERS[TOWERS.length - 1].name, 100, 150 + 6 * 60);
    }
}

function renderTower() {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(100, 150, 1080, 500);
    
    // Render player
    ctx.fillStyle = '#64c8ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    // Render enemies
    for (let enemy of enemies) {
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Enemy health bar
        const barWidth = 40;
        const barHeight = 4;
        ctx.fillStyle = '#333333';
        ctx.fillRect(enemy.x - 2, enemy.y - 10, barWidth, barHeight);
        ctx.fillStyle = '#ff0000';
        const healthWidth = (enemy.health / enemy.maxHealth) * barWidth;
        ctx.fillRect(enemy.x - 2, enemy.y - 10, healthWidth, barHeight);
    }

    // Render ground items (drops)
    for (let it of itemsOnGround) {
        ctx.fillStyle = it.rarity >= 3 ? '#ffd700' : '#ffaa00';
        ctx.fillRect(it.x, it.y, 18, 18);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(it.x, it.y, 18, 18);
    }
    
    // Display floor info
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Floor: ' + currentFloor + '/' + TOWERS[currentTowerIndex].floors, 1100, 200);
    ctx.fillText('Enemies: ' + enemies.length, 1100, 230);
}

function renderGuild() {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GUILD', canvas.width / 2, 50);
    
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Rank: ' + PLAYER_RANKS[player.rank], 100, 150);
    ctx.fillText('Experience: ' + player.experience + '/' + player.experienceToNextRank, 100, 200);
    
    const progressPercent = (player.experience / player.experienceToNextRank) * 100;
    ctx.fillText('Progress to next rank: ' + Math.round(progressPercent) + '%', 100, 250);
}

function renderInventory() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(100, 50, canvas.width - 200, canvas.height - 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('INVENTORY', canvas.width / 2, 100);
    
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Gold: ' + player.gold, 150, 150);
    ctx.fillText('Items: ' + player.inventory.length + '/' + player.maxInventory, 150, 180);
}

function renderSkillTree() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(100, 50, canvas.width - 200, canvas.height - 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SKILL TREE - ' + player.currentWeapon.name.toUpperCase(), canvas.width / 2, 100);
    
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Available skills for this weapon type', 150, 150);
    ctx.fillText('1. Slash - Basic attack (1.0x damage)', 150, 200);
    ctx.fillText('2. Heavy Strike - Powerful blow (1.5x damage)', 150, 250);
    ctx.fillText('3. Whirlwind - Spinning attack (2.0x damage)', 150, 300);
}

function renderCrafting() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(100, 50, canvas.width - 200, canvas.height - 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRAFTING SYSTEM', canvas.width / 2, 100);
    
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Available recipes:', 150, 150);
    ctx.fillText('1. Healing Potion - Herb x3, Water x1', 150, 200);
    ctx.fillText('2. Iron Sword - Metal Scrap x5, Coal x2', 150, 250);
    ctx.fillText('3. Steel Armor - Metal Scrap x8, Leather x3', 150, 300);
}

function renderHUD() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Player info
    ctx.fillText('Player: ' + player.name, 10, 25);
    ctx.fillText('Rank: ' + PLAYER_RANKS[player.rank], 10, 45);
    ctx.fillText('Level: ' + player.level, 10, 65);
    
    // Health bar
    ctx.fillStyle = '#333333';
    ctx.fillRect(10, 85, 200, 15);
    ctx.fillStyle = '#00ff00';
    const healthWidth = (player.health / player.maxHealth) * 200;
    ctx.fillRect(10, 85, healthWidth, 15);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 85, 200, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(Math.round(player.health) + '/' + player.maxHealth, 70, 98);
    
    // Mana bar
    ctx.fillStyle = '#333333';
    ctx.fillRect(10, 105, 200, 15);
    ctx.fillStyle = '#0099ff';
    const manaWidth = (player.mana / player.maxMana) * 200;
    ctx.fillRect(10, 105, manaWidth, 15);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 105, 200, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(Math.round(player.mana) + '/' + player.maxMana, 70, 118);
    
    // Weapon info
    ctx.fillText('Weapon: ' + player.currentWeapon.name, 10, 150);

    // Magic info
    ctx.fillText('Magic: ' + (player.magicPower || 0), 10, 170);

    // Skills (Q/E/R)
    const nowSec = Date.now() / 1000;
    let skillY = 190;
    for (let i = 0; i < player.skills.length; i++) {
        const s = player.skills[i];
        const cdLeft = Math.max(0, Math.ceil(s.cooldown - (nowSec - (s.lastUsed || -9999))));
        const status = cdLeft > 0 ? (`${cdLeft}s`) : 'Ready';
        ctx.fillText(`${s.key}: ${s.name} (${status})`, 10, skillY);
        skillY += 18;
    }
    
    // FPS
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'right';
    ctx.fillText('FPS: ' + fps, canvas.width - 20, 25);

    // Update HTML sidebar values if present
    updateSidebarUI();
}

function updateSidebarUI() {
    const elHP = document.getElementById('playerHP');
    if (elHP) elHP.textContent = Math.round(player.health) + '/' + player.maxHealth;
    const elRank = document.getElementById('playerRank');
    if (elRank) elRank.textContent = PLAYER_RANKS[player.rank];
    const elWeapon = document.getElementById('playerWeapon');
    if (elWeapon) elWeapon.textContent = player.currentWeapon.name;
    const elGold = document.getElementById('playerGold');
    if (elGold) elGold.textContent = player.gold;
    const elMagic = document.getElementById('playerMagic');
    if (elMagic) elMagic.textContent = player.magicPower || 0;
    const elSkills = document.getElementById('playerSkills');
    if (elSkills) elSkills.textContent = player.skills.map(s => s.name + ' (' + s.key + ')').join(', ');
}

function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}

function enterFullscreen() {
    const el = document.getElementById('gameContainer') || document.documentElement;
    if (!el) return;
    if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function toggleFullscreen() {
    if (isFullscreen()) exitFullscreen(); else enterFullscreen();
}

function fitCanvasToViewport() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);
    const w = Math.round(BASE_WIDTH * scale);
    const h = Math.round(BASE_HEIGHT * scale);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
}

const _onFullScreenChange = function() {
    const container = document.getElementById('gameContainer');
    const fsBtn = document.getElementById('nav-fullscreen');
    if (isFullscreen()) {
        if (container) container.classList.add('fullscreen');
        document.documentElement.style.overflow = 'hidden';
        fitCanvasToViewport();
        if (fsBtn) fsBtn.textContent = 'Exit Fullscreen';
    } else {
        if (container) container.classList.remove('fullscreen');
        document.documentElement.style.overflow = '';
        resizeCanvas();
        if (fsBtn) fsBtn.textContent = 'Fullscreen';
    }
};

['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange','msfullscreenchange'].forEach(ev => {
    document.addEventListener(ev, _onFullScreenChange, false);
});

function closeTutorial() {
    var panel = document.getElementById('tutorialPanel');
    if (panel) panel.style.display = 'none';
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
    gameState = GAME_STATES.MAIN_MENU;
}

// Start game loop
window.addEventListener('load', () => {
    resizeCanvas();
    setupMobileControls();
    const fsBtn = document.getElementById('nav-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', function(e){ e.preventDefault(); toggleFullscreen(); });
    }
    window.addEventListener('resize', function() { if (isFullscreen()) fitCanvasToViewport(); else resizeCanvas(); });
    // Show resume button if a save exists
    try {
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            if (localStorage.getItem(SAVE_KEY)) resumeBtn.style.display = 'inline-block'; else resumeBtn.style.display = 'none';
        }
    } catch (e) {}

    // Auto-save every 10 seconds
    setInterval(saveGame, 10000);
    window.addEventListener('beforeunload', saveGame);

    gameLoop();
});
