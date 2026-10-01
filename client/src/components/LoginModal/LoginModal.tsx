import { useState, type FormEvent } from "react";
import { loginUser, registerUser, type AuthUser } from "../../apiService/authApi";

interface LoginModalProps {
  onLoginSuccess: (user: AuthUser) => void;
}

interface LoginForm {
  name: string;
  email: string;
  password: string;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState<LoginForm>({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const normalizedEmail = form.email.trim().toLowerCase();

    try {
      const data = isRegistering
        ? await registerUser({
            name: form.name.trim(),
            email: normalizedEmail,
            password: form.password,
          })
        : await loginUser({ email: normalizedEmail, password: form.password });
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.user);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isRegistering ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          {isRegistering
            ? "Sign up to start tracking your vehicle maintenance"
            : "Sign in to access your garage"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <input
              required
              type="password"
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
            />
            {isRegistering && (
              <p className="text-xs text-neutral-400 mt-1">Must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="text-orange-500 hover:underline cursor-pointer font-medium"
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}