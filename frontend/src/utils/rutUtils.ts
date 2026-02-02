export const cleanRut = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
};

export const formatRut = (rut: string): string => {
  const clean = cleanRut(rut);
  if (clean.length <= 1) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
};

export const validateRut = (rut: string): boolean => {
  const clean = cleanRut(rut);
  if (clean.length < 2) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = 1; i <= body.length; i++) {
    const index = multiplo * parseInt(body.charAt(body.length - i));
    suma = suma + index;
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dv === dvFinal;
};
