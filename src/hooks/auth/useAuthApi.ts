
import { useAuthCore } from "./useAuthCore";
import { useProfileManagement } from "./useProfileManagement";
import { useAccountManagement } from "./useAccountManagement";

export const useAuthApi = () => {
  const { loading: coreLoading, signUp, signIn, signOut } = useAuthCore();
  const { loading: profileLoading, updatePassword, updateProfile } = useProfileManagement();
  const { loading: accountLoading, deleteAccount, resetSalesData } = useAccountManagement();

  return {
    loading: coreLoading || profileLoading || accountLoading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    updateProfile,
    deleteAccount,
    resetSalesData
  };
};
