export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard',
    PRO: 'pro',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export interface PlanLimits {
    maxBooks: number;
    maxSessionsPerMonth: number;
    maxDurationPerSession: number; // in minutes
    hasSessionHistory: boolean;
}

// Payment walls are disabled — every plan is unlimited so the app can be tested freely.
const UNLIMITED: PlanLimits = {
    maxBooks: Infinity,
    maxSessionsPerMonth: Infinity,
    maxDurationPerSession: Infinity,
    hasSessionHistory: true,
};

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PLANS.FREE]: UNLIMITED,
    [PLANS.STANDARD]: UNLIMITED,
    [PLANS.PRO]: UNLIMITED,
};

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};
