import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trash2, Plus } from "lucide-react";
import { CustomerDetailsFormComponent } from './customer-details-form';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface Car {
  id: string;
  plate: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  brand: string;
}

export function CarListComponent() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('plaka');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Car[]>('/api/cars');
      setCars(response.data);
      setLoading(false);
    } catch (err) {
      setError('Araçlar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleAddNewCar = () => {
    setShowForm(true);
  };

  const handleSaveNewCar = async (newCar: Omit<Car, 'id' | 'createdAt' >) => {
    try {
      const response = await axios.post<Car>('/api/cars', {
        ...newCar,
      });
      setCars([...cars, response.data]);
      setShowForm(false);
    } catch (err) {
      setError('Yeni araç eklenirken bir hata oluştu');
    }
  };

  const handleCancelNewCar = () => {
    setShowForm(false);
  };

  const handleInspect = (car: Car) => {
    router.push(`/cars/${car.id}`);
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/cars/${car.id}`);
        setCars(cars.filter(c => c.id !== car.id));
      } catch (err) {
        setError('Araç silinirken bir hata oluştu');
      }
    }
  };

  const filteredCars = cars.filter(car => {
    if (searchType === 'plaka') {
      return car.plate.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === 'musteri') {
      return car.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-64">
              <Input 
                type="text" 
                placeholder="Ara" 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>Araç veya müşteri ara</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddNewCar}
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Araç
            </Button>
          </TooltipTrigger>
          <TooltipContent>Yeni araç ekle</TooltipContent>
        </Tooltip>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plaka</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Müşteri</TableHead>
            <TableHead>İletişim</TableHead>
            <TableHead>Araç Bilgileri</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.plate}</TableCell>
              <TableCell>{new Date(car.createdAt).toLocaleDateString('tr-TR')}</TableCell>
              <TableCell>{car.customerName}</TableCell>
              <TableCell>{car.customerPhone}</TableCell>
              <TableCell>{car.brand}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleInspect(car)}
                  >
                    İncele
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDelete(car)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CustomerDetailsFormComponent
            onSave={handleSaveNewCar}
            onCancel={handleCancelNewCar}
          />
        </div>
      )}
    </div>
  );
}