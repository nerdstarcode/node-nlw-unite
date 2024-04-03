import { Module } from '@nestjs/common';
import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string().uuid(),
    public_id: z.number().int().positive(),
    title: z.string().trim(),
    details: z.string().trim().optional(),
    slug: z.string().trim(),
    maximumAttendees: z.number().int().positive(),
}).strict()

export type EventDTO = z.infer<typeof EventSchema>
export const EventSelectSchema = z.object({
    id: z.boolean().optional(),
    public_id: z.boolean().optional(),
    title: z.boolean().optional(),
    details: z.boolean().optional(),
    slug: z.boolean().optional(),
    maximumAttendees: z.boolean().optional(),
    _count: z.object({
        select: z.object({
            attendees: z.boolean().optional()
        }).optional()
    }).optional()
}).strict()

export type EventSelectDTO = z.infer<typeof EventSelectSchema>

export const CreateEventSchema = z.object({
    title: z.string().trim(),
    details: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    maximumAttendees: z.number().int().positive(),
}).strict()

export type CreateEventDTO = z.infer<typeof CreateEventSchema>

@Module({
    providers: [{ provide: 'EventSchema', useValue: EventSchema }],
    exports: ['EventSchema'], // Export the schema provider
})
export class SchemaModule { }