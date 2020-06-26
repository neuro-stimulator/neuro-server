export class GetContentQuery {
  constructor(
    public readonly path: string,
    public readonly location: 'public' | 'private' = 'public'
  ) {}
}
