import { Verifier } from "@pact-foundation/pact";

import express from "express";
import {z} from "zod";

// Provider code
const server = express();
server.use((_: any, res: any, next: () => void): void => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

server.use(express.json());

const schema = z.object({
  data: z.object({
    attributes: z.object({
      name: z.string(),
    }),
  }),
});

server.post("/", (req: any, res: any) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

const app = server.listen(8080, () => {
  console.log("API listening on http://localhost:8080");
});

// Verification code
describe("Pact Provider Verification", () => {
  const pact = new Verifier({
    pactUrls: ["./pacts/myconsumer-myprovider.json"],
    providerBaseUrl: "http://127.0.0.1:8080",
    logLevel: 'debug',
  });

  it("verifies the pact", () => {
    return pact.verifyProvider();
  });

  afterAll(() => {
    app.close();
  });
});
