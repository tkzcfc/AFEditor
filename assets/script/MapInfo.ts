import { _decorator, Component, Graphics, CCInteger, UITransform, AudioClip, find, Rect, Color  } from 'cc';
import { Export } from './utils/Export';
const {ccclass, property, executeInEditMode, requireComponent, playOnFocus} = _decorator;

@ccclass('MapInfo')
@executeInEditMode
@playOnFocus
@requireComponent(Graphics)
@requireComponent(UITransform)
export class MapInfo extends Component {

    /////////////////////////////////////////////////////////////////////////////////

    /// 是否显示调试信息
    @property({type: Boolean})
    public showDebugInfo: boolean = true;

    /////////////////////////////////////////////////////////////////////////////////

    /// 地图宽度
    @property({type: CCInteger, min: 1, step: 1, tooltip: "地图宽度，单位：像素"})
    public width: number = 40;
    
    /// 地图高度
    @property({type: CCInteger, min: 1, step: 1, tooltip: "地图高度，单位：像素"})
    public height: number = 40;

    /// 是否为城镇地图
    @property({type: Boolean, tooltip: "是否为城镇地图"})
    isTown: boolean = false;

    /// 背景音乐
    @property({type: AudioClip, tooltip: "地图背景音乐"})
    bgm: AudioClip | null = null;

    /// 主题
    @property({type: String, tooltip: "地图主题"})
    theme: string = "";

    /// 名称
    @property({type: String, tooltip: "地图名称"})
    mapName: string = "";

    /// 地平线高度
    @property({type: CCInteger, min: 0, step: 1, tooltip: "地平线高度"})
    horizon: number = 0;

    /// 范围信息
    @property({type: Rect, tooltip: "范围信息"})
    scope: Rect = new Rect();

    
    /////////////////////////////////////////////////////////////////////////////////

    onLoad() {
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
    
    protected update(dt: number): void {
        this.doDraw();
    }

    doDraw() {
        const uiTrans = this.getComponent(UITransform);
        const g = this.getComponent(Graphics);
        
        if (!uiTrans || !g) return;
        
        // 清除之前的绘制
        g.clear();

        this.width = Math.max(1, Math.floor(this.width));
        this.height = Math.max(1, Math.floor(this.height));
        // 设置 UI 变换
        uiTrans.anchorX = 0;
        uiTrans.anchorY = 0;
        uiTrans.setContentSize(this.width, this.height);

        if (this.showDebugInfo) {
            // 设置边框样式
            g.strokeColor = Color.WHITE;
            g.lineWidth = 2;
            g.fillColor = new Color().fromHEX('#00000080');

            // 绘制地图边框
            g.rect(0, 0, this.width, this.height);
            g.stroke();
            g.fill();

            // 绘制范围信息
            g.fillColor = new Color().fromHEX('#8700f580');
            g.rect(this.scope.x, this.scope.y, this.scope.width, this.scope.height);
            
            g.stroke();
            g.fill();
        }
        
        // 绘制水平线
        g.fillColor = new Color().fromHEX('#ff0000ff');
        g.rect(0, this.horizon, this.width, 5);
        g.stroke();
        g.fill();
    }
}
