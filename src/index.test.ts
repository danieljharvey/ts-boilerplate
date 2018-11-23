import { responseData } from "./index";
import { some, none } from "fp-ts/lib/Option";

describe("responseData.isReady()", () => {
  it("Recognises real ready data", () => {
    expect(responseData.isReady(responseData.ready("yeah"))).toEqual(true);
  });

  it("Reloading is also ready", () => {
    expect(responseData.isReady(responseData.reloading("yeah"))).toEqual(true);
  });

  it("Recognises real ready data", () => {
    expect(responseData.isReady(responseData.loading())).toEqual(false);
  });

  it("Recognises total nonsense data is not ready", () => {
    expect(responseData.isReady(undefined as any)).toEqual(false);
  });

  it("Recognises null is not ready", () => {
    expect(responseData.isReady(null as any)).toEqual(false);
  });
});

describe("isLoading", () => {
  it("is false when no data", () => {
    expect(responseData.isLoading(responseData.empty())).toBeFalsy();
  });
  it("is true when loading", () => {
    expect(responseData.isLoading(responseData.loading())).toBeTruthy();
  });
  it("is true when reloading", () => {
    expect(
      responseData.isLoading(responseData.reloading("thing"))
    ).toBeTruthy();
  });
  it("is false when ready", () => {
    expect(responseData.isLoading(responseData.ready("thing"))).toBeFalsy();
  });
  it("is false when failed", () => {
    expect(responseData.isLoading(responseData.failed("what"))).toBeFalsy();
  });
});

describe("isFailed", () => {
  it("is false when no data", () => {
    expect(responseData.isFailed(responseData.empty())).toBeFalsy();
  });
  it("is false when loading", () => {
    expect(responseData.isFailed(responseData.loading())).toBeFalsy();
  });
  it("is false when reloading", () => {
    expect(responseData.isFailed(responseData.reloading("thing"))).toBeFalsy();
  });
  it("is false when ready", () => {
    expect(responseData.isFailed(responseData.ready("thing"))).toBeFalsy();
  });
  it("is true when failed", () => {
    expect(responseData.isFailed(responseData.failed("what"))).toBeTruthy();
  });
});

describe("isEmpty", () => {
  it("is true when no data", () => {
    expect(responseData.isEmpty(responseData.empty())).toBeTruthy();
  });
  it("is false when loading", () => {
    expect(responseData.isEmpty(responseData.loading())).toBeFalsy();
  });
  it("is false when reloading", () => {
    expect(responseData.isEmpty(responseData.reloading("thing"))).toBeFalsy();
  });
  it("is false when ready", () => {
    expect(responseData.isEmpty(responseData.ready("thing"))).toBeFalsy();
  });
  it("is true when failed", () => {
    expect(responseData.isEmpty(responseData.failed("what"))).toBeTruthy();
  });
});

describe("getData", () => {
  it("Returns total OK data", () => {
    expect(responseData.getData(responseData.ready("yeah"))).toEqual(
      some("yeah")
    );
  });

  it("Recognises null is not data", () => {
    expect(responseData.getData(null as any)).toEqual(none);
  });

  it("Recognises undefined is not data", () => {
    expect(responseData.getData(undefined as any)).toEqual(none);
  });
});

describe("setReload", () => {
  it("Reloads from ready", () => {
    expect(responseData.setReload(responseData.ready("yeah"))).toEqual(
      responseData.reloading("yeah")
    );
  });

  it("Goes to loading if empty", () => {
    expect(responseData.setReload(responseData.empty())).toEqual(
      responseData.loading()
    );
  });
});
