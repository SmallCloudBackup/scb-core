var async = require("async");

function ScbCore(core) {
  this.listServices = function (cb) {
    async.waterfall([
      function requestData(next) {
        core.model.Service.find().exec(cb);
      },
      function returnResult(err, data, next) {
        next(data);
      }
    ], cb);
  }
  return this;
}

module.exports = ScbCore;