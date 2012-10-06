describe("PointStore", function() {
  var ps;
  var baseName = "surelyThisKeyDoesNotExist24142909"

  beforeEach(function() {
    ps = new PointStore(baseName);
  });

  afterEach(function() {
    ps.deletePointStore();
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
});