/**
 * Pomocné rozhraní reprezentující strukturu nahraného souboru na server
 */
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

/**
 * Pomocné rozhraní pro označení takové služby, která bude využívat
 * gateway k odesílání zpráv
 */
export interface MessagePublisher {
  /**
   * Zaregistruje funkci pro odesílání zpráv skrz gateway
   *
   * @param messagePublisher Funkce pro odesílání zpráv
   */
  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void): void;

  /**
   * Odešle zprávu na gateway
   *
   * @param topic Téma zprávy
   * @param data Data zprávy
   */
  publishMessage(topic: string, data: any): void;
}
