import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Gtk } from "astal/gtk3";
import { bind, execAsync, Variable } from "astal";
import { notify } from "../../utils/notification";
import { readJSONFile, writeJSONFile } from "../../utils/json";
function formatTextWithCodeBlocks(text) {
    // Split the text by code blocks (```)
    const parts = text.split(/```(.*?)```/gs);
    // Create an array to hold all the elements
    const elements = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part)
            continue; // Skip empty parts
        if (i % 2 === 1) {
            // Odd indices are code blocks (between ```)
            elements.push(_jsxs("box", { className: "code-block", children: [_jsx("label", { className: "text", hexpand: true, wrap: true, halign: Gtk.Align.START, label: part }), _jsx("button", { halign: Gtk.Align.END, valign: Gtk.Align.START, className: "copy", label: "", onClick: () => {
                            execAsync(`wl-copy "${part}"`).catch((err) => print(err));
                        } })] }));
        }
        else {
            // Even indices are regular text
            elements.push(_jsx("label", { hexpand: true, wrap: true, xalign: 0, label: part }));
        }
    }
    return (_jsx("box", { className: "body", vertical: true, spacing: 10, children: elements }));
}
const fetchMessages = (provider) => {
    let fetched_messages = readJSONFile(`./assets/chatbot/${provider}.json`);
    if (Object.keys(fetched_messages).length > 0) {
        return fetched_messages;
    }
    return [];
};
const messages = Variable([]);
const sendMessage = (message, provider) => {
    execAsync(`bash -c "tgpt --provider ${provider.get().name} -q '${message.content}'"`)
        .then((response) => {
        notify({ summary: "Message sent", body: response });
        let newMessage = {
            id: (messages.get().length + 1).toString(),
            sender: provider.get().name,
            receiver: "me",
            content: response,
            timestamp: Date.now(),
        };
        messages.set([...messages.get(), newMessage]);
        writeJSONFile(`./assets/chatbot/${provider.get().name}.json`, messages.get());
    })
        .catch((error) => {
        notify({ summary: "Error", body: error });
    });
};
const Info = (provider) => (_jsx("box", { className: "info", vertical: true, spacing: 5, children: bind(provider).as((provider) => [
        _jsx("label", { className: "name", hexpand: true, wrap: true, label: `[${provider.name}]` }),
        _jsx("label", { className: "description", hexpand: true, wrap: true, label: provider.description }),
    ]) }));
const Messages = (provider) => (_jsx("scrollable", { vexpand: true, child: _jsx("box", { className: "messages", vertical: true, hexpand: true, spacing: 5, children: bind(messages).as((messages) => messages.map((message) => (_jsxs("box", { className: "message", spacing: 5, children: [_jsxs("box", { className: "actions", visible: message.sender !== "me", vexpand: false, vertical: true, children: [_jsx("label", { label: provider.get().icon }), _jsx("button", { valign: Gtk.Align.END, vexpand: true, className: "copy", label: "", onClick: () => {
                                execAsync(`wl-copy "${message.content}"`).catch((err) => print(err));
                            } })] }), message.sender === "me" ? (_jsx("label", { className: "body", hexpand: true, wrap: true, xalign: message.sender === "me" ? 1 : 0, label: message.content })) : (formatTextWithCodeBlocks(message.content))] })))) }) }));
const Clear = (provider) => (_jsx("button", { label: "", className: "clear", onClicked: () => {
        messages.set([]);
        writeJSONFile(`./assets/chatbot/${provider.get().name}.json`, messages.get());
    } }));
const Entry = (provider) => (_jsx("entry", { hexpand: true, placeholderText: "Type a message", onActivate: (self) => {
        let newMessage = {
            id: (messages.get().length + 1).toString(),
            sender: "me",
            receiver: provider.get().name,
            content: self.get_text(),
            timestamp: Date.now(),
        };
        messages.set([...messages.get(), newMessage]);
        sendMessage(newMessage, provider);
        self.set_text("");
    } }));
const Bottom = (provider) => (_jsx("box", { spacing: 5, children: [Entry(provider), Clear(provider)] }));
export default ({ provider }) => {
    messages.set(fetchMessages(provider.get().name));
    provider.subscribe((p) => {
        messages.set(fetchMessages(p.name));
    });
    return (_jsx("box", { className: "chat-bot", vertical: true, hexpand: true, spacing: 5, children: [Info(provider), Messages(provider), Bottom(provider)] }));
};
