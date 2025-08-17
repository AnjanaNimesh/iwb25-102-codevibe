export interface BloodRequest {
  request_id: number
  hospital_id: number
  admission_number: string
  blood_group: string
  units_required: number
  request_date: string
  request_status: string
  notes?: string
}

export interface Donor {
  id: number
  name: string
  blood_group: string
  contact: string
  last_donation: string
  status: string
}

export interface Donation {
  donation_id: number;
  donor_id: number;
  donor_name: string;
  email?: string;
  blood_group: string;
  phone_number: string;
  donate_date: string;
  donate_status: string;
  last_donation_date?: string;
}
export interface BloodUnit {
  blood_group: string
  units: number
  status: string
}

export interface StockSummary {
  blood_group: string
  units: number
  percentage: number
}