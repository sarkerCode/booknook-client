"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpen, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();

  // Form field state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status state
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        const errorMsg = error.message || "Invalid email or password. Please try again.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (data) {
        toast.success("Welcome back to BookNook!");
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMsg = "An unexpected error occurred during sign in.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setServerError(null);
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        console.error("Google login failed:", error);
        const errorMsg = error.message || "Google sign-in failed.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const errorMsg = "An unexpected error occurred during Google sign in.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-paper flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Editorial Brand Header */}
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group mb-1"
            aria-label="BookNook home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-sage text-white shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="size-5" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight text-heading">
              BookNook
            </span>
          </Link>
          <p className="text-[11px] font-bold tracking-[0.25em] text-terracotta uppercase">
            Editorial Library Community
          </p>
        </div>

        <Card className="border-beige bg-card shadow-[0_10px_35px_rgba(36,52,71,0.06)] rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-6">
            <CardTitle className="font-display text-2xl font-semibold text-heading">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate text-xs mt-1">
              Sign in to your account to explore curated shelves and manage your borrows
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            {serverError && (
              <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-medium flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <FieldGroup className="space-y-3.5">
                {/* Social Login */}
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isGoogleLoading || isSubmitting}
                    onClick={handleGoogleLogin}
                    className="w-full h-11 border-beige bg-card text-heading hover:bg-paper hover:text-ink hover:border-ink/30 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:text-slate text-xs">
                  Or sign in with email
                </FieldSeparator>

                {/* Email */}
                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="email" className="text-xs font-semibold text-heading">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="reader@booknook.com"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20"
                  />
                </Field>

                {/* Password */}
                <Field className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password" className="text-xs font-semibold text-heading">
                      Password
                    </FieldLabel>
                    <Link
                      href="#"
                      className="text-xs text-terracotta hover:text-terracotta-hover transition-colors underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-heading p-0.5 rounded cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>

                {/* Submit Action */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isGoogleLoading}
                    className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <LogIn className="size-4" />
                    <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                  </Button>

                  <FieldDescription className="text-center text-xs text-slate mt-3">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-terracotta hover:text-terracotta-hover transition-colors underline-offset-4 hover:underline"
                    >
                      Create an Account
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Legal Footer Note */}
        <p className="px-6 text-center text-xs text-slate/75 leading-relaxed">
          By signing in, you agree to BookNook&apos;s{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-heading">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-heading">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
