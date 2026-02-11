import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

interface GuestUser extends User {
  id: string;
  username: string;
  email: string;
}

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  // Always return authenticated for local browser mode
  const guestUser: GuestUser = {
    id: "guest",
    username: "Guest",
    email: "guest@localhost",
    firstName: "Guest",
    lastName: "User",
    profileImageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    user: user || guestUser,
    isLoading: false, // Always ready for local mode
    isAuthenticated: true, // Always authenticated for local browser mode
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
