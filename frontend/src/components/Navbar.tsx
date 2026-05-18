import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Hammer, LogOut, Sparkles, User, Settings, CreditCard, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsPro(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        const userId = user.id || user.userId;
        const res = await fetch(`${BACKEND_URL}/api/users/subscription/${userId}`);
        const data = await res.json();
        if (data.success && data.subscriptionTier === 'pro') {
          setIsPro(true);
        }
      } catch (err) {
        console.error('Error checking subscription in Navbar:', err);
      }
    };

    checkSubscription();
  }, [user]);

  const navItems = [
    { label: "Builder", to: "/builder" },
    { label: "Templates", to: "/examples" },
    { label: "Cover Letters", to: "/cover-letter" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Pricing", to: "/pricing" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-3">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow transform group-hover:scale-105 transition-transform duration-300">
            <Hammer className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">
              CareerForge <span className="text-gradient-gold">Pro</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">AI Resume Studio</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                isActive(item.to) 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          
          {!user && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex font-semibold">
              Sign in
            </Button>
          )}

          {isPro ? (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/30 hover:bg-amber-500/10 text-amber-500 hover:text-amber-500 font-bold gap-2"
              onClick={() => navigate("/pricing")}
            >
              <Sparkles className="h-4 w-4 fill-amber-500" />
              Pro Member
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 font-bold gap-2 border-none"
              onClick={() => navigate("/pricing")}
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:ring-2 focus:ring-primary rounded-full transition-all duration-300 hover:scale-105">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-2 glass-strong border-border/40">
                <div className="px-2 py-2 mb-2">
                  <p className="text-sm font-bold truncate">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {isPro ? "Pro Member" : "Free Plan"}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="gap-2 font-medium cursor-pointer py-2.5">
                  <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Profile settings are coming soon!")} className="gap-2 font-medium cursor-pointer py-2.5">
                  <User className="h-4 w-4 text-primary" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Account settings are coming soon!")} className="gap-2 font-medium cursor-pointer py-2.5">
                  <Settings className="h-4 w-4 text-primary" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pricing")} className="gap-2 font-medium cursor-pointer py-2.5">
                  <CreditCard className="h-4 w-4 text-primary" /> Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem 
                  onClick={() => signOut().then(() => navigate("/"))}
                  className="gap-2 font-medium text-destructive focus:text-destructive cursor-pointer py-2.5"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
