"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  GraduationCap,
  Check,
  X,
} from "lucide-react";

interface Professor {
  id: string;
  name: string;
  department: string;
  subject: string;
  file?: string;
  created_at: string;
}

interface ProfessorTableProps {
  professors: Professor[];
  isLoading: boolean;
  error: Error | undefined;
  onDelete: (id: string, name: string) => Promise<void>;
  onUpdate: (
    id: string,
    data: Partial<{ name: string; department: string; subject: string }>
  ) => Promise<void>;
}

export function ProfessorTable({
  professors,
  isLoading,
  error,
  onDelete,
  onUpdate,
}: ProfessorTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    department: string;
    subject: string;
  }>({ name: "", department: "", subject: "" });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartEdit = (professor: Professor) => {
    setEditingId(professor.id);
    setEditData({
      name: professor.name,
      department: professor.department,
      subject: professor.subject,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", department: "", subject: "" });
  };

  const handleSaveEdit = async (id: string) => {
    setIsUpdating(true);
    await onUpdate(id, editData);
    setIsUpdating(false);
    setEditingId(null);
  };

  const handleDelete = async (professor: Professor) => {
    if (confirm(`Are you sure you want to delete ${professor.name}?`)) {
      setDeletingId(professor.id);
      await onDelete(professor.id, professor.name);
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">
          Failed to load professors. Please try again.
        </p>
      </div>
    );
  }

  if (professors.length === 0) {
    return (
      <div className="py-12 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-semibold">No professors yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first professor to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Department
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Subject
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Added
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor) => (
            <tr
              key={professor.id}
              className="border-b border-border last:border-0 hover:bg-muted/50"
            >
              {editingId === professor.id ? (
                <>
                  <td className="px-4 py-3">
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="h-8"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={editData.department}
                      onChange={(e) =>
                        setEditData({ ...editData, department: e.target.value })
                      }
                      className="h-8"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={editData.subject}
                      onChange={(e) =>
                        setEditData({ ...editData, subject: e.target.value })
                      }
                      className="h-8"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(professor.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSaveEdit(professor.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-success" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium">{professor.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {professor.department}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {professor.subject}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(professor.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(professor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(professor)}
                        disabled={deletingId === professor.id}
                      >
                        {deletingId === professor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
