import type { GetRoomReservationResponse, RoomResponse } from "./types";

export const getRoomsList = (): Promise<RoomResponse[]> => {
  return fetch("/api/rooms").then((res) => res.json());
};

export const getReservation = (date: string): Promise<GetRoomReservationResponse[]> => {
  return fetch(`/api/reservations?date=${date}`).then((res) => res.json());
};
