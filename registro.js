const countries = window.PAISES;

const countryCode = document.querySelector("#country-code");
const initialCountry = countries.find(([name]) => name === "México");
const sortedCountries = countries
  .filter(([name]) => name !== "México")
  .sort((a, b) => a[0].localeCompare(b[0], "es"));

for (const [name, dialCode, flag] of sortedCountries) {
  const option = document.createElement("option");
  option.value = dialCode;
  option.textContent = `${flag} ${name} (${dialCode})`;
  option.dataset.country = name;
  countryCode.append(option);
}
countryCode.value = initialCountry[1];

const form = document.querySelector("#registration-form");
const fileInput = document.querySelector("#identification");
const uploadZone = document.querySelector("#upload-zone");
const fileName = document.querySelector("#file-name");
const removeFile = document.querySelector("#remove-file");
const fileError = document.querySelector("#file-error");
const formError = document.querySelector("#form-error");
const successMessage = document.querySelector("#success-message");
const maxFileSize = 2.5 * 1024 * 1024;
const allowedExtensions = /\.(pdf|png|jpe?g)$/i;

function clearFile() {
  fileInput.value = "";
  fileName.textContent = "Ningún archivo seleccionado";
  removeFile.hidden = true;
  fileError.textContent = "";
}

function setFile(file) {
  fileError.textContent = "";
  if (!file) {
    clearFile();
    return;
  }

  const validType =
    ["application/pdf", "image/png", "image/jpeg"].includes(file.type) ||
    allowedExtensions.test(file.name);

  if (!validType) {
    clearFile();
    fileError.textContent = "Elige un archivo PDF, PNG o JPG.";
    return;
  }
  if (file.size > maxFileSize) {
    clearFile();
    fileError.textContent = "El archivo supera el tamaño máximo de 2.5 MB.";
    return;
  }

  fileName.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  removeFile.hidden = false;
}

fileInput.addEventListener("change", () => setFile(fileInput.files[0]));
removeFile.addEventListener("click", clearFile);

for (const eventName of ["dragenter", "dragover"]) {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove("dragging");
  });
}

uploadZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  fileInput.files = transfer.files;
  setFile(file);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  successMessage.classList.remove("visible");

  const requiredFields = [
    ["full-name", "Escribe tu nombre completo."],
    ["email", "Escribe un correo electrónico válido."],
    ["address", "Escribe tu dirección."],
    ["phone", "Escribe tu número celular."],
    ["age", "Ingresa una edad entre 1 y 120 años."],
  ];

  let firstInvalidField;
  for (const [id, message] of requiredFields) {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    const isValid =
      field.checkValidity() &&
      (id !== "age" || (Number(field.value) >= 1 && Number(field.value) <= 120));
    error.textContent = isValid ? "" : message;
    if (!isValid && !firstInvalidField) firstInvalidField = field;
  }

  const selectedFile = fileInput.files[0];
  if (!selectedFile) {
    fileError.textContent = "Adjunta tu identificación para continuar.";
    if (!firstInvalidField) firstInvalidField = fileInput;
  } else {
    setFile(selectedFile);
    if (fileError.textContent && !firstInvalidField) firstInvalidField = fileInput;
  }

  if (firstInvalidField) {
    firstInvalidField.focus();
    formError.textContent = "Revisa los campos señalados antes de continuar.";
    return;
  }

  successMessage.textContent =
    "Tus datos están completos y el archivo cumple con los requisitos. Esta página es una demostración: el registro no se ha enviado ni guardado.";
  successMessage.classList.add("visible");
});
