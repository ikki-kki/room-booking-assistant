import { Navigate, Route, Routes } from "react-router-dom";
import { RoomBookingPage } from "@/components/room-booking/room-booking-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoomBookingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
