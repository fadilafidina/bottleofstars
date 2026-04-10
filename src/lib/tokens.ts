export function getTokenFromSearch(search: string) {
  return new URLSearchParams(search).get("token");
}

export function maskToken(token: string | null) {
  if (!token) {
    return "missing";
  }

  if (token.length <= 8) {
    return token;
  }

  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}
