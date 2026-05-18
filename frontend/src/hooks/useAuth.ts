import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkProStatus = async (userId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/subscription/${userId}`);
      const data = await res.json();
      if (data.success && data.subscriptionTier === 'pro') {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    } catch (err) {
      console.error("Error fetching pro status in useAuth:", err);
      setIsPro(false);
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await checkProStatus(s.user.id);
      } else {
        setIsPro(false);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await checkProStatus(data.session.user.id);
      } else {
        setIsPro(false);
      }
    }).catch(err => {
      console.error("Supabase session error:", err);
    }).finally(() => {
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, isPro, loading, signOut: () => supabase.auth.signOut() };
};
