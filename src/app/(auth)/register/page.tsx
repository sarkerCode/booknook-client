"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function RegisterPage() {
  const router = useRouter();

  // Form field state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation & status state
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Password requirement checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  // Compute specific error message for invalid password
  const getPasswordValidationMessage = (): string | null => {
    const missing: string[] = [];
    if (!hasUppercase) missing.push("an uppercase letter (A-Z)");
    if (!hasLowercase) missing.push("a lowercase letter (a-z)");
    if (!hasMinLength) missing.push("at least 6 characters");

    if (missing.length === 0) return null;
    return `Password must have ${missing.join(" and ")}.`;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    // Auto-clear error if user fulfills all criteria while typing
    if (passwordError) {
      if (/[A-Z]/.test(val) && /[a-z]/.test(val) && val.length >= 6) {
        setPasswordError(null);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    setServerError(null);

    // 1. Password validation gate
    const validationError = getPasswordValidationMessage();
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return; // Do not proceed with registration!
    }

    setPasswordError(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim(),
      });

      if (error) {
        const errorMsg = error.message || "Failed to create account.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (data) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch (err: unknown) {
      console.error("Sign up error:", err);
      const errorMsg = "An unexpected error occurred during registration.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsGoogleSubmitting(true);
      setServerError(null);
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        const errorMsg = error.message || "Google registration failed.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        setIsGoogleSubmitting(false);
      }
    } catch (err: unknown) {
      console.error("Google sign up error:", err);
      const errorMsg = "An unexpected error occurred during Google registration.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      setIsGoogleSubmitting(false);
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
              Create an Account
            </CardTitle>
            <CardDescription className="text-slate text-xs mt-1">
              Join our community of readers and borrow from curated shelves
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            {serverError && (
              <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-medium flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <FieldGroup className="space-y-3.5">
                {/* Social Login */}
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isGoogleSubmitting || isSubmitting}
                    onClick={handleGoogleRegister}
                    className="w-full h-11 border-beige bg-card text-heading hover:bg-paper hover:text-ink hover:border-ink/30 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <span>{isGoogleSubmitting ? "Connecting to Google..." : "Sign up with Google"}</span>
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:text-slate text-xs">
                  Or register with email
                </FieldSeparator>

                {/* Name */}
                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="name" className="text-xs font-semibold text-heading">
                    Full Name
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Austen"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20"
                  />
                </Field>

                {/* Email */}
                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="email" className="text-xs font-semibold text-heading">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20"
                  />
                </Field>

                {/* Profile Image URL */}
                <Field className="space-y-1.5">
                  <FieldLabel htmlFor="image" className="text-xs font-semibold text-heading">
                    Profile Image URL
                  </FieldLabel>
                  <Input
                    id="image"
                    type="url"
                    name="image"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    className="h-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20"
                  />
                </Field>

                {/* Password with Eye toggle, form error message & live requirement checklist */}
                <Field className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-xs font-semibold text-heading"
                    >
                      Password
                    </FieldLabel>
                    <span className="text-[11px] text-slate font-medium">
                      Min. 6 chars, A-Z, a-z
                    </span>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => setTouched(true)}
                      placeholder="••••••••"
                      required
                      className={cn(
                        "h-10 pr-10 rounded-xl border-beige bg-card text-heading placeholder:text-slate/60 text-sm focus:border-terracotta focus:ring-terracotta/20 transition-colors",
                        passwordError &&
                          "border-danger focus:border-danger focus:ring-danger/20 text-danger"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-heading cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Form Error Message */}
                  {passwordError && (
                    <div
                      role="alert"
                      className="flex items-start gap-1.5 text-xs text-danger font-medium mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Live Password Requirements Checklist */}
                  {(password.length > 0 || touched) && (
                    <div className="mt-2 rounded-xl border border-beige bg-paper/60 p-3 space-y-1.5 text-xs text-slate">
                      <p className="font-semibold text-heading text-[11px] uppercase tracking-wider">
                        Password Requirements
                      </p>
                      <div className="space-y-1">
                        <div
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            hasUppercase ? "text-success font-medium" : "text-slate"
                          )}
                        >
                          {hasUppercase ? (
                            <Check className="size-3.5 text-success shrink-0" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-slate/40 ml-1 mr-1 shrink-0" />
                          )}
                          <span>Must have an Uppercase letter (A-Z)</span>
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            hasLowercase ? "text-success font-medium" : "text-slate"
                          )}
                        >
                          {hasLowercase ? (
                            <Check className="size-3.5 text-success shrink-0" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-slate/40 ml-1 mr-1 shrink-0" />
                          )}
                          <span>Must have a Lowercase letter (a-z)</span>
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            hasMinLength ? "text-success font-medium" : "text-slate"
                          )}
                        >
                          {hasMinLength ? (
                            <Check className="size-3.5 text-success shrink-0" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-slate/40 ml-1 mr-1 shrink-0" />
                          )}
                          <span>Length must be at least 6 characters</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Field>

                {/* Submit Action */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <LogIn className="size-4" />
                    <span>{isSubmitting ? "Creating account..." : "Register"}</span>
                  </Button>

                  <FieldDescription className="text-center text-xs text-slate mt-3">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-terracotta hover:text-terracotta-hover transition-colors underline-offset-4 hover:underline"
                    >
                      Sign In
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Legal Footer Note */}
        <p className="px-6 text-center text-xs text-slate/75 leading-relaxed">
          By registering, you agree to BookNook&apos;s{" "}
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
