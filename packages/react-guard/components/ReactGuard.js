import '@authing/guard/dist/esm/guard.css';
import React from 'react';
import GuardContext from './context/GuardContext';
import { useGuard } from './hooks/useGuard';
/**
 * React Guard 组件
 */
const ReactGuard = props => {
    const guard = useGuard(props);
    return (React.createElement(GuardContext.Provider, { value: guard }, props.children));
};
export { ReactGuard };
