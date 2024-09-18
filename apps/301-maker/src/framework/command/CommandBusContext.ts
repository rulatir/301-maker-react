// src/CommandBusContext.ts
import React from 'react';
import { CommandBus } from './CommandBus';

export const CommandBusContext = React.createContext<CommandBus | null>(null);