var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Brightness_1;
import GObject, { register, property } from "astal/gobject";
import { monitorFile, readFileAsync } from "astal/file";
import { exec, execAsync } from "astal/process";
const get = (args) => Number(exec(`brightnessctl ${args}`));
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`);
let Brightness = class Brightness extends GObject.Object {
    static { Brightness_1 = this; }
    static instance;
    static get_default() {
        if (!this.instance)
            this.instance = new Brightness_1();
        return this.instance;
    }
    #screenMax = get("max");
    #screen = get("get") / (get("max") || 1);
    get screen() { return this.#screen; }
    set screen(percent) {
        if (percent < 0)
            percent = 0;
        if (percent > 1)
            percent = 1;
        execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent;
            this.notify("screen");
        });
    }
    constructor() {
        super();
        monitorFile(`/sys/class/backlight/${screen}/brightness`, async (f) => {
            const v = await readFileAsync(f);
            this.#screen = Number(v) / this.#screenMax;
            this.notify("screen");
        });
    }
};
__decorate([
    property(Number)
], Brightness.prototype, "screen", null);
Brightness = Brightness_1 = __decorate([
    register({ GTypeName: "Brightness" })
], Brightness);
export default Brightness;
