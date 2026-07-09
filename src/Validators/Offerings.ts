import { ProductModel } from "../Interfaces/offerings";

const validationRegex = (min: number, max: number): RegExp => {
  return new RegExp(`^[\\p{L}0-9 .,!?_\\-()]{${min},${max}}$`, "u");
};

export const isProductValid = (product: ProductModel) => {
  if (!validationRegex(1, 500).test(product.description)) {
    alert(
      "A descrição do produto não pode ter mais de 500 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }

  if (!validationRegex(1, 100).test(product.name)) {
    alert(
      "O nome do produto não pode ter mais de 100 caracteres e deve conter apenas letras, números e os seguintes símbolos: &!@$-_=",
    );
    return false;
  }
  if (product.price < 0) {
    alert("Product price cannot be less than 0");
    return false;
  }

  const date: Date = new Date(product.expirationDate);
  const now: Date = new Date();
  if (date.getTime() <= now.getTime()) {
    alert("The expiration date must be in the future ");
    return false;
  }
  return true;
};
