import InputCursorMove from "../../events/input/cursor/move.ts";
import {eventBus} from "../../system/bus/eventBus.ts";

export const cursorMoveListen = (): (() => void) => {
    const handleMouseMove = (e: MouseEvent) => {
        const payload = {
            events: [{x: e.clientX, y: e.clientY}],
        };

        const event = new InputCursorMove(payload);
        eventBus.emit(event);

    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
    };
};