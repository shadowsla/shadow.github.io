package com.shadowrpg.systems;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * InventorySystem - Manages player inventory
 */
public class InventorySystem {
    private List<Item> items;
    private int maxCapacity;
    private int gold;

    public InventorySystem(int maxCapacity) {
        this.items = new ArrayList<>();
        this.maxCapacity = maxCapacity;
        this.gold = 0;
        initializeStartingItems();
    }

    private void initializeStartingItems() {
        addItem(new Item("Health Potion", ItemType.CONSUMABLE, 5));
        addItem(new Item("Mana Potion", ItemType.CONSUMABLE, 3));
    }

    public boolean addItem(Item item) {
        // Check if item already exists and can stack
        for (Item existingItem : items) {
            if (existingItem.getName().equals(item.getName()) && 
                existingItem.getType() == item.getType()) {
                existingItem.addQuantity(item.getQuantity());
                return true;
            }
        }

        // Add new item if space available
        if (items.size() < maxCapacity) {
            items.add(item);
            return true;
        }
        return false;
    }

    public boolean removeItem(Item item) {
        return items.remove(item);
    }

    public boolean removeItemByName(String name) {
        for (Item item : items) {
            if (item.getName().equals(name)) {
                items.remove(item);
                return true;
            }
        }
        return false;
    }

    public Item getItemByName(String name) {
        for (Item item : items) {
            if (item.getName().equals(name)) {
                return item;
            }
        }
        return null;
    }

    public void addGold(int amount) {
        this.gold += amount;
    }

    public boolean spendGold(int amount) {
        if (gold >= amount) {
            gold -= amount;
            return true;
        }
        return false;
    }

    public boolean isFull() {
        return items.size() >= maxCapacity;
    }

    public boolean hasSpace() {
        return items.size() < maxCapacity;
    }

    public int getAvailableSpace() {
        return maxCapacity - items.size();
    }

    public void sortInventory() {
        items.sort((a, b) -> a.getName().compareTo(b.getName()));
    }

    public List<Item> getItems() { return items; }
    public int getMaxCapacity() { return maxCapacity; }
    public int getGold() { return gold; }
    public int getItemCount() { return items.size(); }
}
