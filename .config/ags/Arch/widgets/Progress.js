import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind, Variable } from "astal";
import { App, Astal } from "astal/gtk3";
import { asyncSleep } from "../utils/time";
const INTERVAL = 10;
const INCREMENT = 0.069;
const progressIncrement = Variable(INCREMENT);
const progressValue = Variable(0);
const levelBar = (_jsx("levelbar", { className: "progress-bar", max_value: 100, widthRequest: 333, value: bind(progressValue) }));
async function RunningProgress() {
    progressValue.set(0);
    progressIncrement.set(INCREMENT);
    while (progressValue.get() <= 100) {
        progressValue.set(progressValue.get() + progressIncrement.get());
        await asyncSleep(INTERVAL); // Wait for 2 seconds before continuing
    }
    App.toggle_window("progress");
}
export function openProgress() {
    App.toggle_window("progress");
    RunningProgress();
}
export function closeProgress() {
    progressIncrement.set(1); // Speed up the progress bar
}
// const Spinner = <spinner />;
export default (monitor) => (_jsx("window", { gdkmonitor: monitor, name: "progress", application: App, anchor: Astal.WindowAnchor.BOTTOM, margin: 0, visible: false, child: _jsx("box", { className: "progress-widget", child: levelBar }) }));
