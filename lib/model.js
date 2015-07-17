function ScbModel () {
    var mongoose = require("mongoose");
	mongoose.connect(process.env.MONGOLAB_URI);

	// CONNECTION EVENTS
	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Mongoose default connection open');
	});

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
	  console.log('Mongoose default connection error: ' + err);
	  console.log(arguments);
	});

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});

	var Schema = mongoose.Schema;

    /** An external service to work with. It can either be a source or a sink. */
    var serviceSchema = Schema({
        /** An instance name of this service. */
        serviceName: String,
        /** Service type - refers to a specific SCB service module. */
        serviceType: String,
        /** Service connection string. */
        connectionString: String,
        /** Any additional service-specific options. */
        options: Schema.Types.Mixed
    });
    this.Service = mongoose.model("Service", serviceSchema);

    /** A source of data to backup. */
    var sourceSchema = Schema({
        /** Reference to a service where the data resides. */
        serviceRef: {type: Schema.ObjectId, ref: "Service"},
        /** An instance name of this source. */
        sourceName: String,
        /** Source type - referring to a specific SCB source module. */
        sourceType: String,
        /** Source-specific configuration (i.e. filters). */
        options: Schema.Types.Mixed

    });
    this.Source = mongoose.model("Source", sourceSchema);

    /** A source of data to backup. */
    var sinkSchema = Schema({
        /** Reference to a service where the data resides. */
        serviceRef: {type: Schema.ObjectId, ref: "Service"},
        /** An instance name of this sink. */
        sinkName: String,
        /** Sink type - referring to a specific SCB sink module. */
        sinkType: String,
        /** Sink-specific configuration (i.e. filters). */
        options: Schema.Types.Mixed

    });
    this.Sink = mongoose.model("Sink", sinkSchema);

    /** A source of data to backup. */
    var transformationSchema = Schema({
        /** Reference to a service which provides this transformation. */
        serviceRef: {type: Schema.ObjectId, ref: "Service"},
        /** Transformation type - referring to a specific SCB transformation module. */
        transformationType: String,
        /** Transformation-specific configuration (i.e. compression levels etc.). */
        options: Schema.Types.Mixed

    });
    this.Transformation = mongoose.model("Transformation", sinkSchema);

    /** A path to transform source data into sink data. */
    var taskSchema = Schema({
        /** Where to take the data from. */
        sourceRef: { type: Schema.ObjectId, ref: "Source" },
        /** How to transform the data. */
        transformations: [{type: Schema.ObjectId, ref: "Transformation"}],
        /** Where to put data to. */
        sinkRef: { type: Schema.ObjectId, ref: "Sink" }
    });
    this.Task = mongoose.model("Task", taskSchema);

    /** A set of tasks to complete as one batch. */
    var jobSchema = Schema({
        /** Id of a job to launch from scheduler. */
        jobId: String,
        /** List of tasks to be performed in a job. */
        tasks: [{ type: Schema.ObjectId, ref: "Task" }]
    });
    return this;
}

module.exports = ScbModel;