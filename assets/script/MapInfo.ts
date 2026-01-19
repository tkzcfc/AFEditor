import { _decorator, Component, Graphics, CCInteger, UITransform, Color, input, Input, EventKeyboard, KeyCode, Sprite, assetManager, find, AudioClip  } from 'cc';
import { Export } from './Export';
const {ccclass, property, executeInEditMode, requireComponent} = _decorator;

@ccclass('MapInfo')
@executeInEditMode(true)
@requireComponent(Graphics)
@requireComponent(UITransform)
export class MapInfo extends Component {
    // 边框颜色属性
    @property(Color)
    strokeColor: Color = Color.RED;

    // 填充颜色属性
    @property(Color)
    fillColor: Color = Color.BLACK;
    
    @property({type: CCInteger, min: 1, max: 10})
    lineWidth: number = 2;

    /////////////////////////////////////////////////////////////////////////////////

    /// 地图宽度
    @property({type: CCInteger, min: 1})
    private _width: number = 40;

    @property({type: CCInteger, min: 1})
    get width(): number {
        return this._width;
    }
    
    set width(value: number) {
        this._width = Math.max(1, Math.floor(value));
        this.redraw();
    }
    
    /// 地图高度
    @property({type: CCInteger, min: 1})
    private _height: number = 40;

    @property({type: CCInteger, min: 1})
    get height(): number {
        return this._height;
    }
    
    set height(value: number) {
        this._height = Math.max(1, Math.floor(value));
        this.redraw();
    }

    /// 是否为城镇地图
    @property({type: Boolean})
    isTown: boolean = false;

    /// 背景音乐
    @property({type: AudioClip})
    bgm: AudioClip | null = null;

    /// 主题
    @property({type: String})
    theme: string = "";

    /// 名称
    @property({type: String})
    mapName: string = "";

    /// 地平线高度
    @property({type: CCInteger, min: 0})
    horizon: number = 0;

    
    /////////////////////////////////////////////////////////////////////////////////

    onLoad() {
        this.redraw();
    }

    doExport() {
        Export.exportMapData(find("Canvas/root")!)
            .then(data => { 
                console.log(data);
                console.log("数据处理完成。");
            })
            .catch(error => {
                console.error(error);
            });
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