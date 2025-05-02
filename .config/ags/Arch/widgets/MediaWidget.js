import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Box, Label } from "astal/gtk3/widget";
import Player from "./Player";
import { Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";
const mpris = Mpris.get_default();
// const noPlayerFound = () => Widget.Box({
//     hpack: "center",
//     vpack: "center",
//     hexpand: true,
//     class_name: "module",
//     child: Widget.Label({
//         label: "No player found",
//     })
// })
const noPlayerFound = () => (_jsx(Box, { halign: Gtk.Align.CENTER, valign: Gtk.Align.CENTER, hexpand: true, className: "module", child: _jsx(Label, { label: "No player found" }) }));
const activePlayer = () => {
    if (mpris.players.length == 0)
        return noPlayerFound();
    const player = mpris.players.find((player) => player.playbackStatus === Mpris.PlaybackStatus.PLAYING) || mpris.players[0];
    // return Player(player, "widget");
    return _jsx(Player, { player: player, playerType: "widget" });
};
const Media = () => (
//   Widget.Box({}).hook(
//     mpris,
//     (self) => (self.child = activePlayer()),
//     "changed"
//   );
_jsx(Box, { child: activePlayer() }));
export default () => Media();
