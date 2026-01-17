"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, Calendar, Clock, Loader2, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EQUIPMENT_LABELS } from "@/lib/booking-utils";
import type { Reservation, Room } from "@/lib/types";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

interface MyReservationsTabProps {
  onReservationCanceled: () => void;
}

export function MyReservationsTab({ onReservationCanceled }: MyReservationsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const {
    data: reservations,
    isPending,
    isError,
  } = useQuery<Reservation[]>({
    queryKey: ["my-reservations"],
    queryFn: () => fetchJson<Reservation[]>("/api/my-reservations"),
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => fetchJson<Room[]>("/api/rooms"),
  });

  const cancelReservation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "예약을 취소할 수 없습니다.");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      onReservationCanceled();
      toast({ title: "취소 완료", description: "예약이 취소되었습니다." });
    },
  });

  const getRoomName = (roomId: string) => {
    return rooms?.find((r) => r.id === roomId)?.name || roomId;
  };

  const handleCancel = async (id: string) => {
    setCancelingId(id);
    try {
      await cancelReservation.mutateAsync(id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error instanceof Error ? error.message : "예약 취소 중 오류가 발생했습니다.",
      });
    } finally {
      setCancelingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <span className="text-muted-foreground ml-2">로딩 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-2 h-8 w-8" />
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-muted-foreground py-20 text-center">
        <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>예약 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h3 className="text-foreground text-lg font-semibold">
                  {getRoomName(reservation.roomId)}
                </h3>
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {reservation.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {reservation.start} - {reservation.end}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {reservation.attendees}명
                  </span>
                </div>
                {reservation.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {reservation.equipment.map((eq) => (
                      <Badge key={eq} variant="secondary" className="text-xs">
                        {EQUIPMENT_LABELS[eq]}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancel(reservation.id)}
                disabled={cancelingId === reservation.id || cancelReservation.isPending}
              >
                {cancelingId === reservation.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="mr-1 h-4 w-4" />
                    취소
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
