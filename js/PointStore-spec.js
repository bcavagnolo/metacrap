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
    var stored = {s1:"a string", i1:3, o1:{a: 1, b: "test"}};
    var retrieved = null;
    var flag = false;

    runs(function () {
      ps.savePoint(stored, function () {
        flag = true;
      });
    });

    waitsFor(function () {
      retrieved = ps.getAll();
      return flag;
    }, "the retrieved value should equal the stored value", 1000);

    runs(function () {
      expect(retrieved).toEqual(stored);
    });

  });
});