import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePoll() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expires, setExpires] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!question.trim()) return "Question is required";

    const filledOptions = options.filter((o) => o.trim() !== "");
    if (filledOptions.length < 2) return "At least 2 options required";

    if (expires <= 0) return "Expiry must be greater than 0 minutes";

    return null;
  };

  const createPoll = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/polls/create",
        {
          question,
          options: options.filter((o) => o.trim() !== ""),
          expiresInMinutes: Number(expires),
        }
      );

      // redirect to vote page
      navigate(`/poll/${res.data.pollId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create poll. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Create a Poll</h1>

      <input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
          <input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, i)}
          />
          <button onClick={() => removeOption(i)}>❌</button>
        </div>
      ))}

      <button onClick={addOption}>+ Add Option</button>

      <div style={{ marginTop: 10 }}>
        Expiry (minutes):
        <input
          type="number"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="primary" onClick={createPoll} disabled={loading}>
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}

export default CreatePoll;
