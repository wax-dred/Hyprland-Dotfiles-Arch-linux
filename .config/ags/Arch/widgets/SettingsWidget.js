import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { App, Astal, Gtk } from "astal/gtk3";
import hyprland from "gi://AstalHyprland";
import { globalIconSize, globalMargin, globalOpacity, globalSettings, } from "../variables";
import { bind, execAsync } from "astal";
import { getSetting, setSetting } from "../utils/settings";
import { notify } from "../utils/notification";
import { hideWindow } from "../utils/window";
import { getMonitorName } from "../utils/monitor";
const Hyprland = hyprland.get_default();
const hyprCustomDir = "$HOME/.config/hypr/configs/custom/";
function buildConfigString(keys, value) {
    if (keys.length === 1)
        return `${keys[0]}=${value}`;
    const currentKey = keys[0];
    const nestedConfig = buildConfigString(keys.slice(1), value);
    return `${currentKey} {\n\t${nestedConfig.replace(/\n/g, "\n\t")}\n}`;
}
const normalizeValue = (value, type) => {
    switch (type) {
        case "int":
            return Math.round(value);
        case "float":
            return parseFloat(value.toFixed(2));
        default:
            return value;
    }
};
const agsSetting = (setting) => {
    const title = _jsx("label", { halign: Gtk.Align.START, label: setting.get().name });
    const sliderWidget = () => {
        const infoLabel = (_jsx("label", { hexpand: true, xalign: 1, label: bind(setting).as((setting) => `${Math.round((setting.value / (setting.max - setting.min)) * 100)}%`) }));
        const Slider = (_jsx("slider", { halign: Gtk.Align.END, step: 1, width_request: 169, className: "slider", value: setting.get().value / (setting.get().max - setting.get().min), onValueChanged: ({ value }) => setting.set({
                name: setting.get().name,
                value: normalizeValue(value * (setting.get().max - setting.get().min), setting.get().type),
                type: setting.get().type,
                min: setting.get().min,
                max: setting.get().max,
            }) }));
        return (_jsxs("box", { hexpand: true, halign: Gtk.Align.END, spacing: 5, children: [Slider, infoLabel] }));
    };
    const switchWidget = () => {
        const infoLabel = (_jsx("label", { hexpand: true, xalign: 1, label: bind(setting).as((setting) => (setting.value ? "On" : "Off")) }));
        const Switch = (_jsx("switch", { active: setting.get().value, onButtonPressEvent: ({ active }) => {
                active = !active;
                setting.set({
                    name: setting.get().name,
                    value: active,
                    type: setting.get().type,
                    min: setting.get().min,
                    max: setting.get().max,
                });
            } }));
        return (_jsxs("box", { hexpand: true, halign: Gtk.Align.END, spacing: 5, children: [Switch, infoLabel] }));
    };
    return (_jsxs("box", { className: "setting", hexpand: true, spacing: 5, children: [title, setting.get().type === "bool" ? switchWidget() : sliderWidget()] }));
};
const hyprlandSetting = (keys, setting) => {
    const keyArray = keys.split(".");
    const lastKey = keyArray.at(-1);
    if (!lastKey)
        return;
    const title = (_jsx("label", { halign: Gtk.Align.START, label: lastKey.charAt(0).toUpperCase() + lastKey.slice(1) }));
    const sliderWidget = () => {
        const infoLabel = (_jsx("label", { hexpand: true, xalign: 1, label: `${Math.round((setting.value / (setting.max - setting.min)) * 100)}%` }));
        const setValue = ({ value }) => {
            infoLabel.label = `${Math.round(value * 100)}%`;
            switch (setting.type) {
                case "int":
                    value = Math.round(value * (setting.max - setting.min));
                    break;
                case "float":
                    value = parseFloat(value.toFixed(2)) * (setting.max - setting.min);
                    break;
                default:
                    break;
            }
            setSetting(keys + ".value", value);
            const configString = buildConfigString(keyArray.slice(1), value);
            execAsync(`bash -c "echo -e '${configString}' >${hyprCustomDir + keyArray.at(-2) + "." + keyArray.at(-1)}.conf"`).catch((err) => notify(err));
        };
        const Slider = (_jsx("slider", { halign: Gtk.Align.END, step: 0.01, width_request: 169, className: "slider", value: bind(globalSettings).as((s) => getSetting(keys + ".value") / (setting.max - setting.min)), onValueChanged: setValue }));
        return (_jsxs("box", { hexpand: true, halign: Gtk.Align.END, spacing: 5, children: [Slider, infoLabel] }));
    };
    const switchWidget = () => {
        const infoLabel = (_jsx("label", { hexpand: true, xalign: 1, label: bind(globalSettings).as((s) => getSetting(keys + ".value") ? "On" : "Off") }));
        const Switch = (_jsx("switch", { active: getSetting(keys + ".value"), onButtonPressEvent: ({ active }) => {
                active = !active;
                setSetting(keys + ".value", active);
                const configString = buildConfigString(keyArray.slice(1), active);
                execAsync(`bash -c "echo -e '${configString}' >${hyprCustomDir + keyArray.at(-2) + "." + keyArray.at(-1)}.conf"`).catch((err) => notify(err));
            } }));
        return (_jsxs("box", { hexpand: true, halign: Gtk.Align.END, spacing: 5, children: [Switch, infoLabel] }));
    };
    return (_jsxs("box", { className: "setting", children: [title, setting.type === "bool" ? switchWidget() : sliderWidget()] }));
};
const Settings = () => {
    const hyprlandSettings = [];
    const Category = (title) => _jsx("label", { label: title });
    const processSetting = (key, value) => {
        if (typeof value === "object" && value !== null) {
            // Add a category label for the current key
            hyprlandSettings.push(Category(key));
            // Iterate over the entries of the current value
            Object.entries(value).forEach(([childKey, childValue]) => {
                if (typeof childValue === "object" && childValue !== null) {
                    const firstKey = Object.keys(childValue)[0];
                    // Check if the childValue has nested settings
                    if (firstKey &&
                        typeof childValue[firstKey] === "object" &&
                        childValue[firstKey] !== null) {
                        // Recursively process nested settings
                        processSetting(`${key}.${childKey}`, childValue);
                    }
                    else {
                        // If no nested settings, treat it as a HyprlandSetting
                        hyprlandSettings.push(hyprlandSetting(`hyprland.${key}.${childKey}`, childValue));
                    }
                }
            });
        }
    };
    Object.entries(globalSettings.get().hyprland).forEach(([key, value]) => {
        processSetting(key, value);
    });
    return (_jsx("scrollable", { heightRequest: 500, child: _jsxs("box", { vertical: true, spacing: 5, className: "settings", children: [_jsx("label", { className: "category", label: "AGS" }), agsSetting(globalOpacity), agsSetting(globalIconSize), _jsx("label", { className: "category", label: "Hyprland" }), hyprlandSettings] }) }));
};
const WindowActions = ({ monitor }) => (_jsxs("box", { hexpand: true, className: "window-actions", children: [_jsx("box", { hexpand: true, halign: Gtk.Align.START, child: _jsx("button", { halign: Gtk.Align.END, label: "\uF00D", onClicked: () => {
                    hideWindow(`settings-${monitor}`);
                } }) }), _jsx("button", { label: "\uDB81\uDC50", onClicked: () => execAsync(`bash -c "hyprctl reload"`) })] }));
export default (monitor) => {
    const monitorName = getMonitorName(monitor.get_display(), monitor);
    return (_jsx("window", { gdkmonitor: monitor, name: `settings-${monitorName}`, namespace: "settings", application: App, className: "", anchor: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT, visible: false, margin: globalMargin, child: _jsxs("box", { vertical: true, className: "settings-widget", children: [_jsx(WindowActions, { monitor: monitorName }), _jsx(Settings, {})] }) }));
};
