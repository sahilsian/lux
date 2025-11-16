import { registerBaseWebEvent } from "./registry.ts";

export const RegisterBaseWebEvent = (type:string) => {
    return (target: any) => {
        registerBaseWebEvent(type, target);
    }
}