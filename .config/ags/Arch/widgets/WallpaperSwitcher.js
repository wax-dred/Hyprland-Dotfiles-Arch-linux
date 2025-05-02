import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import hyprland from "gi://AstalHyprland";
import { bind, exec, execAsync, monitorFile, Variable } from "astal";
import { App, Gtk } from "astal/gtk3";
import { notify } from "../utils/notification";
import { focusedWorkspace, globalTransition } from "../variables";
import ToggleButton from "./toggleButton";
import { Button } from "astal/gtk3/widget";
import { getMonitorName } from "../utils/monitor";
const Hyprland = hyprland.get_default();
const selectedWorkspace = Variable(0);
const selectedWorkspaceWidget = Variable(new Button());
const targetTypes = ["workspace", "sddm", "lockscreen"];
const targetType = Variable("workspace");
const wallpaperType = Variable(false);
let defaultWallpapers = [];
let defaultThumbnails = [];
let customWallpapers = [];
let customThumbnails = [];
const allWallpapers = Variable([]);
const allThumbnails = Variable([]);
const shuffleArraysTogether = (arr1, arr2) => {
    const combined = arr1.map((item, index) => ({ item, thumb: arr2[index] }));
    combined.sort(() => Math.random() - 0.5);
    return [combined.map((c) => c.item), combined.map((c) => c.thumb)];
};
const FetchWallpapers = async () => {
    try {
        await execAsync("bash ./scripts/wallpaper-to-thumbnail.sh");
        const [defaultThumbs, customThumbs, defaultWalls, customWalls] = await Promise.all([
            execAsync("bash ./scripts/get-wallpapers-thumbnails.sh --defaults").then(JSON.parse),
            execAsync("bash ./scripts/get-wallpapers-thumbnails.sh --custom").then(JSON.parse),
            execAsync("bash ./scripts/get-wallpapers.sh --defaults").then(JSON.parse),
            execAsync("bash ./scripts/get-wallpapers.sh --custom").then(JSON.parse),
        ]);
        defaultThumbnails = defaultThumbs;
        customThumbnails = customThumbs;
        defaultWallpapers = defaultWalls;
        customWallpapers = customWalls;
        if (wallpaperType.get()) {
            allWallpapers.set(customWallpapers);
            allThumbnails.set(customThumbnails);
        }
        else {
            const [shuffledWallpapers, shuffledThumbnails] = shuffleArraysTogether([...defaultWallpapers, ...customWallpapers], [...defaultThumbnails, ...customThumbnails]);
            allWallpapers.set(shuffledWallpapers);
            allThumbnails.set(shuffledThumbnails);
        }
    }
    catch (err) {
        notify({ summary: "Error", body: String(err) });
    }
};
FetchWallpapers();
monitorFile("./../wallpapers/custom", FetchWallpapers);
wallpaperType.subscribe(FetchWallpapers);
function Wallpapers(monitor) {
    const getAllWallpapers = () => (_jsx("scrollable", { className: "all-wallpapers-scrollable", hscrollbarPolicy: Gtk.PolicyType.ALWAYS, vscrollbarPolicy: Gtk.PolicyType.NEVER, hexpand: true, vexpand: true, child: _jsx("box", { className: "all-wallpapers", spacing: 5, children: bind(Variable.derive([bind(allWallpapers), bind(allThumbnails)], (allWallpapers, allThumbnails) => allWallpapers.map((wallpaper, key) => (_jsx("eventbox", { className: "wallpaper-event-box", onClick: () => {
                    const target = targetType.get();
                    const command = {
                        sddm: `pkexec sh -c 'sed -i "s|^background=.*|background=\"${wallpaper}\"|" /usr/share/sddm/themes/where_is_my_sddm_theme/theme.conf'`,
                        lockscreen: `bash -c "cp ${wallpaper} $HOME/.config/wallpapers/lockscreen/wallpaper"`,
                        workspace: `bash -c "$HOME/.config/hypr/hyprpaper/set-wallpaper.sh ${selectedWorkspace.get()} ${wallpaper} ${monitor}"`,
                    }[target];
                    execAsync(command)
                        .then(() => {
                        if (target === "workspace") {
                            selectedWorkspaceWidget.get().css = `background-image: url('${wallpaper}');`;
                        }
                        notify({
                            summary: target,
                            body: `${target} wallpaper changed successfully!`,
                        });
                    })
                        .catch(notify);
                }, child: _jsx("box", { className: "wallpaper", vertical: true, css: `
                          background-image: url("${allThumbnails[key]}");
                        `, child: _jsx("button", { visible: wallpaperType.get(), className: "delete-wallpaper", halign: Gtk.Align.END, valign: Gtk.Align.START, label: "\uF467", onClicked: () => {
                            execAsync(`bash -c "rm -f '${allThumbnails[key]}' '${wallpaper}'"`)
                                .then(() => {
                                notify({
                                    summary: "Success",
                                    body: "Wallpaper deleted successfully!",
                                });
                            })
                                .catch((err) => notify({
                                summary: "Error",
                                body: String(err),
                            }));
                        } }) }) }))))) }) }));
    const getWallpapers = () => {
        const activeId = focusedWorkspace.as((workspace) => workspace.id || 1);
        const wallpapers = JSON.parse(exec(`bash ./scripts/get-wallpapers.sh --current ${monitor}`) || "[]");
        return wallpapers.map((wallpaper, key) => (_jsx("button", { valign: Gtk.Align.CENTER, css: `
          background-image: url("${wallpaper}");
        `, className: activeId.as((i) => {
                selectedWorkspace.set(i);
                targetType.set("workspace");
                return i === key + 1
                    ? "workspace-wallpaper focused"
                    : "workspace-wallpaper";
            }), label: `${key + 1}`, onClicked: (self) => {
                targetType.set("workspace");
                bottomRevealer.reveal_child = true;
                selectedWorkspace.set(key + 1);
                selectedWorkspaceWidget.set(self);
            }, setup: (self) => {
                activeId.as((i) => {
                    if (i === key + 1) {
                        selectedWorkspace.set(key + 1);
                        selectedWorkspaceWidget.set(self);
                    }
                });
            } })));
    };
    const reset = (_jsx("button", { valign: Gtk.Align.CENTER, className: "reload-wallpapers", label: "\uDB81\uDC50", onClicked: () => {
            execAsync('bash -c "$HOME/.config/hypr/hyprpaper/reload.sh"')
                .finally(FetchWallpapers)
                .catch(notify);
        } }));
    const top = (_jsx("box", { hexpand: true, vexpand: true, halign: Gtk.Align.CENTER, spacing: 10, children: getWallpapers() }));
    const random = (_jsx("button", { valign: Gtk.Align.CENTER, className: "random-wallpaper", label: "\uF074", onClicked: () => {
            const randomWallpaper = allWallpapers.get()[Math.floor(Math.random() * allWallpapers.get().length)];
            execAsync(`bash -c "$HOME/.config/hypr/hyprpaper/set-wallpaper.sh ${selectedWorkspace.get()} ${randomWallpaper} ${monitor}"`)
                .then(() => {
                const newWallpaper = JSON.parse(exec(`bash ./scripts/get-wallpapers.sh --current ${monitor}`))[selectedWorkspace.get() - 1];
                selectedWorkspaceWidget.get().css = `background-image: url('${newWallpaper}');`;
            })
                .catch(notify);
        } }));
    const custom = (_jsx(ToggleButton, { valign: Gtk.Align.CENTER, className: "custom-wallpaper", label: "all", onToggled: (self, on) => {
            wallpaperType.set(on);
            self.label = on ? "custom" : "all";
        } }));
    const revealButton = (_jsx(ToggleButton, { className: "bottom-revealer-button", label: "\uF107", onToggled: (self, on) => {
            bottomRevealer.reveal_child = on;
            self.label = on ? "" : "";
        } }));
    const targets = (_jsx("box", { className: "targets", hexpand: true, halign: Gtk.Align.CENTER, children: targetTypes.map((type) => (_jsx(ToggleButton, { valign: Gtk.Align.CENTER, className: type, label: type, state: bind(targetType).as((t) => t === type), onToggled: (self, on) => {
                targetType.set(type);
            } }))) }));
    const selectedWorkspaceLabel = (_jsx("label", { className: "button selected-workspace", label: bind(Variable.derive([bind(selectedWorkspace), bind(targetType)], (workspace, targetType) => `Wallpaper -> ${targetType} ${targetType === "workspace" ? workspace : ""}`)) }));
    const addWallpaperButton = (_jsx("button", { label: "", className: "upload", onClicked: () => {
            let dialog = new Gtk.FileChooserDialog({
                title: "Open Image",
                action: Gtk.FileChooserAction.OPEN,
            });
            dialog.add_button("Upload", Gtk.ResponseType.OK);
            dialog.add_button("Cancel", Gtk.ResponseType.CANCEL);
            let response = dialog.run();
            if (response == Gtk.ResponseType.OK) {
                let filename = dialog.get_filename();
                execAsync(`bash -c "cp '${filename}' $HOME/.config/wallpapers/custom"`)
                    .then(() => notify({
                    summary: "Success",
                    body: "Wallpaper added successfully!",
                }))
                    .catch((err) => notify({ summary: "Error", body: String(err) }));
            }
            dialog.destroy();
        } }));
    const actions = (_jsxs("box", { className: "actions", hexpand: true, halign: Gtk.Align.CENTER, spacing: 10, children: [targets, selectedWorkspaceLabel, revealButton, custom, random, reset, addWallpaperButton] }));
    const bottomRevealer = (_jsx("revealer", { visible: true, reveal_child: false, transitionType: Gtk.RevealerTransitionType.SLIDE_DOWN, transition_duration: globalTransition, child: _jsx("box", { child: getAllWallpapers() }) }));
    const bottom = (_jsx("box", { className: "bottom", hexpand: true, vexpand: true, child: bottomRevealer }));
    return (_jsxs("box", { className: "wallpaper-switcher", vertical: true, spacing: 20, children: [top, actions, bottom] }));
}
export default (monitor) => {
    const monitorName = getMonitorName(monitor.get_display(), monitor);
    return (_jsx("window", { gdkmonitor: monitor, namespace: "wallpaper-switcher", name: `wallpaper-switcher-${monitorName}`, application: App, visible: false, child: Wallpapers(monitorName) }));
};
