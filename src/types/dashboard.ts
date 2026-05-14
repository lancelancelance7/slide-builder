export type DashboardTab = "all" | "aiPlans" | "generated" | "exported";

export type DashboardSort = "updatedAt" | "createdAt" | "title";

export type DeckTabCounts = Record<DashboardTab, number>;
