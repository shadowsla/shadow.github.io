package com.shadowrpg.entities;

import java.awt.*;

/**
 * WeaponType Enum - All available weapon types
 */
public enum WeaponType {
    SHORT_SWORD("Short Sword", 15, 1.0),
    LONG_SWORD("Long Sword", 25, 1.2),
    SPEAR("Spear", 20, 1.1),
    GAUNTLETS("Gauntlets", 12, 0.9),
    BOW("Bow", 18, 1.3),
    AXE("Axe", 30, 0.8),
    SCYTHE("Scythe", 28, 1.0),
    WARHAMMER("War Hammer", 35, 0.7),
    DAGGER("Dagger", 10, 1.5),
    MACE("Mace", 22, 0.9),
    HALBERD("Halberd", 32, 0.85),
    STAFF("Staff", 20, 1.4),
    KATANA("Katana", 28, 1.1),
    WHIP("Whip", 16, 1.2),
    CROSSBOW("Crossbow", 24, 1.2);

    private String name;
    private int baseDamage;
    private double attackSpeed;

    WeaponType(String name, int baseDamage, double attackSpeed) {
        this.name = name;
        this.baseDamage = baseDamage;
        this.attackSpeed = attackSpeed;
    }

    public String getWeaponName() {
        return name;
    }

    public int getBaseDamage() {
        return baseDamage;
    }

    public double getAttackSpeed() {
        return attackSpeed;
    }
}
