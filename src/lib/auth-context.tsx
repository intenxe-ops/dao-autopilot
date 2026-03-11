"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { useAccount, useDisconnect } from "wagmi";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextType {
  user: User | null;
  walletAddress: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Check active Supabase session (for Google auth)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create/update wallet user profile in Supabase when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      createWalletProfile(address);
    }
  }, [isConnected, address]);

  const createWalletProfile = async (walletAddress: string) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (!existingProfile) {
        // Generate UUID for wallet user (since they don't have auth.users entry)
        const walletUserId = crypto.randomUUID();
        
        // Create new profile for wallet user
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: walletUserId,
            wallet_address: walletAddress.toLowerCase(),
            tier: 'free',
            auth_type: 'wallet',
            created_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error creating wallet profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createWalletProfile:', error);
    }
  };

  // For wallet auth, we just check if wallet is connected
  const walletAddress = isConnected ? address || null : null;

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    // Sign out of Supabase (if Google user)
    await supabase.auth.signOut();
    
    // Disconnect wallet (if wallet user)
    if (isConnected) {
      disconnect();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      walletAddress,
      loading, 
      signInWithGoogle, 
      signOut, 
      supabase 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}