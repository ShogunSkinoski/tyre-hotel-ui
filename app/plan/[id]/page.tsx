'use client'

import { useParams } from 'next/navigation';
import { StoragePlanComponent } from "@/components/storage-plan";
import { useHeader } from "@/contexts/header-context";
import { useEffect, useState } from "react";

export default function StoragePlanPage() {
  const { id } = useParams();
  const { setHeaderText } = useHeader();
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setHeaderText('Storage Plan');
    // In a real application, you would fetch the map details from your database here
    // For now, we'll use some dummy data
    setMapDimensions({ width: 16, height: 12 });
  }, [setHeaderText]);

  if (mapDimensions.width === 0 || mapDimensions.height === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <StoragePlanComponent mapId={id as string} width={mapDimensions.width} height={mapDimensions.height} />
    </div>
  );
}