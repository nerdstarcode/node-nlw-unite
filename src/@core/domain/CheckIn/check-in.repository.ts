
import { CheckIn } from '@prisma/client';
export interface CheckInInterface {
  create(checkIn: CheckIn): Promise<any>;
  findAll(
    page: number,
    limit: number,
  ): Promise<CheckIn[]>;
  findOne(id: number): Promise<any>;
  delete(id: number): Promise<boolean>;
  countTotal(): Promise<number>;
  update(id: number, data: CheckIn): Promise<any | boolean>
}
