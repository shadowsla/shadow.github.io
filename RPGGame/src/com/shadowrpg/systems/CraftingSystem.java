package com.shadowrpg.systems;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * CraftingSystem - Allows players to craft items from materials
 */
public class CraftingSystem {
    private Map<String, Recipe> recipes;
    private List<String> learnedRecipes;

    public CraftingSystem() {
        this.recipes = new HashMap<>();
        this.learnedRecipes = new ArrayList<>();
        initializeRecipes();
    }

    private void initializeRecipes() {
        // Weapon recipes
        recipes.put("Iron Sword", new Recipe("Iron Sword", 
            new Item[]{new Item("Metal Scrap", ItemType.CRAFTING_MATERIAL, 5),
                      new Item("Coal", ItemType.CRAFTING_MATERIAL, 2)},
            new Item("Iron Sword", "Strong weapon", ItemType.WEAPON, 1, 1, 150)));

        recipes.put("Steel Armor", new Recipe("Steel Armor",
            new Item[]{new Item("Metal Scrap", ItemType.CRAFTING_MATERIAL, 8),
                      new Item("Leather", ItemType.CRAFTING_MATERIAL, 3)},
            new Item("Steel Armor", "Protection", ItemType.ARMOR, 1, 1, 200)));

        recipes.put("Healing Potion", new Recipe("Healing Potion",
            new Item[]{new Item("Herb", ItemType.CRAFTING_MATERIAL, 3),
                      new Item("Water", ItemType.CRAFTING_MATERIAL, 1)},
            new Item("Healing Potion", "Restores HP", ItemType.CONSUMABLE, 0, 1, 50)));

        // Learn basic recipes by default
        learnedRecipes.add("Healing Potion");
    }

    public boolean craft(String recipeName, InventorySystem inventory) {
        if (!learnedRecipes.contains(recipeName)) {
            return false;
        }

        Recipe recipe = recipes.get(recipeName);
        if (recipe == null || !recipe.canCraft(inventory)) {
            return false;
        }

        // Consume materials
        for (Item material : recipe.getMaterials()) {
            Item invItem = inventory.getItemByName(material.getName());
            if (invItem != null) {
                invItem.removeQuantity(material.getQuantity());
                if (invItem.getQuantity() <= 0) {
                    inventory.removeItem(invItem);
                }
            }
        }

        // Add crafted item
        return inventory.addItem(recipe.getResult());
    }

    public void learnRecipe(String recipeName) {
        if (!learnedRecipes.contains(recipeName)) {
            learnedRecipes.add(recipeName);
        }
    }

    public List<String> getLearnedRecipes() { return learnedRecipes; }
    public Recipe getRecipe(String name) { return recipes.get(name); }
    public Collection<Recipe> getAllRecipes() { return recipes.values(); }

    /**
     * Recipe class
     */
    public static class Recipe {
        private String name;
        private Item[] materials;
        private Item result;

        public Recipe(String name, Item[] materials, Item result) {
            this.name = name;
            this.materials = materials;
            this.result = result;
        }

        public boolean canCraft(InventorySystem inventory) {
            for (Item material : materials) {
                Item invItem = inventory.getItemByName(material.getName());
                if (invItem == null || invItem.getQuantity() < material.getQuantity()) {
                    return false;
                }
            }
            return true;
        }

        public String getName() { return name; }
        public Item[] getMaterials() { return materials; }
        public Item getResult() { return result; }
    }
}
