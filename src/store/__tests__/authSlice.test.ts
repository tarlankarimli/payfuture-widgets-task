import { describe, it, expect, beforeEach } from "vitest";
import authReducer, { login, logout, checkAuth } from "../slices/authSlice";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual({
      isAuthenticated: false,
      token: null,
      username: null,
    });
  });

  it("should handle login", () => {
    const action = login({ username: "testuser", token: "mock_token_123" });
    const newState = authReducer(undefined, action);

    expect(newState.isAuthenticated).toBe(true);
    expect(newState.username).toBe("testuser");
    expect(newState.token).toBe("mock_token_123");
    expect(localStorage.getItem("token")).toBe("mock_token_123");
    expect(localStorage.getItem("username")).toBe("testuser");
  });

  it("should handle logout", () => {
    localStorage.setItem("token", "mock_token_123");
    localStorage.setItem("username", "testuser");

    const initialState = {
      isAuthenticated: true,
      token: "mock_token_123",
      username: "testuser",
    };

    const action = logout();
    const newState = authReducer(initialState, action);

    expect(newState.isAuthenticated).toBe(false);
    expect(newState.token).toBeNull();
    expect(newState.username).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
  });

  it("should handle checkAuth when token exists", () => {
    localStorage.setItem("token", "mock_token_123");
    localStorage.setItem("username", "testuser");

    const action = checkAuth();
    const newState = authReducer(undefined, action);

    expect(newState.isAuthenticated).toBe(true);
    expect(newState.token).toBe("mock_token_123");
    expect(newState.username).toBe("testuser");
  });

  it("should handle checkAuth when no token", () => {
    const action = checkAuth();
    const newState = authReducer(undefined, action);

    expect(newState.isAuthenticated).toBe(false);
    expect(newState.token).toBeNull();
    expect(newState.username).toBeNull();
  });
});
