import { JSDOM } from "jsdom";

if (typeof globalThis.document === "undefined") {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/",
  });
  global.document = dom.window.document;
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
}

import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { PointsHistory } from "./PointsHistory";
import { BadgeCollection } from "./BadgeCollection";

describe("Loyalty Components", () => {
  afterEach(() => {
    cleanup();
  });

  describe("PointsHistory Component", () => {
    it("renders empty state when transactions list is empty", () => {
      const { getByText } = render(<PointsHistory transactions={[]} />);
      expect(getByText("No transactions yet")).toBeDefined();
      expect(getByText("Your loyalty points history and activity will appear here.")).toBeDefined();
    });

    it("renders transactions list with semantic list roles and ARIA labels", () => {
      const mockTransactions = [
        {
          id: "tx-1",
          amount: 50,
          type: "REWARD",
          description: "Earned points for booking",
          createdAt: "2026-03-01T12:00:00Z"
        },
        {
          id: "tx-2",
          amount: -20,
          type: "REDEEM",
          description: "Redeemed discount coupon",
          createdAt: "2026-03-02T12:00:00Z"
        }
      ];

      const { getByRole, getAllByRole } = render(<PointsHistory transactions={mockTransactions} />);

      const list = getByRole("list", { name: "Points transaction history" });
      expect(list).toBeDefined();

      const items = getAllByRole("listitem");
      expect(items.length).toBe(2);

      expect(items[0].getAttribute("aria-label")).toContain("Earned 50 points");
      expect(items[1].getAttribute("aria-label")).toContain("Spent 20 points");
    });
  });

  describe("BadgeCollection Component", () => {
    it("renders empty state when badges list is empty", () => {
      const { getByText } = render(<BadgeCollection badges={[]} />);
      expect(getByText("No achievements found")).toBeDefined();
      expect(getByText("Complete activities and book services to unlock loyalty badges.")).toBeDefined();
    });

    it("renders badges with semantic list roles and status labels", () => {
      const mockBadges = [
        {
          id: "b-1",
          name: "First Booking",
          description: "Complete your first service booking",
          icon: "🏆",
          isUnlocked: true,
          unlockedAt: "2026-02-15T00:00:00Z",
          pointsBonus: 100
        },
        {
          id: "b-2",
          name: "Beauty Enthusiast",
          description: "Leave 5 reviews for salons",
          icon: "⭐",
          isUnlocked: false,
          unlockedAt: null,
          pointsBonus: 50
        }
      ];

      const { getByRole, getAllByRole } = render(<BadgeCollection badges={mockBadges} />);

      const list = getByRole("list", { name: "Achievements list" });
      expect(list).toBeDefined();

      const items = getAllByRole("listitem");
      expect(items.length).toBe(2);

      expect(items[0].getAttribute("aria-label")).toContain("First Booking: Unlocked");
      expect(items[1].getAttribute("aria-label")).toContain("Beauty Enthusiast: Locked, +50 bonus points");
    });
  });
});
