import { AuthenticationClient } from 'authing-js-sdk';
import { GuardLocalConfig, GuardEventsKebabToCamelType } from '@authing/react-ui-components';

interface IGuardOptions {
    appId: string;
    config?: Partial<GuardLocalConfig>;
    tenantId?: string;
    authClient?: AuthenticationClient;
}
declare type GuardEventListeners = {
    [key in keyof GuardEventsKebabToCamelType]: Exclude<Required<GuardEventsKebabToCamelType>[key], undefined>[];
};
declare class Guard {
    private appId;
    private config?;
    private tenantId?;
    private authClient?;
    private visible?;
    constructor(options: IGuardOptions);
    private render;
    static getGuardContainer(selector?: string | HTMLElement): Element | null;
    private eventListeners;
    on<T extends keyof GuardEventsKebabToCamelType>(evt: T, handler: Exclude<Required<GuardEventsKebabToCamelType>[T], undefined>): void;
    show(): void;
    hide(): void;
    unmountComponent(): void;
}

export { Guard, GuardEventListeners, IGuardOptions };
