import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { execAsync, timeout, Variable } from "astal";
import { Gtk, Astal } from "astal/gtk3";
import { globalTransition, NOTIFICATION_DELAY } from "../../../variables";
import ToggleButton from "../../toggleButton";
import hyprland from "gi://AstalHyprland";
import { asyncSleep, time } from "../../../utils/time";
const Hyprland = hyprland.get_default();
const isIcon = (icon) => !!Astal.Icon.lookup_icon(icon);
// const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);
// const urgency = (n: Notifd.Notification) => {
//   const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
//   // match operator when?
//   switch (n.urgency) {
//     case LOW:
//       return "low";
//     case CRITICAL:
//       return "critical";
//     case NORMAL:
//     default:
//       return "normal";
//   }
// };
// type Props = {
//   setup(self: EventBox): void;
//   onHoverLost(self: EventBox): void;
//   notification: Notifd.Notification;
// };
const TRANSITION = 200;
function NotificationIcon(n) {
    if (n.image) {
        return (_jsx("box", { className: "image", css: `
          background-image: url("${n.image}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 10px;
        ` }));
    }
    let icon = "dialog-information-symbolic";
    if (isIcon(n.app_icon))
        icon = n.app_icon;
    if (n.desktopEntry && isIcon(n.desktopEntry))
        icon = n.desktopEntry;
    return _jsx("icon", { className: "icon", icon: icon });
}
export default ({ n, newNotification = false, popup = false, }) => {
    const IsLocked = Variable(false);
    IsLocked.subscribe((value) => {
        if (!value)
            timeout(NOTIFICATION_DELAY, () => {
                if (!IsLocked.get() && popup)
                    closeNotification();
            });
    });
    function closeNotification() {
        Revealer.reveal_child = false;
        timeout(globalTransition - 300, () => {
            Parent.destroy();
        });
    }
    const icon = (_jsx("box", { valign: Gtk.Align.START, halign: Gtk.Align.CENTER, hexpand: false, className: "icon", child: NotificationIcon(n) }));
    const title = (_jsx("label", { className: "title", xalign: 0, justify: Gtk.Justification.LEFT, hexpand: true, maxWidthChars: 24, truncate: true, wrap: true, label: n.summary, useMarkup: true }));
    const body = (_jsx("label", { className: "body", hexpand: true, truncate: true, maxWidthChars: 24, xalign: 0, justify: Gtk.Justification.LEFT, label: n.body, wrap: true }));
    // const actions: string[] = n.actions
    //   ? JSON.parse(n.actions.toString()[0])
    //   : [];
    // const Actions = (
    //   <box className="actions">
    //     {actions.map((action) => (
    //       <button
    //         className={action[0].includes("Delete") ? "delete" : ""}
    //         onClicked={() => {
    //           Hyprland.message_async(`dispatch exec ${action[1]}`).catch((err) =>
    //             notify(err)
    //           );
    //         }}
    //         hexpand={true}>
    //         <label label={action[0].includes("Delete") ? "󰆴" : action[0]} />
    //       </button>
    //     ))}
    //   </box>
    // );
    const expand = (_jsx(ToggleButton, { className: "expand", state: false, onToggled: (self, on) => {
            title.set_property("truncate", !on);
            body.set_property("truncate", !on);
            self.label = on ? "" : "";
        }, label: "\uF107" }));
    const lockButton = (_jsx(ToggleButton, { className: "lock", label: "\uF023", onToggled: (self, on) => {
            IsLocked.set(on);
        } }));
    const copyButton = (_jsx("button", { className: "copy", label: "\uF0C5", onClicked: () => execAsync(`wl-copy "${n.body}"`).catch((err) => print(err)) }));
    const leftRevealer = (_jsx("revealer", { reveal_child: false, transition_type: Gtk.RevealerTransitionType.SLIDE_LEFT, transitionDuration: globalTransition, child: popup ? lockButton : copyButton }));
    const closeRevealer = (_jsx("revealer", { reveal_child: false, transition_type: Gtk.RevealerTransitionType.SLIDE_RIGHT, transitionDuration: globalTransition, child: _jsx("button", { className: "close", label: "\uF48E", onClicked: () => {
                closeNotification();
                n.dismiss();
            } }) }));
    const CircularProgress = (_jsx("circularprogress", { className: "circular-progress", rounded: true, value: 1, visible: true, setup: async (self) => {
            while (self.value >= 0) {
                self.value -= 0.01;
                await asyncSleep(50);
            }
            self.destroy();
        } }));
    const topBar = (_jsxs("box", { className: "top-bar", hexpand: true, spacing: 5, children: [leftRevealer, popup ? CircularProgress : _jsx("box", {}), _jsx("label", { hexpand: true, wrap: true, xalign: 0, truncate: popup, className: "app-name", label: n.app_name }), _jsx("label", { hexpand: true, xalign: 1, className: "time", label: time(n.time) }), expand, closeRevealer] }));
    const Box = (_jsx("box", { className: `notification ${n.urgency} ${n.app_name}`, child: _jsxs("box", { className: "main-content", vertical: true, spacing: 10, children: [topBar, _jsxs("box", { spacing: 5, children: [icon, _jsxs("box", { vertical: true, spacing: 5, children: [_jsx("box", { hexpand: true, child: title }), body] })] })] }) }));
    const Revealer = (_jsx("revealer", { transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN, transitionDuration: TRANSITION, reveal_child: !newNotification, visible: true, setup: (self) => {
            timeout(1, () => {
                self.reveal_child = true;
            });
        }, child: Box }));
    const Parent = (_jsx("box", { visible: true, setup: (self) => timeout(NOTIFICATION_DELAY, () => {
            if (!IsLocked.get() && popup)
                closeNotification();
        }), child: _jsx("eventbox", { visible: true, onHover: () => {
                leftRevealer.reveal_child = true;
                closeRevealer.reveal_child = true;
            }, onHoverLost: () => {
                if (!IsLocked.get())
                    leftRevealer.reveal_child = false;
                closeRevealer.reveal_child = false;
            }, onClick: () => popup ? lockButton.activate() : copyButton.activate(), 
            // onSecondaryClick={() => closeRevealer.child.activate()}
            child: Revealer }) }));
    return Parent;
};
