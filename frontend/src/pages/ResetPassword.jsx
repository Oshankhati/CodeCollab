import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/auth.api";
import "../styles/Login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [countdown, setCountdown] = useState(3);

  /* 🔐 Password strength logic */
  useEffect(() => {
    if (!password) return setStrength("");

    if (password.length < 6) setStrength("Weak");
    else if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      setStrength("Strong");
    else setStrength("Medium");
  }, [password]);

  /* ⏳ Countdown redirect */
  useEffect(() => {
    if (!message) return;

    if (countdown === 0) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await resetPassword(token, { password });

      setMessage(res.data.message || "Password reset successful");

    } catch (err) {
      setError(
        err.response?.data?.message || "Reset failed. Token may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-grid">

        {/* LEFT */}
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
                Create New
                <br />
                Password
              </h2>
              <p className="login-quote">
                Choose a strong password to secure your account.
              </p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-form-wrapper slide-right">

            <div className="login-form-header">
              <h1 className="login-form-title">Reset Password</h1>
              <p className="login-form-subtitle">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">

              {error && <div className="login-error">{error}</div>}

              {message && (
                <div className="login-success">
                  ✅ Password reset successful! Redirecting in {countdown}s...
                </div>
              )}

              {/* Password */}
              <div className="login-field">
                <label className="login-label">New Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*********"
                    required
                  />

                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>

                {password && (
                  <div className={`strength strength-${strength.toLowerCase()}`}>
                    Strength: {strength}
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="login-field">
                <label className="login-label">Confirm Password</label>
                <input
                  type="password"
                  className="login-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="*********"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Reset Password"}
              </button>

            </form>

            <div className="login-signup">
              <p>
                Back to{" "}
                <Link to="/login" className="login-signup-link">
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}