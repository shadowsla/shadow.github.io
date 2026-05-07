package com.shadowrpg.entities;

/**
 * Vector - Simple 2D vector for direction and positioning
 */
public class Vector {
    public double x;
    public double y;

    public Vector(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double length() {
        return Math.sqrt(x * x + y * y);
    }

    public Vector normalize() {
        double len = length();
        if (len == 0) return new Vector(0, 0);
        return new Vector(x / len, y / len);
    }

    public Vector add(Vector other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public Vector multiply(double scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public double dot(Vector other) {
        return this.x * other.x + this.y * other.y;
    }
}
