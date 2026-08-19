import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";
import Card from "../components/reusable/Card";
import InputField from "../components/reusable/InputField";
import { ButtonActionPositive } from "../components/reusable/ButtonAction";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "lead") {
        navigate("/dashboard/lead");
      } else if (user.role === "staff") {
        navigate("/dashboard/staff");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="loginPage">
      <Card title="Login">
        <form onSubmit={handleSubmit} className="loginFormContent">
          {error && (
            <div className="errorText" style={{ textAlign: 'center', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({ ...errors, username: "" });
            }}
            error={errors.username}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            required
          />

          <ButtonActionPositive type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </ButtonActionPositive>

          <p>
            Don't have an account?
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default LoginForm;