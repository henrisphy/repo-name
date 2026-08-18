import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/reusable/Card";
import InputField from "../components/reusable/InputField";
import { ButtonActionPositive } from "../components/reusable/ButtonAction";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await login(username, password);

      if (success) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.role === "lead") {
            navigate("/dashboard/lead");
          } else if (user.role === "member") {
            navigate("/dashboard/staff");
          } else {
            navigate("/");
          }
        }
      } else {
        setErrors({ password: "Invalid username or password" });
      }
    } catch (error) {
      setErrors({ password: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <Card title="Login">
        <form onSubmit={handleSubmit} className="loginFormContent">
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
          <ButtonActionPositive type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
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
