// DTOs et types exacts selon le contrat
export interface RegisterRequestDTO { firstname: string; lastname: string; email: string; password: string; role?: 'ROLE_TENANT'|'ROLE_OWNER'|'ROLE_ADMIN'; walletAddress?: string; }
export interface LoginRequestDTO { email: string; password: string; }
export interface AuthResponseDTO { token: string; }
export interface UserResponseDTO { id: number; firstname: string; lastname: string; email: string; role: 'ROLE_TENANT'|'ROLE_OWNER'|'ROLE_ADMIN'; walletAddress?: string; }
export interface ImageDTO { id: number; url: string; }
export interface PropertyRequestDTO { title: string; description: string; address: string; latitude: number; longitude: number; pricePerNight: number; imageUrls: string[]; }
export interface PropertyResponseDTO { id: number; title: string; description: string; address: string; latitude: number; longitude: number; pricePerNight: number; status: 'AVAILABLE'|'RENTED'|'PENDING_VALIDATION'; owner: UserResponseDTO; images: ImageDTO[]; }
export interface RentalRequestDTO { propertyId: number; startDate: string; endDate: string; }
export interface RentalResponseDTO { id: number; startDate: string; endDate: string; totalPrice: number; status: 'PENDING_CONFIRMATION'|'CONFIRMED'|'COMPLETED'|'CANCELLED'; smartContractAddress?: string|null; property: PropertyResponseDTO; renter: UserResponseDTO; }

export type Role = UserResponseDTO['role'];
export type PropertyStatus = PropertyResponseDTO['status'];
export type RentalStatus = RentalResponseDTO['status'];

