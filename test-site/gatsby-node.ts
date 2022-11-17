import { statSync } from "fs";
import { CreatePagesArgs } from "gatsby";
import { resolve } from "path";
import { articlesPerPage, isProduction } from "./gatsby-env";

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
    console.log(`Creating slice for ${name} ${isFooter}`);
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

function buildPages(
  { actions }: CreatePagesArgs,
  nodes: Queries.AllContentQuery["allGraphCmsPage"]["nodes"]
) {
  const defaultPageTemplate = resolve("./src/templates/page.tsx");
  nodes.forEach(({ slug, id, template, pageType }) => {
    const path = slug === "home" ? "/" : `/${slug}/`;
    const templateName = template?.name || pageType?.name;
    const component = templateName
      ? tryLoadTemplate(`pages/${templateName}`) || defaultPageTemplate
      : defaultPageTemplate;
    actions.createPage({
      path,
      component,
      context: { id },
    });
  });
}

function buildArticles(
  { actions, reporter }: CreatePagesArgs,
  nodes: Queries.AllContentQuery["allGraphCmsArticle"]["nodes"]
) {
  const defaultPageTemplate = resolve("./src/templates/article.tsx");
  nodes.forEach(({ slug, id, template, articleType }) => {
    if (!articleType) {
      reporter.panicOnBuild(`Article ${slug} has no article type`);
    } else {
      const path = `/${articleType.slug}/${slug}`;
      const component =
        tryLoadTemplate(`articles/${template?.name || articleType.name}`) ||
        defaultPageTemplate;
      actions.createPage({
        path,
        component,
        context: { id },
      });
    }
  });
}

async function buildArticleTypeIndex(
  { actions, graphql }: CreatePagesArgs,
  articleTypeId: string,
  slug: string,
  name: string
) {
  const { data } = await graphql<Queries.ArticleTypeIndexQuery>(
    `
      query ArticleTypeIndex(
        $allowHidden: Boolean!
        $articleTypeId: String!
        $articlesPerPage: Int
      ) {
        allGraphCmsArticle(
          filter: {
            articleType: { id: { eq: $articleTypeId } }
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
    { articleTypeId, articlesPerPage, allowHidden }
  );

  if (data?.allGraphCmsArticle?.pageInfo) {
    const { pageCount } = data.allGraphCmsArticle.pageInfo;
    if (pageCount) {
      const component =
        tryLoadTemplate(`articleType/${name}List`) ||
        resolve(`./src/templates/articleType/list.tsx`);

      for (let page = 0; page < pageCount; page++) {
        const pathPrefix = slug ? `/${slug}` : "";
        const path =
          page === 0 ? `${pathPrefix}/` : `${pathPrefix}/${page + 1}/`;
        actions.createPage({
          path,
          component,
          context: {
            limit: articlesPerPage,
            skip: page * articlesPerPage,
            articleTypeId,
          },
        });
      }
    }
  }
}

async function buildArticleTypes(
  args: CreatePagesArgs,
  nodes: Queries.AllContentQuery["allGraphCmsArticleType"]["nodes"]
) {
  for (const { id, slug, name } of nodes) {
    await buildArticleTypeIndex(args, id, slug, name);
  }
}

async function buildTagIndex(
  { actions, graphql }: CreatePagesArgs,
  tagId: string,
  slug: string,
  name: string
) {
  const { data } = await graphql<Queries.TagIndexQuery>(
    `
      query TagIndex(
        $allowHidden: Boolean!
        $tagId: String!
        $articlesPerPage: Int
      ) {
        allGraphCmsArticle(
          filter: {
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
    { tagId, articlesPerPage, allowHidden }
  );

  if (data?.allGraphCmsArticle?.pageInfo) {
    const { pageCount } = data.allGraphCmsArticle.pageInfo;
    if (pageCount) {
      const component =
        tryLoadTemplate(`tag/${name}List`) ||
        resolve(`./src/templates/tag/list.tsx`);

      for (let page = 0; page < pageCount; page++) {
        const path = page === 0 ? `/${slug}/` : `/${slug}/${page + 1}/`;
        actions.createPage({
          path,
          component,
          context: {
            limit: articlesPerPage,
            skip: page * articlesPerPage,
            tagId,
          },
        });
      }
    }
  }
}

async function buildTags(
  args: CreatePagesArgs,
  nodes: Queries.AllContentQuery["allGraphCmsTag"]["nodes"]
) {
  for (const { id, slug, name } of nodes) {
    await buildTagIndex(args, id, slug, name);
  }
}

export async function createPages(args: CreatePagesArgs) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { reporter, graphql } = args;
  const results = await graphql<Queries.AllContentQuery>(
    `
      query AllContent($allowHidden: Boolean!) {
        allGraphCmsPage(filter: { hidden: { in: [false, $allowHidden] } }) {
          nodes {
            slug
            id
            template {
              name
            }
            pageType {
              name
              slug
            }
          }
        }
        allGraphCmsArticle(filter: { hidden: { in: [false, $allowHidden] } }) {
          nodes {
            slug
            id
            template {
              name
            }
            articleType {
              name
              slug
            }
          }
        }
        allGraphCmsArticleType(
          filter: { hidden: { in: [false, $allowHidden] } }
        ) {
          nodes {
            slug
            id
            name
          }
        }
        allGraphCmsTag(filter: { hidden: { in: [false, $allowHidden] } }) {
          nodes {
            slug
            id
            name
          }
        }
        allGraphCmsNavigation {
          nodes {
            name
            isFooter
          }
        }
      }
    `,
    { allowHidden }
  );

  const { data } = results;

  if (!data) {
    return reporter.panicOnBuild("No data");
  }

  if (!data.allGraphCmsPage) {
    return reporter.panicOnBuild(`Failed to find any pages`);
  }

  if (data.allGraphCmsTag) {
    if (data.allGraphCmsArticle) {
      await buildTags(args, data.allGraphCmsTag.nodes);
    }
    // if (data.allGraphCmsArticleType) {
    //   await buildArticleTypeTags(
    //     args,
    //     data.allGraphCmsArticleType.nodes,
    //     data.allGraphCmsTag.nodes
    //   );
    // }
  }

  buildPages(args, data.allGraphCmsPage.nodes);
  buildSlices(args, data.allGraphCmsNavigation.nodes);

  if (data.allGraphCmsArticleType) {
    await buildArticleTypes(args, data.allGraphCmsArticleType.nodes);
  }
  if (data.allGraphCmsArticle) {
    buildArticles(args, data.allGraphCmsArticle.nodes);
  }
}
