import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Astal, Gtk } from "astal/gtk3";
import Brightness from "../services/brightness";
const brightness = Brightness.get_default();
import Wp from "gi://AstalWp";
import { globalMargin } from "../variables";
import { bind } from "astal/binding";
import { Variable } from "astal";
const audio = Wp.get_default()?.audio;
const DELAY = 2000;
// Debounce function to avoid multiple rapid calls
const debounce = (func, delay) => {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
};
// Function to map value to icon
const getIcon = (value, icons) => {
    if (value > 0.75)
        return icons[0];
    if (value > 0.5)
        return icons[1];
    if (value > 0.25)
        return icons[2];
    return icons[3];
};
const osdSlider = (connectable, signal, setValue, icons) => {
    let sliderLock = Variable(false);
    const indicator = (_jsx("label", { label: bind(connectable, signal).as((v) => getIcon(v, icons)) }));
    const slider = (_jsx("slider", { vertical: true, inverted: true, className: "slider", draw_value: false, height_request: 100, value: bind(connectable, signal), onDragged: ({ value }) => setValue(value) }));
    const revealer = (_jsx("revealer", { transitionType: Gtk.RevealerTransitionType.SLIDE_LEFT, revealChild: false, setup: (self) => {
            const debouncedHide = debounce(() => {
                if (!sliderLock.get())
                    self.reveal_child = false;
            }, DELAY);
            self.hook(connectable, `notify::${signal}`, () => {
                self.reveal_child = true;
                debouncedHide();
            });
        }, child: _jsxs("box", { className: "container", vertical: true, children: [slider, indicator] }) }));
    const eventbox = (_jsx("eventbox", { onHover: () => sliderLock.set(true), onHoverLost: () => {
            sliderLock.set(false);
            revealer.reveal_child = false;
        }, child: revealer }));
    return eventbox;
};
function OnScreenProgress(vertical) {
    const volumeIcons = ["", "", "", ""];
    const brightnessIcons = ["󰃠", "󰃟", "󰃞", "󰃞"];
    const VolumeSlider = osdSlider(audio.defaultSpeaker, "volume", (value) => (audio.defaultSpeaker.volume = value), volumeIcons);
    const MicrophoneSlider = osdSlider(audio.defaultMicrophone, "volume", (value) => (audio.defaultMicrophone.volume = value), volumeIcons);
    const BrightnessSlider = osdSlider(brightness, "screen", (value) => (brightness.screen = value), brightnessIcons);
    return (_jsxs("box", { spacing: 5, children: [VolumeSlider, MicrophoneSlider, BrightnessSlider] }));
}
export default (monitor) => (_jsx("window", { gdkmonitor: monitor, name: "osd", namespace: "osd", className: "osd", layer: Astal.Layer.OVERLAY, margin: globalMargin, anchor: Astal.WindowAnchor.RIGHT, child: OnScreenProgress(true) }));
