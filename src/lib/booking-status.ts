export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransition(current: BookingStatus, next: BookingStatus) {
  return transitions[current].includes(next);
}
