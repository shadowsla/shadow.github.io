package com.shadowrpg.systems;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * SkillTreeSystem - Manages skill trees for each weapon type
 */
public class SkillTreeSystem {
    private Map<WeaponType, SkillTree> skillTrees;
    private Map<WeaponType, Integer> skillPoints;

    public SkillTreeSystem() {
        this.skillTrees = new HashMap<>();
        this.skillPoints = new HashMap<>();
        initializeSkillTrees();
    }

    private void initializeSkillTrees() {
        for (WeaponType weapon : WeaponType.values()) {
            skillTrees.put(weapon, new SkillTree(weapon));
            skillPoints.put(weapon, 0);
        }
    }

    public void addSkillPoints(WeaponType weapon, int points) {
        skillPoints.put(weapon, skillPoints.getOrDefault(weapon, 0) + points);
    }

    public boolean learnSkill(WeaponType weapon, String skillName) {
        SkillTree tree = skillTrees.get(weapon);
        if (tree != null && skillPoints.getOrDefault(weapon, 0) > 0) {
            if (tree.learnSkill(skillName)) {
                skillPoints.put(weapon, skillPoints.get(weapon) - 1);
                return true;
            }
        }
        return false;
    }

    public SkillTree getSkillTree(WeaponType weapon) {
        return skillTrees.get(weapon);
    }

    public int getSkillPoints(WeaponType weapon) {
        return skillPoints.getOrDefault(weapon, 0);
    }

    /**
     * SkillTree class
     */
    public static class SkillTree {
        private WeaponType weapon;
        private Map<String, Skill> skills;

        public SkillTree(WeaponType weapon) {
            this.weapon = weapon;
            this.skills = new HashMap<>();
            initializeSkills(weapon);
        }

        private void initializeSkills(WeaponType weapon) {
            // Basic skills available for all weapons
            skills.put("Slash", new Skill("Slash", "Basic attack", 1.0, false));
            skills.put("Heavy Strike", new Skill("Heavy Strike", "Powerful blow", 1.5, false));
            skills.put("Whirlwind", new Skill("Whirlwind", "Spinning attack", 2.0, false));
            skills.put("Counterattack", new Skill("Counterattack", "React to enemy attacks", 1.2, false));
            skills.put("Berserk", new Skill("Berserk", "Massive damage boost", 3.0, false));

            // Weapon-specific skills
            switch (weapon) {
                case LONG_SWORD:
                    skills.put("Cleave", new Skill("Cleave", "Split enemies in two", 2.5, true));
                    break;
                case SPEAR:
                    skills.put("Thrust", new Skill("Thrust", "Penetrating attack", 1.8, true));
                    break;
                case AXE:
                    skills.put("Riptide", new Skill("Riptide", "Devastating swing", 3.0, true));
                    break;
                case BOW:
                    skills.put("Multi-Shot", new Skill("Multi-Shot", "Fire multiple arrows", 2.2, true));
                    break;
                case SCYTHE:
                    skills.put("Reap", new Skill("Reap", "Life-stealing attack", 2.8, true));
                    break;
            }
        }

        public boolean learnSkill(String skillName) {
            if (skills.containsKey(skillName)) {
                skills.get(skillName).unlock();
                return true;
            }
            return false;
        }

        public Skill getSkill(String name) {
            return skills.get(name);
        }

        public Collection<Skill> getAllSkills() {
            return skills.values();
        }
    }

    /**
     * Skill class
     */
    public static class Skill {
        private String name;
        private String description;
        private double damageMultiplier;
        private boolean isWeaponSpecific;
        private boolean unlocked;

        public Skill(String name, String description, double damageMultiplier, boolean isWeaponSpecific) {
            this.name = name;
            this.description = description;
            this.damageMultiplier = damageMultiplier;
            this.isWeaponSpecific = isWeaponSpecific;
            this.unlocked = false;
        }

        public void unlock() {
            this.unlocked = true;
        }

        public String getName() { return name; }
        public String getDescription() { return description; }
        public double getDamageMultiplier() { return damageMultiplier; }
        public boolean isUnlocked() { return unlocked; }
    }
}
