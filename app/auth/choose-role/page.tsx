"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Briefcase,
  UserCircle,
  Loader2,
  ArrowRight
} from "lucide-react";

type Role = "brand" | "influencer" | "employee" | "client";

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "brand",
    title: "Brand",
    description: "I want to create campaigns and collaborate with influencers",
    icon: <Building2 className="w-12 h-12" />,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "influencer",
    title: "Influencer",
    description: "I want to join campaigns and collaborate with brands",
    icon: <Users className="w-12 h-12" />,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    id: "employee",
    title: "Employee",
    description: "I'm a team member managing operations",
    icon: <Briefcase className="w-12 h-12" />,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    id: "client",
    title: "Client",
    description: "I'm a client looking for influencer marketing services",
    icon: <UserCircle className="w-12 h-12" />,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export default function ChooseRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user already has a role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // @ts-ignore - needsRole is a custom field
      if (!session.user.needsRole && session.user.role) {
        // User already has a role, redirect to their portal
        router.push("/portal");
      }
    }
  }, [status, session, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set role");
      }

      // Redirect to the appropriate portal
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push("/portal");
      }
    } catch (err) {
      console.error("Error setting role:", err);
      setError(err instanceof Error ? err.message : "Failed to set role");
      setIsSubmitting(false);
      setSelectedRole(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Porchest! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Hi {session?.user?.name || "there"}!
          </p>
          <p className="text-lg text-gray-500">
            To get started, please select your role:
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {roleOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleRoleSelect(option.id)}
              disabled={isSubmitting}
              className={`
                relative group
                p-8 rounded-2xl border-2 border-gray-200
                bg-white shadow-lg hover:shadow-2xl
                transition-all duration-300 transform hover:-translate-y-1
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                ${selectedRole === option.id ? "ring-4 ring-blue-500 ring-opacity-50" : ""}
              `}
            >
              {/* Loading Overlay */}
              {isSubmitting && selectedRole === option.id && (
                <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Setting up your account...</p>
                  </div>
                </div>
              )}

              {/* Icon with colored background */}
              <div
                className={`
                  w-20 h-20 rounded-2xl ${option.color}
                  flex items-center justify-center mb-6
                  text-white transition-transform duration-300
                  group-hover:scale-110
                `}
              >
                {option.icon}
              </div>

              {/* Content */}
              <div className="text-left mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="flex items-center justify-end text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Select</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Don't worry, you can always contact support if you need to change your role later.
          </p>
        </div>
      </div>
    </div>
  );
}
