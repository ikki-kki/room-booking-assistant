"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  findAlternativeRooms,
  findAlternativeTimeSlots,
  isRoomAvailable,
  timeToMinutes,
} from "@/lib/booking-utils";
import type { AlternativeSlot, BookingFormData, Reservation, Room } from "@/lib/types";
import { AlternativeSuggestions } from "./alternative-suggestions";
import { AvailableRooms } from "./available-rooms";
import { BookingForm } from "./booking-form";
import { Timeline } from "./timeline";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

type CreateReservationPayload = {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: BookingFormData["equipment"];
};

interface BookingTabProps {
  onReservationCreated: () => void;
}

export function BookingTab({ onReservationCreated }: BookingTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([]);
  const [alternativeRooms, setAlternativeRooms] = useState<Room[]>([]);

  const {
    data: rooms,
    isPending: roomsLoading,
    isError: roomsError,
  } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => fetchJson<Room[]>("/api/rooms"),
  });

  const {
    data: reservations,
    isPending: reservationsLoading,
    isError: reservationsError,
  } = useQuery<Reservation[]>({
    queryKey: ["reservations", selectedDate],
    queryFn: () => fetchJson<Reservation[]>(`/api/reservations?date=${selectedDate}`),
    enabled: Boolean(selectedDate),
  });

  const createReservation = useMutation({
    mutationFn: async (payload: CreateReservationPayload) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        throw new Error(data.message || "예약 중 오류가 발생했습니다.");
      }

      return { status: response.status, data };
    },
  });

  const [formData, setFormData] = useState<BookingFormData>({
    date: selectedDate,
    startTime: "09:00",
    endTime: "10:00",
    attendees: 1,
    equipment: [],
    preferredFloor: null,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const availableRooms = rooms?.filter((room) =>
    isRoomAvailable(
      room,
      reservations || [],
      formData.date,
      formData.startTime,
      formData.endTime,
      formData.attendees,
      formData.equipment,
      formData.preferredFloor,
    ),
  );

  const validateForm = useCallback((): string | null => {
    if (!selectedRoom) return "회의실을 선택해주세요";
    if (timeToMinutes(formData.endTime) <= timeToMinutes(formData.startTime)) {
      return "종료 시간은 시작 시간보다 늦어야 합니다";
    }
    if (formData.attendees < 1) return "참석 인원은 1명 이상이어야 합니다";
    return null;
  }, [selectedRoom, formData]);

  const handleBooking = async () => {
    const error = validateForm();
    if (error) {
      toast({ variant: "destructive", title: "예약 오류", description: error });
      return;
    }

    setShowAlternatives(false);

    try {
      const result = await createReservation.mutateAsync({
        roomId: selectedRoom!.id,
        date: formData.date,
        start: formData.startTime,
        end: formData.endTime,
        attendees: formData.attendees,
        equipment: formData.equipment,
      });

      if (result.data?.ok) {
        toast({
          title: "예약 완료",
          description: "회의실 예약이 완료되었습니다.",
        });
        queryClient.invalidateQueries({ queryKey: ["reservations"] });
        queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
        setSelectedRoom(null);
        onReservationCreated();
        return;
      }

      if (result.data?.code === "CONFLICT") {
        // Show alternative suggestions
        const durationMinutes = timeToMinutes(formData.endTime) - timeToMinutes(formData.startTime);
        const altSlots = findAlternativeTimeSlots(
          selectedRoom!.id,
          reservations || [],
          formData.date,
          durationMinutes,
        );
        const altRooms = findAlternativeRooms(
          rooms || [],
          reservations || [],
          selectedRoom!.id,
          formData.date,
          formData.startTime,
          formData.endTime,
          formData.attendees,
          formData.equipment,
          formData.preferredFloor,
        );

        setAlternativeSlots(altSlots);
        setAlternativeRooms(altRooms);
        setShowAlternatives(true);
        toast({
          variant: "destructive",
          title: "예약 불가",
          description: "해당 시간에 이미 예약이 있습니다. 대체 옵션을 확인해주세요.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "예약 실패",
        description: result.data?.message || "예약에 실패했습니다.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "오류",
        description: "예약 중 오류가 발생했습니다.",
      });
    }
  };

  const handleSelectAlternativeSlot = (slot: AlternativeSlot) => {
    setFormData((prev) => ({
      ...prev,
      startTime: slot.start,
      endTime: slot.end,
    }));
    setShowAlternatives(false);
  };

  const handleSelectAlternativeRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowAlternatives(false);
  };

  if (roomsLoading || reservationsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <span className="text-muted-foreground ml-2">로딩 중...</span>
      </div>
    );
  }

  if (roomsError || reservationsError) {
    return (
      <div className="text-destructive flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-2 h-8 w-8" />
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>예약 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline
            rooms={rooms || []}
            reservations={reservations || []}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>예약 조건</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingForm formData={formData} onFormDataChange={setFormData} rooms={rooms || []} />
        </CardContent>
      </Card>

      {/* Available Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>예약 가능한 회의실</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailableRooms
            rooms={availableRooms || []}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            onBook={handleBooking}
            isSubmitting={createReservation.isPending}
          />
        </CardContent>
      </Card>

      {/* Alternative Suggestions */}
      {showAlternatives && (
        <Card>
          <CardHeader>
            <CardTitle>대체 제안</CardTitle>
          </CardHeader>
          <CardContent>
            <AlternativeSuggestions
              alternativeSlots={alternativeSlots}
              alternativeRooms={alternativeRooms}
              selectedRoom={selectedRoom}
              onSelectSlot={handleSelectAlternativeSlot}
              onSelectRoom={handleSelectAlternativeRoom}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
