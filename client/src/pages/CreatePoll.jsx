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

  const API = import.meta.env.VITE_API_URL;

  // handle option change
  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  // add new option
  const addOption = () => setOptions([...options, ""]);

  // remove option
  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  // validation
  const validateForm = () => {
    if (!question.trim()) return "Question is required";

    const filledOptions = options.filter((o) => o.trim() !== "");
    if (filledOptions.length < 2) return "At least 2 options required";

    if (expires <= 0) return "Expiry must be greater than 0 minutes";

    return null;
  };

  // create poll
  const createPoll = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${API}/api/polls/create`, {
        question,
        options: options.filter((o) => o.trim() !== ""),
        expiresInMinutes: Number(expires),
      });

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

      {/* Question */}
      <input
        className="input"
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options */}
      {options.map((opt, i) => (
        <div key={i} className="option-row">
          <input
            className="input"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, i)}
          />
          <button className="remove-btn" onClick={() => removeOption(i)}>
            ❌
          </button>
        </div>
      ))}

      <button className="add-btn" onClick={addOption}>
        + Add Option
      </button>

      {/* Expiry */}
      <div className="expiry">
        <label>Expiry (minutes)</label>
        <input
          type="number"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Submit */}
      <button className="primary" onClick={createPoll} disabled={loading}>
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}

export default CreatePoll;
