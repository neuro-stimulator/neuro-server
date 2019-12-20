export interface CustomRepository<T, E> {

  one(experiment: T): Promise<E>;

  insert(experiment: E): Promise<any>;

  update(experiment: E): Promise<any>;

  delete(id: number): Promise<any>;

}
