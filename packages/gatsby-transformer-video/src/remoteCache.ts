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
  ): Promise<boolean> {
    const blob = this.containerClient.getBlockBlobClient(name);
    const exists = await blob.exists();
    reporter.verbose(`${name} remote exists = ${exists}`);
    if (!exists) return false;
    const tempTargetFileName = targetFileName + `.rtmp-${performance.now()}`;
    await blob.downloadToFile(tempTargetFileName);
    reporter.verbose(`${name} downloaded from remote cache`);
    try {
      await rename(tempTargetFileName, targetFileName);
      reporter.verbose(`${name} renamed from temp file`);
    } catch (ex) {
      if (!existsSync(targetFileName)) {
        reporter.verbose(`${name} failed to rename, target does not exist`);
        throw ex;
      }
      reporter.verbose(`${name} failed to rename, target exists`);
    } finally {
      reporter.verbose(`${name} remove old temp file`);
      await rm(tempTargetFileName, { force: true });
    }
    reporter.verbose(`${name} correctly got from cache`);
    return true;
  }

  public async addToCache(sourceFileName: string, name: string): Promise<void> {
    const blob = this.containerClient.getBlockBlobClient(name);
    await blob.uploadFile(sourceFileName);
  }
}
