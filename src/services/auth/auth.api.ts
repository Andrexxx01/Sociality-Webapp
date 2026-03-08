import { apiPost } from "@/lib/api-client";
import type {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export async function login(payload: LoginPayload): Promise<AuthResponseData> {
  const response = await apiPost<AuthResponseData>("/api/auth/login", payload);
  return response.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponseData> {
  const response = await apiPost<AuthResponseData>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}
