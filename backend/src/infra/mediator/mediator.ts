export default interface Mediator {
  register(event: string, callback:Function): void,
  notifyAll(event: string, data: any): Promise<void>;
}

export class MediatorMemory implements Mediator { 
  handles: {event: string, callback: Function}[] = [];

  register(event: string, callback: Function) {
    this.handles.push({event, callback});
  }

  async notifyAll(event: string, data: any) { 
    for(const handler of this.handles) { 
      if(event === handler.event) {
        await handler.callback(data);
      }
    }
  }
}