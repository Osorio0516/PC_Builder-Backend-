const express = require("express");
const cors = require("cors");
const systemRouter = require("./routes/system.js");
const categoryRouter = require("./routes/categories");
const componentRouter = require("./routes/components");
const ruleRouter = require("./routes/compatibilityRules");
const buildRouter = require("./routes/builds.js");
const itemRouter = require("./routes/items.js");
const { requestLogger } = require("./middleware/requestLogger.js");
const { HttpError, notFound, errorHandler } = require("./middleware/errors.js");
const app = express();
app.disable("x-powered-by");
app.use(requestLogger);
const allowed = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin(origin, callback) {
      callback(
        origin && !allowed.includes(origin)
          ? new HttpError(403, "Origin not allowed")
          : null,
        true,
      );
    },
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use("/api", systemRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/components", componentRouter);
app.use("/api/compatibility-rules", ruleRouter);
app.use("/api/builds", buildRouter);
app.use("/api/build-items", itemRouter);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
