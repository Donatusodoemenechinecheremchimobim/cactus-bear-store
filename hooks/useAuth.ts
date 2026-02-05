import { useContext } from 'react';
import { useAuthContext } from '@/components/AuthProvider';

// This simply redirects to our new robust Context
export function useAuth() {
  return useAuthContext();
}