// UI system for web version

const UISystem = {
    inventory: {
        isOpen: false,
        selectedIndex: 0
    },
    skillTree: {
        isOpen: false,
        selectedWeapon: 0
    },
    guild: {
        isOpen: false
    },
    stats: {
        isOpen: false
    },
    crafting: {
        isOpen: false,
        recipes: [
            {
                name: 'Healing Potion',
                materials: [
                    { name: 'Herb', quantity: 3 },
                    { name: 'Water', quantity: 1 }
                ],
                result: { name: 'Healing Potion', quantity: 1 }
            },
            {
                name: 'Mana Potion',
                materials: [
                    { name: 'Mana Crystal', quantity: 2 },
                    { name: 'Water', quantity: 1 }
                ],
                result: { name: 'Mana Potion', quantity: 1 }
            },
            {
                name: 'Iron Sword',
                materials: [
                    { name: 'Metal Scrap', quantity: 5 },
                    { name: 'Coal', quantity: 2 }
                ],
                result: { name: 'Iron Sword', quantity: 1 }
            },
            {
                name: 'Steel Armor',
                materials: [
                    { name: 'Metal Scrap', quantity: 8 },
                    { name: 'Leather', quantity: 3 }
                ],
                result: { name: 'Steel Armor', quantity: 1 }
            }
        ]
    }
};

// clickable areas created by UI panels (used by canvas click handler)
let _skillTreeClickableAreas = [];

function canCraftRecipe(recipe) {
    for (let material of recipe.materials) {
        const hasItem = player.inventory.find(i => i.name === material.name);
        if (!hasItem || hasItem.quantity < material.quantity) {
            return false;
        }
    }
    return true;
}

function craftRecipe(recipe) {
    if (!canCraftRecipe(recipe)) {
        return false;
    }
    
    // Consume materials
    for (let material of recipe.materials) {
        removeFromInventory(material.name, material.quantity);
    }
    
    // Add result
    const result = {
        name: recipe.result.name,
        quantity: recipe.result.quantity,
        type: 'CRAFTED',
        rarity: 1
    };
    addToInventory(result);
    
    return true;
}

function openInventory() {
    UISystem.inventory.isOpen = true;
}

function closeInventory() {
    UISystem.inventory.isOpen = false;
}

function openSkillTree() {
    UISystem.skillTree.isOpen = true;
}

function closeSkillTree() {
    UISystem.skillTree.isOpen = false;
}

function openGuild() {
    UISystem.guild.isOpen = true;
}

function closeGuild() {
    UISystem.guild.isOpen = false;
}

function openCrafting() {
    UISystem.crafting.isOpen = true;
}

function closeCrafting() {
    UISystem.crafting.isOpen = false;
}

function drawInventoryUI(ctx) {
    if (!UISystem.inventory.isOpen) return;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Panel
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    const panelX = 150;
    const panelY = 50;
    const panelWidth = ctx.canvas.width - 300;
    const panelHeight = ctx.canvas.height - 100;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // Title
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('INVENTORY', panelX + 20, panelY + 40);
    
    // Item list
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Arial';
    let itemY = panelY + 80;
    for (let i = 0; i < player.inventory.length; i++) {
        const item = player.inventory[i];
        const isSelected = i === UISystem.inventory.selectedIndex;
        
        if (isSelected) {
            ctx.fillStyle = '#ffff00';
        } else {
            ctx.fillStyle = '#00ff00';
        }
        
        ctx.fillText(item.name + ' x' + item.quantity + ' (Rarity: ' + getRarityName(item.rarity) + ')', 
                     panelX + 40, itemY);
        itemY += 30;
        
        if (itemY > panelY + panelHeight - 50) break;
    }
    
    // Gold
    ctx.fillStyle = '#ffff00';
    ctx.fillText('Gold: ' + player.gold, panelX + 20, panelY + panelHeight - 20);
}

function drawSkillTreeUI(ctx) {
    if (!UISystem.skillTree.isOpen) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    const panelX = 100;
    const panelY = 30;
    const panelWidth = ctx.canvas.width - 200;
    const panelHeight = ctx.canvas.height - 60;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SKILL TREE - ' + (player.className ? CLASS_DEFINITIONS[player.className].display : 'No Class Selected'), ctx.canvas.width / 2, panelY + 40);

    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    _skillTreeClickableAreas = [];

    if (!player.className) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Choose a class first to view and unlock class-specific skills.', panelX + 40, panelY + 100);
        return;
    }

    const def = CLASS_DEFINITIONS[player.className];
    if (!def || !def.skillPool) return;

    let skillY = panelY + 100;
    for (let i = 0; i < def.skillPool.length; i++) {
        const skill = def.skillPool[i];
        const unlocked = player.unlockedClassSkills && player.unlockedClassSkills.includes(skill.name);
        ctx.fillStyle = unlocked ? '#ffff00' : '#00ff00';
        ctx.fillText(skill.name + (unlocked ? ' (Unlocked)' : ''), panelX + 40, skillY);
        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        ctx.fillText(skill.desc, panelX + 40, skillY + 18);

        // draw unlock button area
        const btnX = panelX + panelWidth - 160;
        const btnY = skillY - 12;
        const btnW = 120;
        const btnH = 28;
        ctx.fillStyle = unlocked ? '#333333' : '#004411';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#00ff00'; ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.fillStyle = '#ffffff'; ctx.font = '14px Arial'; ctx.textAlign = 'center';
        const btnText = unlocked ? 'Owned' : ('Unlock (100g)');
        ctx.fillText(btnText, btnX + btnW/2, btnY + 18);

        if (!unlocked) {
            _skillTreeClickableAreas.push({ x: btnX, y: btnY, w: btnW, h: btnH, skillName: skill.name, action: 'unlock' });
        }

        skillY += 48;
        ctx.font = '16px Arial'; ctx.textAlign = 'left';
    }
}

function drawGuildUI(ctx) {
    if (!UISystem.guild.isOpen) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    const panelX = 200;
    const panelY = 100;
    const panelWidth = ctx.canvas.width - 400;
    const panelHeight = ctx.canvas.height - 200;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GUILD', ctx.canvas.width / 2, panelY + 40);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    
    const stats = getPlayerStats();
    ctx.fillText('Player: ' + stats.name, panelX + 30, panelY + 100);
    ctx.fillText('Current Rank: ' + stats.rank, panelX + 30, panelY + 140);
    ctx.fillText('Experience: ' + stats.experience + '/' + stats.nextRankExp, panelX + 30, panelY + 180);
    
    const progressPercent = (stats.experience / stats.nextRankExp) * 100;
    ctx.fillText('Progress: ' + Math.round(progressPercent) + '%', panelX + 30, panelY + 220);
    
    // Progress bar
    ctx.fillStyle = '#333333';
    ctx.fillRect(panelX + 30, panelY + 240, 300, 30);
    ctx.fillStyle = '#00ff00';
    const progressWidth = (progressPercent / 100) * 300;
    ctx.fillRect(panelX + 30, panelY + 240, progressWidth, 30);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX + 30, panelY + 240, 300, 30);
}

function drawCraftingUI(ctx) {
    if (!UISystem.crafting.isOpen) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    const panelX = 100;
    const panelY = 30;
    const panelWidth = ctx.canvas.width - 200;
    const panelHeight = ctx.canvas.height - 60;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRAFTING SYSTEM', ctx.canvas.width / 2, panelY + 40);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    let recipeY = panelY + 100;
    for (let recipe of UISystem.crafting.recipes) {
        const canCraft = canCraftRecipe(recipe);
        ctx.fillStyle = canCraft ? '#00ff00' : '#ff0000';
        
        ctx.fillText(recipe.name, panelX + 40, recipeY);
        recipeY += 25;
        
        for (let material of recipe.materials) {
            ctx.fillText('  - ' + material.name + ' x' + material.quantity, panelX + 60, recipeY);
            recipeY += 20;
        }
        
        recipeY += 15;
    }
}

function toggleStatsPanel() {
    UISystem.stats.isOpen = !UISystem.stats.isOpen;
}

function drawStatsUI(ctx) {
    if (!UISystem.stats.isOpen) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    const panelX = 120;
    const panelY = 40;
    const panelWidth = ctx.canvas.width - 240;
    const panelHeight = ctx.canvas.height - 80;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PLAYER STATS', ctx.canvas.width / 2, panelY + 44);

    const stats = getPlayerStats();
    ctx.fillStyle = '#00ff00';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    let y = panelY + 90;
    ctx.fillText('Name: ' + stats.name, panelX + 30, y); y += 28;
    ctx.fillText('Level: ' + stats.level + '  Rank: ' + stats.rank, panelX + 30, y); y += 28;
    ctx.fillText('HP: ' + stats.health + '/' + stats.maxHealth, panelX + 30, y); y += 24;
    ctx.fillText('Mana: ' + stats.mana + '/' + stats.maxMana, panelX + 30, y); y += 24;
    ctx.fillText('Magic Power: ' + (stats.magicPower || 0), panelX + 30, y); y += 28;
    ctx.fillText('Weapon: ' + stats.weapon + '  Sync: ' + stats.weaponSync + '%', panelX + 30, y); y += 28;
    ctx.fillText('Gold: ' + stats.gold, panelX + 30, y); y += 36;

    // EXP bar
    const expX = panelX + 30;
    const expY = y;
    ctx.fillStyle = '#333333';
    ctx.fillRect(expX, expY, 400, 22);
    ctx.fillStyle = '#00ff00';
    const prog = Math.min(1, stats.experience / stats.nextRankExp);
    ctx.fillRect(expX, expY, 400 * prog, 22);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.strokeRect(expX, expY, 400, 22);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('EXP: ' + Math.round(stats.experience) + ' / ' + stats.nextRankExp, expX + 8, expY + 16);
    y += 46;

    // Skills
    ctx.fillStyle = '#ffaa00';
    ctx.font = '20px Arial';
    ctx.fillText('Skills', panelX + 30, y); y += 28;
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Arial';
    const skills = stats.skills || [];
    for (let s of skills) {
        ctx.fillText('- ' + s.name + ' (' + (s.key || '?') + ')', panelX + 40, y);
        y += 22;
    }
}

function getRarityName(rarity) {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    return rarities[Math.min(rarity, 4)];
}

function drawAllUI(ctx) {
    drawInventoryUI(ctx);
    drawSkillTreeUI(ctx);
    drawGuildUI(ctx);
    drawCraftingUI(ctx);
    drawStatsUI(ctx);
}
