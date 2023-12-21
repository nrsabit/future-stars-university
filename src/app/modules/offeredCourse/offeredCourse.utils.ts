import { TSchedule } from './offeredCourse.interface';

export const hasTimeconflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const bookedStartTime = new Date(`1999-01-01T${schedule.startTime}`);
    const bookedEndTime = new Date(`1999-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1999-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1999-01-01T${newSchedule.endTime}`);

    if (newStartTime < bookedEndTime && newEndTime > bookedStartTime) {
      return true;
    }
  }
  return false;
};
