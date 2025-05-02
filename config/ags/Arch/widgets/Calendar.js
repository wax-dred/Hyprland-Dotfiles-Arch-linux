import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { GObject } from "astal";
import { astalify, Gtk } from "astal/gtk3";
class Calendar extends astalify(Gtk.Calendar) {
    static {
        GObject.registerClass(this);
    }
    constructor(props) {
        super(props);
    }
}
export default () => {
    return (_jsx("box", { className: "calendar", child: new Calendar({ hexpand: true }) }));
};
