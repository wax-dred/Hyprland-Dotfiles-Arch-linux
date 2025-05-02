import { execAsync } from "astal";
export function notify({ summary = '', body = '' }) {
    execAsync(`notify-send "${summary}" "${body}"`).catch((err) => print(err));
}
