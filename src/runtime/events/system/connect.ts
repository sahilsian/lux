// // Connect: granular lifecycle events throughout the system for connecting to the websocket
//
// import type {baseWebEvent} from "../../models/webEvents/baseWebEvent.ts";
//
// interface SystemConnectPayload {
//
// }
//
// class SystemConnect implements baseWebEvent<SystemConnectPayload> {
//     id: string;
//     seq: number;
//     window: string;
//     type: string;
//     payload: SystemConnectPayload;
//     origin: "client" | "server";
//     session: string;
//     status: "ok" | "ack" | "error";
//
//     constructor(payload: SystemConnectPayload) {
//
//     }
// }