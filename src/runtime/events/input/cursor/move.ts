import {RegisterBaseWebEvent} from "../../../models/webEvents/decorator.ts";
import type {baseWebEvent} from "../../../models/webEvents/baseWebEvent.ts";
import {eventBus} from "../../../system/bus/eventBus.ts";


interface InputCursorMoveEvent {
    x: number;
    y: number;
}
export interface InputCursorMovePayload {
    events: InputCursorMoveEvent[]
}

@RegisterBaseWebEvent("input.cursor.move")
class InputCursorMove implements baseWebEvent<InputCursorMovePayload> {
    id: string;
    seq: number;
    readonly window: string;
    type: string;
    payload: InputCursorMovePayload;
    origin: "client" | "server";
    session: string;
    status: "ok" | "ack" | "error";
    timestamp?: number;

    constructor(payload: InputCursorMovePayload, session?: string, seq: number = 0) {
        this.id = crypto.randomUUID();
        this.seq = seq;
        this.window = "input";
        this.type = "input.cursor.move";
        this.origin = "client";
        this.status = "ok";
        this.session = session ?? crypto.randomUUID();
        this.payload = payload;
        this.timestamp = Date.now();
    }

    async _run() {

        const events = this.payload.events;
        const last = events[events.length - 1];

        const ackPayload = {
            acknowledged: true,
            count: events.length,
            last: last
        };

        await eventBus.emit({
            id: crypto.randomUUID(),
            seq: this.seq + 1,
            session: this.session,
            window: "input",
            type: "cursor.cursor.move.ack",
            origin: "server",
            status: "ok",
            payload: ackPayload,
        })
    }
}

export default InputCursorMove