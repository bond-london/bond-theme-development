import { RichTextContent } from "@graphcms/rich-text-types";
import { IRichTextInformation } from "../src";

export const defaultContent: IRichTextInformation = {
  cleaned: [
    {
      type: "paragraph",
      children: [
        {
          bold: true,
          text: "Hello World!",
        },
      ],
    },
  ],
};

export const emptyContent: IRichTextInformation = {
  cleaned: [
    {
      type: "heading-two",
      children: [
        {
          text: "",
        },
        {
          href: "https://graphcms.com",
          type: "link",
          children: [
            {
              text: "Testing Link",
            },
          ],
        },
      ],
    },
    {
      type: "heading-two",
      children: [
        {
          text: "",
        },
        {
          href: "https://graphcms.com",
          type: "link",
          children: [
            {
              text: "Link",
            },
          ],
        },
        {
          text: " 2",
        },
      ],
    },
    {
      type: "heading-one",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "heading-two",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "heading-three",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "heading-four",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "heading-five",
      children: [
        {
          text: "",
        },
      ],
    },
    {
      type: "table",
      children: [
        {
          type: "table_head",
          children: [
            {
              text: "",
            },
          ],
        },
        {
          type: "table_body",
          children: [
            {
              type: "table_row",
              children: [
                {
                  type: "table_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 1 - Col 1",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "table_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 1 - Col 2",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const tableContent: IRichTextInformation = {
  cleaned: [
    {
      type: "table",
      children: [
        {
          type: "table_head",
          children: [
            {
              type: "table_row",
              children: [
                {
                  type: "table_header_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 1 - Header 1",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "table_header_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 1 - Header 2",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "table_body",
          children: [
            {
              type: "table_row",
              children: [
                {
                  type: "table_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 2 - Col 1",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "table_cell",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          text: "Row 2 - Col 2",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const simpleH1Content: IRichTextInformation = {
  cleaned: [
    {
      type: "heading-one",
      children: [
        {
          text: "heading",
        },
      ],
    },
  ],
};

export const inlineContent: IRichTextInformation = {
  cleaned: [
    {
      type: "paragraph",
      children: [
        {
          text: "Hey, ",
          bold: true,
        },
        {
          text: "how",
          italic: true,
        },
        {
          text: "are",
          underline: true,
        },
        {
          text: "you?",
          code: true,
        },
      ],
    },
  ],
};

export const iframeContent: IRichTextInformation = {
  cleaned: [
    {
      type: "class",
      children: [
        {
          type: "paragraph",
          children: [
            {
              text: "wow",
            },
          ],
        },
      ],
      className: "test",
    },
  ],
};

export const imageContent: IRichTextInformation = {
  cleaned: [
    {
      src: "https://media.graphcms.com/output=format:webp/resize=,width:667,height:1000/8xrjYm4CR721mAZ1YAoy",
      type: "image",
      title: "photo-1564631027894-5bdb17618445.jpg",
      width: 667,
      handle: "8xrjYm4CR721mAZ1YAoy",
      height: 1000,
      altText: "photo-1564631027894-5bdb17618445.jpg",
      children: [
        {
          text: "",
        },
      ],
      mimeType: "image/webp",
    },
  ],
};

export const videoContent: IRichTextInformation = {
  cleaned: [
    {
      src: "https://media.graphcms.com/oWd7OYr5Q5KGRJW9ujRO",
      type: "video",
      title: "file_example_MP4_480_1_5MG.m4v",
      width: 400,
      handle: "oWd7OYr5Q5KGRJW9ujRO",
      height: 400,
      children: [
        {
          text: "",
        },
      ],
    },
  ],
};

export const listContent: IRichTextInformation = {
  cleaned: [
    {
      type: "bulleted-list",
      children: [
        {
          type: "list-item",
          children: [
            {
              type: "list-item-child",
              children: [{ text: "Embroided logo" }],
            },
          ],
        },
        {
          type: "list-item",
          children: [
            { type: "list-item-child", children: [{ text: "Fits well" }] },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              type: "list-item-child",
              children: [{ text: "Comes in black" }],
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              type: "list-item-child",
              children: [{ text: "Reasonably priced" }],
            },
          ],
        },
      ],
    },
  ],
};

export const embedAssetContent: IRichTextInformation = {
  cleaned: [
    {
      type: "embed",
      nodeId: "ckrxv7b74g8il0d782lf66dup",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
    {
      type: "embed",
      nodeId: "ckrxv6otkg6ez0c8743xp9bzs",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
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
      nodeId: "ckryzom5si5vw0d78d13bnwix",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
    {
      type: "embed",
      nodeId: "cks2osfk8t19a0b32vahjhn36",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
    {
      type: "embed",
      nodeId: "ckq2eek7c00ek0d83iakzoxuh",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
    {
      type: "embed",
      nodeId: "model_example",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
  ],
};

export const cleanupSrc: RichTextContent = {
  children: [
    {
      type: "paragraph",
      children: [
        {
          text: "This is some text and we show an embedded image that isn't used elsewhere.",
        },
      ],
    },
    {
      type: "embed",
      nodeId: "cky5t4zpsthsg0e04m1psw9cc",
      children: [
        {
          text: "",
        },
      ],
      nodeType: "Asset",
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This also references a person ",
        },
        {
          type: "embed",
          nodeId: "cky5t6nwgt4za0c98fqhokyxt",
          children: [
            {
              text: "",
            },
          ],
          isInline: true,
          nodeType: "Person",
        },
        {
          text: "",
        },
      ],
    },
  ],
};

export const cleanupResult: IRichTextInformation = {
  cleaned: [
    {
      type: "paragraph",
      children: [
        {
          text: "This is some text and we show an embedded image that isn't used elsewhere.",
        },
      ],
    },
    {
      type: "embed",
      nodeId: "cky5t4zpsthsg0e04m1psw9cc",
      children: [],
      nodeType: "Asset",
    },
    {
      type: "paragraph",
      children: [
        {
          text: "This also references a person ",
        },
        {
          type: "embed",
          nodeId: "cky5t6nwgt4za0c98fqhokyxt",
          isInline: true,
          nodeType: "Person",
          children: [],
        },
      ],
    },
  ],
};
