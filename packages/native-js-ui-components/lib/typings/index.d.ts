import { GuardLocalConfig, AuthenticationClient, GuardEventsKebabToCamelType } from '@authing/guard-shim-react';
import '@authing/guard-shim-react/dist/guard.min.css';
export * from '@authing/guard-shim-react';
export interface NativeGuardProps {
    appId?: string;
    config?: Partial<GuardLocalConfig>;
    tenantId?: string;
    authClient?: AuthenticationClient;
}
export interface NativeGuardConstructor {
    (appId?: string | NativeGuardProps, config?: Partial<GuardLocalConfig>, tenantId?: string, authClient?: AuthenticationClient): void;
    (props: NativeGuardProps): void;
}
export declare type GuardEventListeners = {
    [key in keyof GuardEventsKebabToCamelType]: Exclude<Required<GuardEventsKebabToCamelType>[key], undefined>[];
};
export declare class Guard {
    appId?: string;
    config?: Partial<GuardLocalConfig>;
    tenantId?: string;
    authClient?: AuthenticationClient;
    visible?: boolean;
    constructor(props?: NativeGuardProps);
    constructor(appId?: string, config?: Partial<GuardLocalConfig>, tenantId?: string, authClient?: AuthenticationClient);
    static getGuardContainer(selector?: string | HTMLElement): Element | null;
    private eventListeners;
    render(): void;
    render(aliginOrCb: () => void): void;
    render(aliginOrCb: 'none' | 'center' | 'left' | 'right'): void;
    render(aliginOrCb: 'none' | 'center' | 'left' | 'right', callback: () => void): void;
    on<T extends keyof GuardEventsKebabToCamelType>(evt: T, handler: Exclude<GuardEventsKebabToCamelType[T], undefined>): void;
    show(): void;
    hide(): void;
    unmountComponent(): void;
}
