import { registerBaseWebEvent } from "./registry";

export const RegisterBaseWebEvent = (type:string) => {
    return (target: any) => {
        registerBaseWebEvent(type, target);
    }
}