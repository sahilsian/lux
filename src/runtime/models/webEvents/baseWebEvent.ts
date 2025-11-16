export abstract class baseWebEvent<W=any> {
    abstract id: string;
    abstract seq: number;
    abstract window: string;
    abstract type: string;
    abstract payload: W;
    abstract origin: "client" | "server";
    abstract session: string;
    abstract status: "ok" | "ack" | "error";
    // Run is optional, but if it exists, it should return a promise
    abstract run?: Promise<void> | void;
    // Optional timestamp, but mostly not optional
    abstract timestamp?: number;

}