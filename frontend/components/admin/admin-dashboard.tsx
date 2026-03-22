"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher, profApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { ProfessorTable } from "./professor-table";
import { AddProfessorDialog } from "./add-professor-dialog";
import { Users, GraduationCap, Star, Shield, Plus } from "lucide-react";

interface Professor {
  id: string;
  name: string;
  department: string;
  subject: string;
  file?: string;
  created_at: string;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: professors,
    error,
    isLoading,
    mutate,
  } = useSWR<Professor[]>("/admin/profs/", fetcher, {
    revalidateOnFocus: false,
  });

  const handleAddProfessor = async (data: {
    name: string;
    department: string;
    subject: string;
  }) => {
    try {
      await profApi.create(data);
      toast({
        title: "Professor added",
        description: `${data.name} has been added successfully.`,
      });
      mutate();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to add professor",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProfessor = async (id: string, name: string) => {
    try {
      await profApi.delete(id);
      toast({
        title: "Professor deleted",
        description: `${name} has been removed.`,
      });
      mutate();
    } catch (error) {
      toast({
        title: "Failed to delete professor",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfessor = async (
    id: string,
    data: Partial<{ name: string; department: string; subject: string }>
  ) => {
    try {
      await profApi.update(id, data);
      toast({
        title: "Professor updated",
        description: "The professor has been updated successfully.",
      });
      mutate();
    } catch (error) {
      toast({
        title: "Failed to update professor",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Professors",
      value: professors?.length || 0,
      icon: GraduationCap,
      description: "In the system",
    },
    {
      title: "Active Ratings",
      value: "-",
      icon: Star,
      description: "Blockchain verified",
    },
    {
      title: "Registered Voters",
      value: "-",
      icon: Users,
      description: "Anonymous users",
    },
    {
      title: "Chain Integrity",
      value: "100%",
      icon: Shield,
      description: "No tampering detected",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage professors and monitor the rating system
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Professor
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professor Table */}
      <Card>
        <CardHeader>
          <CardTitle>Professors</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfessorTable
            professors={professors || []}
            isLoading={isLoading}
            error={error}
            onDelete={handleDeleteProfessor}
            onUpdate={handleUpdateProfessor}
          />
        </CardContent>
      </Card>

      {/* Add Professor Dialog */}
      <AddProfessorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProfessor}
      />
    </div>
  );
}
