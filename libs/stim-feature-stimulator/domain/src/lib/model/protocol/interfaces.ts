export interface SerializedExperiment {
  offset: number;
  experiment: Buffer;
  outputs?: {
    offset: number;
    output: Buffer;
  }[];
}

export interface SerializedSequence {
  offset: number;
  sequence: Buffer;
}
