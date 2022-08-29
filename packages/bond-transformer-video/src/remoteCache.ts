import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { rename } from "fs-extra";
import { Reporter } from "gatsby";

export class RemoteCache {
  public static async create(
    connectionString: string,
    containerName: string
  ): Promise<RemoteCache> {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    return new RemoteCache(containerClient);
  }
  constructor(private readonly containerClient: ContainerClient) {}

  public async getFromCache(
    name: string,
    targetFileName: string,
    reporter: Reporter
  ): Promise<void> {
    const blob = this.containerClient.getBlockBlobClient(name);
    const exists = await blob.exists();
    reporter.info(`${name} exists = ${exists}`);
    const tempTargetFileName = targetFileName + ".rtmp";
    await blob.downloadToFile(tempTargetFileName);
    await rename(tempTargetFileName, targetFileName);
  }

  public async addToCache(sourceFileName: string, name: string): Promise<void> {
    const blob = this.containerClient.getBlockBlobClient(name);
    await blob.uploadFile(sourceFileName);
  }
}
