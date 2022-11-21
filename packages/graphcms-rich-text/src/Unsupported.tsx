import React from "react";

export const Unsupported: React.FC<{
  component: string;
  message: string;
  inline?: boolean;
}> = ({ component, message, inline }) => (
  <span
    style={{ color: "red", display: inline ? "inline" : "block" }}
  >{`[${component}]: ${message}`}</span>
);
