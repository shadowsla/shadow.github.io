package com.shadowrpg.entities;

/**
 * Item - Represents an item that can be picked up and held
 */
public class Item {
    private String name;
    private String description;
    private ItemType type;
    private int rarity; // 0 = common, 1 = uncommon, 2 = rare, 3 = epic, 4 = legendary
    private int quantity;
    private int value; // For selling

    public Item(String name, ItemType type) {
        this(name, type, 1);
    }

    public Item(String name, ItemType type, int quantity) {
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.rarity = 0;
        this.value = 10 * quantity;
        this.description = "A " + name.toLowerCase();
    }

    public Item(String name, String description, ItemType type, int rarity, int quantity, int value) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.rarity = rarity;
        this.quantity = quantity;
        this.value = value;
    }

    public void addQuantity(int amount) {
        this.quantity += amount;
    }

    public void removeQuantity(int amount) {
        this.quantity -= amount;
        if (this.quantity < 0) {
            this.quantity = 0;
        }
    }

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

    // Getters
    public String getName() { return name; }
    public String getDescription() { return description; }
    public ItemType getType() { return type; }
    public int getRarity() { return rarity; }
    public int getQuantity() { return quantity; }
    public int getValue() { return value * quantity; }

    // Setters
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setRarity(int rarity) { this.rarity = rarity; }
    public void setDescription(String description) { this.description = description; }
}
