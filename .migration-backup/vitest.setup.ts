import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "font-inter"
  })
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useSearchParams: () => new URLSearchParams()
}));
