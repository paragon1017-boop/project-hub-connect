import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// Serve static files from dist/public
const distPath = path.resolve("dist/public");

if (!fs.existsSync(distPath)) {
  console.error(`Build directory not found: ${distPath}`);
  console.error("Please run 'npx vite build' first");
  process.exit(1);
}

app.use(express.static(distPath));

// Fall through to index.html for client-side routing
app.use("/{*path}", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Game server running at http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop");
});
