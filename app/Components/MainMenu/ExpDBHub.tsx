"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/images/Sonder logo with text.png";
import { ExperienceCard } from "./ExperienceHub";
import {
  ChevronRight,
  Activity,
  Eye,
  PlusCircle,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Experience {
  id: number;
  desc: string;
  title: string;
  userId: number;
  firstName: string;
  lastName: string;
  is_hidden: boolean;
}

interface State {
  id: number;
  state_name: string;
  index: number;
}

export const ExpDBHub = ({
  isAuthenticated: parentIsAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState({ title: "", desc: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<number | null>(
    null
  );
  const [isEditor, setIsEditor] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    title: "A Visual Interactive Experience",
    description: "Change the way you engage with educational content",
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(parentIsAuthenticated);
    if (!parentIsAuthenticated) {
      setUserId(null);
    }
  }, [parentIsAuthenticated]);

  useEffect(() => {
    checkAuth();
    fetchExperiences();
  }, [userId]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `/api/supabase/company?userId=${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.title && data.description) {
              setCompanyInfo({
                title: data.title,
                description: data.description,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching company info:", error);
        }
      }
    };

    fetchCompanyInfo();
  }, [userId]);

  const checkAuth = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      // Fetch user profile to get userId
      const response = await fetch(
        `/api/supabase/profile?userId=${session.user.id}`
      );
      const profile = await response.json();
      setUserId(profile.id);
      setIsEditor(profile.is_editor);
    }
  };

  const handleCreateExperience = async () => {
    if (!userId) return;

    try {
      const response = await fetch("/api/supabase/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newExperience.title,
          desc: newExperience.desc,
          profileId: userId,
        }),
      });

      const experience = await response.json();

      if (response.ok) {
        // Redirect to the new experience
        router.push(`/experience/edit/${experience.id}/0`);
      } else {
        throw new Error(experience.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create experience"
      );
    }
  };

  const handleDeleteExperience = async (id: number) => {
    setExperienceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;

    try {
      console.log("Deleting experience with ID:", experienceToDelete);
      const response = await fetch(
        `/api/supabase/experiences?id=${experienceToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setExperiences(
          experiences.filter((exp) => exp.id !== experienceToDelete)
        );
        setDeleteDialogOpen(false);
        setExperienceToDelete(null);
      } else {
        throw new Error("Failed to delete experience");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete experience"
      );
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch(
        `/api/supabase/experiences${userId ? `?userId=${userId}` : ""}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch experiences");
      }
      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch experiences"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHidden = async (id: number, isHidden: boolean) => {
    try {
      const response = await fetch("/api/supabase/experiences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          is_hidden: isHidden,
        }),
      });

      if (response.ok) {
        setExperiences(
          experiences.map((exp) =>
            exp.id === id ? { ...exp, is_hidden: isHidden } : exp
          )
        );
        toast.success(isHidden ? "Experience hidden" : "Experience unhidden");
      } else {
        throw new Error("Failed to update experience");
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience");
    }
  };

  const handleUpdateExperience = async (
    id: number,
    title: string,
    desc: string
  ) => {
    try {
      const response = await fetch("/api/supabase/experiences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          desc,
        }),
      });

      if (response.ok) {
        setExperiences(
          experiences.map((exp) =>
            exp.id === id ? { ...exp, title, desc } : exp
          )
        );
        toast.success("Experience updated successfully");
      } else {
        throw new Error("Failed to update experience");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update experience"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-neutral-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Image
            src={Logo}
            alt="Company Logo"
            width={217}
            height={60}
            className="mx-auto"
            priority
          />
        </div>
        <div className="py-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-center text-white mb-4"
          >
            {companyInfo.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center text-white mb-12"
          >
            {companyInfo.description}
          </motion.p>

          {loading && (
            <div className="text-center text-white">Loading experiences...</div>
          )}

          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {experiences.map((experience, index) => (
              <ExperienceCardDB
                key={experience.id}
                name={experience.title}
                description={experience.desc}
                experienceId={experience.id}
                firstName={experience.firstName}
                lastName={experience.lastName}
                userId={experience.userId}
                currentUserId={userId}
                onDelete={handleDeleteExperience}
                onUpdate={handleUpdateExperience}
                is_hidden={experience.is_hidden}
                onToggleHidden={handleToggleHidden}
              />
            ))}
            {isAuthenticated && isEditor && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-full"
                  >
                    <div className="border-2 border-dashed border-[#01A9B2] bg-white/5 rounded-lg overflow-hidden h-full transition-all duration-300 hover:bg-white/10 cursor-pointer flex flex-col items-center justify-center min-h-[300px] group">
                      <PlusCircle
                        size={40}
                        className="text-[#01A9B2]/70 group-hover:text-[#01A9B2] transition-colors duration-300 mb-3"
                      />
                      <p className="text-[#01A9B2]/70 group-hover:text-[#01A9B2] text-lg font-medium transition-colors duration-300">
                        Add New Experience
                      </p>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      Create New Experience
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter experience title"
                        className="mt-1"
                        value={newExperience.title}
                        onChange={(e) =>
                          setNewExperience((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="What is this experience about?"
                        className="mt-1"
                        value={newExperience.desc}
                        onChange={(e) =>
                          setNewExperience((prev) => ({
                            ...prev,
                            desc: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      onClick={handleCreateExperience}
                      className="w-full bg-[#01A9B2] hover:bg-[#018A91] transition-colors duration-300"
                    >
                      Create Experience
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              {
                "Are you sure you want to delete this experience? This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const ExperienceCardDB = ({
  name,
  description,
  experienceId,
  firstName,
  lastName,
  userId,
  currentUserId,
  onDelete,
  is_hidden,
  onToggleHidden,
  onUpdate,
}: {
  name: string;
  description: string;
  experienceId: number;
  firstName: string;
  lastName: string;
  userId: number;
  currentUserId: number | null;
  onDelete: (id: number) => void;
  is_hidden: boolean;
  onToggleHidden: (id: number, isHidden: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, desc: string) => Promise<void>;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(name);
  const [editDesc, setEditDesc] = useState(description);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    // Don't navigate if we're in editing mode or clicking the menu
    if (isEditing || actionRef.current?.contains(e.target as Node)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/supabase/check-next?experienceId=${experienceId}&index=${0}`
      );
      const data = await response.json();

      if (data.hasNext) {
        router.push(`/experience/data/${experienceId}/${0}`);
      } else {
        toast.warning("This experience is empty");
        return;
      }
    } catch (error) {
      console.error("Error checking experience:", error);
      alert("Error checking experience. Please try again.");
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(experienceId);
  };

  const handleSave = async () => {
    await onUpdate(experienceId, editTitle, editDesc);
    setIsEditing(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={
        actionRef.current?.contains(document.activeElement as Node) || isEditing
          ? {}
          : { scale: 0.95 }
      }
      className="h-full relative"
    >
      <div
        onClick={handleClick}
        className={`bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl cursor-pointer relative group ${
          is_hidden ? "opacity-60" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {userId === currentUserId && (
          <div
            ref={actionRef}
            className="absolute top-2 right-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`p-2.5 bg-white/90 hover:bg-white shadow-md rounded-full transition-all duration-300 ${
                showActions ? "bg-white ring-2 ring-[#01A9B2]" : ""
              }`}
            >
              <MoreVertical size={18} className="text-gray-700" />
            </button>

            {showActions && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                style={{ maxHeight: "100vh" }}
              >
                <div className="relative">
                  <button
                    onClick={handleEditClick}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#01A9B2]/5 flex items-center gap-2 transition-colors duration-200"
                  >
                    <Edit2 size={16} className="text-[#01A9B2]" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Edit Experience
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHidden(experienceId, !is_hidden);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#01A9B2]/5 flex items-center gap-2 border-t border-gray-100 transition-colors duration-200"
                  >
                    {is_hidden ? (
                      <Eye size={16} className="text-[#01A9B2]" />
                    ) : (
                      <EyeOff size={16} className="text-[#01A9B2]" />
                    )}
                    <div>
                      <p className="font-medium text-gray-700">
                        {is_hidden ? "Show Experience" : "Hide Experience"}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 transition-colors duration-200"
                  >
                    <Trash2 size={16} className="text-red-500" />
                    <div>
                      <p className="font-medium text-red-600">
                        Delete Experience
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-[#01A9B2] to-[#7AE5EC] text-white p-6">
          {isEditing ? (
            <div
              className="space-y-4"
              onClick={(e) => e.stopPropagation()} // Prevent card click when editing
            >
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-white text-black"
                placeholder="Enter title"
              />
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="bg-white text-black"
                placeholder="Enter description"
              />
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  variant="secondary"
                >
                  Save
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-2">{name}</h3>
              <div className="flex items-center text-sm">
                <User size={16} className="mr-2" />
                <span>
                  Created by {firstName} {lastName}
                </span>
              </div>
              {currentUserId === userId && (
                <Button
                  onClick={handleEditClick}
                  variant="ghost"
                  className="text-white border border-white/30 hover:border-white/50 flex items-center gap-2 px-3 py-1.5 hover:bg-transparent transition-all duration-200 mt-4"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit Details
                </Button>
              )}
            </>
          )}
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-[#257276] font-semibold flex items-center">
              Start Experience
              <ChevronRight
                size={20}
                className={`ml-1 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </span>
            <Activity size={24} className="text-[#18D9E4]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
