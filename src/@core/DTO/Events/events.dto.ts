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

export const CreateEventSchema = z.object({
    title: z.string().trim(),
    details: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    maximumAttendees: z.number().int().positive(),
}).strict()

export type CreateEventDTO = z.infer<typeof CreateEventSchema>