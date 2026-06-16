
import { ImageMetadata } from "./ImageValidatorService";
import { OfferingType, OrderStatus } from "./categories";

export interface UserLoginModel{
  username: string,
  password: string
}


export interface UserRegistrationModel{
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string
}

export interface AddressModel{
    island:string;
    city:string;
    zone:string;
    street:string;
    postalCode:string;
}

export interface UserProfileModel{
    id:string;
    username:string;
    firstName:string;
    lastName:string;
    address:AddressModel;
    phoneNumber:string;
    email:string;
    createdAt:string;
    updatedAt:string;
}

export interface EmployerModel extends UserProfileModel{
  companiesRegistered: CompanyModel[];
  
}

export interface AddProductModel{
    name:string;
    productType: ProductType
    expirationDate:string;
    description:string;
    stock:number;
    unitType: UnitTypes
    pricePerUnit:number;
    companyId?: string;
    currency: Currency;
    creatorUsername: string;
    offeringType?: OfferingType;
    imagesMetadata?: ImageMetadata[],
}

export interface ProductModel extends AddProductModel{
    id?:string;
    creatorId?: string;
    updatedBy?: string;
    companyName?: string;
    createdAt?:string;
    updatedAt?:string;
    imgS3UrlKeys?: string[]
}



export interface ReviewModel{
  id: string;
  rating: number;
  reviewComment: string;
  companyRated: CompanyModel;
  personRatedId: string;
  ratedByUser: UserProfileModel;
  createdAt: string;
  updatedAt: string;
}



export type BusinessCategory =
  // ===== COMÉRCIO E RETALHO (Supermercados, Lojas e Eletrónica) =====
  | 'LOJA_DE_CONVENIÊNCIA'
  | 'SUPERMERCADO'
  | 'HIPERMERCADO'
  | 'GRANDES_ARMÁZENS'
  | 'CENTRO_COMERCIAL'
  | 'COMÉRCIO_ELETRÓNICO'
  | 'LOJA_DE_ELETRÓNICA_E_INFORMÁTICA'
  | 'FABRICANTE_DE_HARDWARE'

  // ===== LIVROS, ENTRETENIMENTO E MEDIA (Filmes, Séries e TV) =====
  | 'LIVRARIA_E_EDITORIA'
  | 'CINEMA'
  | 'PRODUTORA_DE_CINEMA_E_TELEVISÃO'
  | 'SERVIÇO_DE_STREAMING'
  | 'CANAIS_DE_TELEVISÃO_E_RÁDIO'
  | 'EMPRESA_DE_VIDEOJOGOS'

  // ===== OUTROS FORMATOS DE VENDA DE BENS =====
  | 'MERCADO_ABASTECEDOR'
  | 'LOJA_EM_SEGUNDA_MÃO'
  | 'OUTROS';


// Currency Type
export type Currency =      "CVE" 

// Product Category Type
export type ProductCategory = 
    | "FRESH_PRODUCE"
    | "MEAT_POULTRY"
    | "SEAFOOD"
    | "DAIRY_EGGS"
    | "PLANT_BASED"
    | "BAKERY"
    | "FROZEN"
    | "GRAINS_PASTA"
    | "LEGUMES"
    | "CANNED_JARRED"
    | "OILS_VINEGARS"
    | "BAKING"
    | "SPICES_HERBS"
    | "SNACKS"
    | "CANDY"
    | "CEREAL_BREAKFAST"
    | "BEVERAGES_NON_ALCOHOLIC"
    | "BEVERAGES_ALCOHOLIC"
    | "DELI_PREPARED"
    | "BABY_INFANT"
    | "HEALTH_NUTRITION"
    | "INTERNATIONAL"
    | "HOUSEHOLD"
    | "PERSONAL_CARE"
    | "PET"
    | "OTHER";

// Product Type (all products from the enum)
export type ProductType = | "FRESCOS_E_HORTÍCOLAS" // Frutas e legumes frescos (Produce)
  | "CARNES_E_AVES"
  | "PEIXARIA_E_MARISCO"
  | "LACTICÍNIOS"
  | "PRODUTOS_VEGETAIS" // Alternativas plant-based
  | "PADARIA_E_PASTELARIA"
  | "CONGELADOS"
  | "CEREAIS_E_MASSAS"
  | "CONSERVAS_E_FRASCOS"
  | "ÓLEOS_E_VINAGRES"
  | "ERVAS_E_ESPECIARIAS"
  | "SNACKS_E_APERITIVOS"
  | "DOCES_E_CHOCOLATES"
  | "BEBIDAS"
  | "REFEIÇÕES_PRONTAS_E_CHARCUTARIA"

  // --- ESSENCIAIS DO DIA A DIA PARA A CASA ---
  | "LIMPEZA_DA_CASA" // Detergente da loiça, detergente da roupa, etc.
  | "PRODUTOS_DE_PAPEL_E_PLÁSTICO" // Papel higiénico, rolos de cozinha, sacos do lixo
  | "MATERIAL_DE_ESCRITÓRIO" // Canetas, fita cola, artigos básicos de papelaria

  // --- HIGIENE PESSOAL E SAÚDE ---
  | "HIGIENE_PESSOAL" // Champô, pasta de dentes, desodorizante
  | "SAÚDE_E_BEM_ESTAR" // Medicamentos de venda livre (MNSRM), pensos rápidos

  // --- BEBÉ E ANIMAIS DE ESTIMAÇÃO ---
  | "ARTIGOS_PARA_BEBÉ" // Fraldas, toalhitas, comida de bebé
  | "ALIMENTAÇÃO_E_ACESSÓRIOS_PARA_ANIMAIS" // Comida para cão/gato e areia sanitária

  // --- CAIXA E SOUVENIRS / DIVERSOS ---
  | "REVISTAS" // Revistas expostas junto à caixa de pagamento
  | "CARTÕES_PRESENTE"
  | "OUTROS";




export type  CompanyStatuses =     "OPERATING"| "INACTIVE" | "CLOSED" |null


export interface CompanyModel extends CompanyRegistrationModel{
    id ?: string;
    createdAt: string;
    updatedAt: string;
    imgS3UrlKeys?: string[]
    orderList?: OrderModel[]
}

export interface CompanyRegistrationModel{
    name:string;
    category:BusinessCategory;
    taxIdNumber:string;
    description:string;
    phoneNumber:string;
    faxNumber:string;
    revenue:number;
    email:string;
    address:AddressModel;
    status:CompanyStatuses;
    creatorUsername:string;
    imagesMetadata?: ImageMetadata[]
}


export type Permissions = "ADD_PRODUCT"|  "UPDATE_PRODUCT"|  "DELETE_PRODUCT" | "ASSIGN_TASKS" | "VIEW_REPORTS" | "CREATE_TASK" | "DELETE_TASK";



export type UnitTypes = "LIQUID" | "SOLID" | "SINGULAR" | "BOX" |
 "PACK" | "DOZEN" | "KILOGRAM" | "POUND" | "GALLON" | "LITER" | 
 "MILLILITER" | "OUNCE" | "FLUID_OUNCE" | "GRAM" | "TON" | "QUART" |
  "PINT" | "CUP" | "TABLESPOON" | "TEASPOON" | "PIECE" | "UNIT" | "SET" |
   "PAIR" | "BUNDLE" | "CARTON" | "CASE" | "BAG" | "SACK" | "BARREL" | "CAN" 
   | "BOTTLE" | "JAR" | "TUBE" | "TRAY" | "CRATE" | "PALLET" | "ROLL" | "SLICE" 
   | "BLOCK" | "STICK" | "PORTION" | "SERVING" | "CONTAINER" | "PACKET" |
    "SLEEVE" | "STRIP" | "";

export interface StaffModel{
    id? : string;
    username : string;
    firstName: string,
    lastName: string;
    email : string
    phoneNumber : string;
    hiredAt : string;
    salary : number;
    jobTitle: string;
    department: string,
    companyId : string;
    assignedPermissions: Permissions[];
    address: AddressModel;
    
}
export interface RegisterStaffModel extends StaffModel{
  password: string;
}

export interface CompanyStats {
  staffList: number;
  products:  number;
}

// The full data shape the Company Dashboard page works with
export interface CompanyDashboardData {
  company: CompanyModel;
  stats:   CompanyStats;
  staffList: StaffModel[];
}



export interface CompanyContact{
      phoneNumber:string,
      email:string,
      faxNumber:string,
      taxIdNumber:string
}

export interface CompanyAboutInfo{
  description: string,
  status: CompanyStatuses
}

export interface OfferingImageUploadRequest {
  offeringId: string,
  offeringType: OfferingType
  s3PresignKeys: string[]
}

export interface CompanyImageUploadRequest {
  companyId: string,
  s3PresignKeys: string[]
}

export interface PlaceOrderModel{
  userId: string,
  cartItems: CartItem[],
  orderItems?: OrderItemModel[],
  status: OrderStatus,
  totalCost: number;
  trackId: string;
  companyId: string,
  note: string
}


export interface OrderModel extends PlaceOrderModel{
  id: string,
  createdAt: string,
  updatedAt: string
}

export interface CartItem {
  id?: string;
  quantity: number;
  companyId?: string;
  itemType?: string;
}

export interface OrderItemModel {
  id?: string;
  createdAt?: string;
  updatedAt: string;
    companyId: string,
  userId: string,
  itemId: string,
  itemName: string,
  quantity: number,
  priceAtPurchase: number
  itemType: OfferingType
}
