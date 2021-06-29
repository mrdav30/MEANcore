import fs from 'fs';

export function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (e) {
        return false;
    }
}