export const WORKFLOW_LOOPING_TYPES = {
  POLLING: 'polling',
  SUBSCRIPTION: 'subscription'
} as const;

export type WorkflowLoopingType = typeof WORKFLOW_LOOPING_TYPES[keyof typeof WORKFLOW_LOOPING_TYPES];

export interface PollingSettings {
  loopingType: typeof WORKFLOW_LOOPING_TYPES.POLLING;
  period: number;
  limit: number;
}

export interface SubscriptionSettings {
  loopingType: typeof WORKFLOW_LOOPING_TYPES.SUBSCRIPTION;
  timeout: number;
  limit: number;
}

export type WorkflowSettings = PollingSettings | SubscriptionSettings; 