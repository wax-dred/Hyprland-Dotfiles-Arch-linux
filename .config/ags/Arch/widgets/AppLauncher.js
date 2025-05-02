import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind, execAsync, Variable } from "astal";
import Apps from "gi://AstalApps";
import { readJSONFile } from "../utils/json";
import { arithmetic, containsOperator } from "../utils/arithmetic";
import { containsProtocolOrTLD, formatToURL, getDomainFromURL, } from "../utils/url";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { notify } from "../utils/notification";
import { emptyWorkspace, globalMargin, globalSettings, globalTransition, } from "../variables";
const apps = new Apps.Apps();
import Hyprland from "gi://AstalHyprland";
import { hideWindow } from "../utils/window";
import { getMonitorName } from "../utils/monitor";
const hyprland = Hyprland.get_default();
const MAX_ITEMS = 10;
const monitorName = Variable("");
const Results = Variable([]);
const quickApps = globalSettings.get().quickLauncher.apps;
const QuickApps = () => {
    const apps = (_jsx("revealer", { transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN, transition_duration: globalTransition, revealChild: bind(Results).as((results) => results.length === 0), child: _jsx("scrollable", { vexpand: true, hexpand: true, widthRequest: 500, hscroll: Gtk.PolicyType.ALWAYS, vscroll: Gtk.PolicyType.NEVER, child: _jsx("box", { className: "quick-apps", spacing: 5, children: quickApps.map((app) => (_jsx("button", { className: "quick-app", onClicked: () => {
                        hyprland.message_async(`dispatch exec ${app.exec}`, () => {
                            hideWindow(`app-launcher-${monitorName.get()}`);
                        });
                    }, child: _jsxs("box", { spacing: 5, children: [_jsx("label", { className: "icon", label: app.icon }), _jsx("label", { label: app.name })] }) }))) }) }) }));
    return (_jsx("box", { className: "quick-launcher", halign: Gtk.Align.CENTER, spacing: 5, child: apps }));
};
let debounceTimer;
let args;
const Entry = (_jsx("entry", { hexpand: true, placeholder_text: "Search for an app, emoji, translate, url, or do some math...", onChanged: async ({ text }) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(async () => {
            try {
                if (!text || text.trim() === "") {
                    Results.set([]);
                    return;
                }
                args = text.split(" ");
                if (args[0].includes("translate")) {
                    const language = text.includes(">")
                        ? text.split(">")[1].trim()
                        : "en";
                    const translation = await execAsync(`bash ./scripts/translate.sh '${text
                        .split(">")[0]
                        .replace("translate", "")
                        .trim()}' '${language}'`);
                    Results.set([
                        {
                            app_name: translation,
                            app_launch: () => execAsync(`wl-copy ${translation}`),
                        },
                    ]);
                } // Handle emojis
                else if (args[0].includes("emoji")) {
                    const emojis = readJSONFile("./assets/emojis/emojis.json");
                    const filteredEmojis = emojis.filter((emoji) => emoji.app_tags
                        .toLowerCase()
                        .includes(text.replace("emoji", "").trim()));
                    Results.set(filteredEmojis.map((emoji) => ({
                        app_name: emoji.app_name,
                        app_icon: emoji.app_name,
                        app_type: "emoji",
                        app_launch: () => execAsync(`wl-copy ${emoji.app_name}`),
                    })));
                }
                // handle URL
                else if (containsProtocolOrTLD(args[0])) {
                    Results.set([
                        {
                            app_name: getDomainFromURL(text),
                            app_launch: () => execAsync(`xdg-open ${formatToURL(text)}`).then(() => {
                                const browser = execAsync(`bash -c "xdg-settings get default-web-browser | sed 's/\.desktop$//'"`);
                                notify({
                                    summary: "URL",
                                    body: `Opening ${text} in ${browser}`,
                                });
                            }),
                        },
                    ]);
                }
                // handle arithmetic
                else if (containsOperator(args[0])) {
                    Results.set([
                        {
                            app_name: arithmetic(text),
                            app_launch: () => execAsync(`wl-copy ${arithmetic(text)}`),
                        },
                    ]);
                }
                // Handle apps
                else {
                    Results.set(apps
                        .fuzzy_query(args.shift())
                        .slice(0, MAX_ITEMS)
                        .map((app) => ({
                        app_name: app.name,
                        app_icon: app.iconName,
                        app_arg: args.join(" "),
                        app_launch: () => !args.join("")
                            ? app.launch()
                            : hyprland.message_async(`dispatch exec ${app.executable} ${args.join(" ")}`, () => { }),
                    })));
                    if (Results.get().length === 0) {
                        Results.set([
                            {
                                app_name: `Try ${text}`,
                                app_icon: "󰋖",
                                app_launch: () => hyprland.message_async(`dispatch exec ${text}`, () => { }),
                            },
                        ]);
                    }
                }
            }
            catch (err) {
                print(err);
            }
        }, 100); // 100ms delay
    }, onActivate: () => {
        if (Results.get().length > 0) {
            launchApp(Results.get()[0]);
        }
    } }));
const launchApp = (app) => {
    app.app_launch();
    hideWindow(`app-launcher-${monitorName.get()}`);
};
const organizeResults = (results) => {
    const buttonContent = (element) => (_jsxs("box", { spacing: 10, halign: element.app_type === "emoji" ? Gtk.Align.CENTER : Gtk.Align.START, children: [element.app_type === "emoji" ? (_jsx("icon", { icon: element.app_icon })) : (_jsx("box", {})), _jsx("label", { label: element.app_name }), _jsx("label", { className: "argument", label: element.app_arg || "" })] }));
    const AppButton = ({ element, className, }) => {
        return (_jsx("button", { hexpand: true, className: className, child: buttonContent(element), onClicked: () => {
                launchApp(element);
            } }));
    };
    if (results.length === 0)
        return _jsx("box", {});
    const rows = (_jsx("box", { className: "results", vertical: true, spacing: 5, children: Array.from({ length: Math.ceil(results.length / 2) }).map((_, i) => (_jsx("box", { vertical: false, spacing: 5, children: results.slice(i * 2, i * 2 + 2).map((element, j) => (_jsx(AppButton, { element: element, className: i === 0 && j === 0 ? "checked" : "" }))) }))) }));
    const maxHeight = 500;
    return (_jsx("scrollable", { heightRequest: bind(Results).as((results) => results.length * 20 > maxHeight ? maxHeight : results.length * 20), child: rows }));
};
const ResultsDisplay = _jsx("box", { child: bind(Results).as(organizeResults) });
export default (monitor) => (_jsx("window", { gdkmonitor: monitor, name: `app-launcher-${getMonitorName(monitor.get_display(), monitor)}`, namespace: "app-launcher", application: App, anchor: emptyWorkspace.as((empty) => empty ? undefined : Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT), exclusivity: Astal.Exclusivity.EXCLUSIVE, keymode: Astal.Keymode.ON_DEMAND, layer: Astal.Layer.TOP, margin: globalMargin, visible: false, onKeyPressEvent: (self, event) => {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
            Entry.set_text("");
            Entry.grab_focus();
        }
    }, setup: (self) => {
        monitorName.set(getMonitorName(monitor.get_display(), monitor));
    }, child: _jsx("eventbox", { children: _jsxs("box", { vertical: true, className: "app-launcher", children: [_jsxs("box", { spacing: 5, children: [_jsx("icon", { className: "icon", icon: "preferences-system-search-symbolic" }), Entry] }), ResultsDisplay, QuickApps()] }) }) }));
