import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { CreateEventSchema } from "src/@core/DTO/Events/events.dto";
import { ZodError } from "zod";

@Injectable()
export class EventCreateInterceptor implements NestInterceptor {
  private readonly schema: typeof CreateEventSchema = CreateEventSchema
  constructor() { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const body = request.body;

    try {
      this.schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          {
            describe: 'Invalid Entry',
            receive: body,
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