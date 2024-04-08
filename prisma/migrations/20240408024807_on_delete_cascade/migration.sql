-- DropForeignKey
ALTER TABLE "atendees" DROP CONSTRAINT "atendees_event_id_fkey";

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_attendee_id_fkey";

-- AddForeignKey
ALTER TABLE "atendees" ADD CONSTRAINT "atendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "atendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
