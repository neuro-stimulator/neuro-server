// TODO Přesunout až budu na NB
export interface QueryError {
  message: string;
  errno: number;
  code: string;
  query: string;
  parameters: [];
}
