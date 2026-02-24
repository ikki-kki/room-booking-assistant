import { DateField } from "@/components/date-field";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  SubCard,
  SubCardContent,
  SubCardHeader,
} from "@/components/ui/sub-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { queries } from "@/src/shared/api/queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Presentation, Tv, Video, Volume2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { RoomSelect } from "./room-select";

// 사용자가 날짜를 변경하면 해당 날짜의 예약 현황을 다시 불러와야 합니다
export function BookingTab() {
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get("date") || "";

  const { data: rooms } = useSuspenseQuery(queries.rooms());
  const { data: reservations } = useQuery({
    ...queries.reservation(date),
    enabled: Boolean(date),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>예약 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <DateField
            label="날짜 선택"
            value={date ? new Date(date) : undefined}
            onSelect={(selectedDate) => {
              if (!selectedDate) {
                return;
              }
              setSearchParams({ date: format(selectedDate, "yyyy-MM-dd") });
            }}
          />
          {reservations?.map((reservation) => {
            const hasReservation = reservation.start && reservation.end;

            return (
              <SubCard key={reservation.id}>
                <SubCardHeader>{reservation.roomId}</SubCardHeader>
                <SubCardContent>
                  {hasReservation ? (
                    <Badge variant="outline">
                      {reservation.start} - {reservation.end}
                    </Badge>
                  ) : (
                    <p className="text-muted-foreground text-sm">예약 없음</p>
                  )}
                </SubCardContent>
              </SubCard>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>예약 조건</CardTitle>
        </CardHeader>
        <CardContent>
          <DateField label="날짜" />
          <InputField label="참석 인원" placeholder="1" type="number" min={1} />
          <SelectField label="시작 시간" options={[]} />
          <SelectField label="종료 시간" options={[]} />
          <SelectField
            label="선호 층 (선택)"
            options={[
              { label: "전체", value: "all" },
              { label: "회의실 A", value: "room-1" },
              { label: "회의실 B", value: "room-2" },
              { label: "대회의실", value: "room-3" },
              { label: "소회의실", value: "room-4" },
            ]}
          />

          <div className="space-y-2">
            <Label>필요 장비</Label>
            <ToggleGroup
              type="multiple"
              variant="outline"
              spacing={2}
              size="sm"
            >
              <ToggleGroupItem value="tv">
                <Tv className="h-4 w-4" />
                TV
              </ToggleGroupItem>
              <ToggleGroupItem value="whiteboard">
                <Presentation className="h-4 w-4" />
                화이트보드
              </ToggleGroupItem>
              <ToggleGroupItem value="video">
                <Video className="h-4 w-4" />
                화상회의
              </ToggleGroupItem>
              <ToggleGroupItem value="speaker">
                <Volume2 className="h-4 w-4" />
                스피커
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>예약 가능한 회의실</CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.map((room) => {
            return (
              <RoomSelect
                key={room.id}
                onSelect={() => setSelectedRoomId(room.id)}
                selected={selectedRoomId === room.id}
                name={room.name}
                floor={room.floor}
                capacity={room.capacity}
                equipments={room.equipments}
              />
            );
          })}

          <Button size="lg">예약하기</Button>
        </CardContent>
      </Card>
    </div>
  );
}
