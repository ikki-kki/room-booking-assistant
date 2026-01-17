import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { BookingTab } from "./booking-tab";
import { MyReservationsTab } from "./my-reservations-tab";

export function RoomBookingPage() {
  const [activeTab, setActiveTab] = useState("booking");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReservationChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-foreground mb-8 text-3xl font-bold">회의실 예약</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="booking">예약하기</TabsTrigger>
            <TabsTrigger value="my-reservations">내 예약</TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            <BookingTab
              key={`booking-${refreshKey}`}
              onReservationCreated={handleReservationChange}
            />
          </TabsContent>

          <TabsContent value="my-reservations">
            <MyReservationsTab
              key={`my-reservations-${refreshKey}`}
              onReservationCanceled={handleReservationChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
