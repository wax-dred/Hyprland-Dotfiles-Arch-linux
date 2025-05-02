import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Gtk } from "astal/gtk3";
import { globalTransition } from "../variables";
export default (trigger, child, custom_class = "", on_primary_click = () => { }, vertical = false) => {
    const revealer = (_jsx("revealer", { revealChild: false, transitionDuration: globalTransition, transitionType: vertical
            ? Gtk.RevealerTransitionType.SLIDE_UP
            : Gtk.RevealerTransitionType.SLIDE_RIGHT, child: child }));
    const eventBox = (_jsx("eventbox", { className: "custom-revealer " + custom_class, on_hover: (self) => {
            revealer.reveal_child = true;
        }, on_hover_lost: () => {
            revealer.reveal_child = false;
        }, onClick: on_primary_click, child: _jsxs("box", { vertical: vertical, children: [trigger, revealer] }) }));
    return eventBox;
};
