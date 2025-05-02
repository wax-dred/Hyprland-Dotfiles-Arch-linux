import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Gtk } from "astal/gtk3";
import { focusedWorkspace, globalTransition, leftPanelLock, leftPanelVisibility, } from "../../../variables";
import hyprland from "gi://AstalHyprland";
import { bind, Variable } from "astal";
import ToggleButton from "../../toggleButton";
import { hideWindow, showWindow } from "../../../utils/window";
const Hyprland = hyprland.get_default();
// workspaces icons
const workspaceToIcon = ["󰻃", "", "", "", "", "", "󰙯", "󰓓", "", "", ""];
function Workspaces() {
    let previousWorkspace = 0; // Variable to store the previous workspace ID
    const emptyIcon = ""; // Icon for empty workspaces
    const extraWorkspaceIcon = ""; // Icon for workspaces beyond the maximum limit
    const maxWorkspaces = 10; // Maximum number of workspaces to display with custom icons
    const workspaces = Variable.derive([
        // bind(newAppWorkspace, "value"),
        bind(Hyprland, "workspaces"),
        focusedWorkspace.as((workspace) => workspace.id),
    ], (workspaces, currentWorkspace) => {
        // Get the IDs of active workspaces and fill in empty slots
        const workspaceIds = workspaces.map((w) => w.id);
        const totalWorkspaces = Math.max(...workspaceIds, maxWorkspaces); // Get the total number of workspaces, accounting for more than 10
        const allWorkspaces = Array.from({ length: totalWorkspaces }, (_, i) => i + 1); // Create all workspace slots from 1 to totalWorkspaces
        let inActiveGroup = false; // Flag to track if we're in an active group
        let previousWorkspace_ = currentWorkspace; // Store the previous workspace ID
        const results = allWorkspaces.map((id) => {
            const isActive = workspaceIds.includes(id); // Check if this workspace ID is active
            const icon = id > maxWorkspaces
                ? extraWorkspaceIcon
                : isActive
                    ? workspaceToIcon[id]
                    : emptyIcon; // Icon for extra workspaces beyond 10
            const isFocused = currentWorkspace == id; // Determine if the current ID is focused
            let class_names = ["button"]; // Default class names
            if (isFocused) {
                if (previousWorkspace !== currentWorkspace) {
                    // Workspace has changed, mark it as `focused`
                    class_names.push("focused");
                }
                else {
                    // Same workspace remains focused, mark it as `same-focused`
                    class_names.push("same-focused");
                }
                // Update the previous workspace ID
                previousWorkspace_ = currentWorkspace;
            }
            // Handle active groups
            if (isActive) {
                if (!inActiveGroup) {
                    if (workspaceIds.includes(id + 1)) {
                        class_names.push("first");
                        inActiveGroup = true; // Set the flag to indicate we're in an active group
                    }
                    else {
                        class_names.push("only");
                    }
                }
                else {
                    if (workspaceIds.includes(id + 1)) {
                        class_names.push("between");
                    }
                    else {
                        class_names.push("last");
                        inActiveGroup = false;
                    }
                }
            }
            else {
                class_names.push("inactive");
            }
            return (_jsx("button", { className: class_names.join(" "), label: icon, onClicked: () => {
                    Hyprland.message_async(`dispatch workspace ${id}`, (res) => print(res));
                } }));
        });
        previousWorkspace = previousWorkspace_;
        return results;
    });
    return _jsx("box", { className: "workspaces", children: bind(workspaces) });
}
function LeftPanel() {
    return (_jsx("revealer", { revealChild: bind(leftPanelLock).as((lock) => lock), transitionType: Gtk.RevealerTransitionType.SLIDE_LEFT, transitionDuration: globalTransition, child: _jsx(ToggleButton, { state: bind(leftPanelVisibility), label: bind(leftPanelVisibility).as((v) => (v ? "" : "")), onToggled: (self, on) => leftPanelVisibility.set(on), className: "panel-trigger icon" }) }));
}
const Special = (_jsx("button", { className: "special", label: workspaceToIcon[0], onClicked: () => Hyprland.message_async(`dispatch togglespecialworkspace`, (res) => print(res)) }));
function OverView() {
    return (_jsx("button", { className: "overview", label: "\uDB85\uDDFC", onClicked: () => Hyprland.message_async("dispatch hyprexpo:expo toggle", (res) => print(res)) }));
}
function AppLauncher({ monitorName }) {
    return (_jsx(ToggleButton, { className: "app-search", label: "\uF002", onToggled: (self, on) => {
            on
                ? showWindow(`app-launcher-${monitorName}`)
                : hideWindow(`app-launcher-${monitorName}`);
        } }));
}
function Settings({ monitorName }) {
    return (_jsx(ToggleButton, { className: "settings", label: "\uF013", onToggled: (self, on) => on
            ? showWindow(`settings-${monitorName}`)
            : hideWindow(`settings-${monitorName}`) }));
}
function UserPanel({ monitorName }) {
    return (_jsx(ToggleButton, { className: "user-panel", label: "\uF011", onToggled: (self, on) => {
            on
                ? showWindow(`user-panel-${monitorName}`)
                : hideWindow(`user-panel-${monitorName}`);
        } }));
}
const Actions = ({ monitorName }) => {
    return (_jsxs("box", { className: "actions", children: [_jsx(UserPanel, { monitorName: monitorName }), _jsx(Settings, { monitorName: monitorName }), _jsx(AppLauncher, { monitorName: monitorName })] }));
};
export default (monitorName) => {
    return (_jsxs("box", { className: "bar-left", spacing: 5, children: [_jsx(LeftPanel, {}), _jsx(Actions, { monitorName: monitorName }), _jsx(OverView, {}), Special, _jsx(Workspaces, {})] }));
};
