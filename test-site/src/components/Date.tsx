import React from "react";

const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeZone: "UTC",
});

export const DateElement: React.FC<{ date: Record<string, unknown> }> = ({
  date,
}) => {
  const formatted = formatter.format(new Date(date as unknown as string));
  return <span>{formatted}</span>;
};
