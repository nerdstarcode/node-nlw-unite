import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { CreateEventSchema } from "src/@core/DTO/Events/events.dto";
import { ZodError, z } from "zod";

@Injectable()
export class EventListOneInterceptor implements NestInterceptor {
  private readonly schema = z.object({ eventId: z.string().uuid() }).strict()
  constructor() { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const param = request.params;

    try {
      this.schema.parse(param);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          {
            describe: 'Invalid Entry',
            receive: param,
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