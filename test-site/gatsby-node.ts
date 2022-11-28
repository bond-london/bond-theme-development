import { statSync } from "fs";
import { CreatePageArgs, CreatePagesArgs } from "gatsby";
import { resolve } from "path";
import { articlesPerPage, isProduction } from "./gatsby-env";

// TODO: Working nav menu
// TODO: Reduce use of index.ts in css, but allow auto complete for classes?
// TODO: Site search
// TODO: Make sure it works as a template

const allowHidden = !isProduction;

function tryLoadTemplate(templateName: string) {
  const possible = `./src/templates/${templateName}.tsx`;
  try {
    const stat = statSync(possible);
    if (stat.isFile()) {
      return resolve(possible);
    }
  } catch {
    /* no op */
  }
  return undefined;
}

function buildSlices(
  { actions: { createSlice } }: CreatePagesArgs,
  nodes: Queries.AllContentQuery["allGraphCmsNavigation"]["nodes"]
) {
  for (const { name, isFooter } of nodes) {
    if (isFooter) {
      createSlice({
        id: `footer-${name}`,
        component: resolve("./src/cms/CmsFooter.tsx"),
        context: {
          name,
        },
      });
    } else {
      createSlice({
        id: `navigation-${name}`,
        component: resolve("./src/cms/CmsNavigationMenu.tsx"),
        context: {
          name,
        },
      });
    }
  }
  createSlice({
    id: "analytics",
    component: resolve("./src/components/Analytics.tsx"),
  });
}

function buildListPages<T = unknown>(
  { reporter, actions: { createPage } }: CreatePagesArgs,
  defaultTemplateName: string,
  customTemplateName: string,
  pageCount: number,
  slug: string,
  context: T
) {
  if (pageCount) {
    const mainTemplate = resolve(defaultTemplateName);
    const customTemplate = tryLoadTemplate(customTemplateName);
    const component = customTemplate || mainTemplate;
    reporter.info(`Using template ${customTemplate ? "name" : "custom"}`);

    for (let page = 0; page < pageCount; page++) {
      const path = page === 0 ? `/${slug}/` : `/${slug}/${page + 1}/`;
      reporter.info(`Creating page ${page}`);
      createPage({
        path,
        component,
        defer: page > 0,
        context: {
          ...context,
          articlesPerPage,
          allowHidden,
          skip: page * articlesPerPage,
        },
      });
    }
  }
}

async function buildTagIndexPages(
  args: CreatePagesArgs,
  id: string,
  slug: string,
  name: string
) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { graphql, reporter } = args;

  const { data } = await graphql<Queries.TagIndexQuery>(
    `
      query TagIndex(
        $allowHidden: Boolean!
        $id: String!
        $articlesPerPage: Int
      ) {
        allGraphCmsArticle(
          filter: {
            tags: { elemMatch: { id: { eq: $id } } }
            hidden: { in: [false, $allowHidden] }
          }
          limit: $articlesPerPage
        ) {
          pageInfo {
            pageCount
          }
        }
      }
    `,
    { id, articlesPerPage, allowHidden }
  );

  reporter.info(
    `buildTagIndexPages(${id}, ${slug}, ${name}) for ${
      data?.allGraphCmsArticle?.pageInfo?.pageCount || 0
    } pages`
  );
  if (data?.allGraphCmsArticle?.pageInfo) {
    const { pageCount } = data.allGraphCmsArticle.pageInfo;
    buildListPages(
      args,
      `./src/templates/tag/list.tsx`,
      `tag/${name}List`,
      pageCount,
      slug,
      { id }
    );
    // const mainTemplate = resolve(`./src/templates/tag/list.tsx`);
    // if (pageCount) {
    //   const nameTemplate = tryLoadTemplate(`tag/${name}List`);
    //   const component = nameTemplate || mainTemplate;
    //   reporter.info(`Using template ${nameTemplate ? "name" : "default"}`);

    //   for (let page = 0; page < pageCount; page++) {
    //     const path = page === 0 ? `/${slug}/` : `/${slug}/${page + 1}/`;
    //     reporter.info(`Creating page ${page}`);
    //     actions.createPage({
    //       path,
    //       component,
    //       defer: page > 0,
    //       context: {
    //         articlesPerPage,
    //         allowHidden,
    //         skip: page * articlesPerPage,
    //         id,
    //       },
    //     });
    //   }
    // }
  }
}

async function buildArticleTypeIndexPages(
  args: CreatePagesArgs,
  id: string,
  slug: string,
  name: string
) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { graphql, reporter } = args;
  const { data } = await graphql<Queries.ArticleTypeIndexQuery>(
    `
      query ArticleTypeIndex(
        $allowHidden: Boolean!
        $id: String!
        $articlesPerPage: Int
      ) {
        allGraphCmsArticle(
          filter: {
            articleType: { id: { eq: $id } }
            hidden: { in: [false, $allowHidden] }
          }
          limit: $articlesPerPage
        ) {
          pageInfo {
            pageCount
          }
        }
      }
    `,
    { id, articlesPerPage, allowHidden }
  );

  reporter.info(
    `buildArticleTypeIndexPages(${id}, ${slug}, ${name}) for ${
      data?.allGraphCmsArticle?.pageInfo?.pageCount || 0
    } pages`
  );
  if (data?.allGraphCmsArticle?.pageInfo) {
    buildListPages(
      args,
      `./src/templates/articleType/list.tsx`,
      `articleType/${name}List`,
      data.allGraphCmsArticle.pageInfo.pageCount,
      slug,
      { id }
    );
  }
}

async function buildArticleTypeTagIndexPages(
  args: CreatePagesArgs,
  articleTypeId: string,
  tagId: string,
  slug: string,
  articleTypeName: string,
  tagName: string
) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { graphql, reporter } = args;
  const { data } = await graphql<Queries.ArticleTypeIndexQuery>(
    `
      query ArticleTypeTagIndex(
        $allowHidden: Boolean!
        $articleTypeId: String!
        $tagId: String!
        $articlesPerPage: Int
      ) {
        allGraphCmsArticle(
          filter: {
            articleType: { id: { eq: $articleTypeId } }
            tags: { elemMatch: { id: { eq: $tagId } } }
            hidden: { in: [false, $allowHidden] }
          }
          limit: $articlesPerPage
        ) {
          pageInfo {
            pageCount
          }
        }
      }
    `,
    { articleTypeId, tagId, articlesPerPage, allowHidden }
  );

  reporter.info(
    `buildArticleTypeTagIndexPages(${articleTypeId}, ${tagId}, ${slug}, ${articleTypeName}, ${tagName}) for ${
      data?.allGraphCmsArticle?.pageInfo?.pageCount || 0
    } pages`
  );
  if (data?.allGraphCmsArticle?.pageInfo) {
    buildListPages(
      args,
      `./src/templates/articleType/tag/list.tsx`,
      `articleType/${articleTypeName}/${tagName}List`,
      data.allGraphCmsArticle.pageInfo.pageCount,
      slug,
      { articleTypeId, tagId }
    );
  }
}

const specialPageMap = new Map<
  string,
  { hidden?: boolean; redirectTo?: string }
>();

function updateSpecialPageMap(
  id: string,
  {
    hidden,
    redirectTo,
  }: {
    hidden?: boolean;
    redirectTo?: string;
  }
) {
  const existing = specialPageMap.get(id);
  if (existing) {
    if (typeof hidden !== "undefined") {
      existing.hidden = hidden;
    }
    if (typeof redirectTo !== "undefined") {
      existing.redirectTo = redirectTo;
    }
  } else {
    specialPageMap.set(id, { hidden, redirectTo });
  }
}

function buildHiddenMaps(data: Queries.AllContentQuery) {
  data.hiddenArticles.nodes.forEach(({ id }) =>
    updateSpecialPageMap(id, { hidden: true })
  );
  data.hiddenPages.nodes.forEach(({ id }) =>
    updateSpecialPageMap(id, { hidden: true })
  );
  data.redirectArticles.nodes.forEach(({ id, redirectTo }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    updateSpecialPageMap(id, { redirectTo: redirectTo! })
  );
  data.redirectPages.nodes.forEach(({ id, redirectTo }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    updateSpecialPageMap(id, { redirectTo: redirectTo! })
  );
}

export async function createPages(args: CreatePagesArgs) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { reporter, graphql } = args;
  const results = await graphql<Queries.AllContentQuery>(
    `
      query AllContent {
        allGraphCmsNavigation {
          nodes {
            name
            isFooter
          }
        }
        allGraphCmsTag {
          nodes {
            id
            slug
            name
          }
        }
        allGraphCmsArticleType {
          nodes {
            id
            slug
            name
          }
        }

        hiddenArticles: allGraphCmsArticle(filter: { hidden: { eq: true } }) {
          nodes {
            id
          }
        }
        hiddenPages: allGraphCmsPage(filter: { hidden: { eq: true } }) {
          nodes {
            id
          }
        }
        redirectArticles: allGraphCmsArticle(
          filter: { redirectTo: { ne: null } }
        ) {
          nodes {
            id
            redirectTo
          }
        }
        redirectPages: allGraphCmsPage(filter: { redirectTo: { ne: null } }) {
          nodes {
            id
            redirectTo
          }
        }
      }
    `
  );

  const { data } = results;

  if (!data) {
    return reporter.panicOnBuild("No data");
  }

  for (const { id, slug, name } of data.allGraphCmsTag.nodes) {
    await buildTagIndexPages(args, id, slug, name);
  }

  for (const { id, slug, name } of data.allGraphCmsArticleType.nodes) {
    await buildArticleTypeIndexPages(args, id, slug, name);
    for (const { id: tagId, slug: tagSlug, name: tagName } of data
      .allGraphCmsTag.nodes) {
      await buildArticleTypeTagIndexPages(
        args,
        id,
        tagId,
        `${slug}/${tagSlug}`,
        name,
        tagName
      );
    }
  }

  buildHiddenMaps(data);
  buildSlices(args, data.allGraphCmsNavigation.nodes);
}

export function onCreatePage(args: CreatePageArgs) {
  const {
    page,
    reporter,
    actions: { deletePage, createRedirect },
  } = args;

  const id = page.context?.id as string | undefined;
  if (id) {
    const special = specialPageMap.get(id);
    if (special) {
      deletePage(page);
      reporter.info(`Got a special page: ${id}: ${page.path}`);
      if (special.hidden) {
        reporter.info(`Got a hidden page: ${id}: ${page.path}`);
        return;
      }
      if (special.redirectTo) {
        reporter.info(`Redirecting from ${page.path} to ${special.redirectTo}`);
        createRedirect({ fromPath: page.path, toPath: special.redirectTo });
        return;
      }
    }
  }
}
