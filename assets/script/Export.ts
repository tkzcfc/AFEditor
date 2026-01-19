

import { assetManager, Node, Sprite, UITransform } from "cc";
import { Config } from "./Config";
import { jsonToLuaPretty } from "./JsonToLua";


export class Export {
    public static async exportMapData(root: Node) {
        console.log('开始导出地图数据');

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

        const json_string = JSON.stringify(map_data, null, 2);
        const lua_string = jsonToLuaPretty(JSON.stringify(json_string));
        console.log(lua_string);

        console.log('导出地图数据完成');
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
        return uuid.split('@').shift() || uuid;
    }

    static fmtUrl(url_type: string, path: string): string {
        // 如果url_type是img,则将path前缀 resources/image/ 去掉
        if (url_type === 'img' && path.startsWith('resources/image/')) {
            path = path.substring('resources/image/'.length);
        }
        return `${url_type}://${path}`;
    }
}