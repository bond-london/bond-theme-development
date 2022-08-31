/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";

import {
  defaultContent as content,
  embedAssetContent,
  iframeContent,
  imageContent,
  inlineContent,
  listContent,
  simpleH1Content,
  tableContent,
  videoContent,
} from "./content";
import {
  CustomEmbedRendererProps,
  DefaultRenderer,
  RichText,
  RTFContent,
} from "../src";

describe("@bond-london/graphcms-rich-text", () => {
  it("renders content", () => {
    const { container } = render(<RichText content={content} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          <b>
            Hello World!
          </b>
        </p>
      </div>
    `);
  });

  it("renders content with custom className", () => {
    const { container } = render(
      <RichText content={content} classNameOverrides={{ p: "testing" }} />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p
          class="testing"
        >
          <b>
            Hello World!
          </b>
        </p>
      </div>
    `);
  });

  it("renders content with disabled element", () => {
    const { container } = render(
      <RichText content={content} disabledElements={{ p: true }} />
    );

    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it("renders content with disabled element and custom element", () => {
    const { container } = render(
      <RichText
        content={content}
        disabledElements={{ p: true }}
        renderDisabledElement={(elementName, htmlElementName): JSX.Element => (
          <p>{`${elementName} (${htmlElementName}) is disabled`}</p>
        )}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          paragraph (p) is disabled
        </p>
      </div>
    `);
  });

  it("renders content with disabled text element", () => {
    const { container } = render(
      <RichText content={content} disabledElements={{ bold: true }} />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          Hello World!
        </p>
      </div>
    `);
  });

  it("should render a table", () => {
    const { container } = render(<RichText content={tableContent} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <table>
          <thead>
            <tr>
              <th>
                <p>
                  Row 1 - Header 1
                </p>
              </th>
              <th>
                <p>
                  Row 1 - Header 2
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>
                  Row 2 - Col 1
                </p>
              </td>
              <td>
                <p>
                  Row 2 - Col 2
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it("should should render H1 with some text", () => {
    const { container } = render(<RichText content={simpleH1Content} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <h1>
          heading
        </h1>
      </div>
    `);
  });

  it("renders content with custom elements", () => {
    const { container } = render(
      <RichText
        content={content}
        renderers={{
          p: ({ children }): JSX.Element => (
            <p className="text-white">{children}</p>
          ),
          bold: ({ children }): JSX.Element => (
            <strong className="text-black">{children}</strong>
          ),
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p
          class="text-white"
        >
          <strong
            class="text-black"
          >
            Hello World!
          </strong>
        </p>
      </div>
    `);
  });

  it("renders inline content", () => {
    const { container } = render(<RichText content={inlineContent} />);

    expect(container).toMatchSnapshot();
  });

  it("renders inline content with conditional renderer", () => {
    const { container } = render(
      <RichText
        content={inlineContent}
        renderers={{
          code: (props): JSX.Element => (
            <DefaultRenderer
              {...props}
              element="code"
              style={{ fontStyle: "italic" }}
            />
          ),
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders inline content with custom renderers", () => {
    const { container } = render(
      <RichText
        content={inlineContent}
        renderers={{
          bold: (props): JSX.Element => (
            <DefaultRenderer {...props} element="strong" />
          ),
          italic: (props): JSX.Element => (
            <DefaultRenderer
              {...props}
              element="i"
              className="italic-class"
              style={{ color: "red" }}
            />
          ),
          underline: (props): JSX.Element => (
            <DefaultRenderer {...props} element="u" role="button" />
          ),
          code: (props): JSX.Element => (
            <DefaultRenderer
              {...props}
              element="code"
              style={{ fontStyle: "italic" }}
            />
          ),
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders link", () => {
    const linkContent: RTFContent = [
      {
        type: "link",
        id: "test",
        rel: "noreferrer",
        href: "https://graphcms.com",
        title: "GraphCMS website",
        className: "text-white",
        openInNewTab: true,
        children: [
          {
            text: "GraphCMS",
          },
        ],
      },
    ];

    const { container } = render(<RichText content={linkContent} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="text-white"
          href="https://graphcms.com"
          id="test"
          rel="noreferrer"
          target="_blank"
          title="GraphCMS website"
        >
          GraphCMS
        </a>
      </div>
    `);
  });

  it("renders iframe", () => {
    const iframeContent: RTFContent = [
      {
        url: "https://www.youtube.com/watch?v=Ylmd737tw5w",
        type: "iframe",
        children: [
          {
            text: "",
          },
        ],
      },
    ];

    const { container } = render(<RichText content={iframeContent} />);

    expect(container).toMatchSnapshot();
  });

  it("renders class", () => {
    const { container } = render(<RichText content={iframeContent} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="test"
        >
          <p>
            wow
          </p>
        </div>
      </div>
    `);
  });

  it("renders class with custom renderer", () => {
    const { container } = render(
      <RichText
        content={iframeContent}
        renderers={{
          class: (props): JSX.Element => (
            <DefaultRenderer
              {...props}
              additionalClassName="bg-white"
              element="section"
            />
          ),
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <section
          class="bg-white test"
        >
          <p>
            wow
          </p>
        </section>
      </div>
    `);
  });

  it("renders image", () => {
    const { container } = render(<RichText content={imageContent} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <img
          alt="photo-1564631027894-5bdb17618445.jpg"
          height="1000"
          loading="lazy"
          src="https://media.graphcms.com/output=format:webp/resize=,width:667,height:1000/8xrjYm4CR721mAZ1YAoy"
          title="photo-1564631027894-5bdb17618445.jpg"
          width="667"
        />
      </div>
    `);
  });

  it("renders image with custom renderer", () => {
    const { container } = render(
      <RichText
        content={imageContent}
        renderers={{
          img: ({ src, altText }): JSX.Element => (
            <img src={src || "/"} alt={altText || ""} />
          ),
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <img
          alt="photo-1564631027894-5bdb17618445.jpg"
          src="https://media.graphcms.com/output=format:webp/resize=,width:667,height:1000/8xrjYm4CR721mAZ1YAoy"
        />
      </div>
    `);
  });

  it("renders video", () => {
    const { container } = render(<RichText content={videoContent} />);

    expect(container).toMatchSnapshot();
  });

  it("renders lists", () => {
    const { container } = render(<RichText content={listContent} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <ul>
          <li>
            Embroided logo
          </li>
          <li>
            Fits well
          </li>
          <li>
            Comes in black
          </li>
          <li>
            Reasonably priced
          </li>
        </ul>
      </div>
    `);
  });

  it("should render HTML and JSX tags correctly", () => {
    const content: RTFContent = [
      { type: "paragraph", children: [{ text: "<Test />", code: true }] },
    ];

    const { container } = render(<RichText content={content} />);

    expect(container).toHaveTextContent("<Test />");
  });
});

describe("custom embeds and assets", () => {
  it("should render embed video, image, and audio assets", () => {
    const references = [
      {
        id: "cknjbzowggjo90b91kjisy03a",
        url: "https://media.graphcms.com/dsQtt0ARqO28baaXbVy9",
        mimeType: "image/png",
      },
      {
        id: "ckrus0f14ao760b32mz2dwvgx",
        url: "https://media.graphcms.com/7M0lXLdCQfeIDXnT2SVS",
        mimeType: "video/mp4",
      },
      {
        id: "ckryzom5si5vw0d78d13bnwix",
        url: "https://media.graphcms.com/H9eZ7CISSBpAKxqdSwzg",
        mimeType: "audio/mpeg",
      },
    ];

    const { container } = render(
      <RichText content={embedAssetContent} references={references} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should render specific mimeType if favour of the mimeType group", () => {
    const references = [
      {
        id: "ckrus0f14ao760b32mz2dwvgx",
        url: "https://media.graphcms.com/video_id",
        mimeType: "video/mp4",
      },
      {
        id: "ckq2eek7c00ek0d83iakzoxuh",
        url: "https://media.graphcms.com/video_id",
        mimeType: "video/quicktime",
      },
    ];

    const { container } = render(
      <RichText
        content={embedAssetContent}
        references={references}
        renderers={{
          embed_asset: {
            video: (): JSX.Element => <div>custom video</div>,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "video/mp4": (): JSX.Element => <div>custom video/mp4</div>,
          },
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckrxv7b74g8il0d782lf66dup
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckrxv6otkg6ez0c8743xp9bzs
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: cknjbzowggjo90b91kjisy03a
        </span>
        <div>
          custom video/mp4
        </div>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckryzom5si5vw0d78d13bnwix
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: cks2osfk8t19a0b32vahjhn36
        </span>
        <div>
          custom video
        </div>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: model_example
        </span>
      </div>
    `);
  });

  it(`should show warnings if the embed asset file isn't rendered by the package`, () => {
    console.warn = jest.fn();

    const references = [
      {
        id: "ckrxv7b74g8il0d782lf66dup",
        url: "https://media.graphcms.com/7VA0p81VQfmZQC9jPB2I",
        mimeType: "text/plain",
      },
      {
        id: "ckrxv6otkg6ez0c8743xp9bzs",
        url: "https://media.graphcms.com/HzsAGQyASM2B6B3dHY0n",
        mimeType: "application/pdf",
      },
      {
        id: "model_example",
        url: "https://media.graphcms.com/HzsAGQyASM2B6B3dHY0n",
        mimeType: "model/example",
      },
      {
        id: "cks2osfk8t19a0b32vahjhn36",
        url: "https://media.graphcms.com/Kdk4nsiUTLac3gDD2m5L",
        mimeType: "font/ttf",
      },
    ];

    const { container } = render(
      <RichText content={embedAssetContent} references={references} />
    );

    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it(`shouldn't render embeds or assets if id is missing in references`, () => {
    console.error = jest.fn();

    const content: RTFContent = [
      {
        type: "embed",
        nodeId: "cknjbzowggjo90b91kjisy03a",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Asset",
      },
      {
        type: "embed",
        nodeId: "ckrus0f14ao760b32mz2dwvgx",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Asset",
      },
      {
        type: "embed",
        nodeId: "custom_post_id",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Post",
      },
    ];

    const references = [
      {
        id: "",
        url: "https://media.graphcms.com/dsQtt0ARqO28baaXbVy9",
        mimeType: "image/png",
      },
      {
        id: "",
        url: "https://media.graphcms.com/7M0lXLdCQfeIDXnT2SVS",
        mimeType: "video/mp4",
      },
      {
        id: "",
        title: "GraphCMS is awesome :rocket:",
      },
    ];

    const { container } = render(
      <RichText content={content} references={references} />
    );

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it("should render custom embed assets", () => {
    const references = [
      {
        id: "cknjbzowggjo90b91kjisy03a",
        url: "https://media.graphcms.com/dsQtt0ARqO28baaXbVy9",
        mimeType: "image/png",
      },
      {
        id: "ckrus0f14ao760b32mz2dwvgx",
        url: "https://media.graphcms.com/7M0lXLdCQfeIDXnT2SVS",
        mimeType: "video/mp4",
      },
    ];

    const { container } = render(
      <RichText
        content={embedAssetContent}
        references={references}
        renderers={{
          embed_asset: {
            video: (): JSX.Element => <div>custom VIDEO</div>,
            image: (): JSX.Element => <div>custom IMAGE</div>,
          },
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckrxv7b74g8il0d782lf66dup
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckrxv6otkg6ez0c8743xp9bzs
        </span>
        <div>
          custom IMAGE
        </div>
        <div>
          custom VIDEO
        </div>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckryzom5si5vw0d78d13bnwix
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: cks2osfk8t19a0b32vahjhn36
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: ckq2eek7c00ek0d83iakzoxuh
        </span>
        <span
          style="color: red;"
        >
          [RenderAsset]: No id found for embed node: model_example
        </span>
      </div>
    `);
  });

  it(`shouldn't render embed assets due to missing mimeType or url`, () => {
    console.error = jest.fn();

    const content: RTFContent = [
      {
        type: "embed",
        nodeId: "cknjbzowggjo90b91kjisy03a",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Asset",
      },
      {
        type: "embed",
        nodeId: "ckrus0f14ao760b32mz2dwvgx",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Asset",
      },
    ];

    const references = [
      {
        id: "cknjbzowggjo90b91kjisy03a",
      },
      {
        id: "ckrus0f14ao760b32mz2dwvgx",
      },
    ];

    const { container } = render(
      <RichText content={content} references={references} />
    );

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it("should render custom embed models", () => {
    const content: RTFContent = [
      {
        type: "embed",
        nodeId: "custom_post_id",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Post",
      },
    ];

    const references = [
      {
        id: "custom_post_id",
        title: "GraphCMS is awesome :rocket:",
      },
    ];

    const { container } = render(
      <RichText
        content={content}
        references={references}
        renderers={{
          embed_node: {
            Post: (props): JSX.Element => {
              const embedProps = props as unknown as CustomEmbedRendererProps<{
                title: string;
              }>;
              const { title, nodeId } = embedProps;
              return (
                <div className="post">
                  <h3>{title}</h3>
                  <p>{nodeId}</p>
                </div>
              );
            },
          },
        }}
      />
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="post"
        >
          <h3>
            GraphCMS is awesome :rocket:
          </h3>
          <p>
            custom_post_id
          </p>
        </div>
      </div>
    `);
  });

  it(`should show a warning if embeds are found but there aren't any renderer for it`, () => {
    console.warn = jest.fn();

    const content: RTFContent = [
      {
        type: "embed",
        nodeId: "custom_post_id",
        children: [
          {
            text: "",
          },
        ],
        nodeType: "Post",
      },
    ];

    const references = [
      {
        id: "custom_post_id",
        title: "GraphCMS is awesome :rocket:",
      },
    ];

    const { container } = render(
      <RichText content={content} references={references} />
    );

    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });
});
