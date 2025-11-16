export interface Transport {
    isConnected(): boolean;
    send(event:any): Promise<void>;
    onReceive(callback: (event:any) => void): void;
}
