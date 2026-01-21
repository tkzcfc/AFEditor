

import { director, Node, Sprite, UITransform } from "cc";
import { Config } from "./Config";
import { jsObjectToLuaPretty } from "./JsonToLua";
import { PlatformFileSystem } from "./PlatformFileSystem";


export class Export {
    public static getSceneAssetUuid(): string {
        const scene = director.getScene();
        if (!scene) return '';

        // console.log((`scene name: ${scene.name}`));

        return (scene as any)._id
    }

    public static async getExportFileName(): Promise<string> {
        let asset_uuid_map = await Config.getAssetUUidMap();
        let uuid = this.fmtUUID(this.getSceneAssetUuid());
        let filename = asset_uuid_map[uuid];

        // 去掉后缀
        filename = filename.replace(/\.[^/.]+$/, "");

        // 加上后缀 .lua
        filename = filename + ".lua";

        return filename;
    }

    public static async exportMapData(root: Node) {
        let exportFilename = await this.getExportFileName();
        console.log(`export filename: ${exportFilename}`);
        console.log('start export map data...');

        let layer_node = root.getChildByName('layer');
        if (!layer_node) {
            console.warn('未找到 layer 节点');
            return;
        }

        let map_data = {};
        
        let layer = {}
        layer["farGroup"] = await this.exportGroupData(layer_node.getChildByName('farGroup')!);
        layer["nearGroup"] = await this.exportGroupData(layer_node.getChildByName('nearGroup')!);
        layer["floorGroup"] = await this.exportGroupData(layer_node.getChildByName('floorGroup')!);
        layer["objectGroup"] = await this.exportGroupData(layer_node.getChildByName('objectGroup')!);
        layer["effectGroup"] = await this.exportGroupData(layer_node.getChildByName('effectGroup')!);
        map_data["layer"] = layer;

        const lua_table = jsObjectToLuaPretty(map_data);
        const lua_code = `local M = ${lua_table}\nreturn M`;

        PlatformFileSystem.saveTextFile(lua_code, exportFilename);

        console.log('export map data done.');
    }

    static async exportGroupData(group_node) {
        let group_data = [];
        let asset_uuid_map = await Config.getAssetUUidMap();

        for (let node of group_node.children) {
            let uiTrans = node.getComponent(UITransform);
            
            let data = {}
            data['x'] = node.x;
            data['y'] = node.y;
            data['ax'] = uiTrans!.anchorX;
            data['ay'] = uiTrans!.anchorY;
            data['w'] = uiTrans!.width;
            data['h'] = uiTrans!.height;

            let sprite = node.getComponent(Sprite);
            if (sprite && sprite.spriteFrame)
            {
                const uuid = this.fmtUUID(sprite.spriteFrame.uuid);
                let url = asset_uuid_map[uuid];
                console.log(`资源 UUID: ${uuid} 对应路径: ${url}`);

                data['url'] = this.fmtUrl('img', url);
                group_data.push(data);
            }
        }

        return group_data;
    }

    static fmtUUID(uuid: string): string {
        // console.log(`raw UUID: ${uuid}`);
        return uuid.split('@').shift() || uuid;
    }

    static fmtUrl(url_type: string, path: string): string {
        // 如果url_type是img,则将path前缀 resources/image/ 去掉
        if (url_type === 'img' && path.startsWith('resources/image/')) {
            path = path.substring('resources/image/'.length);
        }
        // 去掉后缀
        path = path.replace(/\.[^/.]+$/, "");
        return `${url_type}://${path}`;
    }
}