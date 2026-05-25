
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
    address:string;
    phoneNumber:string;
    email:string;
    createdAt:string;
    updatedAt:string;
}

export interface EmployerModel extends UserProfileModel{
  companiesRegistered: CompanyModel[];
  staffList: StaffModel[];
  products: ProductModel[];
  
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
}

export interface ProductModel extends AddProductModel{
    id?:string;
    creatorId?: string;
    updatedBy?: string;
    companyName?: string;
    createdAt?:string;
    updatedAt?:string;
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
  // ===== Food & Beverage =====
  | "RESTAURANT" | "FAST_FOOD" | "CAFE" | "BAKERY" | "BAR" | "BREWERY" | "WINERY" | "DISTILLERY" | "FOOD_TRUCK" | "CATERING"
  // ===== Retail =====
  | "GROCERY_STORE" | "SUPERMARKET" | "CONVENIENCE_STORE" | "DEPARTMENT_STORE" | "MALL" | "BOUTIQUE" | "THRIFT_STORE" | "ECOMMERCE" | "WHOLESALE" | "FARMERS_MARKET"
  // ===== Construction & Real Estate =====
  | "CONSTRUCTION_COMPANY" | "GENERAL_CONTRACTOR" | "ARCHITECTURE_FIRM" | "ENGINEERING_FIRM" | "REAL_ESTATE_AGENCY" | "PROPERTY_MANAGEMENT" | "INTERIOR_DESIGN" | "LANDSCAPING"
  // ===== Technology =====
  | "SOFTWARE_COMPANY" | "TECH_STARTUP" | "IT_SERVICES" | "WEB_DEVELOPMENT" | "CYBERSECURITY" | "DATA_ANALYTICS" | "AI_ML_COMPANY" | "CLOUD_SERVICES" | "TELECOMMUNICATIONS" | "HARDWARE_MANUFACTURER"
  // ===== Healthcare =====
  | "HOSPITAL" | "CLINIC" | "PRIVATE_PRACTICE" | "DENTAL_OFFICE" | "PHARMACY" | "VETERINARY" | "MEDICAL_LAB" | "NURSING_HOME" | "REHABILITATION_CENTER" | "BIOTECH"
  // ===== Finance =====
  | "BANK" | "CREDIT_UNION" | "INVESTMENT_FIRM" | "INSURANCE" | "ACCOUNTING_FIRM" | "FINANCIAL_ADVISORY" | "TAX_SERVICES" | "MORTGAGE_LENDER" | "FINTECH"
  // ===== Manufacturing & Industrial =====
  | "MANUFACTURING" | "AUTOMOTIVE_MANUFACTURING" | "TEXTILE" | "FOOD_PROCESSING" | "CHEMICAL_MANUFACTURING" | "PHARMACEUTICAL" | "AEROSPACE" | "DEFENSE"
  // ===== Professional Services ====
  | "LAW_FIRM" | "CONSULTING" | "MARKETING_AGENCY" | "ADVERTISING_AGENCY" | "PUBLIC_RELATIONS" | "STAFFING_AGENCY" | "HUMAN_RESOURCES" | "SECURITY_SERVICES" | "CLEANING_SERVICE"
  // ===== Transportation & Logistics =====
  | "LOGISTICS" | "SHIPPING" | "TRUCKING" | "AIRLINE" | "RAILWAY" | "RIDESHARE" | "TAXI_SERVICE" | "DELIVERY_SERVICE" | "MOVING_COMPANY" | "AUTO_REPAIR" | "AUTO_DEALERSHIP" | "GAS_STATION" | "CAR_RENTAL"
  // ===== Entertainment & Media =====
  | "MOVIE_THEATER" | "AMUSEMENT_PARK" | "CASINO" | "NIGHTCLUB" | "MUSIC_VENUE" | "SPORTS_FACILITY" | "GAMING_COMPANY" | "FILM_PRODUCTION" | "MUSIC_LABEL" | "PUBLISHING" | "BROADCASTING" | "NEWS_AGENCY" | "STREAMING_SERVICE"
  // ===== Education =====
  | "PUBLIC_SCHOOL" | "PRIVATE_SCHOOL" | "UNIVERSITY" | "COMMUNITY_COLLEGE" | "TRADE_SCHOOL" | "TUTORING" | "ONLINE_LEARNING" | "DAYCARE" | "TRAINING_CENTER"
  // ===== Hospitality & Travel =====
  | "HOTEL" | "MOTEL" | "BED_AND_BREAKFAST" | "RESORT" | "HOSTEL" | "TRAVEL_AGENCY" | "TOUR_OPERATOR"
  // ===== Personal Services =====
  | "SALON" | "BARBERSHOP" | "SPA" | "GYM" | "YOGA_STUDIO" | "DRY_CLEANING" | "LAUNDROMAT" | "PHOTOGRAPHY_STUDIO" | "PET_SERVICES" | "FUNERAL_SERVICES"
  // ===== Energy & Utilities =====
  | "OIL_AND_GAS" | "RENEWABLE_ENERGY" | "UTILITIES" | "MINING" | "WASTE_MANAGEMENT" | "RECYCLING"

  // ===== Agriculture =====
  | "AGRICULTURE" | "FARM" | "RANCH" | "FISHERY" | "FORESTRY" | "NURSERY"
  // ===== Other =====
  | "CHARITY" | "RELIGIOUS_ORGANIZATION" | "NONPROFIT_ORGANIZATION" | "RESEARCH_INSTITUTE" | "THINK_TANK" | "OTHER"
  | null;


// Currency Type
export type Currency = 
    | "CVE" 
    | "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN"
    | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL"
    | "BSD" | "BTN" | "BWP" | "BYN" | "BZD"
    | "CAD" | "CDF" | "CHF" | "CLP" | "CNY" | "COP" | "CRC" | "CUP" | "CZK"
    | "DJF" | "DKK" | "DOP" | "DZD"
    | "EGP" | "ERN" | "ETB" | "EUR"
    | "FJD" | "FKP"
    | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD"
    | "HKD" | "HNL" | "HRK" | "HTG" | "HUF"
    | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK"
    | "JMD" | "JOD" | "JPY"
    | "KES" | "KGS" | "KHR" | "KMF" | "KPW" | "KRW" | "KWD" | "KYD" | "KZT"
    | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LYD"
    | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRU" | "MUR" | "MVR"
    | "MWK" | "MXN" | "MYR" | "MZN"
    | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD"
    | "OMR"
    | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG"
    | "QAR"
    | "RON" | "RSD" | "RUB" | "RWF"
    | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD"
    | "STN" | "SYP" | "SZL"
    | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS"
    | "UAH" | "UGX" | "USD" | "UYU" | "UZS"
    | "VES" | "VND" | "VUV"
    | "WST"
    | "XAF" | "XCD" | "XOF" | "XPF"
    | "YER"
    | "ZAR" | "ZMW" | "ZWL"

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
export type ProductType = 
    // Fresh Produce
    | "FRESH_FRUIT" | "FRESH_VEGETABLE" | "FRESH_HERB" | "SALAD_KIT" | "MICROGREENS"
    | "SPROUTS" | "MUSHROOM" | "EDIBLE_FLOWER" | "FRESH_CORN" | "FRESH_NUTS"
    // Meat & Poultry
    | "FRESH_BEEF" | "FRESH_PORK" | "FRESH_LAMB" | "FRESH_VEAL" | "FRESH_CHICKEN"
    | "FRESH_TURKEY" | "FRESH_DUCK" | "FRESH_GAME_MEAT" | "GROUND_MEAT" | "MARINATED_MEAT"
    | "SAUSAGE_FRESH" | "HOT_DOG" | "BACON" | "DELI_MEAT" | "SMOKED_MEAT" | "CANNED_MEAT"
    | "JERKY" | "PATE"
    // Seafood
    | "FRESH_FISH" | "FRESH_SHELLFISH" | "FRESH_MOLLUSKS" | "SMOKED_FISH" | "CANNED_FISH"
    | "FROZEN_FISH" | "FROZEN_SEAFOOD" | "DRIED_FISH" | "FISH_ROE" | "SURIMI"
    // Dairy & Eggs
    | "WHOLE_MILK" | "REDUCED_FAT_MILK" | "SKIM_MILK" | "FLAVORED_MILK" | "BUTTERMILK"
    | "HEAVY_CREAM" | "HALF_AND_HALF" | "SOUR_CREAM" | "CREAM_CHEESE" | "COTTAGE_CHEESE"
    | "RICOTTA" | "MASCARPONE" | "HARD_CHEESE" | "SOFT_CHEESE" | "SEMI_SOFT_CHEESE"
    | "BLUE_CHEESE" | "SHREDDED_CHEESE" | "SLICED_CHEESE" | "BUTTER" | "GHEE" | "YOGURT"
    | "GREEK_YOGURT" | "KEFIR" | "WHIPPED_CREAM" | "ICE_CREAM" | "FROZEN_YOGURT" | "GELATO"
    | "SHERBET" | "EGGS_CHICKEN" | "EGGS_SPECIALTY" | "EGG_SUBSTITUTE"
    // Plant-Based
    | "OAT_MILK" | "ALMOND_MILK" | "SOY_MILK" | "COCONUT_MILK_BEVERAGE" | "RICE_MILK"
    | "CASHEW_MILK" | "PEA_MILK" | "VEGAN_CHEESE" | "VEGAN_BUTTER" | "VEGAN_YOGURT"
    | "VEGAN_ICE_CREAM" | "TOFU" | "TEMPEH" | "SEITAN" | "PLANT_BASED_MEAT"
    | "PLANT_BASED_SAUSAGE" | "PLANT_BASED_SEAFOOD" | "JACKFRUIT_PREPARED"
    // Bakery & Bread
    | "SANDWICH_BREAD" | "ARTISAN_BREAD" | "SOURDOUGH" | "BAGUETTE" | "ROLLS_BUNS" | "BAGEL"
    | "ENGLISH_MUFFIN" | "PITA_BREAD" | "TORTILLA" | "NAAN" | "FLATBREAD" | "CROISSANT"
    | "MUFFIN" | "DONUT" | "DANISH_PASTRY" | "CAKE" | "CUPCAKE" | "PIE" | "CHEESECAKE"
    | "BROWNIE" | "COOKIE" | "CRACKERS" | "BREADSTICK" | "WAFFLE_CONE" | "GLUTEN_FREE_BREAD"
    // Frozen Foods
    | "FROZEN_MEAL" | "FROZEN_PIZZA" | "FROZEN_BURRITO" | "FROZEN_APPETIZER" | "FROZEN_BREAKFAST"
    | "FROZEN_VEGETABLE" | "FROZEN_FRUIT" | "FROZEN_POTATO" | "FROZEN_PASTA_MEAL"
    | "FROZEN_RICE_MEAL" | "FROZEN_SOUP" | "FROZEN_BREAD_DOUGH" | "FROZEN_DESSERT"
    | "FROZEN_JUICE" | "FROZEN_EDAMAME" | "FROZEN_PLANT_BASED_MEAL"
    // Grains & Pasta
    | "WHITE_RICE" | "BROWN_RICE" | "WILD_RICE" | "JASMINE_RICE" | "BASMATI_RICE"
    | "SUSHI_RICE" | "RISOTTO_RICE" | "INSTANT_RICE" | "QUINOA" | "COUSCOUS" | "BULGUR"
    | "FARRO" | "BARLEY" | "MILLET" | "OATS" | "CORNMEAL" | "WHEAT_BERRIES" | "BUCKWHEAT"
    | "AMARANTH" | "TEFF" | "SORGHUM" | "PASTA_DRY" | "PASTA_FRESH" | "PASTA_STUFFED"
    | "PASTA_GLUTEN_FREE" | "EGG_NOODLE" | "RAMEN_NOODLE" | "RICE_NOODLE" | "SOBA_NOODLE"
    | "UDON_NOODLE" | "GLASS_NOODLE" | "BREAD_FLOUR" | "ALL_PURPOSE_FLOUR" | "WHOLE_WHEAT_FLOUR"
    | "ALMOND_FLOUR" | "COCONUT_FLOUR" | "OAT_FLOUR" | "RICE_FLOUR" | "SEMOLINA"
    // Legumes
    | "CANNED_BEANS" | "DRIED_BEANS" | "LENTILS" | "SPLIT_PEAS" | "CHICKPEAS" | "EDAMAME_SHELF"
    | "HUMMUS" | "REFRIED_BEANS"
    // Canned & Jarred
    | "CANNED_TOMATO" | "CANNED_VEGETABLE" | "CANNED_FRUIT" | "CANNED_SOUP"
    | "CANNED_COCONUT_MILK" | "JARRED_PASTA_SAUCE" | "JARRED_SALSA" | "JARRED_PICKLES"
    | "JARRED_OLIVES" | "JARRED_ROASTED_PEPPERS" | "JARRED_ARTICHOKE" | "JARRED_CAPERS"
    | "JARRED_SUN_DRIED_TOMATO" | "JARRED_NUT_BUTTER" | "JARRED_JAM_JELLY" | "JARRED_HONEY"
    | "JARRED_MAPLE_SYRUP" | "CANNED_EVAPORATED_MILK" | "CANNED_CONDENSED_MILK"
    // Oils & Vinegars
    | "OLIVE_OIL" | "VEGETABLE_OIL" | "CANOLA_OIL" | "COCONUT_OIL" | "AVOCADO_OIL"
    | "SESAME_OIL" | "SUNFLOWER_OIL" | "PEANUT_OIL" | "FLAXSEED_OIL" | "TRUFFLE_OIL"
    | "WHITE_VINEGAR" | "APPLE_CIDER_VINEGAR" | "BALSAMIC_VINEGAR" | "RED_WINE_VINEGAR"
    | "RICE_VINEGAR" | "COOKING_SPRAY" | "SOY_SAUCE" | "WORCESTERSHIRE_SAUCE" | "HOT_SAUCE"
    | "FISH_SAUCE" | "OYSTER_SAUCE" | "HOISIN_SAUCE" | "TERIYAKI_SAUCE" | "BBQ_SAUCE"
    | "KETCHUP" | "MUSTARD" | "MAYONNAISE" | "RANCH_DRESSING" | "SALAD_DRESSING" | "TAHINI"
    | "SRIRACHA" | "MISO_PASTE" | "TOMATO_PASTE" | "COOKING_WINE"
    // Baking & Sweeteners
    | "WHITE_SUGAR" | "BROWN_SUGAR" | "POWDERED_SUGAR" | "RAW_SUGAR" | "COCONUT_SUGAR"
    | "MONK_FRUIT_SWEETENER" | "STEVIA" | "ERYTHRITOL" | "ARTIFICIAL_SWEETENER"
    | "CORN_SYRUP" | "MOLASSES" | "AGAVE_NECTAR" | "DATE_SYRUP" | "BAKING_SODA"
    | "BAKING_POWDER" | "YEAST" | "CREAM_OF_TARTAR" | "GELATIN" | "AGAR_AGAR" | "PECTIN"
    | "COCOA_POWDER" | "CHOCOLATE_CHIPS" | "BAKING_CHOCOLATE" | "VANILLA_EXTRACT"
    | "FOOD_COLORING" | "BREAD_CRUMBS" | "CORNSTARCH" | "ARROWROOT" | "XANTHAN_GUM"
    | "FROSTING" | "CAKE_MIX" | "PANCAKE_MIX" | "BROWNIE_MIX" | "COOKIE_MIX" | "BREAD_MIX"
    | "PIE_CRUST" | "PUFF_PASTRY" | "PHYLLO_DOUGH" | "MARZIPAN" | "FONDANT" | "SPRINKLES"
    // Spices & Herbs
    | "SALT" | "BLACK_PEPPER" | "CHILI_POWDER" | "PAPRIKA" | "CUMIN" | "CORIANDER"
    | "TURMERIC" | "CINNAMON" | "GINGER_SPICE" | "GARLIC_POWDER" | "ONION_POWDER"
    | "OREGANO" | "BASIL_DRIED" | "THYME" | "ROSEMARY" | "BAY_LEAVES" | "PARSLEY_DRIED"
    | "DILL_DRIED" | "SAGE" | "TARRAGON" | "CLOVES" | "NUTMEG" | "ALLSPICE" | "CARDAMOM"
    | "FENUGREEK" | "STAR_ANISE" | "FENNEL_SEED" | "MUSTARD_SEED" | "CELERY_SEED"
    | "CARAWAY_SEED" | "SAFFRON" | "SUMAC" | "ZA_ATAR" | "GARAM_MASALA" | "CURRY_POWDER"
    | "FIVE_SPICE" | "ITALIAN_SEASONING" | "TACO_SEASONING" | "LEMON_PEPPER"
    | "SEASONING_SALT" | "OLD_BAY" | "EVERYTHING_BAGEL" | "MSG" | "NUTRITIONAL_YEAST"
    // Snacks
    | "POTATO_CHIPS" | "TORTILLA_CHIPS" | "PRETZELS" | "POPCORN" | "RICE_CAKE"
    | "CRACKERS_SNACK" | "PORK_RINDS" | "VEGGIE_CHIPS" | "TRAIL_MIX" | "MIXED_NUTS"
    | "ROASTED_SEEDS" | "DRIED_FRUIT" | "FRUIT_SNACK" | "GRANOLA_BAR" | "PROTEIN_BAR"
    | "ENERGY_BAR" | "CHEESE_PUFF" | "DIPS" | "BEEF_STICK" | "SEAWEED_SNACK" | "RICE_CRACKER"
    | "PEANUT_BUTTER_CRACKER" | "CHEESE_CRACKERS_SNACK"
    // Candy
    | "CHOCOLATE_BAR" | "CHOCOLATE_TRUFFLES" | "CHOCOLATE_BOX" | "GUMMY_CANDY" | "HARD_CANDY"
    | "CARAMEL_CANDY" | "LICORICE" | "JELLY_BEANS" | "MARSHMALLOW" | "COTTON_CANDY" | "FUDGE"
    | "CANDY_CORN" | "MINTS" | "COUGH_DROP_CANDY" | "CHEWING_GUM" | "SOUR_CANDY" | "TAFFY"
    | "NOUGAT" | "ROCK_CANDY"
    // Cereal & Breakfast
    | "COLD_CEREAL" | "GRANOLA" | "MUESLI" | "HOT_CEREAL" | "INSTANT_OATMEAL" | "BREAKFAST_BAR"
    | "TOASTER_PASTRY" | "INSTANT_GRITS" | "PANCAKE_SYRUP" | "ACAI_BOWL_MIX"
    // Beverages
    | "BOTTLED_WATER" | "SPARKLING_WATER" | "COCONUT_WATER" | "FRUIT_JUICE" | "VEGETABLE_JUICE"
    | "SODA" | "DIET_SODA" | "ENERGY_DRINK" | "SPORTS_DRINK" | "ICED_TEA" | "LEMONADE"
    | "COFFEE_RTD" | "GROUND_COFFEE" | "WHOLE_BEAN_COFFEE" | "INSTANT_COFFEE" | "COFFEE_PODS"
    | "TEA_BAGS" | "LOOSE_LEAF_TEA" | "HOT_CHOCOLATE" | "SMOOTHIE_RTD" | "KOMBUCHA"
    | "PROBIOTIC_DRINK" | "JUICE_BOX" | "ELECTROLYTE_POWDER" | "PROTEIN_SHAKE_RTD"
    | "FLAVORED_SYRUP" | "BEER" | "CRAFT_BEER" | "HARD_SELTZER" | "CIDER" | "RED_WINE"
    | "WHITE_WINE" | "ROSE_WINE" | "SPARKLING_WINE" | "DESSERT_WINE" | "BOXED_WINE"
    | "VODKA" | "WHISKEY" | "RUM" | "TEQUILA" | "GIN" | "BRANDY" | "LIQUEUR" | "HARD_KOMBUCHA"
    | "RTD_COCKTAIL" | "MALT_BEVERAGE" | "SAKE"
    // Deli & Prepared
    | "DELI_PREPARED_MEAL" | "ROTISSERIE_CHICKEN" | "DELI_SANDWICH" | "DELI_SALAD" | "SUSHI"
    | "PREPARED_SOUP" | "CHARCUTERIE" | "STUFFED_GRAPE_LEAVES" | "SPRING_ROLL" | "PARTY_PLATTER"
    // Baby & Infant
    | "BABY_FORMULA" | "BABY_FOOD_PUREE" | "BABY_CEREAL" | "BABY_SNACK" | "TODDLER_MEAL"
    // Health & Nutrition
    | "PROTEIN_POWDER" | "MEAL_REPLACEMENT_SHAKE" | "COLLAGEN_SUPPLEMENT" | "PROBIOTIC_SUPPLEMENT"
    | "VITAMIN_SUPPLEMENT" | "OMEGA_SUPPLEMENT" | "GREENS_POWDER" | "SPORTS_NUTRITION"
    | "HERBAL_SUPPLEMENT" | "DIET_SUPPLEMENT" | "SUPERFOOD" | "KETO_PRODUCT"
    | "GLUTEN_FREE_PRODUCT" | "ORGANIC_PRODUCT" | "DIABETIC_PRODUCT"
    // International
    | "ASIAN_SPECIALTY" | "LATIN_SPECIALTY" | "MIDDLE_EASTERN_SPECIALTY" | "EUROPEAN_SPECIALTY"
    | "SOUTH_ASIAN_SPECIALTY" | "AFRICAN_SPECIALTY" | "CARIBBEAN_SPECIALTY" | "KOSHER_PRODUCT"
    | "HALAL_PRODUCT" | "VEGAN_CERTIFIED" | "FAIR_TRADE"
    // Household
    | "PAPER_TOWEL" | "TOILET_PAPER" | "FACIAL_TISSUE" | "NAPKIN" | "ALUMINUM_FOIL"
    | "PLASTIC_WRAP" | "PARCHMENT_PAPER" | "WAXED_PAPER" | "FOOD_STORAGE_BAG" | "TRASH_BAG"
    | "SANDWICH_BAG" | "DISPOSABLE_PLATES" | "DISPOSABLE_CUPS" | "DISPOSABLE_UTENSILS"
    | "DISH_SOAP" | "DISHWASHER_DETERGENT" | "LAUNDRY_DETERGENT" | "FABRIC_SOFTENER"
    | "BLEACH" | "ALL_PURPOSE_CLEANER" | "BATHROOM_CLEANER" | "GLASS_CLEANER"
    | "SPONGE_SCRUBBER" | "AIR_FRESHENER" | "CANDLE" | "INSECT_REPELLENT" | "LIGHTER_MATCHES"
    | "BATTERIES" | "LIGHT_BULB"
    // Personal Care
    | "SHAMPOO" | "CONDITIONER" | "BODY_WASH" | "BAR_SOAP" | "HAND_SOAP" | "HAND_SANITIZER"
    | "TOOTHPASTE" | "TOOTHBRUSH" | "FLOSS" | "MOUTHWASH" | "DEODORANT" | "SHAVING_CREAM"
    | "RAZOR" | "LOTION" | "SUNSCREEN" | "LIP_BALM" | "FEMININE_HYGIENE" | "CONDOM"
    | "CONTACT_SOLUTION" | "OTC_MEDICINE" | "BANDAGE" | "COTTON_BALL" | "TISSUE_PACK"
    | "HAIR_CARE" | "DIAPER" | "BABY_WIPES"
    // Pet
    | "PET_FOOD_DRY" | "PET_FOOD_WET" | "PET_TREAT" | "PET_LITTER"
    // Other
    | "UNKNOWN";




export type  CompanyStatuses =     "OPERATING"| "INACTIVE" | "CLOSED" |null


export interface CompanyModel extends CompanyRegistrationModel{
    id ?: string;
    createdAt: string;
    updatedAt: string;
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
}


export type Permissions = "ADD_PRODUCT"|  "UPDATE_PRODUCT"|  "DELETE_PRODUCT" | 
"ADD_EMPLOYEE"| "UPDATE_EMPLOYEE"| "FIRE_EMPLOYEE"| "ADD_COMPANY"| "UPDATE_COMPANY"| "DELETE_COMPANY"| 
"ADD_SERVICE"| "UPDATE_SERVICE"| "DELETE_SERVICE";



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

