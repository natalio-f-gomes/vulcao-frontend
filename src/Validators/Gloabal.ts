import { AddressModel } from "../Interfaces/global";

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
  // Lookahead checks for 7-15 overall allowed characters.
  // Body ensures an optional '+' followed by digits and single spaces.
  const phoneRegex = /^(?=^[+\d ]{7,20}$)\+?\d+(?: \d+)*$/;

  return phoneRegex.test(phoneNumber);
};

export const isAddressValid = (address: AddressModel): boolean => {
  // Regex that allows letters, spaces, and common European accented characters
  const NAME_REGEX: RegExp = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s]{1,50}$/;
  const POSTAL_CODE_REGEX: RegExp = /^\d{3,10}$/;

  const city = address.city?.trim() ?? "";
  const street = address.street?.trim() ?? "";
  const postalCode = address.postalCode?.trim() ?? "";
  const zone = address.zone?.trim() ?? "";
  const island = address.island?.trim() ?? "";

  if (city === "" || !NAME_REGEX.test(city)) {
    alert(
      "O campo 'Cidade' é obrigatório e deve conter apenas letras e números.",
    );
    return false;
  }
  if (zone !== "" && !NAME_REGEX.test(zone)) {
    alert("O campo 'Zona/Bairro' deve conter apenas letras e números.");
    return false;
  }

  if (island !== "" && !NAME_REGEX.test(island)) {
    alert("O campo 'Ilha' deve conter apenas letras e números.");
    return false;
  }

  if (street !== "" && !NAME_REGEX.test(street)) {
    alert("O campo 'Rua' deve conter apenas letras e números.");
    return false;
  }

  if (postalCode !== "" && !POSTAL_CODE_REGEX.test(postalCode)) {
    alert("O campo 'Código Postal' deve conter exatamente 6 dígitos.");
    return false;
  }
  return true;
};
