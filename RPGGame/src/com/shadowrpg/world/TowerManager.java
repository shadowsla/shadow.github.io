package com.shadowrpg.world;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * TowerManager - Manages all towers and floor progression
 */
public class TowerManager {
    private List<Tower> towers;
    private Tower currentTower;
    private int currentTowerIndex;
    private int currentFloor;
    private boolean allTowersComplete;
    private boolean seventhTowerSpawned;

    public TowerManager() {
        this.towers = new ArrayList<>();
        this.currentTowerIndex = 0;
        this.currentFloor = 1;
        this.allTowersComplete = false;
        this.seventhTowerSpawned = false;
        initializeTowers();
    }

    private void initializeTowers() {
        towers.add(new Tower("Tower of Shadows", "The beginning of your journey", 5, 1));
        towers.add(new Tower("Crimson Peak", "A blood-stained mountain", 6, 2));
        towers.add(new Tower("Frozen Abyss", "A chilling descent into ice", 7, 3));
        towers.add(new Tower("Inferno Citadel", "The flames consume all", 8, 4));
        towers.add(new Tower("Mystic Spire", "Magic runs rampant here", 9, 5));
        towers.add(new Tower("Draconic Sanctum", "Where dragons rest", 10, 6));
        
        currentTower = towers.get(0);
    }

    public void selectTower(int index) {
        if (index >= 0 && index < towers.size()) {
            currentTowerIndex = index;
            currentTower = towers.get(index);
            currentFloor = 1;
        }
    }

    public void advanceFloor() {
        if (currentTower != null && currentFloor < currentTower.getFloorCount()) {
            currentFloor++;
        }
    }

    public boolean isCurrentTowerComplete() {
        return currentFloor >= currentTower.getFloorCount();
    }

    public void nextTower() {
        if (currentTowerIndex < towers.size() - 1) {
            currentTowerIndex++;
            currentTower = towers.get(currentTowerIndex);
            currentFloor = 1;
        } else {
            allTowersComplete = true;
        }
    }

    public void spawnSeventhTower() {
        if (!seventhTowerSpawned && allTowersComplete) {
            Tower seventhTower = new Tower("The Seventh Tower", "The Ultimate Challenge", 15, 7);
            towers.add(seventhTower);
            seventhTowerSpawned = true;
            currentTowerIndex = 6;
            currentTower = seventhTower;
            currentFloor = 1;
        }
    }

    public boolean isAllTowersComplete() {
        return allTowersComplete;
    }

    public String[] getTowerNames() {
        String[] names = new String[towers.size()];
        for (int i = 0; i < towers.size(); i++) {
            names[i] = towers.get(i).getName();
        }
        return names;
    }

    // Getters
    public Tower getCurrentTower() { return currentTower; }
    public int getCurrentFloor() { return currentFloor; }
    public List<Tower> getTowers() { return towers; }
    public int getCurrentTowerIndex() { return currentTowerIndex; }
    public boolean hasSeventhTowerSpawned() { return seventhTowerSpawned; }
}
