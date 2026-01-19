import * as fs from 'fs';
import * as path from 'path';

declare const Editor: any;

export class AssetMapper {
    /**
     * 生成资源映射表
     */
    public static async generateAssetMap(): Promise<void> {
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
            const assetMap: Record<string, string> = {};
            
            // 递归遍历assets目录
            await this.scanDirectory(assetsPath, assetsPath, assetMap);
            
            // 生成输出文件路径
            const outputPath = path.join(resourcesPath, 'asset-uuid-map.json');
            
            // 按路径排序后写入文件
            const sortedMap = Object.fromEntries(
                Object.entries(assetMap).sort((a, b) => a[1].localeCompare(b[1]))
            );
            
            // 写入JSON文件
            fs.writeFileSync(
                outputPath,
                JSON.stringify(sortedMap, null, 2),
                'utf-8'
            );
            
            // 显示完成提示
            // await Editor.Message.request('progress', 'finish');
            
            Editor.Dialog.info(
                `资源映射表已生成！\n\n` +
                `文件位置：${outputPath}\n` +
                `共找到 ${Object.keys(assetMap).length} 个资源`,
                { title: '生成完成' }
            );
            
            console.log(`Asset map generated at: ${outputPath}`);
            
        } catch (error) {
            // await Editor.Message.request('progress', 'finish');
            
            Editor.Dialog.error(
                `生成资源映射表时出错：\n${error}`,
                { title: '生成失败' }
            );
            
            console.error('Failed to generate asset map:', error);
        }
    }

    /**
     * 递归扫描目录
     */
    private static async scanDirectory(
        rootPath: string,
        currentPath: string,
        assetMap: Record<string, string>
    ): Promise<void> {
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
            } else if (file.endsWith('.meta')) {
                // 处理meta文件获取UUID
                await this.processMetaFile(rootPath, fullPath, assetMap);
            }
        }
    }

    /**
     * 处理meta文件
     */
    private static async processMetaFile(
        rootPath: string,
        metaFilePath: string,
        assetMap: Record<string, string>
    ): Promise<void> {
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
            
        } catch (error) {
            console.warn(`Failed to process meta file: ${metaFilePath}`, error);
        }
    }
}