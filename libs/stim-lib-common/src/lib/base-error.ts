export abstract class BaseError extends Error {
  public abstract get errorCode(): number;
}
