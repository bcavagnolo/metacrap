describe("PointStore", function() {
  var ps;
  var baseName = "surelyThisKeyDoesNotExist24142909"

  beforeEach(function() {
    ps = new PointStore(baseName);
    var loaded = false;

    runs(function () {
      ps.load(function () {
        loaded = true;
      });
    });

    waitsFor(function () {
      return loaded;
    }, "point store to load", 3000);
  });

  afterEach(function() {
    var deleted = false;

    runs(function () {
      ps.deletePointStore(function () {
        deleted = true;
      });
    });

    waitsFor(function () {
      return deleted;
    }, "point store to delete", 3000);
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
});