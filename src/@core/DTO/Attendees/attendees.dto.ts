import { z } from 'zod';

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