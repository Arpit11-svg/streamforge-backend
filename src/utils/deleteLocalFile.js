import fs from "fs";

export const deleteLocalFile = (path) => {
    if (!path) return;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
};