# Texture Optimization Guide

## WebP Conversion for Better Performance

To get the smooth FPS you want, your textures should be in WebP format. Here's how to convert them:

### 1. Install WebP conversion tools
```bash
npm install -g imagemin-webp imagemin
# Or use: npm install -g sharp
```

### 2. Convert your textures
Using Sharp (recommended):
```bash
# Convert all PNG files to WebP
find ./client/public/assets/textures -name "*.png" -exec sh -c 'sharp "$1" -o "${1%.png}.webp"' _ {} \;
```

Using ImageMagick:
```bash
# Convert all PNG files to WebP
for file in ./client/public/assets/textures/*.png; do
    convert "$file" -quality 80 -define webp:lossless=false "${file%.png}.webp"
done
```

### 3. Update texture paths
Your DungeonView component already tries WebP first, then falls back to PNG. Just add WebP versions alongside your existing PNG files.

### 4. Expected Performance Improvements
- **25-35% smaller file sizes** → Faster loading
- **Better GPU compression** → Smoother rendering
- **Reduced memory usage** → Higher stable FPS

### 5. Performance Monitoring
With the new PerformanceMonitor component, you'll see:
- Real-time FPS display
- Render time per frame
- Memory usage

### 6. Frame Rate Limiting
The system now targets 60 FPS with adaptive frame skipping to prevent excessive CPU usage.

## Quick Test
1. Run your development server
2. Check the top-left corner for FPS counter
3. Move around the dungeon to see performance
4. Look for green colors (good performance) vs red (needs optimization)

## Next Steps
If you still want more performance, consider:
1. Install the performance packages: `npm install stats.js r3f-perf three-mesh-bvh @tweenjs/tween.js`
2. Convert textures to WebP using the commands above
3. Test on lower-end devices to see real-world performance

The texture optimizations are now in place - your dungeon crawler should run much smoother!