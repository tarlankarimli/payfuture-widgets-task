import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TasksWidget from "../widgets/TasksWidget";
import React from "react";

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

describe("TasksWidget", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("renders task widget", () => {
    render(<TasksWidget widgetId="test-1" />);
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add new task...")).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    render(<TasksWidget widgetId="test-1" />);
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Test task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });
  });

  it("toggles task completion", async () => {
    render(<TasksWidget widgetId="test-2" />);
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Complete me" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  it("deletes a task", async () => {
    render(<TasksWidget widgetId="test-3" />);
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Delete me" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Delete me")).toBeInTheDocument();
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });
  });

  it("edits a task", async () => {
    render(<TasksWidget widgetId="test-4" />);
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Original task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Original task")).toBeInTheDocument();
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      const editInput = screen.getByDisplayValue("Original task");
      fireEvent.change(editInput, { target: { value: "Edited task" } });

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      expect(screen.getByText("Edited task")).toBeInTheDocument();
      expect(screen.queryByText("Original task")).not.toBeInTheDocument();
    });
  });
});
