export type SubscriptionErrorCode =
  | 'AUTH_REQUIRED'
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'INVALID_PLAN'
  | 'PAYMENT_REQUIRED'
  | 'ALREADY_SUBSCRIBED'
  | 'CANCEL_FAILED'
  | 'REACTIVATE_FAILED'
  | 'UPGRADE_FAILED'
  | 'DOWNGRADE_FAILED'
  | 'API_ERROR'
  | 'RATE_LIMIT_EXCEEDED';

type SubscriptionErrorData = {
  [key: string]: string | number | boolean | null | undefined;
};

export class SubscriptionError extends Error {
  constructor(
    message: string,
    public code: SubscriptionErrorCode,
    public status: number = 400,
    public data?: SubscriptionErrorData
  ) {
    super(message);
    this.name = 'SubscriptionError';
  }

  static notAuthenticated() {
    return new SubscriptionError(
      'Nicht authentifiziert',
      'AUTH_REQUIRED',
      401
    );
  }

  static notFound() {
    return new SubscriptionError(
      'Abonnement nicht gefunden',
      'SUBSCRIPTION_NOT_FOUND',
      404
    );
  }

  static insufficientPermissions() {
    return new SubscriptionError(
      'Keine ausreichenden Berechtigungen',
      'INSUFFICIENT_PERMISSIONS',
      403
    );
  }

  static invalidPlan() {
    return new SubscriptionError(
      'Ungültiger Abonnementplan',
      'INVALID_PLAN',
      400
    );
  }

  static paymentRequired() {
    return new SubscriptionError(
      'Zahlung erforderlich',
      'PAYMENT_REQUIRED',
      402
    );
  }

  static alreadySubscribed() {
    return new SubscriptionError(
      'Bereits abonniert',
      'ALREADY_SUBSCRIBED',
      400
    );
  }

  static cancelFailed() {
    return new SubscriptionError(
      'Kündigung fehlgeschlagen',
      'CANCEL_FAILED',
      500
    );
  }

  static reactivateFailed() {
    return new SubscriptionError(
      'Reaktivierung fehlgeschlagen',
      'REACTIVATE_FAILED',
      500
    );
  }

  static upgradeFailed() {
    return new SubscriptionError(
      'Upgrade fehlgeschlagen',
      'UPGRADE_FAILED',
      500
    );
  }

  static downgradeFailed() {
    return new SubscriptionError(
      'Downgrade fehlgeschlagen',
      'DOWNGRADE_FAILED',
      500
    );
  }

  static apiError(details?: SubscriptionErrorData) {
    return new SubscriptionError(
      'API-Fehler',
      'API_ERROR',
      500,
      details
    );
  }

  static rateLimitExceeded(resetTime?: Date) {
    return new SubscriptionError(
      'Rate Limit überschritten',
      'RATE_LIMIT_EXCEEDED',
      429,
      { resetTime: resetTime?.toISOString() }
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      data: this.data,
    };
  }
}

export function isSubscriptionError(error: unknown): error is SubscriptionError {
  return error instanceof SubscriptionError;
}