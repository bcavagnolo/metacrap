describe("PointStore", function() {
  var ps;
  var options = {
    nameSpace: "surelyThisKeyDoesNotExist24142909",
    openKVURL: "http://riyadh.cusp.berkeley.edu/",
    listID: 'point-store-list',
  };

  beforeEach(function() {
    ps = new PointStore(options);
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
    var stored = new Point([0.0, 0.0], "test1", "type", []);
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
    var point = new Point([0.0, 0.0], "some other name", "type", []);
    var ps2 = new PointStore(options);
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

      points = [new Point([0.0, 0.0], "point zero", "restaurant", ["yummy", "cheap"]),
                new Point([137.0, -34.0], "point one", "bar", ["fancy", "expensive"]),
                new Point([0.0, 0.0], "point two", "shop", ["five stars", "cheap"]),
                new Point([0.0, 0.0], "point three", "restaurant", ["yucky", "fancy"]),
                new Point([0.0, 0.0], "point four", "shop", ["divy", "chain"])];

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
        ps2 = new PointStore(options);
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
      cheap = ps.getByTag("cheap");
      expect(cheap).toContain(points[0]);
      expect(cheap).toContain(points[2]);
      expect(cheap.length).toBe(2);
    });

    it("can search by type", function() {
      restaurants = ps.getByType("restaurant");
      expect(restaurants).toContain(points[0]);
      expect(restaurants).toContain(points[3]);
      expect(restaurants.length).toBe(2);
    });

    it("returns empty list as necessary", function() {
      foobars = ps.getByType("foobar");
      expect(foobars).toEqual([]);
    });

    it("can add a point", function() {
      added = false;
      p = new Point([0.0, 0.0], "point five", "shop", ["boutique"]);
      points.push(p);
      runs(function () {
        ps.updatePoint(p, function() {
          added = true;
        });
      });

      waitsFor(function () {
        return added;
      }, "point added successfully", 1000);

      runs(function() {
        ps2 = new PointStore(options);
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

    it("can update a point", function() {
      updated = false;
      p = points[2];
      p.tags.push("student discount");
      runs(function () {
        ps.updatePoint(p, function() {
          updated = true;
        });
      });

      waitsFor(function () {
        return updated;
      }, "point updated successfully", 1000);

      runs(function() {
        ps2 = new PointStore(options);
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

    it("should not store extra crap", function() {
      updated = false;
      p = points[2];
      p.extraCrap = "extra crap";
      p.MoreExtraCrap = {crap1: "c1", crap2: "c2"};
      runs(function () {
        ps.updatePoint(p, function() {
          updated = true;
        });
      });

      waitsFor(function () {
        return updated;
      }, "point updated successfully", 1000);

      runs(function() {
        ps2 = new PointStore(options);
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
          var p = ps2.getAll()[2];
          expect(p.extraCrap).toBe(undefined);
          expect(p.moreExtraCrap).toBe(undefined);
        });
      });
    });
  });
});

