import { TScheduled } from "./offeredCourse.interface";

export const hasTimeConflict = (
  assignScheduled: TScheduled[],
  newScheduled: TScheduled
) => {
  for (const scheduled of assignScheduled) {
    const existingStartTime = new Date(`1970-01-01T${scheduled.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${scheduled.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newScheduled.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newScheduled.endTime}`);

    // Check if the new schedule overlaps with the existing schedule
    const isOverlapping =
      (newStartTime >= existingStartTime && newStartTime < existingEndTime) || // New start is between the existing start and end time
      (newEndTime > existingStartTime && newEndTime <= existingEndTime) || // New end is between the existing start and end time
      (newStartTime <= existingStartTime && newEndTime >= existingEndTime); // New schedule completely overlaps the existing one

    if (isOverlapping) {
      //   throw new Error(
      //     "Conflict detected: The new schedule overlaps with an existing one."
      //   );
      return true;
    }
  }

  return false;
};
