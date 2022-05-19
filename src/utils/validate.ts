/**
 * Password validation
 * @param val password
 * @returns validation results
 */
export const password = (val: string) => {
  const regex = /^[A-Za-z0-9]{8,}$/g;
  return regex.test(val);
}
