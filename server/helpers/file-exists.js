import fse from 'fs-extra';

export function fileExists(filePath) {
    try {
        return fse.statSync(filePath).isFile();
    } catch (e) {
        return false;
    }
}