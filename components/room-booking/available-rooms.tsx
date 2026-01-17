"use client";

import type { Room } from "@/lib/types";
import { EQUIPMENT_LABELS } from "@/lib/booking-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailableRoomsProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onBook: () => void;
  isSubmitting: boolean;
}

export function AvailableRooms({
  rooms,
  selectedRoom,
  onSelectRoom,
  onBook,
  isSubmitting,
}: AvailableRoomsProps) {
  if (rooms.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        조건에 맞는 예약 가능한 회의실이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {rooms.map((room) => {
          const isSelected = selectedRoom?.id === room.id;

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={cn(
                "relative rounded-lg border p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-primary ring-2"
                  : "border-border hover:border-primary/50 hover:bg-accent/50",
              )}
            >
              {isSelected && (
                <div className="bg-primary absolute top-2 right-2 rounded-full p-1">
                  <Check className="text-primary-foreground h-3 w-3" />
                </div>
              )}
              <h3 className="text-foreground font-semibold">{room.name}</h3>
              <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {room.floor}층
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {room.capacity}명
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {room.equipment.map((eq) => (
                  <Badge key={eq} variant="outline" className="text-xs">
                    {EQUIPMENT_LABELS[eq]}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onBook} disabled={isSubmitting || !selectedRoom} size="lg">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          예약하기
        </Button>
      </div>
    </div>
  );
}
