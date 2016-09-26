var application = require("application");
var trace = require("trace");
trace.enable();
application.start({ moduleName: "main-page" });
