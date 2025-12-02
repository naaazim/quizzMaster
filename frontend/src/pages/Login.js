import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";
import styles from '../style/login.module.css';
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = CookieService.getToken();
    const user = CookieService.getUser();

    if (token && user) {
      try {
        if (user.appUserRole === "EXAMINE") {
          navigate("/dashboard-examine");
        } else if (
          user.appUserRole === "EXAMINATEUR" ||
          user.appUserRole === "ADMIN"
        ) {
          navigate("/dashboard-examinateur");
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        CookieService.clearAuth();
      }
    } else {
      // Clean up if data is invalid
      if (token || user) {
        CookieService.clearAuth();
      }
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/v1/auth/login", {
        email: email,
        password: password,
      });

      CookieService.setToken(response.data.token);
      CookieService.setUser(response.data.appUser);

      if (response.data.appUser.appUserRole === "EXAMINE") {
        navigate("/dashboard-examine");
      } else if (
        response.data.appUser.appUserRole === "EXAMINATEUR" ||
        response.data.appUser.appUserRole === "ADMIN"
      ) {
        navigate("/dashboard-examinateur");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
      }
      setMessage(err.response?.data || "Erreur de connexion. Veuillez vérifier vos identifiants.");
      setError(true);
    }
  }

  const handlemdpoublie = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre email d'abord.");
      setError(true);
      return;
    }
    try {
      await axiosInstance.post(`/v1/auth/mdp-oublie/${email}`);
      setMessage("Vérifiez vos emails.");
      setError(true);
    } catch (err) {
      setMessage(err.response?.data || "Erreur lors de la demande");
      setError(true);
    }
  };

  return (
    <Layout>
      <div className={styles.loginContainer}>
        <div className={`glass-panel ${styles.loginCard}`}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          {error && <div className={styles.errorMessage}>{message}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="john@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.link}
                onClick={handlemdpoublie}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <a
              href={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/oauth2/authorization/google`}
              className={styles.googleBtn}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className={styles.googleIcon}
              />
              Continue with Google
            </a>

            <div className={styles.registerLink}>
              Don't have an account? <Link to="/Signup" className={styles.linkText}>Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;

