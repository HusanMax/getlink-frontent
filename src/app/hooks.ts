import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useToast() {
  const dispatch = useAppDispatch();
  return {
    success: (message: string) => dispatch({ type: 'ui/addToast', payload: { type: 'success', message } }),
    error: (message: string) => dispatch({ type: 'ui/addToast', payload: { type: 'error', message } }),
    info: (message: string) => dispatch({ type: 'ui/addToast', payload: { type: 'info', message } }),
  };
}
