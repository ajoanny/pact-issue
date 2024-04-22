import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  SpecificationVersion,
  PactV3,
  LogLevel,
  MatchersV3,
} from "@pact-foundation/pact";
import axios from "axios";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("Pact Consumer Test", () => {
  const pact = new PactV3({
    consumer: "myconsumer",
    provider: "myprovider",
    spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
    logLevel: "debug",
  });

  it("creates a pact to verify with json api content type", async () => {
    const body = { data: { attributes: { name: 'name' } } };
    await pact
      .addInteraction({
        uponReceiving: "a request with content type application/vnd.api+json",
        withRequest: {
          method: "POST",
          path: "/",
          headers: { 'Content-Type': 'application/vnd.api+json' },
          body,
        },
        willRespondWith: {
          status: 200,
        },
      })
      .executeTest(async (mockserver) => {
        const res = await axios.request({
          baseURL: mockserver.url,
          method: "POST",
          url: "/",
          headers: { 'Content-Type': 'application/vnd.api+json' },
          data: body,
        });

        expect(res.status).to.equal(200);
      });
  });

  it("creates a pact to verify with content type", async () => {
    const body = { data: { attributes: { name: 'name' } } };
    await pact
        .addInteraction({
          uponReceiving: "a request with content type application/json",
          withRequest: {
            method: "POST",
            path: "/",
            headers: { 'Content-Type': 'application/json' },
            body,
          },
          willRespondWith: {
            status: 200,
          },
        })
        .executeTest(async (mockserver) => {
          const res = await axios.request({
            baseURL: mockserver.url,
            method: "POST",
            url: "/",
            headers: { 'Content-Type': 'application/json' },
            data: body
          });

          expect(res.status).to.equal(200);
        });
  });
});
