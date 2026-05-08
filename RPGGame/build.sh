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

# Resolve script directory so the script can be run from any working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASEDIR="$SCRIPT_DIR"

# Check if Java is installed
if ! command -v javac &> /dev/null
then
    echo -e "${RED}ERROR: Java compiler (javac) is not installed or not in PATH${NC}"
    echo "Please install Java SE 11 or higher (JDK) and ensure 'javac' is available"
    exit 1
fi

# Display Java version
echo -e "${GREEN}Found Java:${NC}"
javac -version || true
echo ""

# Create bin directory if it doesn't exist (relative to script)
echo -e "${YELLOW}Creating bin directory...${NC}"
mkdir -p "$BASEDIR/bin"

# Find and compile Java source files (portable and works without globstar)
echo -e "${YELLOW}Compiling Java source files...${NC}"
JAVA_COUNT=$(find "$BASEDIR/src" -name '*.java' | wc -l | tr -d ' ')
if [ "$JAVA_COUNT" -eq 0 ]; then
    echo -e "${RED}No Java source files found in ${BASEDIR}/src — aborting${NC}"
    exit 1
fi

# Use find + xargs to compile all .java files into bin/
find "$BASEDIR/src" -name '*.java' -print0 | xargs -0 javac -d "$BASEDIR/bin"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Compilation successful!${NC}"
    echo ""

    # Create an executable jar if 'jar' exists
    JAR_CMD=$(command -v jar || true)
    if [ -n "$JAR_CMD" ]; then
        JAR_NAME="ShadowRPG.jar"
        echo -e "${YELLOW}Creating executable JAR: ${JAR_NAME}${NC}"
        # -c create, -f output file, -e entry point
        jar cfe "$BASEDIR/${JAR_NAME}" com.shadowrpg.core.Game -C "$BASEDIR/bin" . -C "$BASEDIR" res
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Created ${JAR_NAME} in ${BASEDIR}${NC}"
            echo "Run with: java -jar ${BASEDIR}/${JAR_NAME}"
        else
            echo -e "${RED}Failed to create JAR file${NC}"
        fi
    else
        echo -e "${YELLOW}Warning: 'jar' not found; skipping JAR creation${NC}"
        echo "You can run the game with: java -cp ${BASEDIR}/bin com.shadowrpg.core.Game"
    fi

    # Offer to run the jar now
    read -p "Do you want to run the game now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        if [ -f "${BASEDIR}/${JAR_NAME}" ]; then
            echo -e "${YELLOW}Starting Shadow's Tower RPG from JAR...${NC}"
            java -jar "${BASEDIR}/${JAR_NAME}"
        else
            echo -e "${YELLOW}Starting Shadow's Tower RPG from classpath...${NC}"
            java -cp "$BASEDIR/bin" com.shadowrpg.core.Game
        fi
    fi
else
    echo -e "${RED}Compilation failed!${NC}"
    echo "Please check for errors in the source code"
    exit 1
fi
