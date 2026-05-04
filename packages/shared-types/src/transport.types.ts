export interface Vehicle {
  id: string;
  registrationNumber: string;
  capacity: number;
  driverName?: string | null;
  driverPhone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  name: string;
  source: string;
  destination: string;
  stops: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransportAllocation {
  id: string;
  studentId: string;
  routeId: string;
  vehicleId: string;
  pickupPoint: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
