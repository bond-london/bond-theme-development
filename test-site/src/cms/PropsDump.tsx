"use client";
import { useClientOnly } from "@bond-london/gatsby-theme";
import { PageProps } from "gatsby";
import React from "react";

// eslint-disable-next-line import/no-unused-modules
export const PropsDump: React.FC<{ props: PageProps }> = ({ props }) => {
  const isClient = useClientOnly();
  if (!isClient) return null;
  return <pre>{JSON.stringify(props, undefined, 2)}</pre>;
};
