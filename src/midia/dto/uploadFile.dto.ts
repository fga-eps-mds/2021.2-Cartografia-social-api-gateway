export class UploadFileDto {
  constructor(file: Express.Multer.File) {
    this.file = file;
    this.bufferB64 = file.buffer.toString('base64');

    // clean the file bufffer, because we are sending it as base64
    // the default implementation messes up the data
    this.file.buffer = null;
  }

  file: Express.Multer.File;
  bufferB64: string;
}
