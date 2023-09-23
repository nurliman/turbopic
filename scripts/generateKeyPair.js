import { webcrypto } from "node:crypto";
import { generateKeys } from "paseto-ts/v4";

console.time("generateKeyPair");

const argumentIndex = process.argv.findIndex((arg) => arg === "--local" || arg === "-l");
const keyType = argumentIndex !== -1 ? "local" : "public";

const keypair = generateKeys(keyType, {
  format: "paserk",
  getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
});

console.log(keypair);
console.timeEnd("generateKeyPair");
