import React from "react";
import ReactDOM from "react-dom";
import { AuthingGuard as ReactAuthingGuard } from "@authing/react-ui-components";
import {
  GuardMode,
  UserConfig,
  GuardEventsHandler,
  GuardEventsHandlerKebab,
  GuardEventsCamelToKebabMap,
} from "@authing/react-ui-components";
import "@authing/react-ui-components/lib/index.min.css";

export type EventListeners = {
  [key in keyof GuardEventsHandlerKebab]: Exclude<Required<GuardEventsHandlerKebab>[key], undefined>[];
};

export class AuthingGuard {
  constructor(private appId: string, private config?: UserConfig, private tenantId?: string) {
    this.render();
  }

  static getGuardContainer(selector?: string | HTMLElement) {
    const defaultId = "authing_guard_container";

    if (!selector) {
      let container = document.querySelector(`#${defaultId}`);
      if (!container) {
        container = document.createElement("div");
        container.id = defaultId;
        document.body.appendChild(container);
      }

      return container;
    }

    if (typeof selector === "string") {
      return document.querySelector(selector);
    }

    return selector;
  }

  private visible = this.config?.mode === GuardMode.Modal ? false : true;

  private eventListeners = Object.values(GuardEventsCamelToKebabMap).reduce((acc, evtName) => {
    return Object.assign({}, acc, {
      [evtName]: [],
    });
  }, {} as EventListeners);

  private render(cb?: () => void) {
    const evts: GuardEventsHandler = Object.entries(GuardEventsCamelToKebabMap).reduce((acc, [reactEvt, nativeEvt]) => {
      return Object.assign({}, acc, {
        [reactEvt]: (...rest: any) => {
          if (nativeEvt === "close") {
            this.hide();
          }

          // TODO 返回最后一个执行函数的值，实际应该只让监听一次
          return (
            this.eventListeners[nativeEvt]
              // @ts-ignore
              .map((item: any) => {
                return item(...rest);
              })
              .slice(-1)[0] ?? true
          );
        },
      });
    }, {} as GuardEventsHandler);

    return ReactDOM.render(
      <ReactAuthingGuard
        {...evts}
        appId={this.appId}
        tenantId={this.tenantId}
        config={this.config}
        visible={this.visible}
      />,
      AuthingGuard.getGuardContainer(this.config?.target),
      cb
    );
  }

  on<T extends keyof GuardEventsHandlerKebab>(evt: T, handler: Exclude<GuardEventsHandlerKebab[T], undefined>) {
    this.eventListeners[evt]!.push(handler as any);
  }

  show() {
    this.visible = true;
    this.render();
  }

  hide() {
    this.visible = false;
    this.render();
  }
}
