import { useRef } from 'react';
import { Guard } from '@authing/guard';
const useGuard = (options) => {
    const instance = useRef();
    if (!instance.current) {
        instance.current = new Guard(options);
    }
    return instance.current;
};
export { useGuard };
