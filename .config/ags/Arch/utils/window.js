import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { App, Gtk } from "astal/gtk3";
import ToggleButton from "../widgets/toggleButton";
export function hideWindow(window_name) {
    App.get_window(window_name).hide();
}
export function showWindow(window_name) {
    App.get_window(window_name).show();
}
export function WindowActions({ windowWidth, windowExclusivity, windowLock, windowVisibility, }) {
    const maxRightPanelWidth = 600;
    const minRightPanelWidth = 200;
    return (_jsxs("box", { className: "window-actions", vexpand: true, halign: Gtk.Align.END, valign: Gtk.Align.END, vertical: true, children: [_jsx("button", { label: "", className: "expand-window", onClicked: () => {
                    windowWidth.set(windowWidth.get() < maxRightPanelWidth
                        ? windowWidth.get() + 50
                        : maxRightPanelWidth);
                } }), _jsx("button", { label: "", className: "shrink-window", onClicked: () => {
                    windowWidth.set(windowWidth.get() > minRightPanelWidth
                        ? windowWidth.get() - 50
                        : minRightPanelWidth);
                } }), _jsx(ToggleButton, { label: "", className: "exclusivity", state: !windowExclusivity.get(), onToggled: (self, on) => {
                    windowExclusivity.set(!on);
                } }), _jsx(ToggleButton, { label: windowLock.get() ? "" : "", className: "lock", state: windowLock.get(), onToggled: (self, on) => {
                    windowLock.set(on);
                    self.label = on ? "" : "";
                } }), _jsx("button", { label: "", className: "close", onClicked: () => {
                    windowVisibility.set(false);
                } })] }));
}
