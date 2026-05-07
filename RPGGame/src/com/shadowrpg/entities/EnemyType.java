package com.shadowrpg.entities;

/**
 * EnemyType - Different types of enemies
 */
public enum EnemyType {
    GOBLIN("Goblin", 1, 5, 1),
    ORC("Orc", 2, 15, 2),
    SKELETON("Skeleton", 3, 25, 3),
    ZOMBIE("Zombie", 3, 20, 2),
    WRAITH("Wraith", 4, 30, 4),
    DEMON("Demon", 5, 45, 5),
    GOLEM("Golem", 5, 40, 6),
    DRAGON("Dragon", 8, 80, 10),
    LICH("Lich", 7, 60, 8),
    HYDRA("Hydra", 9, 100, 12),
    WEREWOLF("Werewolf", 4, 35, 4),
    TROLL("Troll", 4, 40, 5),
    GHOST("Ghost", 3, 22, 3),
    MINOTAUR("Minotaur", 6, 50, 7),
    BASILISK("Basilisk", 5, 45, 5);

    private String name;
    private int level;
    private int baseHealth;
    private int baseDamage;

    EnemyType(String name, int level, int baseHealth, int baseDamage) {
        this.name = name;
        this.level = level;
        this.baseHealth = baseHealth;
        this.baseDamage = baseDamage;
    }

    public String getName() { return name; }
    public int getLevel() { return level; }
    public int getBaseHealth() { return baseHealth; }
    public int getBaseDamage() { return baseDamage; }
}
