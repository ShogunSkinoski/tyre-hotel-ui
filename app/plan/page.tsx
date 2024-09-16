'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useHeader } from "@/contexts/header-context";

interface StorageMap {
  id: string;
  name: string;
  width: number;
  height: number;
}

export default function StorageMapsPage() {
  const [maps, setMaps] = useState<StorageMap[]>([]);  // This would typically come from your database
  const [showNewMapForm, setShowNewMapForm] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newMapWidth, setNewMapWidth] = useState('');
  const [newMapHeight, setNewMapHeight] = useState('');
  const router = useRouter();
  const { setHeaderText } = useHeader();

  React.useEffect(() => {
    setHeaderText('Storage Maps');
  }, [setHeaderText]);

  const handleCreateNewMap = (e: React.FormEvent) => {
    e.preventDefault();
    const newMap: StorageMap = {
      id: Date.now().toString(),
      name: newMapName,
      width: parseInt(newMapWidth),
      height: parseInt(newMapHeight)
    };
    setMaps([...maps, newMap]);
    setShowNewMapForm(false);
    // Here you would typically save the new map to your database
    router.push(`/plan/${newMap.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Storage Maps</h1>
        <Button onClick={() => setShowNewMapForm(true)}>Create New Map</Button>
      </div>

      {showNewMapForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Storage Map</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNewMap} className="space-y-4">
              <div>
                <Label htmlFor="mapName">Map Name</Label>
                <Input
                  id="mapName"
                  value={newMapName}
                  onChange={(e) => setNewMapName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mapWidth">Width (in cells)</Label>
                <Input
                  id="mapWidth"
                  type="number"
                  value={newMapWidth}
                  onChange={(e) => setNewMapWidth(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="mapHeight">Height (in cells)</Label>
                <Input
                  id="mapHeight"
                  type="number"
                  value={newMapHeight}
                  onChange={(e) => setNewMapHeight(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <Button type="submit">Create Map</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maps.map((map) => (
          <Card key={map.id} className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => router.push(`/plan/${map.id}`)}>
            <CardHeader>
              <CardTitle>{map.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dimensions: {map.width} x {map.height}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}