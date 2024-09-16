'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DimensionEditorDialog } from "@/components/dimension-editor-dialog"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ColorPicker } from "@/components/ui/color-picker"
import { Undo2, Redo2, Plus, Edit, Trash2, Move } from 'lucide-react'

interface StorageItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  color: string
}

interface StoragePlanProps {
  mapId: string
  width?: number
  height?: number
}

type Mode = 'add' | 'edit' | 'delete' | 'move'

export function StoragePlanComponent({ mapId, width = 20, height = 20 }: StoragePlanProps) {
  const [items, setItems] = useState<StorageItem[]>([])
  const [currentItem, setCurrentItem] = useState<StorageItem | null>(null)
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('add')
  const [color, setColor] = useState('#3B82F6')
  const [history, setHistory] = useState<StorageItem[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const cellSize = 50 // Size of each grid cell in pixels

  const planDimensions = {
    width: width * cellSize,
    height: height * cellSize
  }

  const addToHistory = useCallback((newItems: StorageItem[]) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newItems])
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setItems(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setItems(history[historyIndex + 1])
    }
  }

  useEffect(() => {
    drawPlan()
    drawMinimap()
  }, [items, width, height, currentItem])

  const drawPlan = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, planDimensions.width , planDimensions.height )

    // Draw grid
    ctx.strokeStyle = '#ddd'
    for (let x = 0; x <= planDimensions.width; x += cellSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, planDimensions.height)
      ctx.stroke()
    }
    for (let y = 0; y <= planDimensions.height; y += cellSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(planDimensions.width, y)
      ctx.stroke()
    }

    // Draw items
    items.forEach(item => {
      ctx.fillStyle = item.color
      ctx.fillRect(item.x * cellSize, item.y * cellSize, item.width * cellSize, item.height * cellSize)
      ctx.strokeStyle = '#000'
      ctx.strokeRect(item.x * cellSize, item.y * cellSize, item.width * cellSize, item.height * cellSize)
      ctx.fillStyle = '#000'
      ctx.fillText(item.label, item.x * cellSize + 5, item.y * cellSize + 20)
    })

    // Draw current item (if any)
    if (currentItem) {
      ctx.fillStyle = `${currentItem.color}80`
      ctx.fillRect(currentItem.x * cellSize, currentItem.y * cellSize, currentItem.width * cellSize, currentItem.height * cellSize)
      ctx.strokeStyle = currentItem.color
      ctx.strokeRect(currentItem.x * cellSize, currentItem.y * cellSize, currentItem.width * cellSize, currentItem.height * cellSize)
    }

  }

  const drawMinimap = () => {
    const minimap = minimapRef.current
    if (!minimap) return

    const ctx = minimap.getContext('2d')
    if (!ctx) return

    const scale = 0.1
    ctx.clearRect(0, 0, minimap.width, minimap.height)

    // Draw items
    items.forEach(item => {
      ctx.fillStyle = item.color
      ctx.fillRect(item.x * cellSize * scale, item.y * cellSize * scale, item.width * cellSize * scale, item.height * cellSize * scale)
    })

    // Draw viewport
    ctx.strokeStyle = 'red'
    ctx.strokeRect(0, 0, planDimensions.width * scale, planDimensions.height * scale)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'add' || !currentItem) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = planDimensions.width / rect.width
    const scaleY = planDimensions.height / rect.height

    const x = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize )
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / cellSize)

    setCurrentItem(prev => prev ? { ...prev, x, y } : null)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = planDimensions.width / rect.width
    const scaleY = planDimensions.height / rect.height

    const clickX = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize)
    const clickY = Math.floor(((e.clientY - rect.top) * scaleY) / cellSize )

    if (mode === 'add' && currentItem) {
      if (
        clickX >= currentItem.x &&
        clickX < currentItem.x + currentItem.width &&
        clickY >= currentItem.y &&
        clickY < currentItem.y + currentItem.height &&
        clickX + currentItem.width <= width &&
        clickY + currentItem.height <= height
      ) {
        const newItem = {
          ...currentItem,
          id: Date.now().toString(),
        }
        const newItems = [...items, newItem]
        setItems(newItems)
        addToHistory(newItems)
        setCurrentItem(null)
      }
    } else if (mode === 'edit' || mode === 'delete') {
      const clickedItem = items.find(item =>
        clickX >= item.x &&
        clickX < item.x + item.width &&
        clickY >= item.y &&
        clickY < item.y + item.height
      )

      if (clickedItem) {
        if (mode === 'edit') {
          setEditingItem(clickedItem)
          setIsDialogOpen(true)
        } else if (mode === 'delete') {
          const newItems = items.filter(item => item.id !== clickedItem.id)
          setItems(newItems)
          addToHistory(newItems)
        }
      }
    }
  }

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    setCurrentItem({
      id: '',
      x: 0,
      y: 0,
      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      label: formData.get('label') as string,
      color: color,
    })
  }

  const handleEditItem = (newWidth: number, newHeight: number, newLabel: string) => {
    if (!editingItem) return

    const updatedItem: StorageItem = {
      ...editingItem,
      width: newWidth,
      height: newHeight,
      label: newLabel,
    }

    const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item)
    setItems(newItems)
    addToHistory(newItems)
    setEditingItem(null)
  }

  const handleDeleteItem = () => {
    if (!editingItem) return
    const newItems = items.filter(item => item.id !== editingItem.id)
    setItems(newItems)
    addToHistory(newItems)
    setEditingItem(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault()
        undo()
      } else if (e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
  }

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h2 className="text-2xl font-bold mb-4">Enhanced Storage Plan Designer - Map {mapId}</h2>
      <div className="flex space-x-4 mb-4">
        <div className="flex-grow">
          <canvas
            ref={canvasRef}
            width={planDimensions.width }
            height={planDimensions.height}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
        <div className="w-64 space-y-4">
          <ToggleGroup type="single" value={mode} onValueChange={(value: Mode) => setMode(value)}>
            <ToggleGroupItem value="add" aria-label="Add mode">
              <Plus className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="edit" aria-label="Edit mode">
              <Edit className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="delete" aria-label="Delete mode">
              <Trash2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="move" aria-label="Move mode">
              <Move className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="flex space-x-2">
            <Button onClick={undo} disabled={historyIndex <= 0}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" required />
            </div>
            <div>
              <Label htmlFor="width">Width (in cells)</Label>
              <Input id="width" name="width" type="number" required min="1" max={width} />
            </div>
            <div>
              <Label htmlFor="height">Height (in cells)</Label>
              <Input id="height" name="height" type="number" required min="1" max={height} />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <ColorPicker color={color} onChange={setColor} />
            </div>
            <Button type="submit" className="w-full">Add Item</Button>
          </form>
        
          <canvas
            ref={minimapRef}
            width={planDimensions.width * 0.1}
            height={planDimensions.height * 0.1}
            className="border border-gray-300"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Items:</h3>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex items-center space-x-2">
              <div className="w-4 h-4" style={{ backgroundColor: item.color }}></div>
              <span>{item.label} ({item.width}x{item.height})</span>
            </li>
          ))}
        </ul>
      </div>
      {editingItem && (
        <DimensionEditorDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialWidth={editingItem.width}
          initialHeight={editingItem.height}
          initialLabel={editingItem.label}
          onSave={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  )
}