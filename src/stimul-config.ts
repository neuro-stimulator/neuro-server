export interface StimulConfig {
  // Hodnota stimulu
  value: number;
  // Pravděpodobnost výskytu stimulu
  likelihood: number;
  // Doba trvání zapnutého stimulu
  timeEnabled?: number;
  // Doba trvání vypnutého stimulu
  timeDisabled?: number;
  // Nastavení závislosti na výskytu předchozích stimulech
  dependencies?: Occurrence[];
}

export interface Occurrence {
  // Číslo stimulu
  stimul: number;
  // Počet výskytů
  occurrence: number;
  // True, pokud stimuly mají být přímo za sebou
  inRow: boolean;
}
