"use strict";
(() => {
  // client/src/workers/raycastingWorker.ts
  var map = [];
  var mapWidth = 0;
  var mapHeight = 0;
  var posX = 0;
  var posY = 0;
  var dirX = 0;
  var dirY = 0;
  var planeX = 0;
  var planeY = 0;
  self.onmessage = function(e) {
    const { type, data } = e.data;
    switch (type) {
      case "init":
        map = data.map;
        mapWidth = map[0].length;
        mapHeight = map.length;
        break;
      case "update":
        posX = data.posX;
        posY = data.posY;
        dirX = data.dirX;
        dirY = data.dirY;
        planeX = data.planeX;
        planeY = data.planeY;
        break;
      case "raycast":
        const { w, pxStep } = data;
        const results = [];
        const wHalf = w * 0.5;
        const invW = 1 / w;
        for (let x = 0; x < w; x += pxStep) {
          const cameraX = 2 * x * invW - 1;
          const rayDirX = dirX + planeX * cameraX;
          const rayDirY = dirY + planeY * cameraX;
          let mapX = Math.floor(posX);
          let mapY = Math.floor(posY);
          let sideDistX, sideDistY;
          const deltaDistX = Math.abs(1 / rayDirX);
          const deltaDistY = Math.abs(1 / rayDirY);
          let perpWallDist;
          let stepX, stepY;
          let hit = 0;
          let side;
          if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
          } else {
            stepX = 1;
            sideDistX = (mapX + 1 - posX) * deltaDistX;
          }
          if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
          } else {
            stepY = 1;
            sideDistY = (mapY + 1 - posY) * deltaDistY;
          }
          while (hit === 0) {
            if (sideDistX < sideDistY) {
              sideDistX += deltaDistX;
              mapX += stepX;
              side = 0;
            } else {
              sideDistY += deltaDistY;
              mapY += stepY;
              side = 1;
            }
            if (mapY < 0 || mapX < 0 || mapY >= mapHeight || mapX >= mapWidth) {
              hit = 1;
              perpWallDist = 100;
              break;
            }
            if (map[mapY][mapX] > 0) {
              hit = 1;
              if (side === 0) {
                perpWallDist = sideDistX - deltaDistX;
              } else {
                perpWallDist = sideDistY - deltaDistY;
              }
            }
          }
          results.push({
            x,
            mapX: mapX - (side === 0 ? stepX : 0),
            mapY: mapY - (side === 1 ? stepY : 0),
            perpWallDist,
            side: side || 0
          });
        }
        self.postMessage({ type: "raycast-results", data: results });
        break;
    }
  };
})();
