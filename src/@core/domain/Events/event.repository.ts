
import { Event } from '@prisma/client';
export interface EventInterface {
  create(event: Event): Promise<any>;
  findAll(
    page: number,
    limit: number,
  ): Promise<Event[]>;
  findOne(id: string): Promise<any>;
  delete(id: string): Promise<boolean>;
  countTotal(): Promise<number>;
  update(id: string, data: Event): Promise<any | boolean>
}
