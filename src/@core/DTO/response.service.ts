import { HttpStatus } from '@nestjs/common';

export class DTOOutputService {
  status: HttpStatus;
  message: any;
}

export class MetaData {
  count_total: number;
  count: number;
  limit: number;
  page: number;
}

export class DTOOutputFindAllTakeOverCI {
  data: any;
  meta: MetaData;
}
