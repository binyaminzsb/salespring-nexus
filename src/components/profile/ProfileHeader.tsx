
import React from "react";
import { User } from "@/types/auth";

interface ProfileHeaderProps {
  title: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-4xl font-bold logo-text mb-10">{title}</h1>
  );
};
