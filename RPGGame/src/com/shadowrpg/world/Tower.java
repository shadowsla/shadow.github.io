package com.shadowrpg.world;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * Tower - Represents a tower with multiple floors and bosses
 */
public class Tower {
    private String name;
    private String description;
    private int floorCount;
    private int difficultyTier;
    private List<Floor> floors;
    private Boss boss;

    public Tower(String name, String description, int floorCount, int difficultyTier) {
        this.name = name;
        this.description = description;
        this.floorCount = floorCount;
        this.difficultyTier = difficultyTier;
        this.floors = new ArrayList<>();
        initializeFloors();
        this.boss = createBoss();
    }

    private void initializeFloors() {
        for (int i = 1; i <= floorCount; i++) {
            if (i == floorCount) {
                // Last floor has the boss
                floors.add(new Floor(i, true));
            } else {
                floors.add(new Floor(i, false));
            }
        }
    }

    private Boss createBoss() {
        String[] bossNames = {"Shadow Lord", "Crimson Warlord", "Frost King", "Inferno Prince", 
                              "Mystic Sage", "Dragon Overlord"};
        String bossName = bossNames[Math.min(difficultyTier - 1, bossNames.length - 1)];
        
        int health = 200 + (difficultyTier * 50);
        int damage = 20 + (difficultyTier * 5);
        int expReward = 1000 * difficultyTier;
        
        return new Boss(bossName, 640, 360, floorCount, health, damage, expReward, difficultyTier);
    }

    public Floor getFloor(int floorNumber) {
        if (floorNumber > 0 && floorNumber <= floors.size()) {
            return floors.get(floorNumber - 1);
        }
        return null;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public int getFloorCount() { return floorCount; }
    public int getDifficultyTier() { return difficultyTier; }
    public List<Floor> getFloors() { return floors; }
    public Boss getBoss() { return boss; }
}
