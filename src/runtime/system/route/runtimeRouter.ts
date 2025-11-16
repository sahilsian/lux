
// Runtime router for dispatching events to the correct components
import type {baseWebEvent} from "../../models/webEvents/baseWebEvent";
import {eventBus} from "../bus/eventBus";
let initialized = false;
// Command Registry
const handlers: Record<string, (event: any) => void> = {
    "system.initialize": (e) => console.log("System initialized", e),
    "system.connect": (e) => console.log("System has reconnected", e),
    "input.cursor.move": (e) => console.log("Cursor moved", e),
};
const runtimeRouter = () => {
    if(initialized) return;
    initialized = true;

    eventBus.on("*", (event: baseWebEvent) => {
        const handler = handlers[event.type];
        if(handler) {
            handler(event);
        } else {
            console.warn(`No handler for event type: ${event.type}`);
        }
    })
}

export default runtimeRouter;