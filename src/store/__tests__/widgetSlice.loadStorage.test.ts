import { describe, it, expect, beforeEach, vi } from "vitest";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("loadWidgetsFromStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  it("should return default widgets when localStorage is empty", async () => {
    const widgetSlice = await import("../slices/widgetSlice");
    const initialState = widgetSlice.default(undefined, { type: "unknown" });

    expect(initialState.widgets).toHaveLength(3);
    expect(initialState.widgets[0].id).toBe("1");
    expect(initialState.widgets[0].type).toBe("weather");
    expect(initialState.widgets[1].id).toBe("3");
    expect(initialState.widgets[1].type).toBe("crypto");
    expect(initialState.widgets[2].id).toBe("2");
    expect(initialState.widgets[2].type).toBe("tasks");
  });

  it("should load widgets from localStorage when available", async () => {
    const savedWidgets = [
      { id: "10", type: "weather", order: 0 },
      { id: "20", type: "crypto", order: 1 },
    ];
    localStorageMock.setItem("dashboardWidgets", JSON.stringify(savedWidgets));

    const widgetSlice = await import("../slices/widgetSlice");
    const initialState = widgetSlice.default(undefined, { type: "unknown" });

    expect(initialState.widgets).toHaveLength(2);
    expect(initialState.widgets[0].id).toBe("10");
    expect(initialState.widgets[1].id).toBe("20");
  });
});
