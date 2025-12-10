import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { initializeWidgets } from "../store/slices/widgetSlice";
import SortableWidget from "./SortableWidget";
import WeatherWidget from "./widgets/WeatherWidget";
import CryptoWidget from "./widgets/CryptoWidget";

const DashboardContent = () => {
  const dispatch = useAppDispatch();
  const { widgets } = useAppSelector((state) => state.widgets);

  useEffect(() => {
    dispatch(initializeWidgets());
  }, [dispatch]);

  const renderWidget = (widget: { type: string; id: string }) => {
    switch (widget.type) {
      case "weather":
        return <WeatherWidget />;
      case "crypto":
        return <CryptoWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <SortableWidget key={widget.id} id={widget.id}>
            {renderWidget(widget)}
          </SortableWidget>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
