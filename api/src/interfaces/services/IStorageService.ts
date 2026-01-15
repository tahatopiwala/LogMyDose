export interface IStorageService {
  /**
   * Upload a file to S3 storage
   * @param buffer - File buffer
   * @param key - S3 object key (path)
   * @param contentType - MIME type
   * @returns Public URL of uploaded file
   */
  uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string>;

  /**
   * Generate a temporary signed URL for downloading
   * @param key - S3 object key
   * @param expiresIn - URL expiration in seconds
   * @returns Signed URL valid for specified duration
   */
  getSignedUrl(key: string, expiresIn: number): Promise<string>;

  /**
   * Delete a file from S3 storage
   * @param key - S3 object key
   */
  deleteFile(key: string): Promise<void>;
}
