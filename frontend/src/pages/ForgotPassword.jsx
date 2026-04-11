
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import "../styles/Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setResetLink("");

    try {
      setLoading(true);

      const res = await forgotPassword({ email });

      setMessage(res.data.message || "Reset link generated.");
      setResetLink(res.data.resetLink); // 🔥 IMPORTANT

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="login-container">
      <div className="login-grid">

        {/* LEFT SIDE */}
        <div className="login-left slide-left">
          <div className="login-logo">
            <h1>
              <span className="logo-brackets">{"</>"}</span>
              <span className="logo-text"> CodeCollab</span>
            </h1>
          </div>

          <div className="login-branding">
            <div>
              <h2 className="login-title">
                Reset Your
                <br />
                Password
              </h2>
              <p className="login-quote">
                Don’t worry, it happens. We’ll help you recover access.
              </p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-form-wrapper slide-right">

            <div className="login-form-header">
              <h1 className="login-form-title">Forgot Password</h1>
              <p className="login-form-subtitle">
                Enter your registered email address.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">

              {error && <div className="login-error">{error}</div>}
              {message && <div className="login-success">{message}</div>}

              {/* EMAIL */}
              <div className="login-field">
                <label className="login-label">Email</label>
                <input
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* 🔥 RESET LINK FALLBACK UI */}
            {resetLink && (
              <div className="reset-link-box">
                <p>⚠️ Didn’t receive email? Use this link:</p>

                <input
                  type="text"
                  value={resetLink}
                  readOnly
                  className="login-input"
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button className="login-button" onClick={handleCopy}>
                    Copy Link
                  </button>

                  <a
                    href={resetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="login-button"
                    style={{ textAlign: "center", textDecoration: "none" }}
                  >
                    Open
                  </a>
                </div>
              </div>
            )}

            {/* LOGIN LINK */}
            <div className="login-signup">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="login-signup-link">
                  Back to Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}