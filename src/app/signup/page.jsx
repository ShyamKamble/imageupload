"use client";
import { useState } from "react";
import { authAPI } from "../../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (username.length > 100) {
      setError("Username must be less than 100 characters");
      return;
    }

    // FIXED: Escaped the hyphen to prevent regex parser errors
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password.length > 72) {
      setError("Password must be less than 72 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(email, username, password);
      alert("Registration successful! Redirecting to For You page...");
      window.location.href = "/for-you";
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-muted-foreground text-xs">(valid email required)</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Username <span className="text-muted-foreground text-xs">(3-100 chars, alphanumeric, _, -)</span>
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe or johndoe123"
              minLength={3}
              maxLength={100}
              // FIXED: Escaped the hyphen here as well
              pattern="[a-zA-Z0-9_\-]+"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Letters, numbers, underscores, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password <span className="text-muted-foreground text-xs">(8-72 characters)</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              maxLength={72}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be between 8 and 72 characters
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-primary hover:underline">
            Already have an account? Login
          </a>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </a>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggleButton
          showLabel
          variant="gif"
          url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        />
      </div>
    </div>
  );
}