describe("PointStore", function() {
  var ps;
  var baseName = "surelyThisKeyDoesNotExist24142909"

  beforeEach(function() {
    ps = new PointStore(baseName);
    var loaded = false;
    var deleted = false;

    this.addMatchers({
      toContainExactlyAll: function(expected) {
        if (this.actual.length != expected.length) {
          return false;
        }
        for (i=0; i<expected.length; i++) {
          if (!this.env.contains_(this.actual, expected[i])) {
            return false;
          }
        }
        return true;
      }
    });

    runs(function () {
      ps.deletePointStore(function () {
        deleted = true;
      });
    });

    waitsFor(function () {
      return deleted;
    }, "point store to delete", 3000);

    runs(function () {
      ps.load(function () {
        loaded = true;
      });
    });

    waitsFor(function () {
      return loaded;
    }, "point store to load", 3000);
  });

  it("should start with empty list", function() {
    expect(ps.length()).toEqual(0);
  });

  it("should store items", function() {
    var stored = new Point(0.0, 0.0, "test1", []);
    var retrieved = null;
    var flag = false;

    runs(function () {
      ps.updatePoint(stored, function () {
        flag = true;
      });
    });

    waitsFor(function () {
      retrieved = ps.getAll();
      return flag;
    }, "the retrieved value should equal the stored value", 1000);

    runs(function () {
      expect(retrieved).not.toBe(null);
      expect(retrieved.length).toEqual(1);
      expect(retrieved[0]).toEqual(stored);
    });
  });

  it("should actually persist items", function() {
    var point = new Point(0.0, 0.0, "some other name", []);
    var ps2 = new PointStore(baseName);
    var done = false;

    runs(function () {
      ps.updatePoint(point, function () {
        ps2.load(function () {
          done = true;
        });
      });
    });

    waitsFor(function () {
      return done;
    }, "the load should succeed", 3000);

    runs(function () {
      expect(ps2.getAll()).toEqual(ps.getAll());
    });
  });

  describe("PointStore multi-point tests", function() {
    var points;

    beforeEach(function() {
      var numLoaded = 0;

      points = [new Point(0.0, 0.0, "point zero", ["restaurant", "cheap"]),
                new Point(137.0, -34.0, "point one", ["bar", "expensive"]),
                new Point(0.0, 0.0, "point two", ["shop", "expensive"]),
                new Point(0.0, 0.0, "point three", ["restaurant", "fancy"]),
                new Point(0.0, 0.0, "point four", ["shop", "chain"])];

      runs(function () {
        $.each(points, function (i, p) {
          ps.updatePoint(p, function () {
            numLoaded++;
          });
        });
      });

      waitsFor(function () {
        return numLoaded == points.length;
      }, "points to be updated", 3000);
    });

    it("contains all elements", function() {
      expect(ps.getAll()).toContainExactlyAll(points);
    });

    it("can remove a middle point", function() {
      p = points.splice(2, 1);
      removed = false;
      runs(function () {
        ps.removePoint(p[0], function() {
          removed = true;
        });
      });

      waitsFor(function () {
        return removed;
      }, "item removed successfully", 1000);

      runs(function() {
        ps2 = new PointStore(baseName);
        var loaded = false;

        runs(function () {
          ps2.load(function () {
            loaded = true;
          });
        });

        waitsFor(function () {
          return loaded;
        }, "point store 2 to load", 3000);

        runs(function () {
          expect(ps2.getAll()).toEqual(points);
        });
      });
    });

    it("can search by tag", function() {
      restaurants = ps.getByTag("restaurant");
      expect(restaurants).toContain(points[0]);
      expect(restaurants).toContain(points[3]);
      expect(restaurants.length).toBe(2);
    });

  });
});

