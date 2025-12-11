import { lazy, Suspense, useState, useMemo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { reorderWidgets, initializeWidgets } from "../store/slices/widgetSlice";
import SortableWidget from "./SortableWidget";
import type { WidgetType } from "../store/slices/widgetSlice";

const WeatherWidget = lazy(() => import("./widgets/WeatherWidget"));
const CryptoWidget = lazy(() => import("./widgets/CryptoWidget"));
const TasksWidget = lazy(() => import("./widgets/TasksWidget"));

const DashboardContent = () => {
  const dispatch = useAppDispatch();
  const { widgets } = useAppSelector((state) => state.widgets);
  const [filterType, setFilterType] = useState<WidgetType | "all">("all");

  useEffect(() => {
    dispatch(initializeWidgets());
  }, [dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const orderedWidgets = [...widgets].sort((a, b) => a.order - b.order);
      const oldIndex = orderedWidgets.findIndex(
        (widget) => widget.id === active.id
      );
      const newIndex = orderedWidgets.findIndex(
        (widget) => widget.id === over.id
      );

      const newWidgets = arrayMove(orderedWidgets, oldIndex, newIndex).map(
        (widget, index) => ({ ...widget, order: index })
      );

      dispatch(reorderWidgets(newWidgets));
    }
  };

  const filteredWidgets = useMemo(() => {
    let result = widgets;
    if (filterType !== "all") {
      result = widgets.filter((widget) => widget.type === filterType);
    }
    return [...result].sort((a, b) => a.order - b.order);
  }, [widgets, filterType]);

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case "weather":
        return (
          <Suspense fallback={<div>Loading weather...</div>}>
            <WeatherWidget />
          </Suspense>
        );
      case "crypto":
        return (
          <Suspense fallback={<div>Loading crypto...</div>}>
            <CryptoWidget />
          </Suspense>
        );
      case "tasks":
        return (
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TasksWidget widgetId={widget.id} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded text-sm ${
              filterType === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("weather")}
            className={`px-4 py-2 rounded text-sm ${
              filterType === "weather"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Weather
          </button>
          <button
            onClick={() => setFilterType("crypto")}
            className={`px-4 py-2 rounded text-sm ${
              filterType === "crypto"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setFilterType("tasks")}
            className={`px-4 py-2 rounded text-sm ${
              filterType === "tasks"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tasks
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredWidgets.map((widget) => widget.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map((widget) => (
              <SortableWidget key={widget.id} id={widget.id}>
                {renderWidget(widget)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DashboardContent;
