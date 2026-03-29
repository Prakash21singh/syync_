export class TokenRotationError extends Error {
  constructor(
    public adapterType: string,
    public adapterId: string,
  ) {
    super(`Token rotation failed for ${adapterType} adapter (id: ${adapterId})`);
    this.name = 'TokenRotationError';
  }
}
