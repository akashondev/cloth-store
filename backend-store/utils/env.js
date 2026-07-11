export function env(name, fallback = undefined) {
  return process.env[name] ?? process.env[`${name} `] ?? fallback;
}
