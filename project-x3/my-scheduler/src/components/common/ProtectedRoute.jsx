import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;