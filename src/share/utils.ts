export interface UploadedFileStructure {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}

export interface MessagePublisher {
  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void): void;

  publishMessage(topic: string, data: any): void;
}
