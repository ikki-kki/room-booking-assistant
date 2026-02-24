import { queryOptions } from "@tanstack/react-query";

import { getReservation, getRoomsList } from "./fetcher";

export const queries = {
  rooms: () =>
    queryOptions({
      queryKey: ["rooms"],
      queryFn: getRoomsList,
    }),
  reservation: (date: string) =>
    queryOptions({
      queryKey: ["reservation", date],
      queryFn: () => getReservation(date),
    }),
};
