import { Astal } from "astal/gtk3";
export function playerToIcon(name) {
    let icons = {
        spotify: "󰓇",
        VLC: "󰓈",
        YouTube: "󰓉",
        Brave: "",
        Audacious: "󰓋",
        Rhythmbox: "󰓌",
        Chromium: "",
        Firefox: "󰈹",
        firefox: "󰈹",
    };
    return icons[name] || "";
}
export const lookupIcon = (name) => {
    let result = Astal.Icon.lookup_icon(name) ? Astal.Icon.lookup_icon(name) : "audio-x-generic-symbolic";
    return result;
};
