'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, FileText, Mail, ChevronLeft, ChevronRight, User, Calendar, Phone, Car as CarIcon, Plus, Trash2, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TyreDetailsForm } from "./tyre-details-form"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, Image, pdf } from '@react-pdf/renderer'
import { TyrePackQRDialog } from './qr-code-dialog'
import QRCode from 'qrcode'

// Register a font with good Turkish character support
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjB_mQ.woff'
})

interface Car {
  id: string
  plate: string
  createdAt: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

interface TyrePack {
  id: string
  carId: string
  location: string
  brand: string
  size: string
  season: string
  count: number
}

interface TyrePDFContentProps {
  car: Car
  tyrePacks: TyrePack[]
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Open Sans',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333333',
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  value: {
    fontSize: 12,
    color: '#333333',
  },
  tyrePackContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tyrePackTitle: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  accentColor: {
    color: '#3B82F6',
  },
  qrCode: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
})

export const TyrePDFContent: React.FC<TyrePDFContentProps> = ({ car, tyrePacks }) => {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: Record<string, string> = {}
      
      for (const pack of tyrePacks) {
        const qrData = JSON.stringify({
          location: pack.location,
          brand: pack.brand,
          size: pack.size,
          season: pack.season,
          count: pack.count,
          car: {
            plate: car.plate,
            customer: car.customerName
          }
        })
        
        try {
          const qrDataUrl = await QRCode.toDataURL(qrData)
          codes[pack.location] = qrDataUrl
        } catch (err) {
          console.error('QR code generation failed:', err)
        }
      }
      
      setQrCodes(codes)
    }

    generateQRCodes()
  }, [tyrePacks, car])

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Araç Lastik Bilgileri</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Araç Detayları</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Plaka Numarası:</Text>
            <Text style={[styles.value, styles.accentColor]}>{car.plate}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Olusturulma Tarihi:</Text>
            <Text style={styles.value}>{new Date(car.createdAt).toLocaleString('tr-TR')}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Müsteri Adı:</Text>
            <Text style={styles.value}>{car.customerName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Müsteri E-postası:</Text>
            <Text style={styles.value}>{car.customerEmail}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Müsteri Telefonu:</Text>
            <Text style={styles.value}>{car.customerPhone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lastik Paketleri</Text>
          {tyrePacks.map((tyrePack, index) => (
            <View key={tyrePack.id} style={styles.tyrePackContainer}>
              <Text style={styles.tyrePackTitle}>Lastik Paketi {index + 1}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Konum:</Text>
                <Text style={styles.value}>{tyrePack.location}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Marka:</Text>
                <Text style={styles.value}>{tyrePack.brand}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Ebat:</Text>
                <Text style={styles.value}>{tyrePack.size}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Sezon:</Text>
                <Text style={styles.value}>{tyrePack.season}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Adet:</Text>
                <Text style={[styles.value, styles.accentColor]}>{tyrePack.count}</Text>
              </View>
              {qrCodes[tyrePack.location] && (
                <Image
                  src={qrCodes[tyrePack.location]}
                  style={styles.qrCode}
                />
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

interface TireListProps {
  tyrePacks: TyrePack[];
  car: Car;
  onTyrePackAdded: () => void;
}

function TireList({ tyrePacks: initialTyrePacks, car, onTyrePackAdded }: TireListProps) {
  const [localTyrePacks, setLocalTyrePacks] = useState(initialTyrePacks);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTires = localTyrePacks.filter(tire => 
    tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTires.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTires.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleDeleteTyre = async (tyreId: string) => {
    if (window.confirm('Bu lastiği silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/tyrepacks/${tyreId}`);
        setLocalTyrePacks(localTyrePacks.filter(t => t.id !== tyreId));
      } catch (error) {
        console.error("Failed to delete tyre pack:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lastikler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input 
              type="text" 
              placeholder="Marka, Ebat veya Konum" 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex space-x-4">
            <PDFDownloadLink
              document={<TyrePDFContent car={car} tyrePacks={localTyrePacks} />}
              fileName={`arac_${car.plate}_lastikler.pdf`}
            >
              {({ blob, url, loading, error }) => (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {loading ? 'PDF Oluşturuluyor...' : 'PDF İndir'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={async () => {
                try {
                  const pdfBlob = await pdf(<TyrePDFContent car={car} tyrePacks={localTyrePacks} />).toBlob();
                  const file = new File([pdfBlob], `arac_${car.plate}_lastikler.pdf`, { type: 'application/pdf' });
                  
                  if (navigator.share) {
                    await navigator.share({
                      files: [file],
                      title: `${car.plate} Lastik Bilgileri`,
                      text: 'Araç lastik bilgileri ektedir.'
                    });
                  } else {
                    
                    const reader = new FileReader();
                    reader.onload = () => {
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Araç lastik bilgileri ektedir.')}&phone=${encodeURIComponent(car.customerPhone)}`;
                      window.open(whatsappUrl, '_blank');
                    };
                    reader.readAsDataURL(file);
                  }
                } catch (error) {
                  console.error('Sharing failed:', error);
                }
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Whatsapp'a Yönlendir
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Konum</TableHead>
              <TableHead>Lastik Markası</TableHead>
              <TableHead>Ebatı</TableHead>
              <TableHead>Mevsimi</TableHead>
              <TableHead>Adeti</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((tire) => (
              <TableRow key={tire.id}>
                <TableCell>{tire.location}</TableCell>
                <TableCell>{tire.brand}</TableCell>
                <TableCell>{tire.size}</TableCell>
                <TableCell>{tire.season}</TableCell>
                <TableCell>{tire.count}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <TyrePackQRDialog 
                      tyrePack={{
                        ...tire,
                        car: {
                          plate: car.plate,
                          customerName: car.customerName
                        }
                      }} 
                    />
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteTyre(tire.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <span>
            Sayfa {currentPage} / {totalPages}
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CarDetailsComponentProps {
  car: Car;
  tyrePacks: TyrePack[];
}

export function CarDetailsComponent({ car, tyrePacks }: CarDetailsComponentProps) {
  const [showForm, setShowForm] = useState(false)
  const [localTyrePacks, setLocalTyrePacks] = useState(tyrePacks)

  const handleSaveNewTyre = async (newTyre: Omit<TyrePack, 'id' | 'carId'>) => {
    try {
      const response = await axios.post<TyrePack>(
        `/api/tyrepacks/add-to-car/${car.id}`, 
        newTyre
      );
      setLocalTyrePacks([...localTyrePacks, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add new tyre pack:", error);
    }
  };

  const handleCancelNewTyre = () => {
    setShowForm(false)
  }

  if (!localTyrePacks) {
    return <div>Lastik verisi bulunamadı.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Müşteri Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-semibold">İsim:</span>
              <span>{car.customerName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CarIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Plaka:</span>
              <span>{car.plate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-semibold">Telefon Numarası:</span>
              <span>{car.customerPhone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">Tarih:</span>
              <span>{new Date(car.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Lastik Ekle  
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <TireList tyrePacks={localTyrePacks} car={car} onTyrePackAdded={() => {}} />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TyreDetailsForm
            onSave={handleSaveNewTyre}
            onCancel={handleCancelNewTyre}
          />
        </div>
      )}
    </div>
  )
}