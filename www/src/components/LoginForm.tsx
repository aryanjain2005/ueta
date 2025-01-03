import { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const LoginForm = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    });

    const result = await response.json();
    if (response.ok) {
      window.location.href =
        new URLSearchParams(window.location.search).get("r") || "/";
    } else {
      alert(result.message);
    }
  };

  return (
    <form className="space-y-3 text-left" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="user">User:</label>
        <Input
          type="text"
          id="user"
          name="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password:</label>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
