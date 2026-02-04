import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HabitActionsProps {
  habitId: string;
  habitName: string;
  habitGoal: number;
  onEdit: (id: string, name: string, goal: number) => void;
  onDelete: (id: string) => void;
}

const HabitActions = ({ habitId, habitName, habitGoal, onEdit, onDelete }: HabitActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editName, setEditName] = useState(habitName);
  const [editGoal, setEditGoal] = useState(habitGoal.toString());

  const handleEdit = () => {
    if (editName.trim()) {
      onEdit(habitId, editName.trim(), parseInt(editGoal) || habitGoal);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete(habitId);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = () => {
    setEditName(habitName);
    setEditGoal(habitGoal.toString());
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={openEditDialog} className="cursor-pointer">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Habit</DialogTitle>
            <DialogDescription>
              Make changes to your habit. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editHabitName">Habit Name</Label>
              <Input
                id="editHabitName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-secondary/50"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editHabitGoal">Goal (days/weeks)</Label>
              <Input
                id="editHabitGoal"
                type="number"
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="bg-secondary/50"
                min={1}
                max={31}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<span className="font-semibold text-foreground">{habitName}</span>"? 
              This action cannot be undone and all progress data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitActions;
