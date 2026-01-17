"use client";

import type { Room, BookingFormData, Equipment } from "@/lib/types";
import { TIME_SLOTS, EQUIPMENT_LABELS } from "@/lib/booking-utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingFormProps {
  formData: BookingFormData;
  onFormDataChange: (data: BookingFormData) => void;
  rooms: Room[];
}

const EQUIPMENT_OPTIONS: Equipment[] = ["tv", "whiteboard", "video", "speaker"];

export function BookingForm({ formData, onFormDataChange, rooms }: BookingFormProps) {
  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);

  const handleEquipmentChange = (equipment: Equipment, checked: boolean) => {
    const newEquipment = checked
      ? [...formData.equipment, equipment]
      : formData.equipment.filter((e) => e !== equipment);
    onFormDataChange({ ...formData, equipment: newEquipment });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="booking-date">날짜</Label>
        <Input
          id="booking-date"
          type="date"
          value={formData.date}
          onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
        />
      </div>

      {/* Attendees */}
      <div className="space-y-2">
        <Label htmlFor="attendees">참석 인원</Label>
        <Input
          id="attendees"
          type="number"
          min={1}
          value={formData.attendees}
          onChange={(e) =>
            onFormDataChange({ ...formData, attendees: Number.parseInt(e.target.value) || 1 })
          }
        />
      </div>

      {/* Start Time */}
      <div className="space-y-2">
        <Label htmlFor="start-time">시작 시간</Label>
        <Select
          value={formData.startTime}
          onValueChange={(value) => onFormDataChange({ ...formData, startTime: value })}
        >
          <SelectTrigger id="start-time">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* End Time */}
      <div className="space-y-2">
        <Label htmlFor="end-time">종료 시간</Label>
        <Select
          value={formData.endTime}
          onValueChange={(value) => onFormDataChange({ ...formData, endTime: value })}
        >
          <SelectTrigger id="end-time">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preferred Floor */}
      <div className="space-y-2">
        <Label htmlFor="floor">선호 층 (선택)</Label>
        <Select
          value={formData.preferredFloor?.toString() || "all"}
          onValueChange={(value) =>
            onFormDataChange({
              ...formData,
              preferredFloor: value === "all" ? null : Number.parseInt(value),
            })
          }
        >
          <SelectTrigger id="floor">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor.toString()}>
                {floor}층
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment */}
      <div className="space-y-2 md:col-span-2">
        <Label>필요 장비</Label>
        <div className="flex flex-wrap gap-4">
          {EQUIPMENT_OPTIONS.map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${equipment}`}
                checked={formData.equipment.includes(equipment)}
                onCheckedChange={(checked) => handleEquipmentChange(equipment, !!checked)}
              />
              <Label htmlFor={`equipment-${equipment}`} className="cursor-pointer font-normal">
                {EQUIPMENT_LABELS[equipment]}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
