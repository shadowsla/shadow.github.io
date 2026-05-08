#!/bin/bash
# Run the ShadowRPG jar or classes (script-directory-relative)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JAR="$SCRIPT_DIR/ShadowRPG.jar"
if [ -f "$JAR" ]; then
    echo "Running $JAR"
    java -jar "$JAR"
else
    if [ -d "$SCRIPT_DIR/bin" ]; then
        echo "Running from classes in $SCRIPT_DIR/bin"
        java -cp "$SCRIPT_DIR/bin" com.shadowrpg.core.Game
    else
        echo "No jar or compiled classes found. Run build.sh first."
        exit 1
    fi
fi
