import useAuthStore from "@/stores/authStore";
import { useMutationFunctionType } from "@/types/api";

import { api } from "../../api";
import { getURL } from "../../helpers/constants";
import { UseRequestProcessor } from "../../services/request-processor";
import secureLocalStorage from "react-secure-storage";


export const useLogout: useMutationFunctionType<undefined, void> = (
  options?,
) => {
  const { mutate } = UseRequestProcessor();
  const logout = useAuthStore((state) => state.logout);

  async function logoutUser(): Promise<any> {
    const autoLogin = useAuthStore.getState().autoLogin;
    localStorage.clear();
    secureLocalStorage.clear();
    if (autoLogin) {
      return {};
    }
    const res = await api.post(`${getURL("LOGOUT")}`);
    return res.data;
  }

  const mutation = mutate(["useLogout"], logoutUser, {
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });

  return mutation;
};
