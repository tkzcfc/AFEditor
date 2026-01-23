import { JsonAsset, resources } from "cc";


export class Config {
    static isInited: boolean = false;
    static assetUUidMap: Map<string, string> = new Map<string, string>();

    static async initilze() {
        if (Config.isInited) {
            return;
        }
        Config.isInited = true;
        
        const jsonAsset = await this.loadJsonAsync('asset-uuid-map');
        Config.assetUUidMap = jsonAsset.json as any;
    }

     static loadJsonAsync(path: string): Promise<JsonAsset> {
        return new Promise((resolve, reject) => {
            resources.load(path, (err: Error, jsonAsset: JsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(jsonAsset);
                }
            });
        });
    }

    public static async getAssetUUidMap() : Promise<Map<string, string>> {
        await Config.initilze();
        return Config.assetUUidMap;
    }

}

