
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; 

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
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

    const res = await registerUser({ name, email, password });

    console.log("REGISTER RESPONSE:", res.data); // debug

    // ✅ SAFE LOGIN
    if (res.data.user && res.data.token) {
      login(res.data);
      navigate("/dashboard");
    } else {
      // fallback (should not happen now)
      navigate("/login");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      {/* SAME BACKGROUND */}
      <div className="login-background">
        <svg className="login-svg" viewBox="0 0 1435 797"></svg>
      </div>

      <div className="login-grid">

        {/* LEFT SIDE SAME */}
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
                Start Your Coding
                <br />
                Journey Today
              </h2>

              <p className="login-quote">
                "Build together. Learn together. Grow together."
              </p>
            </div>

            <p className="login-tagline">
              Create your account and start collaborating instantly
            </p>
          </div>

          <div className="login-footer">
            <p className="login-copyright">
              © 2026 CodeCollab. All rights reserved.
            </p>
          </div>
        </div>

        <div className="vertical-line"></div>

        {/* RIGHT SIDE FORM */}
        <div className="login-right">
          <div className="login-form-wrapper slide-right">

            <div className="login-form-header">
              <h1 className="login-form-title">Create Account</h1>
              <p className="login-form-subtitle">
                Sign up to get started.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`login-form ${error ? "shake" : ""}`}
            >
              {error && <div className="login-error">{error}</div>}

              {/* NAME */}
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* EMAIL */}
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

              {/* PASSWORD */}
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
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Sign Up"}
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="login-signup">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="login-signup-link">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}