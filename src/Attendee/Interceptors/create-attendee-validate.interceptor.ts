import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { ParamsTokenFactory } from "@nestjs/core/pipes";
import { Observable } from "rxjs";
import { CreateAttendeeSchema } from "src/@core/DTO/Attendees/attendees.dto";
import { ZodError } from "zod";

@Injectable()
export class AttendeesRegistryInterceptor implements NestInterceptor {
  private readonly schema: typeof CreateAttendeeSchema = CreateAttendeeSchema
  constructor() { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const body = request.body;
    const param = request.params;
    const receive = { ...body, ...param }
    try {
      this.schema.parse(receive);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          {
            param,
            describe: 'Invalid Entry',
            receive,
            error
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw error;
      }
    }

    return next.handle();
  }
}