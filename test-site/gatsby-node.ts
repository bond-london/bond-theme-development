import type { CreatePagesArgs } from "gatsby";
import { resolve } from "path";

function buildPages(
  { actions }: CreatePagesArgs,
  nodes: Queries.AllPagesQuery["allGraphCmsPage"]["nodes"]
) {
  const pageTemplate = resolve("./src/templates/page.tsx");
  nodes.forEach(({ slug, id }) => {
    const path = slug === "home" ? "/" : `/${slug}/`;
    actions.createPage({ path, component: pageTemplate, context: { id } });
  });
}

export async function createPages(args: CreatePagesArgs) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { reporter, graphql } = args;
  const results = await graphql<Queries.AllPagesQuery>(`
    query AllPages {
      allGraphCmsPage {
        nodes {
          slug
          id
        }
      }
    }
  `);

  reporter.info(`Got query results: ${JSON.stringify(results)}`);
  const { data } = results;

  if (!data?.allGraphCmsPage) {
    return reporter.panic(`Failed to find any pages`);
  }
  buildPages(args, data?.allGraphCmsPage.nodes);
}
