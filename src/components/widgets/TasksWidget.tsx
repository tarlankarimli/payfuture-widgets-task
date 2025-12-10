import { useState, useEffect, useMemo } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TasksWidget = ({ widgetId }: { widgetId: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("Tasks");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleText, setEditTitleText] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${widgetId}`);
    const savedTitle = localStorage.getItem(`tasks_title_${widgetId}`);

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }

    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, [widgetId]);

  useEffect(() => {
    const tasksJson = JSON.stringify(tasks);
    localStorage.setItem(`tasks_${widgetId}`, tasksJson);
  }, [tasks, widgetId]);

  useEffect(() => {
    localStorage.setItem(`tasks_title_${widgetId}`, title);
  }, [title, widgetId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTasks = useMemo(() => {
    if (!debouncedSearch.trim()) return tasks;
    const searchLower = debouncedSearch.toLowerCase();
    return tasks.filter((task) =>
      task.text.toLowerCase().includes(searchLower)
    );
  }, [tasks, debouncedSearch]);

  const addTask = () => {
    const trimmedText = newTaskText.trim();
    if (trimmedText) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: trimmedText,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      const trimmedText = editText.trim();
      setTasks(
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: trimmedText } : task
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const startEditTitle = () => {
    setIsEditingTitle(true);
    setEditTitleText(title);
  };

  const saveTitle = () => {
    const trimmedTitle = editTitleText.trim();
    if (trimmedTitle) {
      setTitle(trimmedTitle);
    } else {
      setTitle("Tasks");
    }
    setIsEditingTitle(false);
    setEditTitleText("");
  };

  const cancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditTitleText("");
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditTitle();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={editTitleText}
              onChange={(e) => setEditTitleText(e.target.value)}
              onKeyDown={handleTitleKeyPress}
              className="text-lg font-semibold px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              autoFocus
            />
            <button
              onClick={saveTitle}
              className="text-green-600 hover:text-green-800 text-sm px-2"
            >
              ✓
            </button>
            <button
              onClick={cancelEditTitle}
              className="text-gray-600 hover:text-gray-800 text-sm px-2"
            >
              ×
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold flex-1">{title}</h3>
            <button
              onClick={startEditTitle}
              className="text-gray-500 hover:text-gray-700 text-xs"
              title="Edit title"
            >
              ✏️
            </button>
          </>
        )}
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => {
              setNewTaskText(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Add new task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="cursor-pointer"
                disabled={editingId === task.id}
              />
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-800 text-sm px-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-800 text-sm px-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400" : ""}`}
                    onDoubleClick={() => startEdit(task)}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
