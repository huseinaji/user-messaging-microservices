export interface jwtPayload {
  sub: string;
  username: string;
  role: string;
}

export type ZodiacRange = {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  animal: string;
};
