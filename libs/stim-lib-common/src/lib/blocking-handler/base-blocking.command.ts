export interface BaseBlockingCommand<CType> {
  waitForResponse: boolean;
  commandType: CType;
}
