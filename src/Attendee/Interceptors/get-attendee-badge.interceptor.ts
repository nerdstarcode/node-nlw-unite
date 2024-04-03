import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ZodError, z } from "zod";

@Injectable()
export class AttendeeBadgeInterceptor implements NestInterceptor {
  private readonly schema = z.object({ attendeeId: z.coerce.number().int().positive() }).strict()
  constructor() { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const param = request.params;
    const receive = param
    try {
      this.schema.parse(receive);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          {
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