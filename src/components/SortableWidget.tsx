import { ReactNode } from "react";

import { useAppDispatch } from "../store/hooks";
import { removeWidget } from "../store/slices/widgetSlice";

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
}

const SortableWidget = ({ id, children }: SortableWidgetProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative group">
      <button
        onClick={() => dispatch(removeWidget(id))}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
      {children}
    </div>
  );
};

export default SortableWidget;
