export type Equipment = "tv" | "whiteboard" | "video" | "speaker";

export type Room = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
};

export type Reservation = {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
  userId?: string;
};

export type BookingFormData = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
};

export type AlternativeSlot = {
  start: string;
  end: string;
};

export type AlternativeRoom = {
  room: Room;
};
