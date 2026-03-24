import { useDispatch } from "react-redux";
import { register, login, getMe, handleVerify } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      const res = await register({ email, username, password });
      const data = res?.data || res;
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      dispatch(setError(message));
      throw error?.response?.data || error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const res = await login({ email, password });
      const data = res?.data || res;
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      dispatch(setError(message));
      throw error?.response?.data || error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const res = await getMe();
      const data = res?.data || res;
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      dispatch(setUser(null));
      const message =
        error?.response?.data?.message || "Failed to fetch user details";
      dispatch(setError(message));
      throw error?.response?.data || error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyToken(token) {
    try {
      dispatch(setLoading(true));
      const res = await handleVerify(token);
      const data = res?.data || res;
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Verification failed";
      dispatch(setError(message));
      throw error?.response?.data || error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleGetMe,
    handleRegister,
    handleLogin,
    handleVerifyToken,
  };
}
