import { expect } from "chai";
import { config as dotenvConfig } from "dotenv";
import { apiServices } from "../src/index";

dotenvConfig();

describe("API Key Authentication", function () {
  this.timeout(10000);

  const apiUrl = process.env.API_URL || "https://api.otomato.xyz/api";
  const apiKey = process.env.API_KEY;

  before(() => {
    if (!apiKey) {
      throw new Error(
        "API_KEY is not defined in .env file. Set it to run API key tests.",
      );
    }
    apiServices.setUrl(apiUrl);
    apiServices.setApiKey(apiKey);
  });

  it("should fetch workflows using API key authentication", async () => {
    const result = await apiServices.getWorkflowsOfUser(0, 5);
    expect(result).to.be.an("object");
    expect(result).to.have.property("data");
    expect(result.data).to.be.an("array");
  });

  it("should fetch workflows with isActive filter", async () => {
    const result = await apiServices.getWorkflowsOfUser(0, 5, true);
    expect(result).to.be.an("object");
    expect(result).to.have.property("data");
    expect(result.data).to.be.an("array");
  });

  it("should fail with an invalid API key", async () => {
    const originalKey = apiKey;
    apiServices.setApiKey("sk_test_invalid_key");

    try {
      await apiServices.getWorkflowsOfUser(0, 5);
      expect.fail("Expected request to fail with invalid API key");
    } catch (error: any) {
      expect(error.response?.status).to.be.oneOf([401, 403]);
    }

    // Restore the valid key
    apiServices.setApiKey(originalKey!);
  });

  it("should be able to call GET /workflows directly", async () => {
    const result = await apiServices.get("/workflows?offset=0&limit=5");
    console.log(`res:`, result);
    expect(result).to.be.an("object");
    expect(result).to.have.property("data");
  });
});
