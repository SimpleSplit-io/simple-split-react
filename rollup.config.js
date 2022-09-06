import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ["src/index.ts"],
  output: [
    {
      format: "cjs",
      dir: "dist",
    },
    { format: "esm", dir: "esm" },
  ],
  plugins: [typescript({ declaration: false })],
  external: ["react"],
};
export default config;
