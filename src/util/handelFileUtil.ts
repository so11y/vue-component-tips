
type HandleFile = (filePath: string, scopeConfig: FileConfig) => Record<"key" | "path", string>;

export type FileConfig = Record<"path" | "alias", string> & { sub: boolean };

const getFileName = (filsPath: String): string => {
    return filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf("."));
};

const getParentFolderName = (filsPath: String): string => {
    const splitFolderNames = filsPath.split('/');
    return splitFolderNames[splitFolderNames.length - 2] || "";
};

const fileIsStyleFile = (fileName: string): boolean => {
    return fileName.includes("style");
};

const jointFile = (filePath: string, config: FileConfig): string => {
    const fileName = getFileName(filePath);
    const folderName = getParentFolderName(filePath);
    const isStyle = fileIsStyleFile(fileName);

    let file = fileName;
    if (isStyle) {
        file = folderName + "-" + file;
    }

    if (config.sub) {
        const splitFiles = filePath.split("/");
        const subFileName = splitFiles[splitFiles.findIndex(v => v === "components") - 1];

        file = `${subFileName}-` + file;
    }

    return config.alias + file;
};


export const handleFile: HandleFile = (filePath, scopeConfig) => {
    return {
        key: jointFile(filePath, scopeConfig),
        path: filePath
    };
};
