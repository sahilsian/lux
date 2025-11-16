import type {baseWebEvent} from "./baseWebEvent";

type BaseWebEventConstructor = new (...args: any[]) => baseWebEvent;

const registry = new Map<string, BaseWebEventConstructor>();

export const registerBaseWebEvent = (type:string, constructor: any) => {
    registry.set(type, constructor)
}
export const getBaseWebEvents = () => {
    return Array.from(registry.entries());
}

export const getBaseWebEvent = (type: string): BaseWebEventConstructor | undefined => {
    return registry.get(type);
};
