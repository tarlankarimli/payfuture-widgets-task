import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WidgetType = "weather" | "crypto" | "tasks";

export interface Widget {
  id: string;
  type: WidgetType;
  order: number;
}

interface WidgetState {
  widgets: Widget[];
}

const loadWidgetsFromStorage = (): Widget[] => {
  try {
    const saved = localStorage.getItem("dashboardWidgets");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load widgets from storage", e);
  }
  return [
    { id: "1", type: "weather", order: 0 },
    { id: "2", type: "tasks", order: 1 },
    { id: "3", type: "crypto", order: 2 },
  ];
};

const initialState: WidgetState = {
  widgets: loadWidgetsFromStorage(),
};

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<WidgetType>) => {
      const newWidget: Widget = {
        id: Date.now().toString(),
        type: action.payload,
        order: state.widgets.length,
      };
      state.widgets.push(newWidget);
      const widgetsJson = JSON.stringify(state.widgets);
      localStorage.setItem("dashboardWidgets", widgetsJson);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload;
      state.widgets = state.widgets.filter((widget) => widget.id !== widgetId);
      state.widgets.forEach((widget, index) => {
        widget.order = index;
      });
      localStorage.setItem("dashboardWidgets", JSON.stringify(state.widgets));
    },
    initializeWidgets: (state) => {
      const saved = localStorage.getItem("dashboardWidgets");
      if (saved) {
        try {
          state.widgets = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load widgets from storage", e);
        }
      } else if (state.widgets.length === 0) {
        state.widgets = [
          { id: "1", type: "weather", order: 0 },
          { id: "2", type: "tasks", order: 1 },
          { id: "3", type: "crypto", order: 2 },
        ];
        localStorage.setItem("dashboardWidgets", JSON.stringify(state.widgets));
      }
    },
  },
});

export const { addWidget, removeWidget, initializeWidgets } =
  widgetSlice.actions;
export default widgetSlice.reducer;
