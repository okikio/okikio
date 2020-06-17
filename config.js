import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

export const env = process.env;
export const dev = "dev" in env ? env.dev !== "true" : true;
export const netlify = "netlify" in env && env.netlify === "true";
export const netlifyURL = "https://okikio.netlify.app";
export const websiteURL = "https://okikio.dev";
export {
  author,
  homepage,
  license,
  copyright,
  github,
  keywords,
} from "./package";
