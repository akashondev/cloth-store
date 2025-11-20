import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`http://localhost:5000/users/verify/${token}`);

        const data = await res.json();
        if (!res.ok) {
          navigate("/login");
          return;
        }

        // auto-login: save token + user
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/", { replace: true });
      } catch (err) {
        navigate("/login");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center text-xl">
      Verifying email...
    </div>
  );
}
