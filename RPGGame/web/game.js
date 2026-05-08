// Shadow's Tower RPG - Web Version (JavaScript/Canvas)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_STATES = {
    MAIN_MENU: 'main_menu',
    TOWER_SELECTION: 'tower_selection',
    TOWER_FLOOR: 'tower_floor',
    GUILD: 'guild',
    CRAFTING: 'crafting',
    INVENTORY: 'inventory',
    SKILL_TREE: 'skill_tree',
    BOSS_BATTLE: 'boss_battle',
    PAUSE: 'pause'
};

const WEAPON_TYPES = {
    SHORT_SWORD: { name: 'Short Sword', damage: 15, speed: 1.0 },
    LONG_SWORD: { name: 'Long Sword', damage: 25, speed: 1.2 },
    SPEAR: { name: 'Spear', damage: 20, speed: 1.1 },
    GAUNTLETS: { name: 'Gauntlets', damage: 12, speed: 0.9 },
    BOW: { name: 'Bow', damage: 18, speed: 1.3 },
    AXE: { name: 'Axe', damage: 30, speed: 0.8 },
    SCYTHE: { name: 'Scythe', damage: 28, speed: 1.0 },
    WARHAMMER: { name: 'War Hammer', damage: 35, speed: 0.7 },
    DAGGER: { name: 'Dagger', damage: 10, speed: 1.5 },
    MACE: { name: 'Mace', damage: 22, speed: 0.9 }
};

const PLAYER_RANKS = [
    'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Z'
];

const TOWERS = [
    { name: 'Tower of Shadows', floors: 5, difficulty: 1 },
    { name: 'Crimson Peak', floors: 6, difficulty: 2 },
    { name: 'Frozen Abyss', floors: 7, difficulty: 3 },
    { name: 'Inferno Citadel', floors: 8, difficulty: 4 },
    { name: 'Mystic Spire', floors: 9, difficulty: 5 },
    { name: 'Draconic Sanctum', floors: 10, difficulty: 6 }
];

const ENEMY_TYPES = [
    { name: 'Goblin', health: 20, damage: 5, exp: 30 },
    { name: 'Orc', health: 40, damage: 10, exp: 60 },
    { name: 'Skeleton', health: 35, damage: 8, exp: 50 },
    { name: 'Zombie', health: 50, damage: 12, exp: 70 },
    { name: 'Demon', health: 80, damage: 20, exp: 150 },
    { name: 'Dragon', health: 200, damage: 40, exp: 500 }
];

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
                gameState = GAME_STATES.TOWER_SELECTION;
            }
            break;
        case 'I':
            gameState = GAME_STATES.INVENTORY;
            break;
        case 'G':
            gameState = GAME_STATES.GUILD;
            break;
        case 'S':
            gameState = GAME_STATES.SKILL_TREE;
            break;
        case 'C':
            gameState = GAME_STATES.CRAFTING;
            break;
        case 'ESCAPE':
            gameState = GAME_STATES.MAIN_MENU;
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
    
    // FPS
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'right';
    ctx.fillText('FPS: ' + fps, canvas.width - 20, 25);
}

function closeTutorial() {
    var panel = document.getElementById('tutorialPanel');
    if (panel) panel.style.display = 'none';
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
    gameState = GAME_STATES.MAIN_MENU;
}

// Start game loop
window.addEventListener('load', () => {
    gameLoop();
});
