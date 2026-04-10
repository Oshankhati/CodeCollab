
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
// import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background */}
      <div className="login-background">
        <svg
          className="login-svg"
          width="1435"
          height="797"
          viewBox="0 0 1435 797"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Keep your SVG here */}
        </svg>
      </div>

      {/* Main Grid */}
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
                Collaborative Coding
                <br />
                Without Git
              </h2>
              <p className="login-quote">
                "The best way to code together is to actually code together."
              </p>
            </div>

            <p className="login-tagline">
              Join us and experience a better way for teams to collaborate
            </p>
          </div>

          <div className="login-footer">
            <p className="login-copyright">
              © 2026 CodeCollab. All rights reserved.
            </p>
          </div>
        </div>

        {/* 🔥 DIVIDER (IMPORTANT FIX) */}
        <div className="vertical-line"></div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-form-wrapper slide-right">

            {/* Header */}
            <div className="login-form-header">
              <h1 className="login-form-title">Welcome back</h1>
              <p className="login-form-subtitle">
                Enter your credentials to continue.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={`login-form ${error ? "shake" : ""}`}
            >
              {error && <div className="login-error">{error}</div>}

              {/* Email */}
              <div className="login-field">
                <label className="login-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="you@gmail.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label">Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
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

                <div className="login-forgot-container">
                  <Link to="/forgot-password" className="login-forgot-link">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Sign In"}
              </button>
            </form>

            {/* Signup */}
            <div className="login-signup">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="login-signup-link">
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}