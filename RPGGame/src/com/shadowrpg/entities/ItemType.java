package com.shadowrpg.entities;

/**
 * ItemType - Different types of items that can be collected
 */
public enum ItemType {
    WEAPON("Weapon"),
    ARMOR("Armor"),
    CRAFTING_MATERIAL("Crafting Material"),
    CONSUMABLE("Consumable"),
    KEY_ITEM("Key Item"),
    QUEST_ITEM("Quest Item"),
    TREASURE("Treasure"),
    CURRENCY("Currency"),
    ACCESSORY("Accessory");

    private String displayName;

    ItemType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
