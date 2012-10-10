
/**
 * Create a Point suitable to be stored in the PointStore
 * @param {Array} array containing lat and lon as floats
 * @param {string} name of the point (e.g., "Vital Vittles")
 * @param {string} the type of the point (e.g., restaurant)
 * @param {Array} array of tags
 */
function Point(posn, name, type, tags) {
  this.posn = posn;
  this.name = name;
  this.type = type;
  this.tags = tags;

  /* the following members are used internally by PointStore and should not be
   * altered by the caller
   */
  this.idx = -1;
}

/**
 * Create a PointStore to store a bunch of geo points and their attributes
 *
 * Uses <a href="http://http://openkeyval.org/">open key value service.</a> to
 * persist a list of points.  Each JSON point is serialized and stored at its
 * own key.  The key name is generated by appending a number n to the name
 * space to form nameSpace_n.  All values with keys of the form nameSpace_n are
 * loaded until a 404 is returned.
 *
 * @param {Object} key-value pairs specifying the following options:
 * <ul>
 * <li>openKVURL: url of openkv server to use as back end</li>
 * <li>nameSpace: [hopefully] unique nameSpace for use on openKV</li>
 * </ul>
 *
 * NOTE: This storage scheme suffers from ample problems that a conventional DB
 * resolves including concurrency issues between clients, no support for unique
 * base names, terrible search algorithms, etc.
 */
function PointStore(options) {
  this.points = [];
  this.options = options;
  this.end = 0;
  this.deleting = 0;
}

PointStore.prototype._getURL = function(i, store) {
  if (store)
    return this.options.openKVURL + 'store/';
  else
    return this.options.openKVURL + this.options.nameSpace + "_" + i;
}

/**
 * load points from persistent storage
 * @param {function} function to be called after initial loading is complete
 */
PointStore.prototype.load = function(success) {
  ps = this;
  $.ajax({
    ps: ps,
    psSuccess: success,
    url: this._getURL(this.end),
    dataType: "jsonp",
    success: function(data) {
      if (!data) {
        /* in this case, we're done */
        if (this.psSuccess) {
          this.psSuccess();
        }
        return;
      }
      if (data != "deleted") {
        this.ps.points.push(JSON.parse(data));
      }
      this.ps.end++;
      /* Recursion.  Bold.  Hopefully we won't run out of stack. */
      this.ps.load(this.psSuccess);
    }
  });
};

/**
 * get all points with a certain tag in the top-level tag member.
 *
 * @return (possibly empty) list of points
 */
PointStore.prototype.getByTag = function(tag) {
  return this.points.filter(function(p) {
    return ($.inArray(tag, p.tags) != -1);
  });
};

/**
 * get all points of a certain type.
 *
 * @return (possibly empty) list of points
 */
PointStore.prototype.getByType = function(type) {
  return this.points.filter(function(p) {
    return (p.type == type);
  });
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
 */
PointStore.prototype.updatePoint = function(p, success) {
  if (p.idx == -1) {
    p.idx = this.end++;
  }
  ps = this;
  data = new Object();
  data[this.options.nameSpace + "_" + p.idx] = JSON.stringify(p);
  $.ajax({
    ps: ps,
    psSuccess: success,
    url: this._getURL(p.idx, true),
    data: data,
    dataType: "jsonp",
    success: function(data) {
      this.ps.points.push(p);
      if (this.psSuccess) {
        this.psSuccess();
      }
    }
  });
};

/**
 * remove a point from the PointStore
 * @param {Point} the point p to remove
 * @param {function} to be called after deleting is complete
 *
 * @note: we only soft delete the items.  This ends up leaving holes in the
 * list.  Yuck.
 */
PointStore.prototype.removePoint = function(p, done) {
  data = new Object();
  data[this.options.nameSpace + "_" + p.idx] = "deleted";
  ps = this;
  $.ajax({
    ps: ps,
    p: p,
    psDone: done,
    url: this._getURL(p.idx, true),
    data: data,
    dataType: "jsonp",
    success: function(data) {
      this.ps.points.splice(this.ps.points.indexOf(this.p), 1);
      if (this.psDone)
        this.psDone();
    }
  });
};

/**
 * delete the entire PointStore from openkeyval
 * @param {function} to be called after deleting is complete
 */
PointStore.prototype.deletePointStore = function(done) {

  data = new Object();
  data[this.options.nameSpace + "_" + this.deleting++] = null;
  ps = this;
  $.ajax({
    ps: ps,
    psDone: done,
    url: this._getURL(this.end, true),
    data: data,
    dataType: "jsonp",
    success: function(data) {
      if (data.status == "did_not_exist") {
        this.ps.end = 0;
        this.ps.deleting = 0;
        this.ps.points = [];
        if (this.psDone) {
          this.psDone();
        }
        return;
      }
      this.ps.deletePointStore(this.psDone);
    },
  });
};
