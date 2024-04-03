import { z } from 'zod';
import { EventSelectSchema } from '../Events/events.dto';

export const AttendeeSchema = z.object({
    id: z.number().int().optional(),
    email: z.string().email(),
    name: z.string().trim().optional(),
    active: z.boolean().default(true),
    discord: z.string().trim(),
    nick: z.string().trim(),
    updatedAt: z.date().optional(),
    createdAt: z.date().optional(),
    eventId: z.string().trim(),
});
export type AttendeeDTO = z.infer<typeof AttendeeSchema>

export const AttendeeSelectSchema = z.object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    name: z.boolean().optional(),
    active: z.boolean().optional(),
    discord: z.boolean().optional(),
    nick: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    eventId: z.boolean().optional(),
    event: z.object({
        select: EventSelectSchema.optional()
    }).optional()
});
export type AttendeeSelectDTO = z.infer<typeof AttendeeSelectSchema>

export const CreateAttendeeSchema = z.object({
    email: z.string().email(),
    name: z.string().trim().optional(),
    active: z.boolean().default(true),
    discord: z.string().trim(),
    nick: z.string().trim(),
    AttendeeId: z.string().trim().optional(),
    eventId: z.string().trim().uuid(),
}).strict()

export type CreateAttendeeDTO = z.infer<typeof CreateAttendeeSchema>