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

  /**
   * Fetch model object by its id
   */
  this.getObjectById = function (type, id, cb) {
    async.waterfall([
      function requestObject (next) {
        var typeObj;
        switch (type) {
          case "service": typeObj = core.model.Service; break;
          case "source": typeObj = core.model.Source; break;
          case "notification": typeObj = core.model.Notification; break;
          case "sink": typeObj = core.model.Sink; break;
          case "task": typeObj = core.model.Task; break;
          case "job": typeObj = core.model.Job; break;
        }
        typeObj.findById(id).exec(cb);
      },
      function returnResult (err, data, next) {
        next(data);
      }
    ], cb)
  }

  return this;
}

module.exports = ScbCore;
