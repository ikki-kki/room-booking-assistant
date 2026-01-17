"use client";

import type { Room, AlternativeSlot } from "@/lib/types";
import { EQUIPMENT_LABELS } from "@/lib/booking-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Building2, Users } from "lucide-react";

interface AlternativeSuggestionsProps {
  alternativeSlots: AlternativeSlot[];
  alternativeRooms: Room[];
  selectedRoom: Room | null;
  onSelectSlot: (slot: AlternativeSlot) => void;
  onSelectRoom: (room: Room) => void;
}

export function AlternativeSuggestions({
  alternativeSlots,
  alternativeRooms,
  selectedRoom,
  onSelectSlot,
  onSelectRoom,
}: AlternativeSuggestionsProps) {
  const hasAlternatives = alternativeSlots.length > 0 || alternativeRooms.length > 0;

  if (!hasAlternatives) {
    return (
      <p className="text-muted-foreground py-4 text-center">
        대체 가능한 시간대나 회의실이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alternative Time Slots */}
      {alternativeSlots.length > 0 && (
        <div>
          <h4 className="text-foreground mb-3 flex items-center gap-2 font-medium">
            <Clock className="h-4 w-4" />
            대체 시간대 ({selectedRoom?.name})
          </h4>
          <div className="flex flex-wrap gap-2">
            {alternativeSlots.map((slot, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSelectSlot(slot)}
                className="text-sm"
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Rooms */}
      {alternativeRooms.length > 0 && (
        <div>
          <h4 className="text-foreground mb-3 flex items-center gap-2 font-medium">
            <Building2 className="h-4 w-4" />
            대체 회의실 (같은 시간대)
          </h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {alternativeRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="border-border hover:border-primary/50 hover:bg-accent/50 rounded-lg border p-3 text-left transition-all"
              >
                <h5 className="text-foreground font-medium">{room.name}</h5>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {room.floor}층
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
