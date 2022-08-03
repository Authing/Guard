import { Guard } from '@authing/guard';
import { createContext } from 'react';

const GuardContext = createContext<Guard | null>(null);

export default GuardContext;
