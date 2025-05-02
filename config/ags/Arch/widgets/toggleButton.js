import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Binding, Variable } from "astal";
// ToggleButton functional component
export default function ToggleButton(btnprops) {
    // Destructure properties from props, providing default values if needed
    const { state = false, onToggled, setup, child, ...props } = btnprops;
    // Create an internal state variable
    // If `state` is a Binding, initialize with its current value; otherwise, use the boolean value directly
    const innerState = Variable(state instanceof Binding ? state.get() : state);
    return (_jsx("button", { ...props, setup: (self) => {
            setup?.(self); // Call the setup function if provided
            // Apply "checked" class based on the current inner state value
            self.toggleClassName("checked", innerState.get());
            self.hook(innerState, () => {
                self.toggleClassName("checked", innerState.get());
            });
            // If `state` is a Binding, sync the inner state whenever `state` updates
            if (state instanceof Binding) {
                self.hook(state, () => innerState.set(state.get()));
            }
        }, onClicked: (self) => {
            // Toggle the state and trigger the `onToggled` callback with the new value
            innerState.set(!innerState.get());
            onToggled?.(self, innerState.get());
        }, child: child }));
}
