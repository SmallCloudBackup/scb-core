/**
 * SmallCloudBackup - Interface
 * A set of inter-module interface objects and functions.
 * @author Valentin Alekseev <valentin.alekseev@gmail.com>
 */

/**
 * A POJsO to hold results of source data gathering.
 * @constructor
 * @param sourceName String Instance name of source
 * @param sourceType String Source type
 * @param artifacts Array List of artifacts to be backed up
 */
function ScbISourceData(sourceName, sourceType, artifacts) {
  this.sourceName = sourceName;
  this.sourceType = sourceType;
  this.artifacts = artifacts;
  return this;
}

function ScbInterface(core) {
  this.sourceData = ScbISourceData;
  return this;
}

module.exports = ScbInterface;
