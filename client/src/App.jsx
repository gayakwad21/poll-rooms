import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<VotePoll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
