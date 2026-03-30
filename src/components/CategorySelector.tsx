"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { History, FlaskConical, Popcorn, Globe, Music, Cpu, Trophy, BookOpen } from "lucide-react";

const CATEGORIES = [
  { id: "History", icon: History, label: "History" },
  { id: "Science", icon: FlaskConical, label: "Science" },
  { id: "Pop Culture", icon: Popcorn, label: "Pop Culture" },
  { id: "Geography", icon: Globe, label: "Geography" },
  { id: "Music", icon: Music, label: "Music" },
  { id: "Technology", icon: Cpu, label: "Technology" },
  { id: "Sports", icon: Trophy, label: "Sports" },
  { id: "Literature", icon: BookOpen, label: "Literature" },
];

interface CategorySelectorProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export default function CategorySelector({ selectedCategories, onToggleCategory }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map((cat) => (
        <label
          key={cat.id}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group hover:border-primary/50 ${
            selectedCategories.includes(cat.id)
              ? "bg-primary/5 border-primary shadow-sm"
              : "bg-white border-border"
          }`}
        >
          <Checkbox
            checked={selectedCategories.includes(cat.id)}
            onCheckedChange={() => onToggleCategory(cat.id)}
            className="sr-only"
          />
          <cat.icon className={`h-5 w-5 ${selectedCategories.includes(cat.id) ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
          <span className={`text-sm font-medium ${selectedCategories.includes(cat.id) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
            {cat.label}
          </span>
        </label>
      ))}
    </div>
  );
}
