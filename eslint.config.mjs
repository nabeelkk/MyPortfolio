import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "_legacy/**", "media/**", "scripts/**", "next-env.d.ts", "node_modules*/**"] },
];

export default config;
