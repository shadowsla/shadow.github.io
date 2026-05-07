// Enemy management for web version

function createEnemy(type, x, y, difficulty = 1) {
    return {
        ...type,
        x: x,
        y: y,
        width: 35,
        height: 35,
        health: type.health + (difficulty * 5),
        maxHealth: type.health + (difficulty * 5),
        damage: type.damage + difficulty,
        experience: type.exp * difficulty,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        attackTimer: 0,
        attackCooldown: 1.5,
        loot: generateLoot(type, difficulty)
    };
}

function generateLoot(enemyType, difficulty) {
    const loot = [];
    
    // Common drop
    loot.push({
        name: enemyType.name + ' Loot',
        quantity: 1,
        rarity: 0,
        type: 'CRAFTING_MATERIAL',
        value: 10 * difficulty
    });
    
    // Rare drop (20% chance)
    if (Math.random() < 0.2) {
        loot.push({
            name: 'Rare Essence',
            quantity: 1,
            rarity: 2,
            type: 'CRAFTING_MATERIAL',
            value: 50 * difficulty
        });
    }
    
    // Epic drop (5% chance)
    if (Math.random() < 0.05) {
        loot.push({
            name: 'Epic Gem',
            quantity: 1,
            rarity: 3,
            type: 'TREASURE',
            value: 200 * difficulty
        });
    }
    
    // Legendary drop (1% chance)
    if (Math.random() < 0.01) {
        loot.push({
            name: 'Legendary Token',
            quantity: 1,
            rarity: 4,
            type: 'TREASURE',
            value: 1000 * difficulty
        });
    }
    
    return loot;
}

function enemyDeath(enemy) {
    // Reward player
    gainExperience(enemy.experience);
    addGold(enemy.experience / 10);
    
    // Drop loot
    for (let item of enemy.loot) {
        addToInventory(item);
    }
}

function updateEnemy(enemy, deltaTime) {
    // Random movement
    if (Math.random() < 0.01) {
        enemy.velocityX = (Math.random() - 0.5) * 4;
        enemy.velocityY = (Math.random() - 0.5) * 4;
    }
    
    // Update cooldown
    enemy.attackTimer += deltaTime;
}

function getEnemyColor(enemyType) {
    switch(enemyType.name.toLowerCase()) {
        case 'goblin': return '#669966';
        case 'orc': return '#996666';
        case 'skeleton': return '#ffffff';
        case 'zombie': return '#669986';
        case 'demon': return '#cc3333';
        case 'dragon': return '#cc9933';
        default: return '#ff0000';
    }
}

class BossEnemy {
    constructor(name, difficulty) {
        this.name = name;
        this.x = 640;
        this.y = 360;
        this.width = 70;
        this.height = 70;
        this.phase = 1;
        this.maxHealth = 200 + (difficulty * 50);
        this.health = this.maxHealth;
        this.damage = 20 + (difficulty * 5);
        this.experience = 1000 * difficulty;
        this.difficulty = difficulty;
        this.attacks = [
            { name: 'Slam', damage: 25 + difficulty * 5, cooldown: 2.0 },
            { name: 'Breath', damage: 35 + difficulty * 5, cooldown: 3.0 },
            { name: 'Stomp', damage: 30 + difficulty * 4, cooldown: 2.5 }
        ];
        this.attackTimer = 0;
        this.attackCooldown = 1.5;
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
    update(deltaTime) {
        this.attackTimer += deltaTime;
        
        // Change phase at health thresholds
        if (this.health < this.maxHealth * 0.66 && this.phase === 1) {
            this.phase = 2;
        } else if (this.health < this.maxHealth * 0.33 && this.phase === 2) {
            this.phase = 3;
        }
    }
    
    getRandomAttack() {
        return this.attacks[Math.floor(Math.random() * this.attacks.length)];
    }
    
    canAttack() {
        return this.attackTimer >= this.attackCooldown;
    }
    
    resetAttackTimer() {
        this.attackTimer = 0;
    }
}

function spawnBoss(towerIndex) {
    const bossNames = [
        'Shadow Lord', 'Crimson Warlord', 'Frost King',
        'Inferno Prince', 'Mystic Sage', 'Dragon Overlord'
    ];
    
    const bossName = bossNames[Math.min(towerIndex, bossNames.length - 1)];
    return new BossEnemy(bossName, towerIndex + 1);
}
