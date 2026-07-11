import { ProductModel, WearableModel } from "../Interfaces/offerings";

const validationRegex = (min: number, max: number): RegExp => {
  // Allow all Unicode letters, numbers, spaces, and common punctuation
  // This prevents control characters, null bytes, and other dangerous characters
  return new RegExp(
    `^[\\p{L}\\p{N}\\s.,!?@$%^&*()_+=\\-\\[\\]{};:'"<>]{${min},${max}}$`,
    "u",
  );
};

const isBaseOfferingValid = (
  description: string,
  name: string,
  price: number,
) => {
  if (!validationRegex(1, 500).test(description)) {
    alert(
      "A descrição não pode ter mais de 500 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }
  if (!validationRegex(1, 100).test(name)) {
    alert(
      "O nome não pode ter mais de 100 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }
  if (price < 0) {
    alert("O preço não pode ser negativo!");
    return false;
  }
  return true;
};

export const isProductValid = (product: ProductModel) => {
  const date: Date = new Date(product.expirationDate);
  const now: Date = new Date();
  if (date.getTime() <= now.getTime()) {
    alert("The expiration date must be in the future ");
    return false;
  }
  return isBaseOfferingValid(product.description, product.name, product.price);
};
export const isWearableValid = (wearable: WearableModel) => {
  if (!validationRegex(1, 100).test(wearable.brand)) {
    alert(
      "A Marca não pode ter mais de 100 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }
  if (!validationRegex(1, 100).test(wearable.colors)) {
    alert(
      "As Cores não pode ter mais de 100 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }
  if (!validationRegex(1, 50).test(wearable.size)) {
    alert(
      "O tamanho não pode ter mais de 50 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }

  if (!validationRegex(1, 500).test(wearable.material)) {
    alert(
      "A descrição dos materiais não pode ter mais de 500 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }

  return isBaseOfferingValid(
    wearable.description,
    wearable.name,
    wearable.price,
  );
};
