declare module '@authing/native-js-ui-components/App' {
  /// <reference types="react" />
  import './App.css';
  function App(): JSX.Element;
  export default App;

}
declare module '@authing/native-js-ui-components/App.test' {
  export {};

}
declare module '@authing/native-js-ui-components/components/AuthingGuard/index' {
  import { UserConfig, GuardEventsHandlerKebab } from "@authing/react-ui-components";
  import "@authing/react-ui-components/lib/index.min.css";
  export type EventListeners = {
      [key in keyof GuardEventsHandlerKebab]: Exclude<Required<GuardEventsHandlerKebab>[key], undefined>[];
  };
  export class AuthingGuard {
      private appId;
      private config?;
      private tenantId?;
      constructor(appId: string, config?: UserConfig | undefined, tenantId?: string | undefined);
      static getGuardContainer(selector?: string | HTMLElement): Element | null;
      private visible;
      private eventListeners;
      private render;
      on<T extends keyof GuardEventsHandlerKebab>(evt: T, handler: Exclude<GuardEventsHandlerKebab[T], undefined>): void;
      show(): void;
      hide(): void;
  }

}
declare module '@authing/native-js-ui-components/components/Guard/index' {
  import { GuardMode, AuthenticationClient, GuardEventsKebabToCamelType, GuardModuleType, Lang } from "@authing/react-ui-components";
  import "@authing/react-ui-components/lib/index.min.css";
  import { GuardLocalConfig } from "@authing/react-ui-components/components/Guard/config";
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
  export type GuardEventListeners = {
      [key in keyof GuardEventsKebabToCamelType]: Exclude<Required<GuardEventsKebabToCamelType>[key], undefined>[];
  };
  interface GuardOptions {
      appId: string;
      mode?: GuardMode;
      defaultScene?: GuardModuleType;
      lang?: Lang;
      isSSO?: boolean;
      host: string;
      scope?: string;
      redirectUri: string;
      state?: string;
  }
  export class Guard {
      private appId?;
      private visible?;
      private el?;
      constructor(options: GuardOptions);
      static getGuardContainer(selector?: string | HTMLElement): Element | null;
      private eventListeners;
      start(el: string): Promise<unknown>;
      private render;
      on<T extends keyof GuardEventsKebabToCamelType>(evt: T, handler: Exclude<GuardEventsKebabToCamelType[T], undefined>): void;
      show(): void;
      hide(): void;
      unmountComponent(): void;
  }
  export {};

}
declare module '@authing/native-js-ui-components/components/index' {
  import { Guard } from "@authing/native-js-ui-components/components/Guard/index";
  import { AuthingGuard } from "@authing/native-js-ui-components/components/AuthingGuard/index";
  import { User, GuardMode, UserConfig, GuardScenes, LoginMethods, getAuthClient, CommonMessage, initAuthClient, RegisterMethods, GuardEventsHandler, AuthenticationClient, GuardEventsHandlerKebab, GuardEventsCamelToKebabMap, GuardEvents, GuardEventsKebabToCamelType, GuardEventsCamelToKebabMapping, GuardConfig, GuardLocalConfig } from "@authing/react-ui-components";
  export { Guard, AuthingGuard, GuardMode, GuardScenes, LoginMethods, getAuthClient, initAuthClient, RegisterMethods, GuardEventsCamelToKebabMap, GuardEventsCamelToKebabMapping, };
  export type { GuardConfig, GuardLocalConfig, GuardEvents, User, UserConfig, CommonMessage, GuardEventsHandler, AuthenticationClient, GuardEventsHandlerKebab, GuardEventsKebabToCamelType, };

}
declare module '@authing/native-js-ui-components/index' {
  import './index.css';

}
declare module '@authing/native-js-ui-components/reportWebVitals' {
  import { ReportHandler } from 'web-vitals';
  const reportWebVitals: (onPerfEntry?: ReportHandler) => void;
  export default reportWebVitals;

}
declare module '@authing/native-js-ui-components/setupTests' {
  import '@testing-library/jest-dom';

}
declare module '@authing/native-js-ui-components' {
  import main = require('@authing/native-js-ui-components/components/index');
  export = main;
}