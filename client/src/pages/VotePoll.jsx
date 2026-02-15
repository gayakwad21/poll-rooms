import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL;

// create socket connection
const socket = io(API, {
  transports: ["websocket"],
});

export default function VotePoll() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // 🔹 Fetch poll
  useEffect(() => {
    axios
      .get(`${API}/api/polls/${id}`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Poll not found");
        setLoading(false);
      });
  }, [id]);

  // 🔹 Countdown timer
  useEffect(() => {
    if (!poll) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(poll.expiresAt);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Poll expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `Time left: ${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  // 🔹 Real-time vote updates
  useEffect(() => {
    socket.emit("joinPoll", id);

    socket.on("voteUpdate", (data) => {
      if (data.pollId === id) {
        setPoll((prev) => ({ ...prev, options: data.results }));
      }
    });

    return () => {
      socket.off("voteUpdate");
      socket.emit("leavePoll", id);
    };
  }, [id]);

  // 🔹 Vote handler
  const handleVote = async (index) => {
    try {
      const res = await axios.post(`${API}/api/polls/${id}/vote`, {
        optionIndex: index,
      });

      setPoll((prev) => ({ ...prev, options: res.data.results }));
      setMessage("✅ Vote recorded");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error voting");
    }
  };

  // 🔹 Loading / error states
  if (loading) return <h2 className="center">Loading poll...</h2>;
  if (!poll) return <h2 className="center">{message}</h2>;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="page center">
      <h1>{poll.question}</h1>

      {/* ⏱️ TIMER */}
      <p className="timer">{timeLeft}</p>

      {/* OPTIONS */}
      {poll.options.map((opt, i) => {
        const percent = totalVotes
          ? Math.round((opt.votes / totalVotes) * 100)
          : 0;

        return (
          <div key={i} className="option-wrapper">
            <button
              className="option"
              onClick={() => handleVote(i)}
              disabled={timeLeft === "Poll expired"}
            >
              {opt.text} — {opt.votes} votes ({percent}%)
            </button>

            {/* vote bar */}
            <div className="bar">
              <div className="bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}

      {/* MESSAGE */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}
