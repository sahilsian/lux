import type {baseWebEvent} from "../../models/webEvents/baseWebEvent";
/*
<summary>
Runtime Pub/Sub with an emitter and buffering for when the connection is not ready
</summary>
 */
type Listener<T extends baseWebEvent = baseWebEvent> = (event: T) => void | Promise<void>;
export class EventBus {
    private listeners: Map<string, Listener[]> = new Map();
    private buffer: any[] = [];
    private attached:boolean = false;

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
    }
}

export const eventBus = new EventBus();