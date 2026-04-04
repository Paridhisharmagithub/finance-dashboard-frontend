export default function RoleGate({ allowedRoles, children }) {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!allowedRoles.includes(payload.role)) {
      return null; // 🔥 HIDE instead of showing error
    }

    return children;

  } catch {
    return null;
  }
}