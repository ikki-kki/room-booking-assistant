export interface RoomResponse {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipments: Equipment[];
}

type Equipment = "tv" | "whiteboard" | "video" | "speaker";

export interface GetRoomReservationResponse {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  attendees: number;
  equipment: Equipment[];
}
