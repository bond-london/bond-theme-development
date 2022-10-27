"use client";
import { useClientOnly } from "@bond-london/gatsby-graphcms-components";
import { PageProps } from "gatsby";
import React from "react";
export const PropsDump = (props: PageProps) => {
  const isClient = useClientOnly();
  if (!isClient) return null;
  return <pre>{JSON.stringify(props, undefined, 2)}</pre>;
};
