// Actions for loading state
export const LOADING = 'LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';

// Action creators
export const loadingAction = () => ({ type: LOADING });
export const finishLoadingAction = () => ({ type: FINISH_LOADING });