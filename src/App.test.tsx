// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import App from "./App";
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});
describe("Parcours du portfolio", () => {
  it("affiche les tarifs, ouvre le menu mobile et sélectionne une offre", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Professionnel" })).toBeTruthy();
    const menu = screen.getByRole("button", { name: "Ouvrir le menu" });
    fireEvent.click(menu);
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getAllByText("Choisir ce pack")[1]);
    expect(
      (screen.getByLabelText("Votre projet") as HTMLSelectElement).value,
    ).toBe("Professionnel — 100 €");
    expect(
      (
        screen.getByRole("button", {
          name: "Envoyer ma demande",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it.each(["coiffure", "plombier"])(
    "simule une demande sur %s sans transmission",
    async (key) => {
      window.history.replaceState({}, "", `/demos/${key}`);
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      render(<App />);
      fireEvent.submit(
        screen
          .getByRole("button", { name: /Tester la demande/ })
          .closest("form")!,
      );
      expect(screen.getByRole("status").textContent).toContain(
        "Rien n’a été envoyé",
      );
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("confirme une réception réussie sur un endpoint configuré", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "https://example.com/contact");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Envoyer ma demande" })
        .closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "bien été envoyée",
      ),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("affiche une erreur si la réception échoue", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "https://example.com/contact");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<App />);
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Envoyer ma demande" })
        .closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("a échoué"),
    );
  });
  it("affiche une page introuvable pour une route inconnue", () => {
    window.history.replaceState({}, "", "/inconnu");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Page introuvable" }),
    ).toBeTruthy();
  });
});

describe("Direction éditoriale", () => {
  it("présente Lyon et une couverture sans photographie", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Des sites qui",
    );
    expect(screen.getByText("Studio web indépendant — Lyon")).toBeTruthy();
    expect(document.querySelector(".hero img")).toBeNull();
  });
  it("ouvre les trois démos depuis des captures réelles et adaptées au mobile", () => {
    render(<App />);
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(".project-stage > a"),
    ];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/demos/boulangerie",
      "/demos/coiffure",
      "/demos/plombier",
    ]);
    links.forEach((link) => {
      expect(link.querySelector("img")?.getAttribute("src")).toMatch(
        /\/previews\/.+-desktop\.jpg$/,
      );
      expect(link.querySelector("source")?.getAttribute("srcset")).toMatch(
        /-mobile\.jpg$/,
      );
    });
  });
});
