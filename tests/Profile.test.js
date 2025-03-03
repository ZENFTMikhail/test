import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Profile from "../src/components/Profile";
import { server } from "./mockserver";



beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test("Profile component renders and loads user data", async () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );


  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

});
