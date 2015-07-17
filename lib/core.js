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
   * An internal map between object type and its' mongoose model
   */
  this.typeMap = {
    "service": core.model.Service,
    "source": core.model.Source,
    "sink": core.model.Sink,
    "transformation": core.model.Transformation,
    "notification": core.model.Notification,
    "task": core.model.Task,
    "job": core.model.Job,
  };

  this.list = function (type, cb) {
    async.waterfall([
      function requestData(next) {
        this.typeMap[type].find().populate("serviceRef").exec(cb);
      },
      function returnResult(err, data, next) {
        next(data);
      }
    ], cb);
  }

  /**
   * Fetch model object by its id
   * @param type String object type
   * @param id String Id of an object
   * @param cb Function handler
   * @async
   */
  this.getObjectById = function (type, id, cb) {
    async.waterfall([
      function requestObject (next) {
        this.typeMap[type].findById(id).populate("serviceRef").exec(cb);
      },
      function returnResult (err, data, next) {
        next(data);
      }
    ], cb)
  }

  /**
   * Create or update object provided by specific service
   */
  this.putServicedObject = function (objectType, id, serviceRef, name, type, options, cb) {
    async.waterfall([
      function checkIfExists(next) {
        if (id) {
          console.log("checking if need to update");
          this.getObjectById(objectType, id, next);
        } else {
          console.log("will create new");
          next(null);
        }
      },
      function createOrUpdate (existingData, next) {
        console.log(arguments);
        if (typeof(existingData) === "function") {
          console.log("creating new");
          var obj = new this.typeMap[objectType]();
          obj.serviceRef = require("mongoose").Types.ObjectId(serviceRef);
          obj.name = name;
          obj.type = type;
          obj.options = options;
          obj.save();
          existingData(obj);
        } else {
          console.log("will update");
          console.log(existingData);
          this.typeMap[objectType].findByIdAndUpdate(
            id,
            { $set: {
                serviceRef: require("mongoose").Types.ObjectId(serviceRef),
                name: name,
                type: type,
                options: options
              }
            },
            next);
        }
      }
    ], cb);
  }

  return this;
}

module.exports = ScbCore;
