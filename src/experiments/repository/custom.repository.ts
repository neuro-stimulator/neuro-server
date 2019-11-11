import { Experiment} from 'diplomka-share';

export interface CustomRepository<E> {

  one(experiment: Experiment): Promise<E>;

  insert(experiment: E): Promise<any>;

  update(experiment: E): Promise<any>;

  delete(id: number): Promise<any>;

}
