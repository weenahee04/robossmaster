import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className} data-testid="nav-link">
      {children}
    </a>
  ),
}));

// Mock next/navigation
const mockPathname = vi.fn().mockReturnValue("/admin/dashboard");
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

import Sidebar, { type SidebarGroup, type SidebarItem } from "@/components/ui/Sidebar";

const mockGroups: SidebarGroup[] = [
  {
    title: "ภาพรวม",
    icon: "dashboard",
    items: [
      { label: "แดชบอร์ด", icon: "dashboard", href: "/admin/dashboard" },
      { label: "จัดการสาขา", icon: "store", href: "/admin/branches" },
    ],
  },
  {
    title: "การเงิน",
    icon: "payments",
    items: [
      { label: "ภาพรวมการเงิน", icon: "account_balance", href: "/admin/finance" },
      { label: "ตั้งค่า ROI", icon: "trending_up", href: "/admin/roi-config" },
    ],
  },
  {
    title: "Loyalty",
    icon: "loyalty",
    items: [
      { label: "ลูกค้า", icon: "group", href: "/admin/loyalty-customers" },
      { label: "คูปอง", icon: "confirmation_number", href: "/admin/loyalty-coupons", badge: 5 },
    ],
  },
];

const mockFlatItems: SidebarItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onLogout: vi.fn(),
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname.mockReturnValue("/admin/dashboard");
  });

  describe("Grouped navigation", () => {
    it("renders all group titles", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      expect(screen.getByText("ภาพรวม")).toBeInTheDocument();
      expect(screen.getByText("การเงิน")).toBeInTheDocument();
      expect(screen.getByText("Loyalty")).toBeInTheDocument();
    });

    it("renders all menu items", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      expect(screen.getByText("แดชบอร์ด")).toBeInTheDocument();
      expect(screen.getByText("จัดการสาขา")).toBeInTheDocument();
      expect(screen.getByText("ภาพรวมการเงิน")).toBeInTheDocument();
      expect(screen.getByText("ลูกค้า")).toBeInTheDocument();
    });

    it("auto-expands group containing active item", () => {
      mockPathname.mockReturnValue("/admin/dashboard");
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      // The "แดชบอร์ด" item in "ภาพรวม" group should be visible
      const dashboardLink = screen.getByText("แดชบอร์ด");
      expect(dashboardLink).toBeInTheDocument();
    });
  });

  describe("Collapse/expand", () => {
    it("toggles group collapse on click", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      const groupHeader = screen.getByText("ภาพรวม");
      // Click to collapse
      fireEvent.click(groupHeader);
      // Click again to expand
      fireEvent.click(groupHeader);
      // Items should still be in the DOM
      expect(screen.getByText("แดชบอร์ด")).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("renders search input", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);
      expect(screen.getByPlaceholderText("ค้นหาเมนู...")).toBeInTheDocument();
    });

    it("filters items by search text", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      const searchInput = screen.getByPlaceholderText("ค้นหาเมนู...");
      fireEvent.change(searchInput, { target: { value: "คูปอง" } });

      expect(screen.getByText("คูปอง")).toBeInTheDocument();
      expect(screen.queryByText("แดชบอร์ด")).not.toBeInTheDocument();
    });

    it("shows no results message for unmatched search", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      const searchInput = screen.getByPlaceholderText("ค้นหาเมนู...");
      fireEvent.change(searchInput, { target: { value: "ไม่มีเมนูนี้" } });

      expect(screen.getByText(/ไม่พบเมนู/)).toBeInTheDocument();
    });

    it("clears search on clear button click", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      const searchInput = screen.getByPlaceholderText("ค้นหาเมนู...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      // Find and click the clear button (the close icon button)
      const clearButtons = screen.getAllByText("close");
      fireEvent.click(clearButtons[0]);

      expect((searchInput as HTMLInputElement).value).toBe("");
    });
  });

  describe("Badge", () => {
    it("renders badge count", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("does not render badge when count is 0", () => {
      const groups = [
        {
          title: "Test",
          icon: "test",
          items: [{ label: "Item", icon: "icon", href: "/test", badge: 0 }],
        },
      ];
      render(<Sidebar {...defaultProps} groups={groups} />);
      // Badge should not render for 0
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("shows 99+ for large badge counts", () => {
      const groups = [
        {
          title: "Test",
          icon: "test",
          items: [{ label: "Item", icon: "icon", href: "/test", badge: 150 }],
        },
      ];
      render(<Sidebar {...defaultProps} groups={groups} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  describe("Flat items (backward compatibility)", () => {
    it("renders flat items when no groups provided", () => {
      render(<Sidebar {...defaultProps} items={mockFlatItems} />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("filters flat items by search", () => {
      render(<Sidebar {...defaultProps} items={mockFlatItems} />);

      const searchInput = screen.getByPlaceholderText("ค้นหาเมนู...");
      fireEvent.change(searchInput, { target: { value: "Dash" } });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });
  });

  describe("Brand & Logout", () => {
    it("renders brand name", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} brandName="MyBrand" brandSub="Admin Panel" />);
      expect(screen.getByText("MyBrand")).toBeInTheDocument();
      expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });

    it("defaults brand name to Roboss", () => {
      render(<Sidebar {...defaultProps} groups={mockGroups} />);
      expect(screen.getByText("Roboss")).toBeInTheDocument();
    });

    it("calls onLogout when logout button clicked", () => {
      const onLogout = vi.fn();
      render(<Sidebar {...defaultProps} onLogout={onLogout} groups={mockGroups} />);

      fireEvent.click(screen.getByText("ออกจากระบบ"));
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when nav link clicked", () => {
      const onClose = vi.fn();
      render(<Sidebar {...defaultProps} onClose={onClose} groups={mockGroups} />);

      const links = screen.getAllByTestId("nav-link");
      fireEvent.click(links[0]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Mobile overlay", () => {
    it("renders overlay when open", () => {
      const { container } = render(<Sidebar {...defaultProps} isOpen={true} groups={mockGroups} />);
      // Overlay div should exist
      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
    });

    it("does not render overlay when closed", () => {
      const { container } = render(<Sidebar {...defaultProps} isOpen={false} groups={mockGroups} />);
      const overlay = container.querySelector(".fixed.inset-0.z-40");
      expect(overlay).not.toBeInTheDocument();
    });
  });
});
