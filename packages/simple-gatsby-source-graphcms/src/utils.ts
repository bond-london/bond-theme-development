import { mkdir } from "fs/promises";
import fetch from "node-fetch";
import { NodePluginArgs, ParentSpanPluginArgs } from "gatsby";
import {
  buildNodeDefinitions,
  compileNodeQueries,
  readOrGenerateDefaultFragments,
  wrapQueryExecutorWithQueue,
  generateDefaultFragments,
} from "@nrandell/gatsby-graphql-source-toolkit";
import {
  IQueryExecutionArgs,
  IQueryExecutor,
  ISourcingConfig,
} from "@nrandell/gatsby-graphql-source-toolkit/dist/types";
import { ISchemaInformation, IPluginOptions, IPluginState } from "./types";
import { copyFile, existsSync, rename, rm } from "fs-extra";
import {
  GraphQLType,
  GraphQLField,
  ExecutionResult,
  isNonNullType,
  isListType,
} from "graphql";
import pThrottle from "p-throttle";

export const stateCache: IPluginState = {};

function postprocessValue(
  locale: string,
  stage: string,
  value: { locale?: string; stage: string } & unknown
): {
  locale?: string;
  stage: string;
  actualLocale?: string;
  actualStage: string;
} & unknown {
  const { locale: actualLocale, stage: actualStage, ...rest } = value;
  const newValue = {
    ...rest,
    stage,
    locale,
    actualStage,
    actualLocale,
  };
  return newValue;
}

function postprocessData(
  gatsbyApi: NodePluginArgs,
  args: IQueryExecutionArgs,
  result: ExecutionResult
): ExecutionResult {
  const { reporter } = gatsbyApi;
  const { operationName } = args;
  if (!operationName.startsWith("LIST_")) {
    return result;
  }
  const split = operationName.split("_");
  if (split.length !== 4) {
    return reporter.panic(
      `Operation name (${operationName}) should contain 4 entries`
    );
  }

  const [, , possibleLocale, stage] = split;
  const locale =
    possibleLocale.length === 2
      ? possibleLocale
      : possibleLocale.substring(0, 2) + "_" + possibleLocale.substring(2);

  const { data } = result;
  if (!data) {
    return result;
  }

  const updatedData: { [key: string]: unknown } = {};
  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    const values = data[key];
    if (Array.isArray(values)) {
      const newValues = values.map(value =>
        postprocessValue(locale, stage, value)
      );
      updatedData[key] = newValues;
    } else {
      updatedData[key] = values;
    }
  }
  return { ...result, data: updatedData };
}

interface IGraphCMSResponse {
  errors?: Array<string>;
}

const throttler = pThrottle({ limit: 2, interval: 1000 });

type Fetcher = Promise<
  ExecutionResult<{ [key: string]: unknown }, { [key: string]: unknown }>
>;

export function createExecutor(
  gatsbyApi: NodePluginArgs,
  pluginOptions: IPluginOptions
): IQueryExecutor {
  const { endpoint, stages, token } = pluginOptions;
  const { reporter } = gatsbyApi;
  const defaultStage = stages[0];
  const execute = (args: IQueryExecutionArgs): Fetcher => {
    const { operationName, query, variables = {} } = args;
    return fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ query, variables, operationName }),
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ...(defaultStage && { "gcms-stage": defaultStage }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(response => {
        if (!response.ok) {
          return response
            .text()
            .then(text =>
              reporter.panic(
                `gatsby-source-graphcms: Response not ok building GraphCMS nodes: "${query}"`,
                new Error(text)
              )
            );
        }

        return response.json() as IGraphCMSResponse;
      })
      .then(response => {
        if (response.errors) {
          return reporter.panic(
            `gatsby-source-graphcms: Response errors building GraphCMS nodes: "${query}" (${JSON.stringify(
              response.errors
            )})`,
            response.errors as unknown as Array<Error>
          );
        }

        return response as ExecutionResult;
      })
      .then(response => {
        const post = postprocessData(gatsbyApi, args, response);
        return post;
      })
      .catch(error =>
        reporter.panic(
          `gatsby-source-graphcms: Error postprocessing GraphCMS nodes: "${query}"`,
          new Error(error)
        )
      );
  };
  return throttler(execute);
}

export async function createSourcingConfig(
  schemaConfig: ISchemaInformation,
  gatsbyApi: ParentSpanPluginArgs,
  pluginOptions: IPluginOptions
): Promise<ISourcingConfig> {
  const { fragmentsPath, typePrefix, concurrency } = pluginOptions;

  const execute = createExecutor(gatsbyApi, pluginOptions);
  const { schema, gatsbyNodeTypes } = schemaConfig;

  const fragmentsDir = fragmentsPath
    ? `${process.cwd()}/${fragmentsPath}`
    : undefined;
  if (fragmentsDir) {
    await mkdir(fragmentsDir, { recursive: true });
  }

  const addSystemFieldArguments = (
    field: GraphQLField<unknown, unknown>
  ):
    | {
        [argName: string]: unknown;
      }
    | undefined => {
    if (["createdAt", "publishedAt", "updatedAt"].includes(field.name)) {
      return { variation: `COMBINED` };
    }
    if (field.args.find(a => a.name === "first")) {
      return { first: 100 };
    }
    return undefined;
  };

  const fragmentsConfig = {
    schema,
    gatsbyNodeTypes,
    defaultArgumentValues: [addSystemFieldArguments],
  };
  const fragments = fragmentsDir
    ? await readOrGenerateDefaultFragments(fragmentsDir, fragmentsConfig)
    : generateDefaultFragments(fragmentsConfig);

  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  });

  return {
    gatsbyApi,
    schema,
    execute: wrapQueryExecutorWithQueue(execute, { concurrency }),
    gatsbyTypePrefix: typePrefix,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  };
}

async function timeout(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function retry<A>(
  fn: () => Promise<A>,
  options: {
    retries: number;
    factor: number;
    minTimeout: number;
    onRetry: (error: Error | string) => void;
  }
): Promise<A | undefined> {
  let ms = options.minTimeout;
  for (let i = 0; i < options.retries; i++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      if (i < options.retries - 1) {
        if (typeof error === "string" || error instanceof Error) {
          options.onRetry(error);
        } else {
          options.onRetry("" + error);
        }
      }
      await timeout(ms);
      ms += ms * options.factor;
    }
  }
  return undefined;
}

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

export function getRealType(
  valueType: GraphQLType,
  level?: number
): GraphQLType {
  if (isListType(valueType)) {
    return getRealType(valueType.ofType, (level || 0) + 1);
  }
  if (isNonNullType(valueType)) {
    return getRealType(valueType.ofType, (level || 0) + 1);
  }
  return valueType;
}

export function couldBeAList(valueType: GraphQLType): boolean {
  if (isListType(valueType)) {
    return true;
  }
  if (isNonNullType(valueType)) {
    return couldBeAList(valueType.ofType);
  }
  return false;
}
