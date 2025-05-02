import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind, exec, execAsync, Variable } from "astal";
import MediaWidget from "./MediaWidget";
import NotificationHistory from "./rightPanel/NotificationHistory";
import { App, Astal, Gtk } from "astal/gtk3";
import hyprland from "gi://AstalHyprland";
import { date_less } from "../variables";
import { hideWindow } from "../utils/window";
import { getMonitorName } from "../utils/monitor";
import { notify } from "../utils/notification";
import { FileChooserButton } from "./FileChooser";
const Hyprland = hyprland.get_default();
const pfpPath = exec(`bash -c "echo $HOME/.face.icon"`);
const username = exec(`whoami`);
const uptime = Variable("-").poll(600000, "uptime -p");
const UserPanel = (monitorName) => {
    const Profile = () => {
        const UserName = (_jsxs("box", { halign: Gtk.Align.CENTER, className: "user-name", children: [_jsx("label", { label: "I'm " }), _jsx("label", { className: "name", label: username })] }));
        const Uptime = (_jsx("box", { halign: Gtk.Align.CENTER, className: "up-time", child: _jsx("label", { className: "uptime", label: bind(uptime) }) }));
        const ProfilePicture = (_jsx("box", { className: "profile-picture", css: `
          background-image: url("${pfpPath}");
        `, child: _jsx(FileChooserButton, { hexpand: true, vexpand: true, usePreviewLabel: false, onFileSet: (self) => {
                    let uri = self.get_uri();
                    if (!uri)
                        return;
                    const cleanUri = uri.replace("file://", ""); // Remove 'file://' from the URI
                    execAsync(`bash -c "cp '${cleanUri}' ${pfpPath}"`)
                        .then(() => {
                        ProfilePicture.css = `background-image: url('${pfpPath}');`;
                    })
                        .finally(() => {
                        notify({
                            summary: "Profile picture",
                            body: `${cleanUri} set to ${pfpPath}`,
                        });
                    })
                        .catch((err) => notify(err));
                } }) }));
        return (_jsxs("box", { className: "profile", vertical: true, children: [ProfilePicture, UserName, Uptime] }));
    };
    const Actions = () => {
        const Logout = () => (_jsx("button", { hexpand: true, className: "logout", label: "\uDB80\uDF43", onClicked: () => {
                Hyprland.message_async("dispatch exit", () => { });
            } }));
        const Shutdown = () => (_jsx("button", { hexpand: true, className: "shutdown", label: "\uF011", onClicked: () => {
                execAsync(`shutdown now`);
            } }));
        const Restart = () => (_jsx("button", { hexpand: true, className: "restart", label: "\uDB81\uDF09", onClicked: () => {
                execAsync(`reboot`);
            } }));
        const Sleep = () => (_jsx("button", { hexpand: true, className: "sleep", label: "\uDB82\uDD04", onClicked: () => {
                hideWindow(`user-panel-${monitorName}`);
                execAsync(`bash -c "$HOME/.config/hypr/scripts/hyprlock.sh suspend"`);
            } }));
        return (_jsxs("box", { className: "system-actions", vertical: true, spacing: 10, children: [_jsxs("box", { className: "action", spacing: 10, children: [Shutdown(), Restart()] }), _jsxs("box", { className: "action", spacing: 10, children: [Sleep(), Logout()] })] }));
    };
    const right = (_jsxs("box", { halign: Gtk.Align.CENTER, className: "bottom", vertical: true, spacing: 10, children: [Profile(), Actions()] }));
    const Date = (_jsx("box", { className: "date", child: _jsx("label", { halign: Gtk.Align.CENTER, hexpand: true, label: bind(date_less) }) }));
    const middle = (_jsxs("box", { className: "middle", vertical: true, hexpand: true, vexpand: true, spacing: 10, children: [NotificationHistory(), Date] }));
    return (_jsxs("box", { className: "user-panel", spacing: 10, children: [MediaWidget(), middle, right] }));
};
const WindowActions = (monitorName) => {
    return (_jsx("box", { className: "window-actions", hexpand: true, halign: Gtk.Align.END, child: _jsx("button", { className: "close", label: "\uF00D", onClicked: () => {
                hideWindow(`user-panel-${monitorName}`);
            } }) }));
};
export default (monitor) => {
    const monitorName = getMonitorName(monitor.get_display(), monitor);
    return (_jsx("window", { gdkmonitor: monitor, name: `user-panel-${monitorName}`, namespace: "user-panel", application: App, className: "user-panel", layer: Astal.Layer.OVERLAY, visible: false, child: _jsxs("box", { className: "display", vertical: true, spacing: 10, children: [WindowActions(monitorName), UserPanel(monitorName)] }) }));
};
