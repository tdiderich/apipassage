import React from "react";

export const PrettyPrintJson = ({ json, className }: any) => (
  <div
    className={`dark:text-white text-black dark:bg-black bg-white${className}`}
  >
    <pre>{JSON.stringify(json, null, 2)}</pre>
  </div>
);
