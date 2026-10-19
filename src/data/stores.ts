/** PLACEHOLDER store list — replace with the real showroom directory. */
export interface Showroom {
  id: string;
  city: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
}

export const showrooms: Showroom[] = [
  { id: 's1', city: 'Mumbai', name: 'Indriya · Mumbai', address: 'Sample address, Bandra West, Mumbai', hours: '11:00 – 20:00', phone: '+91 00000 00001' },
  { id: 's2', city: 'Mumbai', name: 'Indriya · Andheri', address: 'Sample address, Andheri East, Mumbai', hours: '11:00 – 20:00', phone: '+91 00000 00002' },
  { id: 's3', city: 'Delhi', name: 'Indriya · South Ex', address: 'Sample address, South Extension, New Delhi', hours: '11:00 – 20:30', phone: '+91 00000 00003' },
  { id: 's4', city: 'Bengaluru', name: 'Indriya · Indiranagar', address: 'Sample address, Indiranagar, Bengaluru', hours: '10:30 – 20:00', phone: '+91 00000 00004' },
  { id: 's5', city: 'Hyderabad', name: 'Indriya · Banjara Hills', address: 'Sample address, Banjara Hills, Hyderabad', hours: '10:30 – 20:00', phone: '+91 00000 00005' },
  { id: 's6', city: 'Ahmedabad', name: 'Indriya · CG Road', address: 'Sample address, CG Road, Ahmedabad', hours: '11:00 – 20:00', phone: '+91 00000 00006' },
];
