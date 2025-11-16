import type {baseWebEvent} from "../../models/webEvents/baseWebEvent.ts";
import * as signalR from "@microsoft/signalr";
import { getBaseWebEvent } from "../../models/webEvents/registry.ts";
/*
<summary>
Runtime Pub/Sub with an emitter and buffering for when the connection is not ready
</summary>
 */
type Listener<T extends baseWebEvent = baseWebEvent> = (event: T) => void | Promise<void>;
export class EventBus {
    private listeners: Map<string, Listener[]> = new Map();
    private connection: signalR.HubConnection | null = null;
    private buffer: any[] = [];
    private attached:boolean = false;
    attachConnection(conn: signalR.HubConnection) {
        this.connection = conn;
        if (conn.state === signalR.HubConnectionState.Connected && this.buffer.length > 0 ) {
            for (const event of this.buffer) {
                console.log("🚌 attach and buffer")
                conn.invoke("RecieveEvent", event).catch((err) => {
                    console.error("🚌 failed to send event to server: ", err)
                });
            }
            this.buffer = [];
        }

        // Guarded attachment to avoid multiple listeners per connection
        if(!this.attached) {
            this.attached = true;
            conn.on("RecieveEvent", (raw: any) => {
                const cloned = JSON.parse(JSON.stringify(raw));
                const ctor = getBaseWebEvent(cloned.type);
                const event = ctor ? Object.assign(new ctor(cloned.payload), cloned) : cloned;
                this.emit(event);
            });
        }

    }

    on<T extends baseWebEvent>(type: string, listener: Listener<T>) {
        const list = this.listeners.get(type) || [];
        list.push(listener as Listener);
        this.listeners.set(type, list);
    }

    off<T extends baseWebEvent>(type: string, listener: Listener<T>) {
        const list = this.listeners.get(type) || [];
        if (!list) {
            return;
        }
        this.listeners.set(type, list.filter((l) => l !== listener));
    }

    async emit<T extends baseWebEvent>(event: T, _options?: { remote?: boolean }) {

        const list = [
            ...((this.listeners.get(event.type) || []) as Listener[]),
            ...((this.listeners.get("*") || []) as Listener[])
        ]

        for (const listener of list) {
            try {
                listener(event);
                console.log("🚌 added listener called for ", event.type)
            } catch (e) {
                console.error(`🚌 had a listener error at emit for ${event.type}: `, e);
            }
        }

        if (event.origin === "client" && this.connection?.state === signalR.HubConnectionState.Connected ) {
            console.log("🚌 emit")

            // SignalR event invoke:
            await this.connection.invoke("RecieveEvent", event).catch((err) => {
                console.error("Failed to send event to server: ", err)
            });

        } else {
            if (event.origin !== "client") return
            console.warn("🚌 server connection is not ready, buffering event:", event.type);
            this.buffer.push(event);
        }
    }
}

export const eventBus = new EventBus();