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
import { Search } from "lucide-react";
import { CustomerDetailsFormComponent } from './customer-details-form';

interface Car {
  id: string;
  plate: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
      const response = await axios.get<Car[]>('http://localhost:5260/api/cars');
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

  const handleSaveNewCar = async (newCar: Omit<Car, 'id' | 'createdAt'>) => {
    try {
      const response = await axios.post<Car>('http://localhost:5260/api/cars', newCar);
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
    router.push(`/dashboard/${car.id}`);
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
        <div className="flex space-x-4">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Arama Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plaka">Plaka</SelectItem>
              <SelectItem value="musteri">Müşteri</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddNewCar}
          >
            + Yeni Araç
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plaka</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Müşteri</TableHead>
            <TableHead>İletişim</TableHead>
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
              <TableCell>
                <Button 
                  variant="secondary" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => handleInspect(car)}
                >
                  İncele
                </Button>
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