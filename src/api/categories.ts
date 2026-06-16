import { Permissions } from "./interfaces";

export const BUSINESS_CATEGORIES: string[] = [
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
  "OUTROS"
];

export const ProductCategories: string[] = 
[
  // --- MERCEARIA E PRODUTOS FRESCOS ---
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

  // --- ESSENCIAIS DO DIA A DIA PARA A CASA ---
  "LIMPEZA_DA_CASA",
  "PRODUTOS_DE_PAPEL_E_PLÁSTICO",
  "MATERIAL_DE_ESCRITÓRIO",

  // --- HIGIENE PESSOAL E SAÚDE ---
  "HIGIENE_PESSOAL",
  "SAÚDE_E_BEM_ESTAR",

  // --- BEBÉ E ANIMAIS DE ESTIMAÇÃO ---
  "ARTIGOS_PARA_BEBÉ",
  "ALIMENTAÇÃO_E_ACESSÓRIOS_PARA_ANIMAIS",

  // --- CAIXA E SOUVENIRS / DIVERSOS ---
  "REVISTAS",
  "CARTÕES_PRESENTE",
  "OUTROS"
]


export const CURRENCIES: string[] = [
"CVE"
];
 // for now lets just deal with the CVE and not the others


export const UNIT_TYPES: string[] = [
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
  "TIRA"
]

export type OfferingType = "PRODUCT" | "TV_SHOW" | "MOVIE" | "BOOK" | "ELECTRONIC"|  "MUSIC";



export const ALL_PERMISSIONS: { value: Permissions; label: string; description: string }[] = [
  // Gestão de Produtos
  { 
    value: "ADD_PRODUCT",  
    label: "Adicionar Produto",  
    description: "Permite ao utilizador criar novas entradas de produto no sistema." 
  },
  { 
    value: "UPDATE_PRODUCT",    
    label: "Atualizar Produto",    
    description: "Permite ao utilizador editar detalhes de produtos existentes e inventário." 
  },
  { 
    value: "DELETE_PRODUCT", 
    label: "Eliminar Produto", 
    description: "Permite ao utilizador remover permanentemente produtos do catálogo." 
  },

  // Gestão de Tarefas
  { 
    value: "ASSIGN_TASKS", 
    label: "Atribuir Tarefas", 
    description: "Permite ao utilizador delegar, acompanhar e atribuir tarefas aos membros da equipa." 
  },
  
  { 
    value: "CREATE_TASK", 
    label: "Criar Tarefas", 
    description: "Permite ao funcionário criar tarefas para si próprio ou para outros." 
  },
  
  { 
    value: "DELETE_TASK", 
    label: "Eliminar Tarefas", 
    description: "Permite ao funcionário eliminar tarefas para si próprio ou para outros." 
  },

  // Analítica e Relatórios
  { 
    value: "VIEW_REPORTS", 
    label: "Visualizar Relatórios", 
    description: "Permite ao utilizador aceder a painéis operacionais e resumos analíticos do sistema." 
  }
  
];
export const addressFields = ["island", "city", "zone", "street", "postalCode"];


export type OrderStatus = "PENDING" | "PROCESSING" | "CANCELLED" | "COMPLETED" | "RECEIVED" | "SENT"