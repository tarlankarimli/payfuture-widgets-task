import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../Login";
import authReducer from "../../store/slices/authSlice";

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Login", () => {
  it("renders login form", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("heading", {
        name: /login/i,
        level: 1,
      })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });

  it("shows error when fields are empty", async () => {
    renderWithProviders(<Login />);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter both username and password")
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid credentials", async () => {
    renderWithProviders(<Login />);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter both username and password")
      ).not.toBeInTheDocument();
    });
  });
});
