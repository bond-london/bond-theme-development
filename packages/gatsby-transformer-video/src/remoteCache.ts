import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { existsSync, rename, rm } from "fs-extra";
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
    reporter.info(`${name} remote exists = ${exists}`);
    const tempTargetFileName = targetFileName + `.rtmp-${performance.now()}`;
    await blob.downloadToFile(tempTargetFileName);
    reporter.info(`${name} downloaded from remote cache`);
    try {
      await rename(tempTargetFileName, targetFileName);
      reporter.info(`${name} renamed from temp file`);
    } catch (ex) {
      if (!existsSync(targetFileName)) {
        reporter.info(`${name} failed to rename, target does not exist`);
        throw ex;
      }
      reporter.info(`${name} failed to rename, target exists`);
    } finally {
      reporter.info(`${name} remove old temp file`);
      await rm(tempTargetFileName, { force: true });
    }
    reporter.info(`${name} correctly got from cache`);
  }

  public async addToCache(sourceFileName: string, name: string): Promise<void> {
    const blob = this.containerClient.getBlockBlobClient(name);
    await blob.uploadFile(sourceFileName);
  }
}
