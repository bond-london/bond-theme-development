import { CreatePageArgs, CreatePagesArgs } from "gatsby";
import { resolve } from "path";
import { isProduction } from "./gatsby-env";

const allowHidden = false && !isProduction;

// function tryLoadTemplate(templateName: string) {
//   const possible = `./src/templates/${templateName}.tsx`;
//   try {
//     const stat = statSync(possible);
//     if (stat.isFile()) {
//       return resolve(possible);
//     }
//   } catch {
//     /* no op */
//   }
//   return undefined;
// }

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

// async function buildTagIndex(
//   { actions, graphql }: CreatePagesArgs,
//   tagId: string,
//   slug: string,
//   name: string
// ) {
//   const { data } = await graphql<Queries.TagIndexQuery>(
//     `
//       query TagIndex(
//         $allowHidden: Boolean!
//         $tagId: String!
//         $articlesPerPage: Int
//       ) {
//         allGraphCmsArticle(
//           filter: {
//             tags: { elemMatch: { id: { eq: $tagId } } }
//             hidden: { in: [false, $allowHidden] }
//           }
//           limit: $articlesPerPage
//         ) {
//           pageInfo {
//             pageCount
//           }
//         }
//       }
//     `,
//     { tagId, articlesPerPage, allowHidden }
//   );

//   if (data?.allGraphCmsArticle?.pageInfo) {
//     const { pageCount } = data.allGraphCmsArticle.pageInfo;
//     if (pageCount) {
//       const component =
//         tryLoadTemplate(`tag/${name}List`) ||
//         resolve(`./src/templates/tag/list.tsx`);

//       for (let page = 0; page < pageCount; page++) {
//         const path = page === 0 ? `/${slug}/` : `/${slug}/${page + 1}/`;
//         actions.createPage({
//           path,
//           component,
//           context: {
//             limit: articlesPerPage,
//             skip: page * articlesPerPage,
//             tagId,
//           },
//         });
//       }
//     }
//   }
// }

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

  buildHiddenMaps(data);
  buildSlices(args, data.allGraphCmsNavigation.nodes);
}

export function onCreatePage(args: CreatePageArgs) {
  const {
    page,
    reporter,
    actions: { createPage, deletePage, createRedirect },
  } = args;
  reporter.info(`Create page: ${JSON.stringify(page, undefined, 2)}`);

  deletePage(page);
  const id = page.context?.id as string | undefined;
  if (id) {
    const special = specialPageMap.get(id);
    if (special) {
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
  createPage({
    ...page,
    context: {
      ...page.context,
      allowHidden,
    },
  });
}
