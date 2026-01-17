import type { Reservation, Room } from "@/lib/types";

export const rooms: Room[] = [
  { id: "room-1", name: "회의실 A", floor: 1, capacity: 4, equipment: ["tv", "whiteboard"] },
  {
    id: "room-2",
    name: "회의실 B",
    floor: 1,
    capacity: 8,
    equipment: ["tv", "whiteboard", "video"],
  },
  {
    id: "room-3",
    name: "대회의실",
    floor: 2,
    capacity: 20,
    equipment: ["tv", "whiteboard", "video", "speaker"],
  },
  { id: "room-4", name: "소회의실", floor: 2, capacity: 3, equipment: ["whiteboard"] },
  { id: "room-5", name: "미팅룸 C", floor: 3, capacity: 6, equipment: ["tv", "video"] },
  {
    id: "room-6",
    name: "세미나실",
    floor: 3,
    capacity: 15,
    equipment: ["tv", "whiteboard", "video", "speaker"],
  },
];

export const reservations: Reservation[] = [
  {
    id: "res-1",
    roomId: "room-1",
    date: new Date().toISOString().split("T")[0],
    start: "09:00",
    end: "10:00",
    attendees: 3,
    equipment: ["tv"],
    userId: "user-1",
  },
  {
    id: "res-2",
    roomId: "room-2",
    date: new Date().toISOString().split("T")[0],
    start: "14:00",
    end: "16:00",
    attendees: 6,
    equipment: ["tv", "whiteboard"],
    userId: "user-1",
  },
  {
    id: "res-3",
    roomId: "room-3",
    date: new Date().toISOString().split("T")[0],
    start: "10:00",
    end: "12:00",
    attendees: 15,
    equipment: ["tv", "video"],
    userId: "user-2",
  },
];

export const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
