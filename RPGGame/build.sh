#!/bin/bash

# Shadow's Tower RPG - Build Script
# This script compiles the Java source code and runs the game

echo "========================================="
echo "Shadow's Tower RPG - Build & Run Script"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Java is installed
if ! command -v javac &> /dev/null
then
    echo -e "${RED}ERROR: Java is not installed or not in PATH${NC}"
    echo "Please install Java SE 11 or higher"
    exit 1
fi

# Display Java version
echo -e "${GREEN}Found Java:${NC}"
javac -version
echo ""

# Create bin directory if it doesn't exist
echo -e "${YELLOW}Creating bin directory...${NC}"
mkdir -p bin

# Compile Java source files
echo -e "${YELLOW}Compiling Java source files...${NC}"
javac -d bin src/com/shadowrpg/**/*.java

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Compilation successful!${NC}"
    echo ""
    
    # Ask user if they want to run the game
    read -p "Do you want to run the game now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo -e "${YELLOW}Starting Shadow's Tower RPG...${NC}"
        echo ""
        java -cp bin com.shadowrpg.core.Game
    fi
else
    echo -e "${RED}Compilation failed!${NC}"
    echo "Please check for errors in the source code"
    exit 1
fi
