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
  const dv = clean.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(body[i], 10);
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal: string;
  if (dvEsperado === 11) dvFinal = "0";
  else if (dvEsperado === 10) dvFinal = "K";
  else dvFinal = dvEsperado.toString();

  return dv === dvFinal;
};
