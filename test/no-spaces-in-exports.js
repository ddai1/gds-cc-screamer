const { expect } = require("chai");
const noSpaces = require("../checks/no-spaces-in-exports");

describe("No Spaces in Exports Check", () => {
  it("skips if there is no orders file", async () => {
    const deployment = {
      serviceName: "streamliner"
    };

    const results = await noSpaces(deployment);
    expect(results.length).to.equal(0);
  });

  it("allows orders where all exports have proper spacing", async () => {
    const deployment = {
      serviceName: "streamliner",
      ordersPath: "streamliner/orders",
      ordersContents: [
        "export HEALTHCHECK=/diagnostic",
        "export SECURITY_MODE=jwt",
        'export CAT="pants"',
        "dockerdeploy github/glg/streamliner/main:latest"
      ],
    };

    const results = await noSpaces(deployment);
    expect(results.length).to.equal(0);
  });

  it("rejects orders if they include exports with incorrect spacing", async () => {
    const deployment = {
      serviceName: "streamliner",
      ordersPath: "streamliner/orders",
      ordersContents: [
        "export HEALTHCHECK =/diagnostic",
        "export SECURITY_MODE= jwt",
        'export CAT = "pants"',
      ],
    };

    const results = await noSpaces(deployment);
    expect(results.length).to.equal(3);

    expect(results[0].problems[0]).to.equal(
      `Trim out this whitespace\n\`\`\`suggestion
export HEALTHCHECK=/diagnostic
\`\`\``
    );

    expect(results[1].problems[0]).to.equal(
      `Trim out this whitespace\n\`\`\`suggestion
export SECURITY_MODE=jwt
\`\`\``
    );

    expect(results[2].problems[0]).to.equal(
      `Trim out this whitespace\n\`\`\`suggestion
export CAT="pants"
\`\`\``
    );
  });
});
