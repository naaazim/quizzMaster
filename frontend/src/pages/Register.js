import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import style from "../style/Register.module.css";
import Layout from "../components/Layout";

function Register() {

  const navigate = useNavigate();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EXAMINE");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  
  async function save() {
    try {
      await axiosInstance.post("/v1/auth/register", {
        firstName: FirstName,
        lastName: LastName,
        email: email,
        password: password,
        role: role
      });
      setError(false);
      setMessage("Vérifiez vos emails pour activer votre compte");
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data || "Erreur lors de l'inscription");
      setError(true);
    }
  }

  return (
    <Layout>
      <div className={style.registerContainer}>
        <div className={`glass-panel ${style.registerCard}`}>
          <div className={style.header}>
            <h1 className={style.title}>Create Account</h1>
            <p className={style.subtitle}>Join QuizzMaster today</p>
          </div>

          {error && <div className="alert alert-error">{message}</div>}
          {success && <div className="alert alert-success">{message}</div>}

          <form onSubmit={(e) => {
            e.preventDefault();
            save();
          }} className={style.form}>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label htmlFor="FirstName" className={style.label}>First Name</label>
                <input
                  type="text"
                  required
                  className={style.input}
                  id="FirstName"
                  placeholder="John"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="LastName" className={style.label}>Last Name</label>
                <input
                  type="text"
                  required
                  className={style.input}
                  id="LastName"
                  placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>Email Address</label>
              <input
                type="email"
                required
                className={style.input}
                id="email"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label htmlFor="password" className={style.label}>Password</label>
              <input
                type="password"
                required
                className={style.input}
                id="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={style.roleGroup}>
              <label className={style.label}>I am a:</label>
              <div className={style.roleSelector}>
                <button
                  type="button"
                  className={`${style.roleBtn} ${role === 'EXAMINE' ? style.active : ''}`}
                  onClick={() => setRole('EXAMINE')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`${style.roleBtn} ${role === 'EXAMINATEUR' ? style.active : ''}`}
                  onClick={() => setRole('EXAMINATEUR')}
                >
                  Teacher
                </button>
              </div>
            </div>

            <button type="submit" className={style.submitBtn}>
              Sign Up
            </button>

            <div className={style.divider}>
              <span>OR</span>
            </div>

            <a
              href={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/oauth2/authorization/google`}
              className={style.googleBtn}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className={style.googleIcon}
              />
              Continue with Google
            </a>

            <div className={style.loginLink}>
              Already have an account? <Link to="/login" className={style.link}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Register;

