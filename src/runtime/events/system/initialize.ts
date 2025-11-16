// High level macro event for running the application
import { RegisterBaseWebEvent } from "../../models/webEvents/decorator.ts";
import type {baseWebEvent} from "../../models/webEvents/baseWebEvent.ts";
import {eventBus} from "../../system/bus/eventBus.ts";

export interface SystemInitializePayload {
    environment?: "development" | "staging" | "production";
    configUrl?: string;
    autoConnect?: boolean;
}
@RegisterBaseWebEvent("system.initialize")
class SystemInitialize implements baseWebEvent<SystemInitializePayload> {
    id: string;
    seq: number;
    readonly window: string;
    type: string;
    origin: "client" | "server";
    status: "ok" | "ack" | "error";
    session: string;
    payload: SystemInitializePayload;
    timestamp?: number;

    constructor(payload: SystemInitializePayload, session?: string) {
        this.id = crypto.randomUUID();
        this.seq = 0;
        this.window = "system";
        this.type = "system.initialize";
        this.origin = "client";
        this.status = "ok";
        this.session = session ?? SystemInitialize.getOrCreateSessionId();
        this.payload = payload;
        this.timestamp = Date.now();
    }

    async _run() {
        await eventBus.emit({
            id: crypto.randomUUID(),
            seq: 1,
            session: this.session,
            window: "system",
            type: "system.ready",
            origin: "client",
            status: "ok",
            payload: {},
            timestamp: Date.now(),
        });
    }

    private static getOrCreateSessionId() {
        const key = "runtime-session";
        let sessionId = localStorage.getItem(key);
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem(key, sessionId);
            console.log("🧭 created new session:", sessionId);
        } else {
            console.log("🧭 restored existing session:", sessionId);
        }
        return sessionId;
    }
}

export default SystemInitialize