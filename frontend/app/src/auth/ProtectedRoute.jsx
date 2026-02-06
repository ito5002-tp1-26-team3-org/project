import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isInGroup } from "./authService";

export default function ProtectedRoute({ children, requireGroup }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (requireGroup && !isInGroup(user, requireGroup)) {
    // logged in but wrong role/group
    return <Navigate to="/" replace />;
  }

  return children;
}
