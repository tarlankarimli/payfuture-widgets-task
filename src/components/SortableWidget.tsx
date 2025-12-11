import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useAppDispatch } from "../store/hooks";
import { removeWidget } from "../store/slices/widgetSlice";

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
}

const SortableWidget = ({ id, children }: SortableWidgetProps) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md p-4 relative group"
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        ⋮⋮
      </button>
      <button
        onClick={() => dispatch(removeWidget(id))}
        className="absolute top-2 right-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
      {children}
    </div>
  );
};

export default SortableWidget;
