import { execAsync } from "astal";

export function notify({ summary = '', body = '' }: { summary: string, body: string })
{
    execAsync(`notify-send "${summary}" "${body}"`).catch((err) => print(err));
}