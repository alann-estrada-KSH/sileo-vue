import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "src/styles.css");
const targetDir = resolve(root, "dist");
const target = resolve(targetDir, "styles.css");

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
