import * as express from 'express';
import * as SerialPort from 'serialport';

export class SerialRequest {
    
    public port: string;
    public baudRate: number;
    public dataBits: number;
    public highWaterMark: number;
    public lock: boolean;
    public stopBits: number;
    public parity: 'none'|'even'|'mark'|'odd'|'space';
    public rtscts: boolean;
    public xon: boolean;
    public xoff: boolean;
    public xany: boolean;
    public data: number[];

    static Execute(request: express.Request) {
        const serialRequest = <SerialRequest> request.body;
        const options = this.GetSerialOption(serialRequest);
        
        return this.ExecutePromise(serialRequest.port, options, serialRequest.data);
    }

    static GetSerialOption(serialRequest: SerialRequest): SerialPort.OpenOptions {
        const options = <SerialPort.OpenOptions> {}
        this.CopyOptionTag('baudRate'       , serialRequest, options);
        this.CopyOptionTag('dataBits'       , serialRequest, options);
        this.CopyOptionTag('highWaterMark'  , serialRequest, options);
        this.CopyOptionTag('lock'           , serialRequest, options);
        this.CopyOptionTag('stopBits'       , serialRequest, options);
        this.CopyOptionTag('parity'         , serialRequest, options);
        this.CopyOptionTag('rtscts'         , serialRequest, options);
        this.CopyOptionTag('xon'            , serialRequest, options);
        this.CopyOptionTag('xoff'           , serialRequest, options);
        this.CopyOptionTag('xany'           , serialRequest, options);

        return options;
    }

    private static CopyOptionTag(tag: string, input: any, output: any) {
        if (input[tag]) {
            output[tag] = input[tag];
        }
    }

    private static ExecutePromise(port: string, options?: SerialPort.OpenOptions, data?: number[]) {
        if (!options) {
            options = { autoOpen: false };
        } else {
            options.autoOpen = false;
        }

        return new Promise((resolve, reject) => {
            const serialPort = new SerialPort(port, options);
            
            serialPort.open((err?) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                serialPort.write(data, (err?) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                    serialPort.close();
                });
            });
        });
    }
}