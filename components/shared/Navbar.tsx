"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Trophy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { clearAuthStorage, useAuthUser } from "@/lib/auth";

const navLinkClass = (active: boolean) =>
  `rounded-2xl px-4 py-2 text-sm font-bold transition-all duration-200 ${active
    ? "bg-primary text-primary-foreground shadow-sm"
    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
  }`;

const mobileNavLinkClass = (active: boolean) =>
  `block rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${active
    ? "bg-primary text-primary-foreground shadow-sm"
    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
  }`;

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthUser();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    clearAuthStorage();
    toast.success("Logged out successfully");
    setIsOpen(false);
    router.push("/login");
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <p className="font-heading text-lg font-black leading-none">
              WC Prediction
            </p>
            <p className="text-xs text-muted-foreground">League 2026</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-3xl border bg-card/70 p-2 shadow-sm backdrop-blur md:flex">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Matches
          </Link>

          <Link
            href="/leaderboard"
            className={navLinkClass(pathname === "/leaderboard")}
          >
            Leaderboard
          </Link>

          {user && (
            <Link
              href="/my-predictions"
              className={navLinkClass(pathname === "/my-predictions")}
            >
              My Picks
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={navLinkClass(pathname.startsWith("/admin"))}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border bg-card px-2 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {getInitial(user.name)}
                </div>

                <div className="max-w-32 pr-2 leading-tight">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="smooth-button rounded-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>

              <Button size="sm" asChild className="smooth-button rounded-full">
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t bg-background/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          <div className="mx-auto max-w-7xl space-y-4">
            {user && (
              <div className="flex items-center gap-3 rounded-3xl border bg-card/80 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-sm font-black">
                  {getInitial(user.name)}
                </div>

                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            <nav className="space-y-2 rounded-3xl border bg-card/70 p-2">
              <Link
                href="/"
                onClick={closeMenu}
                className={mobileNavLinkClass(pathname === "/")}
              >
                Matches
              </Link>

              <Link
                href="/leaderboard"
                onClick={closeMenu}
                className={mobileNavLinkClass(pathname === "/leaderboard")}
              >
                Leaderboard
              </Link>

              {user && (
                <Link
                  href="/my-predictions"
                  onClick={closeMenu}
                  className={mobileNavLinkClass(pathname === "/my-predictions")}
                >
                  My Predictions
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className={mobileNavLinkClass(pathname.startsWith("/admin"))}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <div className="grid gap-2">
              {user ? (
                <Button
                  variant="outline"
                  onClick={logout}
                  className="smooth-button h-11 rounded-2xl"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="smooth-button h-11 rounded-2xl"
                  >
                    <Link href="/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </Button>

                  <Button asChild className="smooth-button h-11 rounded-2xl">
                    <Link href="/register" onClick={closeMenu}>
                      Join League
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};