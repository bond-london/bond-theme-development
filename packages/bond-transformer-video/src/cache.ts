import { copy, rename } from "fs-extra";
import { RemoteCache } from "./remoteCache";
import { join } from "path";
import { Reporter } from "gatsby";

async function atomicCopyFile(sourceFileName: string, targetFileName: string) {
  const tempTargetFileName = targetFileName + ".tmp";
  await copy(sourceFileName, tempTargetFileName, { dereference: false });
  await rename(tempTargetFileName, targetFileName);
}

export class Cache {
  constructor(
    private readonly cacheDir: string,
    private readonly remoteCache?: RemoteCache
  ) {}

  private cachedPromised: { [key: string]: Promise<void> } = {};

  public async getFromCache(
    name: string,
    targetFileName: string,
    reporter: Reporter
  ) {
    const key = `${name}#${targetFileName}`;
    const current = this.cachedPromised[key];
    if (current) {
      reporter.info(`Using cached promise for ${name} to ${targetFileName}`);
      return current;
    }

    const newPromise = this.internalGetFromCache(
      name,
      targetFileName,
      reporter
    );
    this.cachedPromised[key] = newPromise;
    return newPromise;
  }

  private async internalGetFromCache(
    name: string,
    targetFileName: string,
    reporter: Reporter
  ) {
    const localFileName = join(this.cacheDir, name);

    try {
      await atomicCopyFile(localFileName, targetFileName);
    } catch (error) {
      if (this.remoteCache) {
        reporter.info(`Looking to get ${name} from remote cache`);
        await this.remoteCache.getFromCache(name, targetFileName, reporter);
        await atomicCopyFile(targetFileName, localFileName);
        reporter.info(`Got ${name} from remote cache`);
      } else {
        throw error;
      }
    }
  }

  public async addToCache(sourceFileName: string, name: string) {
    if (this.remoteCache) {
      await this.remoteCache.addToCache(sourceFileName, name);
    }
    const localFileName = join(this.cacheDir, name);
    await copy(sourceFileName, localFileName, { dereference: false });
  }
}
