import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { getDominantColor } from "../utils/image";
import { Gtk } from "astal/gtk3";
import { rightPanelWidth } from "../variables";
const FALLBACK_ICON = "audio-x-generic-symbolic";
const PLAY_ICON = "media-playback-start-symbolic";
const PAUSE_ICON = "media-playback-pause-symbolic";
const PREV_ICON = "media-skip-backward-symbolic";
const NEXT_ICON = "media-skip-forward-symbolic";
function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? "0" : "";
    return `${min}:${sec0}${sec}`;
}
export default ({ player, playerType, }) => {
    const dominantColor = bind(player, "coverArt").as((path) => getDominantColor(path));
    const img = () => {
        if (playerType == "widget")
            return _jsx("box", {});
        return (_jsx("box", { valign: Gtk.Align.CENTER, child: _jsx("box", { className: "img", css: bind(player, "coverArt").as((p) => `
                    background-image: url('${p}');
                    box-shadow: 0 0 5px 0 ${getDominantColor(p)};
                `) }) }));
    };
    const title = (_jsx("label", { className: "title", max_width_chars: 20, halign: Gtk.Align.START, truncate: true, label: bind(player, "title").as((t) => t || "Unknown Track") }));
    const artist = (_jsx("label", { className: "artist", max_width_chars: 20, halign: Gtk.Align.START, truncate: true, label: bind(player, "artist").as((a) => a || "Unknown Artist") }));
    const positionSlider = (_jsx("slider", { className: "slider", css: dominantColor.as((c) => `highlight{background: ${c}00}`), onDragged: ({ value }) => (player.position = value * player.length), visible: bind(player, "length").as((l) => l > 0), value: bind(player, "position").as((p) => player.length > 0 ? p / player.length : 0) }));
    const positionLabel = (_jsx("label", { className: "position", halign: Gtk.Align.START, label: bind(player, "position").as(lengthStr), visible: bind(player, "length").as((l) => l > 0) }));
    const lengthLabel = (_jsx("label", { className: "length", halign: Gtk.Align.END, visible: bind(player, "length").as((l) => l > 0), label: bind(player, "length").as(lengthStr) }));
    // const icon = Widget.icon({
    //   class_name: "icon",
    //   hexpand: true,
    //   hpack: "end",
    //   vpack: "center",
    //   tooltip_text: player.identity || "",
    //   icon: player.bind("entry").transform((entry) => {
    //     const name = `${entry}-symbolic`;
    //     return Utils.lookUpicon(name) ? name : FALLBACK_ICON;
    //   }),
    // });
    const icon = (_jsx("box", { halign: Gtk.Align.END, valign: Gtk.Align.CENTER }));
    const playPause = (_jsx("button", { on_clicked: () => player.play_pause(), className: "play-pause", visible: bind(player, "can_play").as((c) => c), child: _jsx("icon", { icon: bind(player, "playbackStatus").as((s) => {
                switch (s) {
                    case AstalMpris.PlaybackStatus.PLAYING:
                        return PAUSE_ICON;
                    case AstalMpris.PlaybackStatus.PAUSED:
                    case AstalMpris.PlaybackStatus.STOPPED:
                        return PLAY_ICON;
                }
            }) }) }));
    const prev = (_jsx("button", { on_clicked: () => player.previous(), visible: bind(player, "can_go_previous").as((c) => c), child: _jsx("icon", { icon: PREV_ICON }) }));
    const next = (_jsx("button", { on_clicked: () => player.next(), visible: bind(player, "can_go_next").as((c) => c), child: _jsx("icon", { icon: NEXT_ICON }) }));
    return (_jsx("box", { className: `player ${playerType}`, vexpand: false, css: bind(player, "coverArt").as((p) => playerType == "widget"
            ? `
              min-height:${rightPanelWidth.get()}px;
              background-image: url('${p}');
              `
            : ``), child: _jsxs("box", { className: "player-content", vexpand: true, children: [img(), _jsxs("box", { vertical: true, hexpand: true, spacing: 5, children: [_jsxs("box", { children: [artist, icon] }), _jsx("box", { vexpand: true }), title, positionSlider, _jsxs("centerbox", { children: [positionLabel, _jsxs("box", { children: [prev, playPause, next] }), lengthLabel] })] })] }) }));
};
