import { _decorator, AudioClip, Component, easing, EventKeyboard, Input, input, UIOpacity } from "cc";
import { ChartPlayer } from "../ChartPlayer";
import { JudgePoint } from "../JudgePoint";
const { ccclass, property } = _decorator;

@ccclass("Note")
export abstract class Note extends Component {
    @property(UIOpacity)
    uiOpacity: UIOpacity

    @property(AudioClip)
    sfx: AudioClip | null = null

    protected chartPlayer: ChartPlayer
    protected judgePoint: JudgePoint

    protected mode: string = "autoplay"
    protected hasPlayedSFX = false
    protected lastGlobalTime: number = -1

    protected isFake: boolean
    protected time: number
    protected speed: number
    protected isJudged: number


    
    // # Lifecycle
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected abstract onKeyDown(event: EventKeyboard): void;

    update(deltaTime: number) {
        
    }



    // # Functions
    initialize(data: any, judgePoint: JudgePoint) {
        this.chartPlayer = ChartPlayer.Instance;
        this.judgePoint = judgePoint;

        this.isFake = data.isFake || false;
        this.time = data.time;
        this.speed = data.speed || 1.0;

        const offset = this.judgePoint.calculatePositionOffset(this.time);
        this.node.setPosition(0, offset, 0);
    }

    updateUI(time: number) {
        if (time > this.time) {
            const fadeDuration = 0.1;
            const elapsedTime = time - this.time;
            const progress = Math.min(elapsedTime / fadeDuration, 1); // Ensure progress does not exceed 1
            this.uiOpacity.opacity = 255 * (1 - easing.linear(progress));
            this.node.setScale((1 - easing.expoIn(progress)), (1 - easing.expoIn(progress)));
        } else {
            this.uiOpacity.opacity = 255;
            this.node.setScale(1, 1);
        }
    }
}
