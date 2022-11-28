import React, { Fragment } from "react";
import {
  buildTableInformationFromNodes,
  IClassNodeRendererProps,
  IDefaultNodeRendererProps,
  RenderElements,
  TableCell,
  TableRow,
} from "@bond-london/graphcms-rich-text";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";

interface Entry {
  title?: TableCell;
  entries: ReadonlyArray<TableCell>;
}

function buildEntry(row: TableRow): Entry {
  const [title, ...entries] = row;
  return { title, entries };
}

const SpecialTable: React.FC<IClassNodeRendererProps> = ({
  contents,
  references,
  classNameOverrides,
  renderers,
  index: parentIndex,
}) => {
  if (!contents) {
    return (
      <Unsupported
        component="RenderSpecialTable"
        message="No contents to render"
      />
    );
  }
  const information = buildTableInformationFromNodes(contents);
  const allEntries = (
    [information.header, ...information.body].filter(
      (x) => x
    ) as ReadonlyArray<TableRow>
  ).map(buildEntry);

  return (
    <div className="flex flex-col">
      {allEntries.map(({ title, entries }, index) => (
        <Fragment key={index}>
          {title && (
            <RenderElements
              contents={title}
              references={references}
              classNameOverrides={classNameOverrides}
              renderers={renderers}
              index={index}
              parentIndex={parentIndex}
            />
          )}
          {entries.map((entry, index) => (
            <RenderElements
              key={index}
              contents={entry}
              references={references}
              classNameOverrides={classNameOverrides}
              renderers={renderers}
              index={1 + index}
              parentIndex={parentIndex}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export const RenderSpecial: React.FC<IDefaultNodeRendererProps> = ({
  renderers,
  classNameOverrides,
  index,
  parentIndex,
  references,
  contents,
}) => {
  return (
    <RenderElements
      classNameOverrides={classNameOverrides}
      index={index}
      parentIndex={parentIndex}
      references={references}
      contents={contents}
      renderers={{
        ...renderers,
        table: ({ contents }) => (
          <SpecialTable
            contents={contents}
            references={references}
            renderers={renderers}
            classNameOverrides={classNameOverrides}
            index={index}
            parentIndex={parentIndex}
          />
        ),
      }}
    />
  );
};
