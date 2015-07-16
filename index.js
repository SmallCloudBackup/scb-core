/**
 * SmallCloudBackup - Core data and model
 */

var core = {};

core.model = new require("./lib/model")(core);
core.core = new require("./lib/core")(core);

module.exports = core;