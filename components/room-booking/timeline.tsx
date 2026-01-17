import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Reservation, Room } from "@/lib/types";

interface TimelineProps {
  rooms: Room[];
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function Timeline({ rooms, reservations, selectedDate, onDateChange }: TimelineProps) {
  return (
    <div>
      {/* Date Picker */}
      <div className="mb-6">
        <Label htmlFor="timeline-date">날짜 선택</Label>
        <Input
          id="timeline-date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-1 w-auto"
        />
      </div>

      <div className="space-y-4">
        {rooms.map((room) => {
          const roomReservations = reservations.filter((r) => r.roomId === room.id);

          return (
            <div key={room.id} className="bg-card rounded-lg border p-4">
              <div className="text-foreground mb-2 font-medium">{room.name}</div>
              {roomReservations.length > 0 ? (
                <div className="space-y-2">
                  {roomReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-primary/80 text-primary-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm"
                    >
                      <span>
                        {reservation.start} - {reservation.end}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">예약 없음</p>
              )}
            </div>
          );
        })}

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary/80 h-4 w-4 rounded" />
            <span>예약됨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
