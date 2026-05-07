package com.shadowrpg.world;

/**
 * Floor - Represents a single floor in a tower
 */
public class Floor {
    private int floorNumber;
    private boolean hasBoss;
    private int enemyCount;
    private int miniBossCount;
    private boolean cleared;
    private double secretPathChance;

    public Floor(int floorNumber, boolean hasBoss) {
        this.floorNumber = floorNumber;
        this.hasBoss = hasBoss;
        this.cleared = false;
        this.secretPathChance = 0.15; // 15% chance to have secret path
        
        if (hasBoss) {
            this.enemyCount = 3 + (floorNumber / 2);
            this.miniBossCount = 1;
        } else {
            this.enemyCount = 4 + (floorNumber / 3);
            this.miniBossCount = (floorNumber % 3 == 0) ? 1 : 0;
        }
    }

    public void clearFloor() {
        this.cleared = true;
    }

    public boolean hasSecretPath() {
        return Math.random() < secretPathChance;
    }

    public int getFloorNumber() { return floorNumber; }
    public boolean hasBoss() { return hasBoss; }
    public int getEnemyCount() { return enemyCount; }
    public int getMiniBossCount() { return miniBossCount; }
    public boolean isCleared() { return cleared; }
}
