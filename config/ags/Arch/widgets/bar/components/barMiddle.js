import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import Hyprland from "gi://AstalHyprland";
const hyprland = Hyprland.get_default();
import Mpris from "gi://AstalMpris";
const mpris = Mpris.get_default();
import Cava from "gi://AstalCava";
const cava = Cava.get_default();
import { playerToColor } from "../../../utils/color";
import { playerToIcon } from "../../../utils/icon";
import { date_less, date_more, emptyWorkspace, focusedClient, globalTransition, } from "../../../variables";
import { bind, Variable } from "../../../../../../../usr/share/astal/gjs";
import { Gtk } from "astal/gtk3";
import CustomRevealer from "../../CustomRevealer";
import { showWindow } from "../../../utils/window";
cava?.set_bars(12);
const bars = Variable("");
const blocks = [
    "\u2581",
    "\u2582",
    "\u2583",
    "\u2584",
    "\u2585",
    "\u2586",
    "\u2587",
    "\u2588",
];
function AudioVisualizer() {
    const revealer = (_jsx("revealer", { 
        // reveal_child={bind(
        //   mpris.players.find(
        //     (player) => player.playbackStatus === Mpris.PlaybackStatus.PLAYING
        //   ) || mpris.players[0],
        //   "playbackStatus"
        // ).as((status) => status === Mpris.PlaybackStatus.PLAYING)}
        revealChild: false, transitionDuration: globalTransition, transitionType: Gtk.RevealerTransitionType.SLIDE_LEFT, child: _jsx("label", { className: "cava", onDestroy: () => bars.drop(), label: bind(bars) }) }));
    cava?.connect("notify::values", () => {
        const values = cava.get_values();
        const blocksLength = blocks.length;
        const barArray = new Array(values.length);
        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            const index = Math.min(Math.floor(val * 8), blocksLength - 1);
            barArray[i] = blocks[index];
        }
        const b = barArray.join("");
        bars.set(b);
        revealer.reveal_child = b !== "".padEnd(12, "\u2581");
    });
    return revealer;
}
function Media({ monitorName }) {
    const progress = (player) => {
        const playerIcon = bind(player, "entry").as((e) => playerToIcon(e));
        return (_jsx("circularprogress", { className: "progress", rounded: true, inverted: false, 
            // startAt={0.25}
            borderWidth: 1, value: bind(player, "position").as((p) => player.length > 0 ? p / player.length : 0), halign: Gtk.Align.CENTER, valign: Gtk.Align.CENTER, child: 
            // <icon className="icon" icon={playerIcon}/>
            _jsx("label", { className: "icon", label: playerIcon }) }));
    };
    const title = (player) => (_jsx("label", { className: "label", max_width_chars: 20, truncate: true, label: bind(player, "title").as((t) => t || "Unknown Track") }));
    const artist = (player) => (_jsx("label", { className: "label", max_width_chars: 20, truncate: true, label: bind(player, "artist").as((a) => `[${a}]` || "Unknown Artist") }));
    const coverArt = (player) => bind(player, "coverArt").as((c) => `
          color: ${playerToColor(player.entry)};
          background-image: linear-gradient(
              to right,
              #000000,
              rgba(0, 0, 0, 0.5)
            ),
            url("${c}");
        `);
    function Player(player) {
        return (_jsxs("box", { className: "media", css: coverArt(player), spacing: 10, children: [progress(player), title(player), artist(player)] }));
    }
    const activePlayer = () => Player(mpris.players.find((player) => player.playbackStatus === Mpris.PlaybackStatus.PLAYING) || mpris.players[0]);
    return (_jsx("revealer", { revealChild: bind(mpris, "players").as((arr) => arr.length > 0), transitionDuration: globalTransition, transitionType: Gtk.RevealerTransitionType.SLIDE_LEFT, child: _jsx("eventbox", { className: "media-event", onClick: () => hyprland.message_async("dispatch workspace 4", (res) => print(res)), on_hover: () => {
                showWindow(`media-${monitorName}`);
            }, child: bind(mpris, "players").as((arr) => arr.length > 0 ? activePlayer() : _jsx("box", {})) }) }));
}
function Clock() {
    const revealer = _jsx("label", { className: "revealer", label: bind(date_more) });
    const trigger = _jsx("label", { className: "trigger", label: bind(date_less) });
    return CustomRevealer(trigger, revealer, "clock");
}
function Bandwidth() {
    const bandwidth = Variable([]).watch(`bash ./scripts/bandwidth.sh`, (out) => [String(JSON.parse(out)[0]), String(JSON.parse(out)[1])]);
    const packet = (icon, value) => (_jsxs("box", { className: "packet", spacing: 1, children: [_jsx("label", { label: value }), _jsx("label", { className: "icon", label: icon })] }));
    return (_jsx("box", { className: "bandwidth", spacing: 5, children: bind(bandwidth).as((bandwidth) => {
            return [
                packet("", String(bandwidth[0])),
                packet("", String(bandwidth[1])),
            ];
        }) }));
}
function ClientTitle() {
    return (_jsx("revealer", { revealChild: emptyWorkspace.as((empty) => !empty), transitionDuration: globalTransition, transitionType: Gtk.RevealerTransitionType.SLIDE_RIGHT, child: focusedClient.as((client) => client && (_jsx("label", { className: "client-title", truncate: true, max_width_chars: 24, label: bind(client, "title").as(String) }))) }));
}
export default (monitorName) => {
    return (_jsxs("box", { className: "bar-middle", spacing: 5, children: [_jsx(AudioVisualizer, {}), _jsx(Media, { monitorName: monitorName }), _jsx(Clock, {}), _jsx(Bandwidth, {}), _jsx(ClientTitle, {})] }));
};
