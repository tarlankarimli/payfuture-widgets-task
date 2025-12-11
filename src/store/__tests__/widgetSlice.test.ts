import { describe, it, expect } from "vitest";
import widgetReducer, {
  addWidget,
  removeWidget,
  reorderWidgets,
} from "../slices/widgetSlice";
import type { Widget } from "../slices/widgetSlice";

describe("widgetSlice", () => {
  const initialState = {
    widgets: [
      { id: "1", type: "weather" as const, order: 0 },
      { id: "2", type: "crypto" as const, order: 1 },
    ],
  };

  it("should handle initial state", () => {
    expect(widgetReducer(undefined, { type: "unknown" })).toHaveProperty(
      "widgets"
    );
  });

  it("should handle addWidget", () => {
    const action = addWidget("tasks");
    const newState = widgetReducer(initialState, action);

    expect(newState.widgets).toHaveLength(3);
    expect(newState.widgets[2].type).toBe("tasks");
  });

  it("should handle removeWidget", () => {
    const action = removeWidget("1");
    const newState = widgetReducer(initialState, action);

    expect(newState.widgets).toHaveLength(1);
    expect(newState.widgets[0].id).toBe("2");
  });

  it("should handle reorderWidgets", () => {
    const newWidgets: Widget[] = [
      { id: "2", type: "crypto", order: 0 },
      { id: "1", type: "weather", order: 1 },
    ];
    const action = reorderWidgets(newWidgets);
    const newState = widgetReducer(initialState, action);

    expect(newState.widgets[0].id).toBe("2");
    expect(newState.widgets[1].id).toBe("1");
  });
});
