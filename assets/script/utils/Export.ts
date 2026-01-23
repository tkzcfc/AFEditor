

import { director, Node, Sprite, UITransform } from "cc";
import { Config } from "./Config";
import { jsObjectToLuaPretty } from "./JsonToLua";
import { PlatformFileSystem } from "./PlatformFileSystem";
import { MapInfo } from "../MapInfo";
import { ResourceURLBuilder } from "./ResourceURLBuilder";

enum SpriteType
{
    kSpriteType_Simple,
    kSpriteType_Tiled,
    kSpriteType_Sliced,
    kSpriteType_Filled,
};

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
        let export_filename = await this.getExportFileName();
        console.log(`export filename: ${export_filename}`);
        console.log('start export map data...');

        let layer_node = root.getChildByName('layer');
        if (!layer_node) {
            console.warn('未找到 layer 节点');
            return;
        }

        let map_data = {};
        
        // 导出各个图层数据
        let layer = {}
        layer["farGroup"] = await this.exportGroupData(layer_node.getChildByName('farGroup')!);
        layer["nearGroup"] = await this.exportGroupData(layer_node.getChildByName('nearGroup')!);
        layer["floorGroup"] = await this.exportGroupData(layer_node.getChildByName('floorGroup')!);
        layer["objectGroup"] = await this.exportGroupData(layer_node.getChildByName('objectGroup')!);
        layer["effectGroup"] = await this.exportGroupData(layer_node.getChildByName('effectGroup')!);
        map_data["layer"] = layer;

        // 递归查找MapInfo组件
        let map_info = root.getComponentInChildren(MapInfo);
        map_data["info"] = {
            width: Math.floor(map_info?.width) || 0,
            height: Math.floor(map_info?.height) || 0,
            isTown: map_info?.isTown || false,
            name: map_info?.mapName || "",
            theme: map_info?.theme || "",
            horizon: Math.floor(map_info?.horizon) || 0,
        }
        map_data["scope"] = {
            x: Math.floor(map_info?.scope.x) || 0,
            y: Math.floor(map_info?.scope.y) || 0,
            width: Math.floor(map_info?.scope.width) || 0,
            height: Math.floor(map_info?.scope.height) || 0,
        }

        const lua_table = jsObjectToLuaPretty(map_data);
        // const lua_code = `local M = ${lua_table}\nreturn M`;
        const lua_code = `return ${lua_table}`;

        PlatformFileSystem.saveTextFile(lua_code, export_filename);

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
            data['sx'] = node.getScale().x;
            data['sy'] = node.getScale().y;
            data['ax'] = uiTrans!.anchorX;
            data['ay'] = uiTrans!.anchorY;
            data['w'] = uiTrans!.width;
            data['h'] = uiTrans!.height;

            let sprite = node.getComponent(Sprite);
            if (sprite && sprite.spriteFrame)
            {
                const uuid = this.fmtUUID(sprite.spriteFrame.uuid);
                let url = asset_uuid_map[uuid];
                // console.log(`资源 UUID: ${uuid} 对应路径: ${url}`);
                
                const url_builder = new ResourceURLBuilder(this.fmtUrl('spr', url));

                const frame_size = sprite.spriteFrame.getOriginalSize();
                const sprite_size = uiTrans!.contentSize;

                if (frame_size.width !== sprite_size.width || frame_size.height !== sprite_size.height) {
                    url_builder.appendParam('w', sprite_size.width);
                    url_builder.appendParam('h', sprite_size.height);
                }

                switch (sprite.type) {
                    case Sprite.Type.TILED:
                        url_builder.appendParam('type', SpriteType.kSpriteType_Tiled);
                        break;
                    case Sprite.Type.SLICED:
                        url_builder.appendParam('type', SpriteType.kSpriteType_Sliced);
                        break;
                    case Sprite.Type.FILLED:
                        url_builder.appendParam('type', SpriteType.kSpriteType_Filled);
                        break;
                    default:
                        break;
                }

                data['url'] = url_builder.build();
                console.log(`build URL: ${data['url']}`);
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
        // 如果url_type是spr,则将path前缀 resources/image/ 去掉
        if (url_type === 'spr' && path.startsWith('resources/image/')) {
            path = path.substring('resources/image/'.length);
        }
        // 去掉后缀
        path = path.replace(/\.[^/.]+$/, "");
        return `${url_type}://${path}`;
    }
}