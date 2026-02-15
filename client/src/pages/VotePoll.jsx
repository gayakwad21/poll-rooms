import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VotePoll() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // fetch poll
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/polls/${id}`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Poll not found");
        setLoading(false);
      });
  }, [id]);

  // ⏱️ countdown timer
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

  // real-time vote updates
  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      if (data.pollId === id) {
        setPoll((prev) => ({ ...prev, options: data.results }));
      }
    });

    return () => socket.off("voteUpdate");
  }, [id]);

  // vote handler
  const handleVote = async (index) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/polls/${id}/vote`,
        { optionIndex: index }
      );

      setPoll((prev) => ({ ...prev, options: res.data.results }));
      setMessage("✅ Vote recorded");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error voting");
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading poll...</h2>;
  if (!poll) return <h2 style={{ textAlign: "center" }}>{message}</h2>;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h1>{poll.question}</h1>

      {/* ⏱️ TIMER */}
      <p className="timer">{timeLeft}</p>

      {/* OPTIONS */}
      {poll.options.map((opt, i) => {
        const percent = totalVotes
          ? Math.round((opt.votes / totalVotes) * 100)
          : 0;

        return (
          <div key={i} style={{ marginBottom: 16 }}>
            <button
              className="option"
              onClick={() => handleVote(i)}
              disabled={timeLeft === "Poll expired"}
            >
              {opt.text} — {opt.votes} votes ({percent}%)
            </button>

            {/* Vote bar */}
            <div className="bar">
              <div className="bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}

      {/* MESSAGE */}
      {message && (
        <p style={{ marginTop: 15, fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}
