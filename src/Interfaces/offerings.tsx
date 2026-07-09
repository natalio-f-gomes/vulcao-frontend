import { ImageMetadata } from "./global";

export type OfferingType =
  | "PRODUCT"
  | "TV_SHOW"
  | "MOVIE"
  | "BOOK"
  | "ELECTRONIC"
  | "MUSIC"
  | "WEARABLE";

export type Currency = "CVE";
//export type Currency = "CVE" | "USD" | "EUR";

export const CURRENCIES: string[] = ["CVE"];
//export const CURRENCIES: string[] = ["CVE", "USD", "EUR"];

export type UnitOfMeasurement =
  | "SINGULAR"
  | "CAIXA"
  | "PACOTE"
  | "DÚZIA"
  | "QUILOGRAMA"
  | "LIBRA"
  | "GALÃO"
  | "LITRO"
  | "MILILITRO"
  | "ONÇA"
  | "ONÇA_LÍQUIDA"
  | "GRAMA"
  | "TONELADA"
  | "QUARTO"
  | "PINTO"
  | "CHÁVENA"
  | "COLHER_DE_SOPA"
  | "COLHER_DE_CHÁ"
  | "PEDAÇO"
  | "UNIDADE"
  | "CONJUNTO"
  | "PAR"
  | "MOLHO"
  | "PACOTE_DE_CARTÃO"
  | "CAIXA_COMPLETA"
  | "SACO"
  | "SACA"
  | "BARRIL"
  | "LATA"
  | "GARRAFA"
  | "FRASCO"
  | "TUBO"
  | "TABULEIRO"
  | "GRADE"
  | "PALETE"
  | "ROLO"
  | "FATIA"
  | "BLOCO"
  | "BARRA"
  | "PORÇÃO"
  | "DOSE"
  | "RECIPIENTE"
  | "SAQUETA"
  | "CARTUCHO"
  | "TIRA";

export const UNIT_OF_MEASUREMENT_LIST: UnitOfMeasurement[] = [
  "SINGULAR",
  "CAIXA",
  "PACOTE",
  "DÚZIA",
  "QUILOGRAMA",
  "LIBRA",
  "GALÃO",
  "LITRO",
  "MILILITRO",
  "ONÇA",
  "ONÇA_LÍQUIDA",
  "GRAMA",
  "TONELADA",
  "QUARTO",
  "PINTO",
  "CHÁVENA",
  "COLHER_DE_SOPA",
  "COLHER_DE_CHÁ",
  "PEDAÇO",
  "UNIDADE",
  "CONJUNTO",
  "PAR",
  "MOLHO",
  "PACOTE_DE_CARTÃO",
  "CAIXA_COMPLETA",
  "SACO",
  "SACA",
  "BARRIL",
  "LATA",
  "GARRAFA",
  "FRASCO",
  "TUBO",
  "TABULEIRO",
  "GRADE",
  "PALETE",
  "ROLO",
  "FATIA",
  "BLOCO",
  "BARRA",
  "PORÇÃO",
  "DOSE",
  "RECIPIENTE",
  "SAQUETA",
  "CARTUCHO",
  "TIRA",
];

export type ProductType =
  // ===== FRESCOS E ALIMENTAÇÃO =====

  | "FRESCOS_E_HORTÍCOLAS"
  | "CARNES_E_AVES"
  | "PEIXARIA_E_MARISCO"
  | "LACTICÍNIOS"
  | "PRODUTOS_VEGETAIS"
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

  // ===== ESSENCIAIS DO DIA A DIA PARA A CASA =====
  | "LIMPEZA_DA_CASA"
  | "PRODUTOS_DE_PAPEL_E_PLÁSTICO"
  | "MATERIAL_DE_ESCRITÓRIO"

  // ===== HIGIENE PESSOAL E SAÚDE =====
  | "HIGIENE_PESSOAL"
  | "SAÚDE_E_BEM_ESTAR"

  // ===== BEBÉ E ANIMAIS DE ESTIMAÇÃO =====
  | "ARTIGOS_PARA_BEBÉ"
  | "ALIMENTAÇÃO_E_ACESSÓRIOS_PARA_ANIMAIS"

  // ===== CAIXA E SOUVENIRS / DIVERSOS =====
  | "REVISTAS"
  | "CARTÕES_PRESENTE"
  | "OUTROS";

export const PRODUCT_TYPE_LIST: ProductType[] = [
  "FRESCOS_E_HORTÍCOLAS",
  "CARNES_E_AVES",
  "PEIXARIA_E_MARISCO",
  "LACTICÍNIOS",
  "PRODUTOS_VEGETAIS",
  "PADARIA_E_PASTELARIA",
  "CONGELADOS",
  "CEREAIS_E_MASSAS",
  "CONSERVAS_E_FRASCOS",
  "ÓLEOS_E_VINAGRES",
  "ERVAS_E_ESPECIARIAS",
  "SNACKS_E_APERITIVOS",
  "DOCES_E_CHOCOLATES",
  "BEBIDAS",
  "REFEIÇÕES_PRONTAS_E_CHARCUTARIA",
  "LIMPEZA_DA_CASA",
  "PRODUTOS_DE_PAPEL_E_PLÁSTICO",
  "MATERIAL_DE_ESCRITÓRIO",
  "HIGIENE_PESSOAL",
  "SAÚDE_E_BEM_ESTAR",
  "ARTIGOS_PARA_BEBÉ",
  "ALIMENTAÇÃO_E_ACESSÓRIOS_PARA_ANIMAIS",
  "REVISTAS",
  "CARTÕES_PRESENTE",
  "OUTROS",
];

export interface BaseOfferingModel {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  price: number;
  stock: number;
  type: OfferingType;
  description: string;
  creatorId: string;
  businessId: string;
  updatedBy: string;
  currency: Currency;
  unit: UnitOfMeasurement;

  imgS3UrlKeys: string[];
  imagesMetadata: ImageMetadata[];
}

export interface ProductModel extends BaseOfferingModel {
  expirationDate: string;
  productType: ProductType;
}

export interface OfferingModel {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  price: number;
  stock: number;
  type: OfferingType;
  description: string;
  creatorId: string;
  businessId: string;
  updatedBy: string;
  currency: Currency;
  unit: UnitOfMeasurement;
  product: { expirationDate: string; productType: ProductType };

  imgS3UrlKeys: string[];
  imagesMetadata: ImageMetadata[];
}

export interface CartItem {
  id: string;
  offering: OfferingModel;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartModel {
  id: string;
  items: CartItem[];
  updatedAt?: string;
}
