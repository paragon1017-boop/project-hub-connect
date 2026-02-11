#!/bin/bash

# Performance Package Installation Script
# This script installs all packages needed for smooth FPS in Three.js

echo "🚀 Installing performance packages for smooth FPS..."

# Install React 18 compatible versions
echo "📦 Installing performance monitoring tools..."
npm install stats.js r3f-perf

echo "🎮 Installing Three.js performance libraries..."
npm install three-mesh-bvh @tweenjs/tween.js

echo "🔧 Installing compatible @react-three/drei version for React 18..."
npm install @react-three/drei@9.108.1

echo "✅ Performance packages installed successfully!"
echo ""
echo "📊 Next steps:"
echo "   1. Convert textures to WebP format (see TEXTURE_OPTIMIZATION.md)"
echo "   2. Check the FPS counter in the top-left corner during gameplay"
echo "   3. Look for green colors = good performance, red = needs optimization"
echo ""
echo "🎯 Target: Stable 60 FPS with frame rate limiting active"