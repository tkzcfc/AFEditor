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
            const resourcesPath = path.join(assetsPath, 'resources');
            // 资源映射结果
            const assetMap = {};
            // 递归遍历assets目录
            await this.scanDirectory(assetsPath, assetsPath, assetMap);
            // 生成输出文件路径
            const outputPath = path.join(resourcesPath, 'asset-uuid-map.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNzZXRNYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvQXNzZXRNYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUk3QixNQUFhLFdBQVc7SUFDcEI7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtRQUNoQyxXQUFXO1FBQ1gsc0RBQXNEO1FBQ3RELDBCQUEwQjtRQUMxQix5QkFBeUI7UUFDekIseUJBQXlCO1FBQ3pCLE1BQU07UUFFTixJQUFJLENBQUM7WUFDRCxlQUFlO1lBQ2YsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDeEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDcEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFekQsU0FBUztZQUNULE1BQU0sUUFBUSxHQUEyQixFQUFFLENBQUM7WUFFNUMsZUFBZTtZQUNmLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTNELFdBQVc7WUFDWCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1lBRW5FLGFBQWE7WUFDYixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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Q0FBQyxDQUFDO1lBRXZELFNBQVM7WUFDVCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDO1FBRW5DLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQTVIRCxrQ0E0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IEVkaXRvcjogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0TWFwcGVyIHtcclxuICAgIC8qKlxyXG4gICAgICog55Sf5oiQ6LWE5rqQ5pig5bCE6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVBc3NldE1hcCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAvLyAvLyDmmL7npLrov5vluqbmnaFcclxuICAgICAgICAvLyBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdwcm9ncmVzcycsICdzdGFydCcsIHtcclxuICAgICAgICAvLyAgICAgdGl0bGU6ICfmraPlnKjnlJ/miJDotYTmupDmmKDlsITooagnLFxyXG4gICAgICAgIC8vICAgICBpbmZvOiAn5q2j5Zyo5omr5o+P6LWE5rqQLi4uJyxcclxuICAgICAgICAvLyAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIOiOt+WPlumhueebrmFzc2V0c+ebruW9lVxyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IEVkaXRvci5Qcm9qZWN0LnBhdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0c1BhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdhc3NldHMnKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VzUGF0aCA9IHBhdGguam9pbihhc3NldHNQYXRoLCAncmVzb3VyY2VzJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDotYTmupDmmKDlsITnu5PmnpxcclxuICAgICAgICAgICAgY29uc3QgYXNzZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOmAkuW9kumBjeWOhmFzc2V0c+ebruW9lVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNjYW5EaXJlY3RvcnkoYXNzZXRzUGF0aCwgYXNzZXRzUGF0aCwgYXNzZXRNYXApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g55Sf5oiQ6L6T5Ye65paH5Lu26Lev5b6EXHJcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4ocmVzb3VyY2VzUGF0aCwgJ2Fzc2V0LXV1aWQtbWFwLmpzb24nKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOaMiei3r+W+hOaOkuW6j+WQjuWGmeWFpeaWh+S7tlxyXG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRNYXAgPSBPYmplY3QuZnJvbUVudHJpZXMoXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhhc3NldE1hcCkuc29ydCgoYSwgYikgPT4gYVsxXS5sb2NhbGVDb21wYXJlKGJbMV0pKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g5YaZ5YWlSlNPTuaWh+S7tlxyXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0UGF0aCxcclxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHNvcnRlZE1hcCwgbnVsbCwgMiksXHJcbiAgICAgICAgICAgICAgICAndXRmLTgnXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDmmL7npLrlrozmiJDmj5DnpLpcclxuICAgICAgICAgICAgLy8gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncHJvZ3Jlc3MnLCAnZmluaXNoJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBFZGl0b3IuRGlhbG9nLmluZm8oXHJcbiAgICAgICAgICAgICAgICBg6LWE5rqQ5pig5bCE6KGo5bey55Sf5oiQ77yBXFxuXFxuYCArXHJcbiAgICAgICAgICAgICAgICBg5paH5Lu25L2N572u77yaJHtvdXRwdXRQYXRofVxcbmAgK1xyXG4gICAgICAgICAgICAgICAgYOWFseaJvuWIsCAke09iamVjdC5rZXlzKGFzc2V0TWFwKS5sZW5ndGh9IOS4qui1hOa6kGAsXHJcbiAgICAgICAgICAgICAgICB7IHRpdGxlOiAn55Sf5oiQ5a6M5oiQJyB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXNzZXQgbWFwIGdlbmVyYXRlZCBhdDogJHtvdXRwdXRQYXRofWApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLyBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdwcm9ncmVzcycsICdmaW5pc2gnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuZXJyb3IoXHJcbiAgICAgICAgICAgICAgICBg55Sf5oiQ6LWE5rqQ5pig5bCE6KGo5pe25Ye66ZSZ77yaXFxuJHtlcnJvcn1gLFxyXG4gICAgICAgICAgICAgICAgeyB0aXRsZTogJ+eUn+aIkOWksei0pScgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGdlbmVyYXRlIGFzc2V0IG1hcDonLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCS5b2S5omr5o+P55uu5b2VXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIHNjYW5EaXJlY3RvcnkoXHJcbiAgICAgICAgcm9vdFBhdGg6IHN0cmluZyxcclxuICAgICAgICBjdXJyZW50UGF0aDogc3RyaW5nLFxyXG4gICAgICAgIGFzc2V0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGN1cnJlbnRQYXRoKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oY3VycmVudFBhdGgsIGZpbGUpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g5b+955Wl6ZqQ6JeP5paH5Lu25ZKM55uu5b2VXHJcbiAgICAgICAgICAgIGlmIChmaWxlLnN0YXJ0c1dpdGgoJy4nKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOmAkuW9kuaJq+aPj+WtkOebruW9lVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zY2FuRGlyZWN0b3J5KHJvb3RQYXRoLCBmdWxsUGF0aCwgYXNzZXRNYXApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUuZW5kc1dpdGgoJy5tZXRhJykpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWkhOeQhm1ldGHmlofku7bojrflj5ZVVUlEXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3NNZXRhRmlsZShyb290UGF0aCwgZnVsbFBhdGgsIGFzc2V0TWFwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWkhOeQhm1ldGHmlofku7ZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgcHJvY2Vzc01ldGFGaWxlKFxyXG4gICAgICAgIHJvb3RQYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgbWV0YUZpbGVQYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgYXNzZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuICAgICk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIOivu+WPlm1ldGHmlofku7ZcclxuICAgICAgICAgICAgY29uc3QgbWV0YUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMobWV0YUZpbGVQYXRoLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBKU09OLnBhcnNlKG1ldGFDb250ZW50KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOiOt+WPllVVSURcclxuICAgICAgICAgICAgY29uc3QgdXVpZCA9IG1ldGFEYXRhLnV1aWQ7XHJcbiAgICAgICAgICAgIGlmICghdXVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDorqHnrpfnm7jlr7not6/lvoTvvIjljrvpmaQubWV0YeWQjue8gO+8iVxyXG4gICAgICAgICAgICBjb25zdCBhc3NldFBhdGggPSBtZXRhRmlsZVBhdGguc2xpY2UoMCwgLTUpOyAvLyDljrvmjokubWV0YVxyXG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHJvb3RQYXRoLCBhc3NldFBhdGgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgY29udmVydGVkUGF0aCA9IHJlbGF0aXZlUGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XHJcblxyXG4gICAgICAgICAgICAvLyDmt7vliqDliLDmmKDlsITooahcclxuICAgICAgICAgICAgYXNzZXRNYXBbdXVpZF0gPSBjb252ZXJ0ZWRQYXRoO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBwcm9jZXNzIG1ldGEgZmlsZTogJHttZXRhRmlsZVBhdGh9YCwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==