// PlatformFileSystem.ts
import { sys, native } from 'cc';

export class PlatformFileSystem {
    /**
     * 通用保存方法，自动适配平台
     */
    public static saveTextFile(content: string, filename: string): boolean {
        if (sys.isNative) {
            // 原生平台（模拟器/打包后）
            return this.saveNative(content, filename);
        } else if (sys.isBrowser) {
            // 浏览器平台
            return this.saveBrowser(content, filename);
        }
        return false;
    }

    /**
     * 原生平台保存
     */
    private static saveNative(content: string, filename: string): boolean {
        try {
            if(native.fileUtils.isAbsolutePath(filename) == false){
                filename = native.fileUtils.getWritablePath() + "export/" + filename;
            }

            // 确保目录存在
            const dir = filename.substring(0, filename.lastIndexOf('/'));
            if (!native.fileUtils.isDirectoryExist(dir)) {
                native.fileUtils.createDirectory(dir);
            }

            native.fileUtils.writeStringToFile (content, filename);
            console.log(`文件已保存到: ${filename}`);
            return true;
        } catch (error) {
            console.error('保存文件失败:', error);
            return false;
        }
    }

    /**
     * 浏览器平台保存
     */
    private static saveBrowser(content: string, filename: string): boolean {
        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            return true;
        } catch (error) {
            console.error('浏览器保存失败:', error);
            return false;
        }
    }
}