import { IncomingMessage, ServerResponse } from "http";
const clearSiteData = require("clearsitedata");


interface ClearSiteDataOptions {
  directives?: string[];
}

function getHeaderValueFromOptions({
  directives = ["*"],
}: Readonly<ClearSiteDataOptions>): string {
  const VALID_TYPES = new Set([
    "cache",
    "cookies",
    "storage",
    "executionContexts",
    "*",
  ]);

  if (!Array.isArray(directives)) {
    throw new Error("Clear-Site-Data directives must be an array.");
  } else if (directives.length === 0) {
    throw new Error("Clear-Site-Data directives cannot be an empty array.");
  }

  const directivesSet = new Set(directives);
  if (directivesSet.size !== directives.length) {
    throw new Error("Clear-Site-Data directives cannot contain duplicates.");
  } else if (directivesSet.has("*") && directives.length > 1) {
    throw new Error(
      'Clear-Site-Data cannot contain "*" and other directives. Remove the other directives or "*".'
    );
  }

  return directives
    .map((directive) => {
      if (!VALID_TYPES.has(directive)) {
        throw new Error(
          `${directive} is not a valid Clear-Site-Data directive.`
        );
      }
      return `"${directive}"`;
    })
    .join(",");
}

export = function clearSiteData(options: Readonly<ClearSiteDataOptions> = {}) {
  const headerValue = getHeaderValueFromOptions(options);

  return function clearSiteData(
    _req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) {
    res.setHeader("Clear-Site-Data", headerValue);
    next();
  };
};




// Clear everything
app.post(
  "/logout",
  clearSiteData({
    directives: ["*"],
  })
);

// Clearing everything is the default
app.post("/logout", clearSiteData());

// Only clear cookies and storage
app.post(
  "/logout",
  clearSiteData({
    directives: ["cookies", "storage"],
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});