import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind, exec, execAsync, Variable } from "astal";
import { waifuApi, globalSettings, globalTransition, rightPanelWidth, waifuCurrent, waifuFavorites, } from "../../../variables";
import { Gtk } from "astal/gtk3";
import ToggleButton from "../../toggleButton";
import { getSetting, setSetting } from "../../../utils/settings";
import { notify } from "../../../utils/notification";
import { closeProgress, openProgress } from "../../Progress";
import { readJSONFile } from "../../../utils/json";
import hyprland from "gi://AstalHyprland";
const Hyprland = hyprland.get_default();
const waifuPath = "./assets/waifu/waifu.png";
const jsonPath = "./assets/waifu/waifu.json";
const favoritesPath = "./assets/waifu/favorites/";
const apiList = [
    {
        name: "Danbooru",
        value: "danbooru",
        idSearchUrl: "https://danbooru.donmai.us/posts/",
    },
    {
        name: "Gelbooru",
        value: "gelbooru",
        idSearchUrl: "https://gelbooru.com/index.php?page=post&s=view&id=",
    },
];
const nsfw = Variable(false);
nsfw.subscribe((value) => notify({ summary: "Waifu", body: `NSFW is ${value ? "on" : "off"}` }));
const terminalWaifuPath = `./assets/terminal/icon.jpg`;
const GetImageFromApi = (param = "", api = {}) => {
    openProgress();
    let apiValue = api.value ?? waifuApi.get().value;
    execAsync(`python ./scripts/get-waifu.py ${apiValue} ${nsfw.get()} "${param}"`)
        .finally(() => {
        closeProgress();
        let imageDetails = readJSONFile(jsonPath);
        waifuCurrent.set({
            id: imageDetails.id,
            preview: imageDetails.preview_file_url ?? imageDetails.preview_url,
            height: imageDetails.image_height ?? imageDetails.height,
            width: imageDetails.image_width ?? imageDetails.width,
            api: waifuApi.get(),
        });
    })
        .catch((error) => notify({ summary: "Error", body: error }));
};
const OpenInBrowser = () => execAsync(`bash -c "xdg-open '${waifuApi.get().idSearchUrl}${waifuCurrent.get().id}' && xdg-settings get default-web-browser | sed 's/\.desktop$//'"`)
    .then((browser) => notify({ summary: "Waifu", body: `opened in ${browser}` }))
    .catch((err) => notify({ summary: "Error", body: err }));
const CopyImage = () => execAsync(`bash -c "wl-copy --type image/png < ${waifuPath}"`).catch((err) => notify({ summary: "Error", body: err }));
const OpenImage = () => Hyprland.message_async(`dispatch exec [float;size 50%] feh --scale-down $HOME/.config/ags/${waifuPath}`, (res) => {
    notify({ summary: "Waifu", body: waifuPath });
});
const addToFavorites = () => {
    if (!waifuFavorites.get().find((fav) => fav.id === waifuCurrent.get().id)) {
        if (waifuCurrent.get().id == 0) {
            notify({ summary: "Waifu", body: "Only Api images could be favored" });
            return;
        }
        execAsync(`bash -c "curl -o ${favoritesPath + waifuCurrent.get().id}.jpg ${waifuCurrent.get().preview}"`)
            .then(() => waifuFavorites.set([...waifuFavorites.get(), waifuCurrent.get()]))
            .finally(() => notify({
            summary: "Waifu",
            body: `Image ${waifuCurrent.get().id} Added to favorites`,
        }))
            .catch((err) => notify({ summary: "Error", body: err }));
    }
    else {
        notify({
            summary: "Waifu",
            body: `Image ${waifuCurrent.get().id} Already favored`,
        });
    }
};
const downloadAllFavorites = () => {
    waifuFavorites.get().forEach((fav) => {
        execAsync(`bash -c "curl -o ${favoritesPath + fav.id}.jpg ${fav.preview}"`).catch((err) => notify({ summary: "Error", body: err }));
    });
};
const removeFavorite = (favorite) => {
    execAsync(`rm ${favoritesPath + favorite.id}.jpg`)
        .then(() => notify({
        summary: "Waifu",
        body: `${favorite.id} Favorite removed`,
    }))
        .finally(() => {
        waifuFavorites.set(waifuFavorites.get().filter((fav) => fav !== favorite));
    })
        .catch((err) => notify({ summary: "Error", body: err }));
};
const PinImageToTerminal = () => {
    execAsync(`bash -c "cmp -s ${waifuPath} ${terminalWaifuPath} && { rm ${terminalWaifuPath}; echo 1; } || { cp ${waifuPath} ${terminalWaifuPath}; echo 0; }"`)
        .then((output) => notify({
        summary: "Waifu",
        body: `${Number(output) == 0 ? "Pinned To Terminal" : "UN-Pinned from Terminal"}`,
    }))
        .catch((err) => notify({ summary: "Error", body: err }));
};
function Actions() {
    const favoritesDisplay = (_jsx("revealer", { transitionType: Gtk.RevealerTransitionType.SLIDE_DOWN, transitionDuration: globalTransition, revealChild: false, child: _jsx("eventbox", { className: "favorite-event", child: _jsx("scrollable", { vscroll: Gtk.PolicyType.NEVER, child: _jsx("box", { className: "favorites", spacing: 5, children: bind(waifuFavorites).as((favorites) => [
                        ...favorites.map((favorite) => (_jsx("eventbox", { onClick: () => GetImageFromApi(String(favorite.id), favorite.api), child: _jsx("box", { className: "favorite", css: `
                              background-image: url("${favoritesPath +
                                    favorite.id}.jpg");
                            `, child: _jsx("button", { valign: Gtk.Align.START, halign: Gtk.Align.END, className: "delete", label: "\uF00D", onClicked: () => removeFavorite(favorite) }) }) }))),
                        _jsx("button", { label: "\uF067", className: "add", onClicked: addToFavorites }),
                    ]) }) }) }) }));
    const top = (_jsxs("box", { className: "top", vertical: true, vexpand: true, children: [favoritesDisplay, _jsx(ToggleButton, { halign: Gtk.Align.START, label: "\uF097", className: "favorite", onToggled: (self, on) => {
                    favoritesDisplay.reveal_child = on;
                } })] }));
    const Entry = (_jsx("entry", { className: "input", placeholderText: "Tags / ID", text: getSetting("waifu.input_history"), onActivate: (self) => {
            setSetting("waifu.input_history", self.text);
            GetImageFromApi(self.text);
        } }));
    const actions = (_jsx("revealer", { revealChild: false, transitionDuration: globalTransition, transition_type: Gtk.RevealerTransitionType.SLIDE_UP, child: _jsxs("box", { vertical: true, children: [_jsxs("box", { children: [_jsx("button", { label: "\uF03E", className: "open", hexpand: true, onClicked: OpenImage }), _jsx("button", { label: "\uF435", hexpand: true, className: "pin", onClicked: () => PinImageToTerminal() }), _jsx("button", { label: "\uF074", hexpand: true, className: "random", onClicked: () => GetImageFromApi() }), _jsx("button", { label: "\uF08E", hexpand: true, className: "browser", onClicked: () => OpenInBrowser() }), _jsx("button", { label: "\uF0C5", hexpand: true, className: "copy", onClicked: CopyImage })] }), _jsxs("box", { children: [_jsx("button", { hexpand: true, label: "\uF002", className: "entry-search", onClicked: () => Entry.activate() }), Entry, _jsx(ToggleButton, { label: "", className: "nsfw", hexpand: true, onToggled: (self, on) => {
                                nsfw.set(on);
                            } }), _jsx("button", { hexpand: true, label: "", className: "upload", onClicked: () => {
                                let dialog = new Gtk.FileChooserDialog({
                                    title: "Open Image",
                                    action: Gtk.FileChooserAction.OPEN,
                                });
                                dialog.add_button("Open", Gtk.ResponseType.OK);
                                dialog.add_button("Cancel", Gtk.ResponseType.CANCEL);
                                let response = dialog.run();
                                if (response == Gtk.ResponseType.OK) {
                                    let filename = dialog.get_filename();
                                    let [height, width] = exec(`identify -format "%h %w" ${filename}`).split(" ");
                                    execAsync(`cp ${filename} ${waifuPath}`)
                                        .then(() => waifuCurrent.set({
                                        id: 0,
                                        preview: waifuPath,
                                        height: Number(height) ?? 0,
                                        width: Number(width) ?? 0,
                                        api: {},
                                    }))
                                        .finally(() => notify({
                                        summary: "Waifu",
                                        body: "Custom image set",
                                    }))
                                        .catch((err) => notify({ summary: "Error", body: err }));
                                }
                                dialog.destroy();
                            } })] }), _jsx("box", { children: apiList.map((api) => (_jsx(ToggleButton, { hexpand: true, className: "api", label: api.name, state: bind(waifuApi).as((current) => current.value === api.value), onToggled: (self, on) => waifuApi.set(api) }))) })] }) }));
    const bottom = (_jsxs("box", { className: "bottom", vertical: true, valign: Gtk.Align.END, children: [_jsx(ToggleButton, { label: "\uF106", className: "action-trigger", halign: Gtk.Align.END, onToggled: (self, on) => {
                    actions.reveal_child = on;
                    self.label = on ? "" : "";
                    actions.reveal_child = on;
                } }), actions] }));
    return (_jsxs("box", { className: "actions", vertical: true, children: [top, bottom] }));
}
function Image() {
    return (_jsx("eventbox", { 
        // onClicked={OpenInBrowser}
        child: _jsx("box", { className: "image", hexpand: false, vexpand: false, css: bind(Variable.derive([bind(waifuCurrent), bind(rightPanelWidth)], (waifuCurrent, width) => {
                return `
                    background-image: url("${waifuPath}");
                    min-height: ${(Number(waifuCurrent.height) /
                    Number(waifuCurrent.width)) *
                    width}px;
                    `;
            })), child: Actions() }) }));
}
export default () => {
    return (_jsx("revealer", { transitionDuration: globalTransition, transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN, revealChild: globalSettings.get().waifu.visibility, child: _jsx("eventbox", { className: "waifu-event", child: _jsx("box", { className: "waifu", vertical: true, child: Image() }) }) }));
};
export function WaifuVisibility() {
    return ToggleButton({
        state: bind(globalSettings).as((s) => s.waifu.visibility),
        onToggled: (self, on) => setSetting("waifu.visibility", on),
        label: "󱙣",
        className: "waifu icon",
    });
}
