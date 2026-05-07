package com.shadowrpg.entities;

/**
 * Armor - Represents armor pieces worn by the player
 */
public class Armor {
    private String name;
    private int defense;
    private int maxHealthBonus;
    private String description;
    private int rarity; // 0 = common, 1 = uncommon, 2 = rare, 3 = epic, 4 = legendary

    public Armor(String name, int defense, int maxHealthBonus) {
        this.name = name;
        this.defense = defense;
        this.maxHealthBonus = maxHealthBonus;
        this.description = "";
        this.rarity = 0;
    }

    public Armor(String name, int defense, int maxHealthBonus, String description, int rarity) {
        this.name = name;
        this.defense = defense;
        this.maxHealthBonus = maxHealthBonus;
        this.description = description;
        this.rarity = rarity;
    }

    public String getName() { return name; }
    public int getDefense() { return defense; }
    public int getMaxHealthBonus() { return maxHealthBonus; }
    public String getDescription() { return description; }
    public int getRarity() { return rarity; }
    public String getRarityName() {
        switch (rarity) {
            case 0: return "Common";
            case 1: return "Uncommon";
            case 2: return "Rare";
            case 3: return "Epic";
            case 4: return "Legendary";
            default: return "Unknown";
        }
    }
}
