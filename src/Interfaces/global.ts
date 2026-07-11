import { BaseOfferingModel } from "./offerings";

export const COMPANY_NAME = "Vulcão";

export type USER_TYPE = "CLIENT" | "EMPLOYER" | "STAFF";
export type ENTITY_TYPE = USER_TYPE | "BUSINESS" | "PRODUCT" | "OFFERING";

export interface AddressModel {
  country: Country;
  state: string;
  island: string;
  city: string;
  zone: string;
  postalCode: string;
  street: string;
}

export const COUNTRIES = [
  "AFGHANISTAN",
  "ALBANIA",
  "ALGERIA",
  "ANDORRA",
  "ANGOLA",
  "ANTIGUA_AND_BARBUDA",
  "ARGENTINA",
  "ARMENIA",
  "AUSTRALIA",
  "AUSTRIA",
  "AZERBAIJAN",
  "BAHAMAS",
  "BAHRAIN",
  "BANGLADESH",
  "BARBADOS",
  "BELARUS",
  "BELGIUM",
  "BELIZE",
  "BENIN",
  "BHUTAN",
  "BOLIVIA",
  "BOSNIA_AND_HERZEGOVINA",
  "BOTSWANA",
  "BRAZIL",
  "BRUNEI",
  "BULGARIA",
  "BURKINA_FASO",
  "BURUNDI",
  "CABO_VERDE",
  "CAMBODIA",
  "CAMEROON",
  "CANADA",
  "CENTRAL_AFRICAN_REPUBLIC",
  "CHAD",
  "CHILE",
  "CHINA",
  "COLOMBIA",
  "COMOROS",
  "CONGO",
  "COSTA_RICA",
  "CROATIA",
  "CUBA",
  "CYPRUS",
  "CZECHIA",
  "DENMARK",
  "DJIBOUTI",
  "DOMINICA",
  "DOMINICAN_REPUBLIC",
  "ECUADOR",
  "EGYPT",
  "EL_SALVADOR",
  "EQUATORIAL_GUINEA",
  "ERITREA",
  "ESTONIA",
  "ESWATINI",
  "ETHIOPIA",
  "FIJI",
  "FINLAND",
  "FRANCE",
  "GABON",
  "GAMBIA",
  "GEORGIA",
  "GERMANY",
  "GHANA",
  "GREECE",
  "GRENADA",
  "GUATEMALA",
  "GUINEA",
  "GUINEA_BISSAU",
  "GUYANA",
  "HAITI",
  "HONDURAS",
  "HUNGARY",
  "ICELAND",
  "INDIA",
  "INDONESIA",
  "IRAN",
  "IRAQ",
  "IRELAND",
  "ISRAEL",
  "ITALY",
  "IVORY_COAST",
  "JAMAICA",
  "JAPAN",
  "JORDAN",
  "KAZAKHSTAN",
  "KENYA",
  "KIRIBATI",
  "KOREA_NORTH",
  "KOREA_SOUTH",
  "KUWAIT",
  "KYRGYZSTAN",
  "LAOS",
  "LATVIA",
  "LEBANON",
  "LESOTHO",
  "LIBERIA",
  "LIBYA",
  "LIECHTENSTEIN",
  "LITHUANIA",
  "LUXEMBOURG",
  "MADAGASCAR",
  "MALAWI",
  "MALAYSIA",
  "MALDIVES",
  "MALI",
  "MALTA",
  "MARSHALL_ISLANDS",
  "MAURITANIA",
  "MAURITIUS",
  "MEXICO",
  "MICRONESIA",
  "MOLDOVA",
  "MONACO",
  "MONGOLIA",
  "MONTENEGRO",
  "MOROCCO",
  "MOZAMBIQUE",
  "MYANMAR",
  "NAMIBIA",
  "NAURU",
  "NEPAL",
  "NETHERLANDS",
  "NEW_ZEALAND",
  "NICARAGUA",
  "NIGER",
  "NIGERIA",
  "NORTH_MACEDONIA",
  "NORWAY",
  "OMAN",
  "PAKISTAN",
  "PALAU",
  "PALESTINE",
  "PANAMA",
  "PAPUA_NEW_GUINEA",
  "PARAGUAY",
  "PERU",
  "PHILIPPINES",
  "POLAND",
  "PORTUGAL",
  "QATAR",
  "ROMANIA",
  "RUSSIA",
  "RWANDA",
  "SAINT_KITTS_AND_NEVIS",
  "SAINT_LUCIA",
  "SAINT_VINCENT_AND_THE_GRENADINES",
  "SAMOA",
  "SAN_MARINO",
  "SAO_TOME_AND_PRINCIPE",
  "SAUDI_ARABIA",
  "SENEGAL",
  "SERBIA",
  "SEYCHELLES",
  "SIERRA_LEONE",
  "SINGAPORE",
  "SLOVAKIA",
  "SLOVENIA",
  "SOLOMON_ISLANDS",
  "SOMALIA",
  "SOUTH_AFRICA",
  "SOUTH_SUDAN",
  "SPAIN",
  "SRI_LANKA",
  "SUDAN",
  "SURINAME",
  "SWEDEN",
  "SWITZERLAND",
  "SYRIA",
  "TAIWAN",
  "TAJIKISTAN",
  "TANZANIA",
  "THAILAND",
  "TIMOR_LESTE",
  "TOGO",
  "TONGA",
  "TRINIDAD_AND_TOBAGO",
  "TUNISIA",
  "TURKEY",
  "TURKMENISTAN",
  "TUVALU",
  "UGANDA",
  "UKRAINE",
  "UNITED_ARAB_EMIRATES",
  "UNITED_KINGDOM",
  "UNITED_STATES",
  "URUGUAY",
  "UZBEKISTAN",
  "VANUATU",
  "VATICAN_CITY",
  "VENEZUELA",
  "VIETNAM",
  "YEMEN",
  "ZAMBIA",
  "ZIMBABWE",
] as const;

export type Country =
  | "AFGHANISTAN"
  | "ALBANIA"
  | "ALGERIA"
  | "ANDORRA"
  | "ANGOLA"
  | "ANTIGUA_AND_BARBUDA"
  | "ARGENTINA"
  | "ARMENIA"
  | "AUSTRALIA"
  | "AUSTRIA"
  | "AZERBAIJAN"
  | "BAHAMAS"
  | "BAHRAIN"
  | "BANGLADESH"
  | "BARBADOS"
  | "BELARUS"
  | "BELGIUM"
  | "BELIZE"
  | "BENIN"
  | "BHUTAN"
  | "BOLIVIA"
  | "BOSNIA_AND_HERZEGOVINA"
  | "BOTSWANA"
  | "BRAZIL"
  | "BRUNEI"
  | "BULGARIA"
  | "BURKINA_FASO"
  | "BURUNDI"
  | "CABO_VERDE"
  | "CAMBODIA"
  | "CAMEROON"
  | "CANADA"
  | "CENTRAL_AFRICAN_REPUBLIC"
  | "CHAD"
  | "CHILE"
  | "CHINA"
  | "COLOMBIA"
  | "COMOROS"
  | "CONGO"
  | "COSTA_RICA"
  | "CROATIA"
  | "CUBA"
  | "CYPRUS"
  | "CZECHIA"
  | "DENMARK"
  | "DJIBOUTI"
  | "DOMINICA"
  | "DOMINICAN_REPUBLIC"
  | "ECUADOR"
  | "EGYPT"
  | "EL_SALVADOR"
  | "EQUATORIAL_GUINEA"
  | "ERITREA"
  | "ESTONIA"
  | "ESWATINI"
  | "ETHIOPIA"
  | "FIJI"
  | "FINLAND"
  | "FRANCE"
  | "GABON"
  | "GAMBIA"
  | "GEORGIA"
  | "GERMANY"
  | "GHANA"
  | "GREECE"
  | "GRENADA"
  | "GUATEMALA"
  | "GUINEA"
  | "GUINEA_BISSAU"
  | "GUYANA"
  | "HAITI"
  | "HONDURAS"
  | "HUNGARY"
  | "ICELAND"
  | "INDIA"
  | "INDONESIA"
  | "IRAN"
  | "IRAQ"
  | "IRELAND"
  | "ISRAEL"
  | "ITALY"
  | "IVORY_COAST"
  | "JAMAICA"
  | "JAPAN"
  | "JORDAN"
  | "KAZAKHSTAN"
  | "KENYA"
  | "KIRIBATI"
  | "KOREA_NORTH"
  | "KOREA_SOUTH"
  | "KUWAIT"
  | "KYRGYZSTAN"
  | "LAOS"
  | "LATVIA"
  | "LEBANON"
  | "LESOTHO"
  | "LIBERIA"
  | "LIBYA"
  | "LIECHTENSTEIN"
  | "LITHUANIA"
  | "LUXEMBOURG"
  | "MADAGASCAR"
  | "MALAWI"
  | "MALAYSIA"
  | "MALDIVES"
  | "MALI"
  | "MALTA"
  | "MARSHALL_ISLANDS"
  | "MAURITANIA"
  | "MAURITIUS"
  | "MEXICO"
  | "MICRONESIA"
  | "MOLDOVA"
  | "MONACO"
  | "MONGOLIA"
  | "MONTENEGRO"
  | "MOROCCO"
  | "MOZAMBIQUE"
  | "MYANMAR"
  | "NAMIBIA"
  | "NAURU"
  | "NEPAL"
  | "NETHERLANDS"
  | "NEW_ZEALAND"
  | "NICARAGUA"
  | "NIGER"
  | "NIGERIA"
  | "NORTH_MACEDONIA"
  | "NORWAY"
  | "OMAN"
  | "PAKISTAN"
  | "PALAU"
  | "PALESTINE"
  | "PANAMA"
  | "PAPUA_NEW_GUINEA"
  | "PARAGUAY"
  | "PERU"
  | "PHILIPPINES"
  | "POLAND"
  | "PORTUGAL"
  | "QATAR"
  | "ROMANIA"
  | "RUSSIA"
  | "RWANDA"
  | "SAINT_KITTS_AND_NEVIS"
  | "SAINT_LUCIA"
  | "SAINT_VINCENT_AND_THE_GRENADINES"
  | "SAMOA"
  | "SAN_MARINO"
  | "SAO_TOME_AND_PRINCIPE"
  | "SAUDI_ARABIA"
  | "SENEGAL"
  | "SERBIA"
  | "SEYCHELLES"
  | "SIERRA_LEONE"
  | "SINGAPORE"
  | "SLOVAKIA"
  | "SLOVENIA"
  | "SOLOMON_ISLANDS"
  | "SOMALIA"
  | "SOUTH_AFRICA"
  | "SOUTH_SUDAN"
  | "SPAIN"
  | "SRI_LANKA"
  | "SUDAN"
  | "SURINAME"
  | "SWEDEN"
  | "SWITZERLAND"
  | "SYRIA"
  | "TAIWAN"
  | "TAJIKISTAN"
  | "TANZANIA"
  | "THAILAND"
  | "TIMOR_LESTE"
  | "TOGO"
  | "TONGA"
  | "TRINIDAD_AND_TOBAGO"
  | "TUNISIA"
  | "TURKEY"
  | "TURKMENISTAN"
  | "TUVALU"
  | "UGANDA"
  | "UKRAINE"
  | "UNITED_ARAB_EMIRATES"
  | "UNITED_KINGDOM"
  | "UNITED_STATES"
  | "URUGUAY"
  | "UZBEKISTAN"
  | "VANUATU"
  | "VATICAN_CITY"
  | "VENEZUELA"
  | "VIETNAM"
  | "YEMEN"
  | "ZAMBIA"
  | "ZIMBABWE";

export type ISLAND =
  | "SANTO_ANTÃO"
  | "SÃO_VICENTE"
  | "SÃO_NICOLAU"
  | "SAL"
  | "BOA_VISTA"
  | "MAIO"
  | "SANTIAGO"
  | "FOGO"
  | "BRAVA";

export const ISLANDS = [
  "SANTO_ANTÃO",
  "SÃO_VICENTE",
  "SÃO_NICOLAU",
  "SAL",
  "BOA_VISTA",
  "MAIO",
  "SANTIAGO",
  "FOGO",
  "BRAVA",
];

export interface PasswordRequest {
  password: string;
}

export interface ImageMetadata {
  name: string;
  byteSize: number;
  extension: string; // NOTE: holds the MIME type (e.g. "image/png"), not "png"
}

export interface ImageUploadRequest {
  entityId: string;
  entityType: ENTITY_TYPE;
  s3PresignKeys: string[];
}

export interface CartItem {
  offering: BaseOfferingModel;
  quantity: number;
  createdAt?: string;
}

export interface CartModel {
  id: string;
  items: CartItem[];
}

export interface OrderItemRequest {
  id: string;
  quantity: number;
  name: string;
  businessId: string;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  note: string;
}
export type OrderItem = CartItem; //since the order item and cart item is the same on backend, there is no need for duplicate fields

export interface OrderModel {
  items: OrderItem[];
  clientId: string;
  trackId: string;
  businessId: string;
  totalCost: number;
  note: string;
  status: OrderStatus;
  canceled: boolean;
}

export const OrderStatusList = [
  "PENDENTE",
  "PROCESSANDO",
  "CANCELADO",
  "CONCLUÍDO",
  "RECEBIDO",
  "ENVIADO",
];

export type OrderStatus =
  | "PENDENTE"
  | "PROCESSANDO"
  | "CANCELADO"
  | "CONCLUÍDO"
  | "RECEBIDO"
  | "ENVIADO";

export type FeedBackType =
  | "LOJA_COMPRAS"
  | "CARRINHO_ENCOMENDAS"
  | "PERFIL"
  | "PAINEL_DE_CONTROLO"
  | "PAGAMENTOS"
  | "OUTROS"
  | "VISUAL_DO_WEBSITE"
  | "FUNCIONALIDADE"
  | "PROBLEMA";

export const FEEDBACK_TYPE_LIST: FeedBackType[] = [
  "LOJA_COMPRAS",
  "CARRINHO_ENCOMENDAS",
  "PERFIL",
  "PAINEL_DE_CONTROLO",
  "PAGAMENTOS",
  "OUTROS",
  "VISUAL_DO_WEBSITE",
  "FUNCIONALIDADE",
  "PROBLEMA",
];

export type RequestStatus =
  "PLANEJADO" | "PROCESSANDO" | "ANALISANDO" | "RESOLVIDO" | "CANCELADO";

export const FEEDBACK_REQUEST_LIST: RequestStatus[] = [
  "PLANEJADO",
  "PROCESSANDO",
  "ANALISANDO",
  "RESOLVIDO",
  "CANCELADO",
];

export interface FeedbackModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  email: string;
  name: string;
  status: RequestStatus;
  votes: number;
  feedbackType: FeedBackType;
}
