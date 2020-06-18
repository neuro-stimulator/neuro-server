// @WebSocketGateway({ namespace: '/experiment-results' })
export class ExperimentResultsGateway {
  // implements OnGatewayConnection, OnGatewayDisconnect {
  // private readonly logger = new Logger(ExperimentResultsGateway.name);
  //
  // @WebSocketServer()
  // server: Server;
  //
  // constructor(private readonly _service: ExperimentResultsService) {
  //   _service.registerMessagePublisher((topic: string, data: any) =>
  //     this._messagePublisher(topic, data)
  //   );
  // }
  //
  // private _messagePublisher(topic: string, data: any) {
  //   this.server.emit(topic, data);
  // }
  //
  // handleConnection(client: Client, ...args: any[]): any {
  //   this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  // }
  //
  // handleDisconnect(client: Client): any {
  //   this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  // }
  //
  // @SubscribeMessage('all')
  // handleAll(client: any, message: any) {
  //   this._service.findAll().then((experiments: ExperimentResult[]) => {
  //     client.emit('all', experiments);
  //   });
  // }
}
