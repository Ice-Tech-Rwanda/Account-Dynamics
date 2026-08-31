"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: window.location.origin + "/admin/dashboard",
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Welcome back!");
        router.push(result.url ?? "/admin/dashboard");
        router.refresh();
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" showWordmark={false} />
          </div>
          <h1 className="text-xl font-black text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-400">{siteConfig.productName}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-brand/50"
              placeholder={siteConfig.email}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-slate-300">Password</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-brand/50 pr-10"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            variant="accent"
            size="xl"
            className="w-full rounded-xl gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          For secure admin onboarding, create an admin user via the management UI or `prisma db seed`.
        </p>
      </div>
    </div>
  );
}
