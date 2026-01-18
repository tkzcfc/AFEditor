import { _decorator, Component, Graphics, CCInteger, UITransform, Size, Color, input, Input, EventKeyboard, KeyCode, Sprite, assetManager  } from 'cc';
const {ccclass, property, executeInEditMode, requireComponent} = _decorator;

@ccclass('MapInfo')
@executeInEditMode(true)
@requireComponent(Graphics)
@requireComponent(UITransform)
export class MapInfo extends Component {
    @property({type: CCInteger, min: 1})
    private _width: number = 40;
    
    @property({type: CCInteger, min: 1})
    private _height: number = 40;

    // 边框颜色属性
    @property(Color)
    strokeColor: Color = Color.RED;

    @property(Color)
    fillColor: Color = Color.BLACK;
    
    @property({type: CCInteger, min: 1, max: 10})
    lineWidth: number = 2;

    @property({type: CCInteger, min: 1})
    get width(): number {
        return this._width;
    }
    
    set width(value: number) {
        this._width = Math.max(1, Math.floor(value));
        this.redraw();
    }
    
    @property({type: CCInteger, min: 1})
    get height(): number {
        return this._height;
    }
    
    set height(value: number) {
        this._height = Math.max(1, Math.floor(value));
        this.redraw();
    }

    onLoad() {
        // 启用键盘输入
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.redraw();
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_Q) {
            console.log('开始导出地图数据');

            let root = this.node.parent;
            let layer_node = root.getChildByName('layer');
            if (!layer_node) {
                console.warn('未找到 layer 节点');
                return;
            }

            let map_data = {};
            
            let layer = {}
            layer["farGroup"] = this.exportGroupData(layer_node.getChildByName('farGroup')!);
            layer["nearGroup"] = this.exportGroupData(layer_node.getChildByName('nearGroup')!);
            layer["floorGroup"] = this.exportGroupData(layer_node.getChildByName('floorGroup')!);
            layer["objectGroup"] = this.exportGroupData(layer_node.getChildByName('objectGroup')!);
            layer["effectGroup"] = this.exportGroupData(layer_node.getChildByName('effectGroup')!);
            map_data["layer"] = layer;


        }
    }

    exportGroupData(group_node) {
        let group_data = [];

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
                // 1. 获取资源的 UUID
                const uuid = sprite.spriteFrame._uuid;
                console.log('uuid:', uuid);
                
                // // 2. 获取资源引用
                // const spriteFrame = sprite.spriteFrame;
                
                // 3. 通过资源管理器获取详细信息
                const assetInfo = assetManager.assets.get(uuid);
                if (assetInfo) {
                    console.log('asset _nativeUrl:', assetInfo._nativeUrl);
                    console.log('asset _native:', assetInfo._native);
                    // assetInfo.path 或 assetInfo.url 可能有路径信息
                }
                
                // // 4. 获取原始文件路径（在编辑器中）
                // const nativeUrl = sprite.spriteFrame.texture.nativeUrl;
                // console.log('native path:', nativeUrl);
                // // 示例输出: "db://assets/resources/image.png"
                
                // // 5. 转换为项目相对路径
                // const relativePath = this.convertNativeUrlToPath(nativeUrl);
                // console.log('相对路径:', relativePath);

                group_data.push(data);
            }
        }

        return group_data;
    }
    
    onEnable() {
        this.redraw();
    }

    onFocusInEditor() {
        this.redraw();
    }

    onLostFocusInEditor() {
        this.redraw();
    }

    private redraw() {
        // 延迟一帧执行，避免频繁重绘
        // this.scheduleOnce(() => this.doDraw());
        this.doDraw();
    }

    doDraw() {
        const uiTrans = this.getComponent(UITransform);
        const g = this.getComponent(Graphics);
        
        if (!uiTrans || !g) return;
        
        // 设置 UI 变换
        uiTrans.anchorX = 0;
        uiTrans.anchorY = 0;
        uiTrans.setContentSize(this._width, this._height);
        
        // 清除之前的绘制
        g.clear();
        // 设置边框样式
        g.strokeColor = this.strokeColor.clone();
        g.lineWidth = this.lineWidth;
        g.fillColor = this.fillColor.clone();

        // 先描边
        g.rect(0, 0, this._width, this._height);
        g.stroke();
        g.fill();
    }
}