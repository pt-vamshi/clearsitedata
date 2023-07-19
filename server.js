const http = require("http");
const clearSiteData = require("clearsitedata");




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

server.listen(3000, "localhost", () => {
    console.log("Listening for request");
  });