export function json(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function allowMethods(req: any, res: any, methods: string[]) {
  if (methods.includes(req.method)) {
    return true;
  }

  res.setHeader("Allow", methods.join(", "));
  json(res, 405, { error: "Method not allowed." });
  return false;
}

export function parseJsonBody<T>(req: any): T {
  if (!req.body) {
    return {} as T;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body) as T;
  }

  return req.body as T;
}

export function requireAdmin(req: any) {
  const expected = process.env.ADMIN_SECRET;

  if (!expected) {
    return true;
  }

  const received = req.headers["x-admin-secret"];
  return received === expected;
}
