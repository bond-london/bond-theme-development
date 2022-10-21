import { copy, copyFile, existsSync, mkdirSync, rename, rm } from "fs-extra";
import { RemoteCache } from "./remoteCache";
import { join } from "path";
import { Reporter } from "gatsby";

export async function atomicCopyFile(
  sourcePath: string,
  targetPath: string
): Promise<void> {
  const tempFile = targetPath + `.tmp-${performance.now()}`;
  await rm(targetPath, { force: true });
  try {
    await copyFile(sourcePath, tempFile);
    await rename(tempFile, targetPath);
  } catch (ex) {
    if (!existsSync(targetPath)) {
      throw ex;
    }
  } finally {
    await rm(tempFile, { force: true });
  }
}

export class Cache {
  constructor(
    private readonly cacheDir: string,
    private readonly remoteCache?: RemoteCache
  ) {
    mkdirSync(cacheDir, { recursive: true });
  }

  public async getFromCache(
    name: string,
    targetFileName: string,
    reporter: Reporter
  ): Promise<boolean> {
    const localFileName = join(this.cacheDir, name);

    try {
      await atomicCopyFile(localFileName, targetFileName);
      return true;
    } catch (error) {
      if (this.remoteCache) {
        reporter.verbose(`Looking to get ${name} from remote cache`);
        const exists = await this.remoteCache.getFromCache(
          name,
          targetFileName,
          reporter
        );
        if (exists) {
          reporter.verbose(
            `Got ${name} from remote cache, copying to local ${localFileName}`
          );
          await atomicCopyFile(targetFileName, localFileName);
          reporter.verbose(`Got ${name} from remote cache`);
          return true;
        }
      }
    }
    return false;
  }

  public async addToCache(sourceFileName: string, name: string): Promise<void> {
    if (this.remoteCache) {
      await this.remoteCache.addToCache(sourceFileName, name);
    }
    const localFileName = join(this.cacheDir, name);
    await copy(sourceFileName, localFileName, { dereference: false });
  }
}
