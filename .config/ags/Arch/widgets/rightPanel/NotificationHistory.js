import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Gtk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "./components/Notification";
import { bind, Variable } from "astal";
const notificationFilter = Variable({ name: "", class: "" });
export default () => {
    const Filters = [
        { name: "Spotify", class: "spotify" },
        { name: "Clipboard", class: "clipboard" },
        { name: "Update", class: "update" },
    ];
    const Filter = (_jsx("box", { className: "filter", hexpand: false, children: Filters.map((filter) => (_jsx("button", { label: filter.name, hexpand: true, onClicked: () => {
                notificationFilter.set(notificationFilter.get() === filter
                    ? { name: "", class: "" }
                    : filter);
            }, className: bind(notificationFilter).as((f) => f.class === filter.class ? "active" : "") }))) }));
    function FilterNotifications(notifications, filter) {
        const MAX_NOTIFICATIONS = 10;
        // Sort notifications by time (newest first)
        const sortedNotifications = notifications.sort((a, b) => b.time - a.time);
        const filtered = [];
        const others = [];
        sortedNotifications.forEach((notification) => {
            if (notification.app_name.includes(filter) ||
                notification.summary.includes(filter)) {
                filtered.push(notification);
            }
            else {
                others.push(notification);
            }
        });
        const combinedNotifications = [...filtered, ...others];
        const keptNotifications = combinedNotifications.slice(0, MAX_NOTIFICATIONS);
        // Close excess notifications
        combinedNotifications.slice(MAX_NOTIFICATIONS).forEach((notification) => {
            notification.dismiss();
        });
        return keptNotifications;
    }
    const NotificationHistory = (_jsx("box", { vertical: true, spacing: 5, children: bind(Variable.derive([bind(Notifd.get_default(), "notifications"), notificationFilter], (notifications, filter) => {
            if (!notifications)
                return [];
            return FilterNotifications(notifications, filter.name).map((notification) => _jsx(Notification, { n: notification }));
        })) }));
    const NotificationsDisplay = (_jsx("scrollable", { hscroll: Gtk.PolicyType.NEVER, vexpand: true, child: NotificationHistory }));
    const ClearNotifications = (_jsx("button", { className: "clear", label: "\uF48E", on_clicked: () => {
            Notifd.get_default().notifications.forEach((notification) => {
                notification.dismiss();
            });
        } }));
    return (_jsxs("box", { className: "notification-history", vertical: true, spacing: 5, children: [Filter, NotificationsDisplay, ClearNotifications] }));
};
