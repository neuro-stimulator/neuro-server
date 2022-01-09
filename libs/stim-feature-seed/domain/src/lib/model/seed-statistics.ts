export type SeedStatistics = Record<string, EntityStatistic>;

export interface FailedReason {
  code: string;
  errno: number;
  message: string;
  query: string;
  parameters: string[];
}

export interface SuccessfulEntityStatistics {
    inserted: number;
    updated: number;
    deleted: number;
}

export interface FailedEntityStatistics {
    inserted: {
      count: number;
      reason: FailedReason[];
    };
    updated: {
      count: number;
      reason: FailedReason[];
    };
    deleted: {
      count: number;
      reason: FailedReason[];
    };
}

export interface EntityStatistic {
  successful: SuccessfulEntityStatistics;
  failed: FailedEntityStatistics;
}

export function createEmptyEntityStatistic(): EntityStatistic {
  return {
    successful: {
      inserted: 0,
      updated: 0,
      deleted: 0,
    },
    failed: {
      inserted: {
        count: 0,
        reason: [],
      },
      updated: {
        count: 0,
        reason: [],
      },
      deleted: {
        count: 0,
        reason: [],
      },
    },
  };
}
