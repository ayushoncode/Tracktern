"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword, resetPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await forgotPassword(email);

      if (data.message === "OTP sent to email") {
        setStep("reset");
        setSuccess(
          data.otp
            ? `OTP for testing: ${data.otp}. Enter it below and reset your password.`
            : "OTP sent. Check your email and enter the code below."
        );
      } else {
        setError(data.message || "Unable to send OTP");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await resetPassword(email, otp, newPassword);

      if (data.message === "Password reset successful") {
        setSuccess("Password updated successfully. Redirecting to login...");
        setTimeout(() => router.push("/"), 1200);
      } else {
        setError(data.message || "Unable to reset password");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.25), transparent 40%), #080810" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(124,58,237,0.28),transparent_68%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)]">
            {step === "email" ? <Mail className="h-5 w-5 text-white" /> : <ShieldCheck className="h-5 w-5 text-white" />}
          </div>
          <h1 className="text-3xl font-black text-white">{step === "email" ? "Forgot password" : "Reset password"}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {step === "email" ? "Enter your email to receive an OTP." : `Use the OTP sent to ${email} and set a new password.`}
          </p>
        </div>

        {error ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div> : null}
        {success ? <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div> : null}

        {step === "email" ? (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-sm font-bold text-white hover:opacity-90">
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength={6}
                required
                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-sm font-bold text-white hover:opacity-90">
              {loading ? "Updating..." : "Update password"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStep("email");
                setOtp("");
                setNewPassword("");
                setError("");
                setSuccess("");
              }}
              className="h-11 w-full rounded-xl text-gray-300 hover:text-white"
            >
              Change email
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
