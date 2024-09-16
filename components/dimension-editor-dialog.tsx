import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DimensionEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialWidth: number;
  initialHeight: number;
  initialLabel: string;
  onSave: (width: number, height: number, label: string) => void;
  onDelete: () => void;
}

export function DimensionEditorDialog({ 
  isOpen, 
  onOpenChange, 
  initialWidth, 
  initialHeight, 
  initialLabel, 
  onSave ,
  onDelete

}: DimensionEditorProps) {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setLabel(initialLabel);
  }, [initialWidth, initialHeight, initialLabel]);

  const handleSave = () => {
    onSave(width, height, label);
    onOpenChange(false);
  };
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dimensions</DialogTitle>
          <DialogDescription>
            Make changes to the width, height, and label. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">
              Width
            </Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height
            </Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}