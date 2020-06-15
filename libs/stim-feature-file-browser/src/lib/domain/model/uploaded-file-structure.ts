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
