import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/global/api";
import { apiClient } from "@/global/apiClient";
import { useAuth } from "@/global/authContext";

type AuthMode = "login" | "register";

import { BollyBingoLogoIcon } from "@/components/common/BollyBingoLogoIcon";

function AuthFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#C81D4A]/15 text-[#C81D4A]">
        <Sparkles className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#C9C3D7]">{description}</p>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";
  const { setTokens, setUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError("Email and password are required.");
        return;
      }
    } else if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body = isLogin
        ? {
            email: email.trim(),
            password,
          }
        : {
            name: name.trim(),
            email: email.trim(),
            password,
          };

      const res = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const fallback = typeof payload === "string" ? payload : payload?.message;
        throw new Error(fallback || (isLogin ? "Login failed." : "Registration failed."));
      }

      setMessage(isLogin ? "Login successful." : "Registration successful.");
      setName("");
      setEmail("");
      setPassword("");

      if (isLogin) {
        const { accessToken, refreshToken } = payload;
        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);

          const meResponse = await apiClient.get("/api/v1/users/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setUser(meResponse.data);

          setTimeout(() => {
            window.location.hash = "#/";
          }, 500);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isLogin ? "Login failed." : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(200,29,74,0.22),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(11,110,100,0.20),_transparent_32%),linear-gradient(135deg,_#110820_0%,_#1B1330_50%,_#2A173B_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <Button
              asChild
              variant="outline"
              className="mb-6 w-fit border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <a href="#/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </Button>

            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#C81D4A]/30 bg-[#C81D4A]/15 px-4 py-2 text-sm font-medium text-[#E8A93B]">
                <BollyBingoLogoIcon className="h-6 w-6" />
                Secure access for players and hosts
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {isLogin ? "Welcome back to BollyBingo" : "Create your BollyBingo account"}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#C9C3D7] sm:text-lg">
                {isLogin
                  ? "Sign in to continue your game rooms, keep your star balance, and join live Bollywood bingo sessions."
                  : "Register once to play with friends, create rooms, and track your Bollywood bingo journey from any device."}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <AuthFeature
                title="Fast login"
                description="Pick up right where you left off with a smooth sign-in flow."
              />
              <AuthFeature
                title="Play with friends"
                description="Join private rooms or create public tables in seconds."
              />
              <AuthFeature
                title="Star wallet"
                description="Manage stars, create rooms, and unlock the full experience."
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-xl border-white/10 bg-[#1B1330]/90 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl text-white">{isLogin ? "Login" : "Register"}</CardTitle>
                    <CardDescription className="mt-1 text-[#C9C3D7]">
                      {isLogin
                        ? "Use your email and password to enter your account."
                        : "Fill in your details to create a new account."}
                    </CardDescription>
                  </div>

                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1.5 shadow-sm">
                    <Button
                      type="button"
                      variant={isLogin ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMode("login")}
                      className={[
                        "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                        isLogin
                          ? "bg-[#C81D4A] text-white shadow-md hover:bg-[#A6153B]"
                          : "bg-transparent text-[#C9C3D7] hover:bg-white/5 hover:text-white",
                      ].join(" ")}
                    >
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant={!isLogin ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMode("register")}
                      className={[
                        "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                        !isLogin
                          ? "bg-[#C81D4A] text-white shadow-md hover:bg-[#A6153B]"
                          : "bg-transparent text-[#C9C3D7] hover:bg-white/5 hover:text-white",
                      ].join(" ")}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#D8D2E6]">Full name</label>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C81D4A]" />
                        <Input
                          placeholder="Enter your name"
                          className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-[#8F879E]"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#D8D2E6]">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C81D4A]" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-[#8F879E]"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#D8D2E6]">Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C81D4A]" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-[#8F879E]"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm text-[#C9C3D7]">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#C81D4A]" />
                      Remember me
                    </label>

                    {isLogin ? (
                      <button type="button" className="font-medium text-[#E8A93B] hover:text-[#C81D4A]">
                        Forgot password?
                      </button>
                    ) : (
                      <span className="text-right">By registering, you agree to the game rules.</span>
                    )}
                  </div>

                  {error ? (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </p>
                  ) : null}

                  {message ? (
                    <p className="rounded-xl border border-[#0B6E64]/30 bg-[#0B6E64]/15 px-4 py-3 text-sm text-[#4ade80]">
                      {message}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full bg-[#C81D4A] text-base font-bold text-white hover:bg-[#A6153B]"
                  >
                    {isSubmitting ? "Please wait..." : isLogin ? "Login now" : "Create account"}
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8F879E]">Or continue with</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Google
                  </Button>
                  <Button variant="outline" className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Continue with OTP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}