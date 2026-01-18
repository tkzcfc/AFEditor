"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetMapper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AssetMapper {
    /**
     * 生成资源映射表
     */
    static async generateAssetMap() {
        // // 显示进度条
        // await Editor.Message.request('progress', 'start', {
        //     title: '正在生成资源映射表',
        //     info: '正在扫描资源...',
        //     cancelable: false,
        // });
        try {
            // 获取项目assets目录
            const projectPath = Editor.Project.path;
            const assetsPath = path.join(projectPath, 'assets');
            // 资源映射结果
            const assetMap = {};
            // 递归遍历assets目录
            await this.scanDirectory(assetsPath, assetsPath, assetMap);
            // 生成输出文件路径
            const outputPath = path.join(assetsPath, 'asset-uuid-map.json');
            // 按路径排序后写入文件
            const sortedMap = Object.fromEntries(Object.entries(assetMap).sort((a, b) => a[1].localeCompare(b[1])));
            // 写入JSON文件
            fs.writeFileSync(outputPath, JSON.stringify(sortedMap, null, 2), 'utf-8');
            // 显示完成提示
            // await Editor.Message.request('progress', 'finish');
            Editor.Dialog.info(`资源映射表已生成！\n\n` +
                `文件位置：${outputPath}\n` +
                `共找到 ${Object.keys(assetMap).length} 个资源`, { title: '生成完成' });
            console.log(`Asset map generated at: ${outputPath}`);
        }
        catch (error) {
            // await Editor.Message.request('progress', 'finish');
            Editor.Dialog.error(`生成资源映射表时出错：\n${error}`, { title: '生成失败' });
            console.error('Failed to generate asset map:', error);
        }
    }
    /**
     * 递归扫描目录
     */
    static async scanDirectory(rootPath, currentPath, assetMap) {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
            const fullPath = path.join(currentPath, file);
            const stat = fs.statSync(fullPath);
            // 忽略隐藏文件和目录
            if (file.startsWith('.')) {
                continue;
            }
            if (stat.isDirectory()) {
                // 递归扫描子目录
                await this.scanDirectory(rootPath, fullPath, assetMap);
            }
            else if (file.endsWith('.meta')) {
                // 处理meta文件获取UUID
                await this.processMetaFile(rootPath, fullPath, assetMap);
            }
        }
    }
    /**
     * 处理meta文件
     */
    static async processMetaFile(rootPath, metaFilePath, assetMap) {
        try {
            // 读取meta文件
            const metaContent = fs.readFileSync(metaFilePath, 'utf-8');
            const metaData = JSON.parse(metaContent);
            // 获取UUID
            const uuid = metaData.uuid;
            if (!uuid) {
                return;
            }
            // 计算相对路径（去除.meta后缀）
            const assetPath = metaFilePath.slice(0, -5); // 去掉.meta
            const relativePath = path.relative(rootPath, assetPath);
            const convertedPath = relativePath.replace(/\\/g, '/');
            // 添加到映射表
            assetMap[uuid] = convertedPath;
        }
        catch (error) {
            console.warn(`Failed to process meta file: ${metaFilePath}`, error);
        }
    }
}
exports.AssetMapper = AssetMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNzZXRNYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvQXNzZXRNYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUk3QixNQUFhLFdBQVc7SUFDcEI7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtRQUNoQyxXQUFXO1FBQ1gsc0RBQXNEO1FBQ3RELDBCQUEwQjtRQUMxQix5QkFBeUI7UUFDekIseUJBQXlCO1FBQ3pCLE1BQU07UUFFTixJQUFJLENBQUM7WUFDRCxlQUFlO1lBQ2YsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDeEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFcEQsU0FBUztZQUNULE1BQU0sUUFBUSxHQUEyQixFQUFFLENBQUM7WUFFNUMsZUFBZTtZQUNmLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTNELFdBQVc7WUFDWCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1lBRWhFLGFBQWE7WUFDYixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDcEUsQ0FBQztZQUVGLFdBQVc7WUFDWCxFQUFFLENBQUMsYUFBYSxDQUNaLFVBQVUsRUFDVixJ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LENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQTNIRCxrQ0EySEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IEVkaXRvcjogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TWFwcGVyIHtcclxuICAgIC8qKlxyXG4gICAgICog55Sf5oiQ6LWE5rqQ5pig5bCE6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVBc3NldE1hcCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAvLyAvLyDmmL7npLrov5vluqbmnaFcclxuICAgICAgICAvLyBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdwcm9ncmVzcycsICdzdGFydCcsIHtcclxuICAgICAgICAvLyAgICAgdGl0bGU6ICfmraPlnKjnlJ/miJDotYTmupDmmKDlsITooagnLFxyXG4gICAgICAgIC8vICAgICBpbmZvOiAn5q2j5Zyo5omr5o+P6LWE5rqQLi4uJyxcclxuICAgICAgICAvLyAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIOiOt+WPlumhueebrmFzc2V0c+ebruW9lVxyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IEVkaXRvci5Qcm9qZWN0LnBhdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0c1BhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdhc3NldHMnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOi1hOa6kOaYoOWwhOe7k+aenFxyXG4gICAgICAgICAgICBjb25zdCBhc3NldE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g6YCS5b2S6YGN5Y6GYXNzZXRz55uu5b2VXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2NhbkRpcmVjdG9yeShhc3NldHNQYXRoLCBhc3NldHNQYXRoLCBhc3NldE1hcCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDnlJ/miJDovpPlh7rmlofku7bot6/lvoRcclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGguam9pbihhc3NldHNQYXRoLCAnYXNzZXQtdXVpZC1tYXAuanNvbicpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g5oyJ6Lev5b6E5o6S5bqP5ZCO5YaZ5YWl5paH5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZE1hcCA9IE9iamVjdC5mcm9tRW50cmllcyhcclxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGFzc2V0TWFwKS5zb3J0KChhLCBiKSA9PiBhWzFdLmxvY2FsZUNvbXBhcmUoYlsxXSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDlhpnlhaVKU09O5paH5Lu2XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRQYXRoLFxyXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc29ydGVkTWFwLCBudWxsLCAyKSxcclxuICAgICAgICAgICAgICAgICd1dGYtOCdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOaYvuekuuWujOaIkOaPkOekulxyXG4gICAgICAgICAgICAvLyBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdwcm9ncmVzcycsICdmaW5pc2gnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcclxuICAgICAgICAgICAgICAgIGDotYTmupDmmKDlsITooajlt7LnlJ/miJDvvIFcXG5cXG5gICtcclxuICAgICAgICAgICAgICAgIGDmlofku7bkvY3nva7vvJoke291dHB1dFBhdGh9XFxuYCArXHJcbiAgICAgICAgICAgICAgICBg5YWx5om+5YiwICR7T2JqZWN0LmtleXMoYXNzZXRNYXApLmxlbmd0aH0g5Liq6LWE5rqQYCxcclxuICAgICAgICAgICAgICAgIHsgdGl0bGU6ICfnlJ/miJDlrozmiJAnIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBc3NldCBtYXAgZ2VuZXJhdGVkIGF0OiAke291dHB1dFBhdGh9YCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3Byb2dyZXNzJywgJ2ZpbmlzaCcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5lcnJvcihcclxuICAgICAgICAgICAgICAgIGDnlJ/miJDotYTmupDmmKDlsITooajml7blh7rplJnvvJpcXG4ke2Vycm9yfWAsXHJcbiAgICAgICAgICAgICAgICB7IHRpdGxlOiAn55Sf5oiQ5aSx6LSlJyB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZ2VuZXJhdGUgYXNzZXQgbWFwOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJLlvZLmiavmj4/nm67lvZVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgc2NhbkRpcmVjdG9yeShcclxuICAgICAgICByb290UGF0aDogc3RyaW5nLFxyXG4gICAgICAgIGN1cnJlbnRQYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgYXNzZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuICAgICk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoY3VycmVudFBhdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG4gICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihjdXJyZW50UGF0aCwgZmlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhmdWxsUGF0aCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDlv73nlaXpmpDol4/mlofku7blkoznm67lvZVcclxuICAgICAgICAgICAgaWYgKGZpbGUuc3RhcnRzV2l0aCgnLicpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g6YCS5b2S5omr5o+P5a2Q55uu5b2VXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNjYW5EaXJlY3Rvcnkocm9vdFBhdGgsIGZ1bGxQYXRoLCBhc3NldE1hcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZS5lbmRzV2l0aCgnLm1ldGEnKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5aSE55CGbWV0YeaWh+S7tuiOt+WPllVVSURcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucHJvY2Vzc01ldGFGaWxlKHJvb3RQYXRoLCBmdWxsUGF0aCwgYXNzZXRNYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5aSE55CGbWV0YeaWh+S7tlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBwcm9jZXNzTWV0YUZpbGUoXHJcbiAgICAgICAgcm9vdFBhdGg6IHN0cmluZyxcclxuICAgICAgICBtZXRhRmlsZVBhdGg6IHN0cmluZyxcclxuICAgICAgICBhc3NldE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8g6K+75Y+WbWV0YeaWh+S7tlxyXG4gICAgICAgICAgICBjb25zdCBtZXRhQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhtZXRhRmlsZVBhdGgsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBjb25zdCBtZXRhRGF0YSA9IEpTT04ucGFyc2UobWV0YUNvbnRlbnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g6I635Y+WVVVJRFxyXG4gICAgICAgICAgICBjb25zdCB1dWlkID0gbWV0YURhdGEudXVpZDtcclxuICAgICAgICAgICAgaWYgKCF1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOiuoeeul+ebuOWvuei3r+W+hO+8iOWOu+mZpC5tZXRh5ZCO57yA77yJXHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0UGF0aCA9IG1ldGFGaWxlUGF0aC5zbGljZSgwLCAtNSk7IC8vIOWOu+aOiS5tZXRhXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUocm9vdFBhdGgsIGFzc2V0UGF0aCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ZWRQYXRoID0gcmVsYXRpdmVQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOa3u+WKoOWIsOaYoOWwhOihqFxyXG4gICAgICAgICAgICBhc3NldE1hcFt1dWlkXSA9IGNvbnZlcnRlZFBhdGg7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgRmFpbGVkIHRvIHByb2Nlc3MgbWV0YSBmaWxlOiAke21ldGFGaWxlUGF0aH1gLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19