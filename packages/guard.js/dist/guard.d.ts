declare module 'guard.js/index' {
  import { GuardMode, GuardEvents, GuardEventsKebabToCamelType, GuardEventsCamelToKebabMapping, GuardModuleType, Lang, User, UserConfig, GuardScenes, LoginMethods, getAuthClient, CommonMessage, initAuthClient, RegisterMethods, GuardEventsHandler, GuardEventsHandlerKebab, GuardEventsCamelToKebabMap, GuardConfig } from '@authing/react-ui-components';
  import '@authing/react-ui-components/lib/index.min.css';
  import { GuardLocalConfig } from '@authing/react-ui-components/components/Guard/config';
  import { AuthenticationClient, AuthenticationClientOptions } from 'authing-js-sdk';
  export { GuardMode, GuardScenes, LoginMethods, getAuthClient, initAuthClient, RegisterMethods, GuardEventsCamelToKebabMap, GuardEventsCamelToKebabMapping };
  export type { GuardConfig, GuardLocalConfig, GuardEvents, User, UserConfig, CommonMessage, GuardEventsHandler, AuthenticationClient, GuardEventsHandlerKebab, GuardEventsKebabToCamelType, };
  export type GuardEventListeners = {
      [key in keyof GuardEventsKebabToCamelType]: Exclude<Required<GuardEventsKebabToCamelType>[key], undefined>[];
  };
  type CodeMethod = 'S256' | 'plain';
  interface GuardOptions {
      appId: string;
      mode?: GuardMode;
      defaultScenes?: GuardModuleType;
      tenantId?: string;
      lang?: Lang;
      isSSO?: boolean;
      host: string;
      scope?: string;
      redirectUri: string;
      state?: string;
      config?: Partial<GuardLocalConfig>;
      authClientOptions?: AuthenticationClientOptions;
  }
  export class Guard {
      private appId?;
      private tenantId?;
      private config?;
      private visible?;
      private el?;
      authClient: AuthenticationClient;
      constructor(options: GuardOptions);
      static getGuardContainer(selector?: string | HTMLElement): Element | null;
      private eventListeners;
      /**
       * 启动嵌入模式
       * @param el String
       * @returns Promise
       */
      start(el: string): Promise<unknown>;
      /**
       * 启动跳转模式
       * @param {String} codeChallengeDigestMethod 'S256' | 'plain'
       * @param {String} codeChallengeMethod 'S256' | 'plain'
       */
      startWithRedirect(codeChallengeDigestMethod?: CodeMethod, codeChallengeMethod?: CodeMethod): void;
      handleRedirectCallback(): Promise<void>;
      private getAccessTokenByCode;
      private getCodeAndCodeChallenge;
      private setStorageCache;
      private parseUrlQuery;
      /**
       * 获取当前用户信息
       */
      trackSession(): Promise<User | null>;
      logout(): void;
      updateIdToken(): Promise<import("authing-js-sdk").RefreshToken>;
      private render;
      on<T extends keyof GuardEventsKebabToCamelType>(evt: T, handler: Exclude<GuardEventsKebabToCamelType[T], undefined>): void;
      show(): void;
      hide(): void;
      unmountComponent(): void;
  }

}
declare module 'guard.js' {
  import main = require('guard.js/components/guard');
  export = main;
}