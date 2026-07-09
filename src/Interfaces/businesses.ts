import { AddressModel, ImageMetadata } from "./global";

export interface BusinessModel extends BusinessRegistrationModel {
  id?: string;
  createdAt: string;
  updatedAt: string;
  imgS3UrlKeys?: string[];
}

export interface BusinessRegistrationModel {
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  type: BusinessType;
  revenue: number;
  imagesMetadata: ImageMetadata[];
  creatorId: string;
  address: AddressModel;
  weeklySchedule: WeeklySchedule | null;
  status: BusinessStatus;
}

export type BusinessType =
  | "LOJA_DE_CONVENIÊNCIA"
  | "SUPERMERCADO"
  | "HIPERMERCADO"
  | "GRANDES_ARMÁZENS"
  | "CENTRO_COMERCIAL"
  | "COMÉRCIO_ELETRÓNICO"
  | "LOJA_DE_ELETRÓNICA_E_INFORMÁTICA"
  | "FABRICANTE_DE_HARDWARE"
  | "LIVRARIA_E_EDITORIA"
  | "CINEMA"
  | "PRODUTORA_DE_CINEMA_E_TELEVISÃO"
  | "SERVIÇO_DE_STREAMING"
  | "CANAIS_DE_TELEVISÃO_E_RÁDIO"
  | "EMPRESA_DE_VIDEOJOGOS"
  | "MERCADO_ABASTECEDOR"
  | "LOJA_EM_SEGUNDA_MÃO"
  | "RESTAURANTE"
  | "OUTROS";

export const BUSINESS_TYPE: string[] = [
  // ===== COMÉRCIO E RETALHO (Supermercados, Lojas e Eletrónica) =====
  "LOJA_DE_CONVENIÊNCIA",
  "SUPERMERCADO",
  "HIPERMERCADO",
  "GRANDES_ARMÁZENS",
  "CENTRO_COMERCIAL",
  "COMÉRCIO_ELETRÓNICO",
  "LOJA_DE_ELETRÓNICA_E_INFORMÁTICA",
  "FABRICANTE_DE_HARDWARE",

  // ===== LIVROS, ENTRETENIMENTO E MEDIA (Filmes, Séries e TV) =====
  "LIVRARIA_E_EDITORIA",
  "CINEMA",
  "PRODUTORA_DE_CINEMA_E_TELEVISÃO",
  "SERVIÇO_DE_STREAMING",
  "CANAIS_DE_TELEVISÃO_E_RÁDIO",
  "EMPRESA_DE_VIDEOJOGOS",

  // ===== OUTROS FORMATOS DE VENDA DE BENS =====
  "MERCADO_ABASTECEDOR",
  "LOJA_EM_SEGUNDA_MÃO",
  "OUTROS",
];

export type WeekDays =
  | "SEGUNDA_FEIRA"
  | "TERÇA_FEIRA"
  | "QUARTA_FEIRA"
  | "QUINTA_FEIRA"
  | "SEXTA_FEIRA"
  | "SABADO"
  | "DOMINGO";

export interface TimeRange {
  start: string;
  end: string;
  isClosed: boolean;
}

export interface WeeklySchedule {
  daySchedule: Record<WeekDays, TimeRange>;
  open247: boolean;
}

export type BusinessStatus = "OPERACIONAL" | "INATIVO" | "FECHADO";

export interface BusinessStats {
  products: number;
}

// The full data shape the Company Dashboard page works with
export interface BusinessDasgboard {
  business: BusinessModel;
  stats: BusinessStats;
  //staffList: StaffModel[];
}

export interface BusinessContact {
  phoneNumber: string;
  email: string;
}

export interface BusinessAboutInfo {
  description: string;
  status: BusinessStatus;
  name: string;
  type: BusinessType;
}
