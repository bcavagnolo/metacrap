/**
 * Create a Point suitable to be stored in the PointStore
 */
function Point(lat, lon, name, tags) {
  this.lat = lat;
  this.lon = lon;
  this.name = name;
  this.tags = tags;
}

/**
 * Create a PointStore to store a bunch of geo points and their attributes
 *
 * Uses <a href="http://http://openkeyval.org/">open key value service.</a>
 * to persist a list of points.  Each JSON point is serialized and stored at
 * its own key.  The key name is generated by appending a number n to the
 * baseKey to form baseKey-n.  All values with keys of the form baseKey-n are
 * loaded until a 404 is returned.
 *
 * @param {string} a [hopefully] unique baseKey
 *
 * NOTE: This storage scheme suffers from ample problems that a conventional DB
 * resolves including concurrency issues between clients, no support for unique
 * base names, terrible search algorithms, etc.
 */
function PointStore(baseKey, load) {
  this.points = [];
}

/**
 * load points from persistent storage
 * @param {function} function to be called after initial loading is complete
 */
PointStore.prototype.load = function(success) {
  if (success)
    success();
};

/**
 * get all points with a certain tag in the top-level tag member.
 *
 * @return {string} (possibly empty) list of points
 */
PointStore.prototype.getByTag = function(tag) {
};

/**
 * get complete list of points
 *
 * @return (possibly empty) list of points
 */
PointStore.prototype.getAll = function() {
  return this.points;
};

/**
 * @return number of points contained in the PointStore
 */
PointStore.prototype.length = function() {
  return this.points.length;
};

/**
 * update a point in the PointStore
 *
 * If the point does not exist in the PointStore, it will be created.
 * @param {Point} the point to update
 * @param {function} to call after the save succeeds (optional)
 * @param {function} to call if the save fails (optional)
 */
PointStore.prototype.updatePoint = function(p, success, failure) {
  this.points.push(p);
  if (success)
    success();
};

/**
 * remove a point from the PointStore
 * @param {Point} the point p to remove
 */
PointStore.prototype.removePoint = function(p) {
};

/**
 * delete the entire PointStore from openkeyval
 * @param {function} to be called after deleting is complete
 */
PointStore.prototype.deletePointStore = function(done) {
};
