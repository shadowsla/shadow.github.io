// Player management for web version

function gainExperience(amount) {
    player.experience += amount;
    // Level up while reaching next threshold
    while (player.experience >= player.experienceToNextRank) {
        player.experience -= player.experienceToNextRank;
        player.level = (player.level || 1) + 1;
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.maxMana += 10;
        player.mana = player.maxMana;
        player.experienceToNextRank = Math.round(player.experienceToNextRank * 1.2);
        // Optionally increase rank based on level thresholds
        if (player.level % 5 === 0 && player.rank < PLAYER_RANKS.length - 1) {
            player.rank++;
        }
    }
}

function rankUp() {
    if (player.rank < PLAYER_RANKS.length - 1) {
        player.rank++;
        player.maxHealth += 50;
        player.health = player.maxHealth;
        player.maxMana += 25;
        player.mana = player.maxMana;
        player.experienceToNextRank = Math.round(player.experienceToNextRank * 1.5);
    }
}

function switchWeapon(weaponType) {
    player.currentWeapon = weaponType;
    player.attackCooldown = 1.0 / weaponType.speed;
    
    // Initialize synchronization if not exists
    if (!player.synchronization[weaponType.name]) {
        player.synchronization[weaponType.name] = 0;
    }
}

function takeDamage(amount) {
    const armorDefense = player.armor.defense || 0;
    const actualDamage = Math.max(1, amount - armorDefense);
    player.health = Math.max(0, player.health - actualDamage);
}

function addToInventory(item) {
    if (player.inventory.length < player.maxInventory) {
        // Check if item already exists
        const existing = player.inventory.find(i => i.name === item.name);
        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            player.inventory.push({
                name: item.name,
                quantity: item.quantity || 1,
                type: item.type,
                rarity: item.rarity || 0
            });
        }
        return true;
    }
    return false;
}

function removeFromInventory(itemName, quantity = 1) {
    const item = player.inventory.find(i => i.name === itemName);
    if (item) {
        item.quantity -= quantity;
        if (item.quantity <= 0) {
            player.inventory = player.inventory.filter(i => i.name !== itemName);
        }
        return true;
    }
    return false;
}

function useItem(itemName) {
    const item = player.inventory.find(i => i.name === itemName);
    if (item) {
        if (item.name === 'Healing Potion') {
            player.health = Math.min(player.maxHealth, player.health + 50);
            removeFromInventory(itemName, 1);
            return true;
        } else if (item.name === 'Mana Potion') {
            player.mana = Math.min(player.maxMana, player.mana + 30);
            removeFromInventory(itemName, 1);
            return true;
        }
    }
    return false;
}

function addGold(amount) {
    player.gold += amount;
}

function spendGold(amount) {
    if (player.gold >= amount) {
        player.gold -= amount;
        return true;
    }
    return false;
}

function getWeaponSync() {
    const sync = player.synchronization[player.currentWeapon.name] || 0;
    return Math.min(100, sync);
}

function increaseWeaponSync(amount = 1) {
    const weaponName = player.currentWeapon.name;
    if (!player.synchronization[weaponName]) {
        player.synchronization[weaponName] = 0;
    }
    player.synchronization[weaponName] += amount * 0.1;
}

function getPlayerStats() {
    return {
        name: player.name,
        rank: PLAYER_RANKS[player.rank],
        level: player.level,
        health: Math.round(player.health),
        maxHealth: player.maxHealth,
        mana: Math.round(player.mana),
        maxMana: player.maxMana,
        experience: player.experience,
        nextRankExp: player.experienceToNextRank,
        weapon: player.currentWeapon.name,
        weaponSync: getWeaponSync().toFixed(1),
        gold: player.gold,
        armor: player.armor.defense,
        magicPower: player.magicPower || 0,
        skills: (player.skills || []).map(s => ({ name: s.name, key: s.key })),
        keyPieces: player.keyPieces || 0
    };
}
