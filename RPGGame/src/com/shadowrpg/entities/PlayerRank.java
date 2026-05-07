package com.shadowrpg.entities;

/**
 * PlayerRank Enum - Represents player progression ranks
 */
public enum PlayerRank {
    F("F - Novice", 0),
    E("E - Apprentice", 500),
    D("D - Experienced", 1200),
    C("C - Seasoned", 2500),
    B("B - Expert", 5000),
    A("A - Master", 10000),
    S("S - Legend", 20000),
    SS("SS - Mythical", 40000),
    SSS("SSS - Divine", 80000),
    Z("Z - Transcendent", 160000);

    private String displayName;
    private int experienceRequired;

    PlayerRank(String displayName, int experienceRequired) {
        this.displayName = displayName;
        this.experienceRequired = experienceRequired;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getExperienceRequired() {
        return experienceRequired;
    }

    /**
     * Get next rank after current rank
     */
    public PlayerRank getNextRank() {
        PlayerRank[] ranks = PlayerRank.values();
        for (int i = 0; i < ranks.length - 1; i++) {
            if (ranks[i] == this) {
                return ranks[i + 1];
            }
        }
        return Z; // Return Z if already at highest
    }

    /**
     * Check if this is the highest rank
     */
    public boolean isMaxRank() {
        return this == Z;
    }
}
