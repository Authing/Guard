import {
  OnInit,
  Output,
  Component,
  EventEmitter,
  ViewEncapsulation,
  Input,
  OnChanges,
} from '@angular/core';

import {
  AuthenticationClient,
  Guard as NativeGuard,
  GuardEvents,
  GuardLocalConfig,
} from '@authing/native-js-ui-components';

@Component({
  selector: 'guard',
  template: `<div id="guard_container"></div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class GuardComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() guard!: NativeGuard;
  @Input() appId?: string;
  @Input() visible?: boolean;
  @Input() tenantId?: string;
  @Input() authClient?: AuthenticationClient;
  @Input() config?: Partial<GuardLocalConfig>;

  @Output() onLoad = new EventEmitter<
    Parameters<Required<GuardEvents>['onLoad']>
  >();
  @Output() onLoadError = new EventEmitter<
    Parameters<Required<GuardEvents>['onLoadError']>
  >();
  @Output() onLogin = new EventEmitter<
    Parameters<Required<GuardEvents>['onLogin']>
  >();
  @Output() onLoginError = new EventEmitter<
    Parameters<Required<GuardEvents>['onLoginError']>
  >();
  @Output() onRegister = new EventEmitter<
    Parameters<Required<GuardEvents>['onRegister']>
  >();
  @Output() onRegisterError = new EventEmitter<
    Parameters<Required<GuardEvents>['onRegisterError']>
  >();
  @Output() onEmailSend = new EventEmitter<
    Parameters<Required<GuardEvents>['onEmailSend']>
  >();
  @Output() onEmailSendError = new EventEmitter<
    Parameters<Required<GuardEvents>['onEmailSendError']>
  >();
  @Output() onPhoneSend = new EventEmitter<
    Parameters<Required<GuardEvents>['onPhoneSend']>
  >();
  @Output() onPhoneSendError = new EventEmitter<
    Parameters<Required<GuardEvents>['onPhoneSendError']>
  >();
  @Output() onPwdReset = new EventEmitter<
    Parameters<Required<GuardEvents>['onPwdReset']>
  >();
  @Output() onPwdResetError = new EventEmitter<
    Parameters<Required<GuardEvents>['onPwdResetError']>
  >();
  @Output() onClose = new EventEmitter<
    Parameters<Required<GuardEvents>['onClose']>
  >();

  @Output() onLangChange = new EventEmitter<
    Parameters<Required<GuardEvents>['onLangChange']>
  >();
  ngAfterViewInit() {
    // @ts-ignore

    this.guard = new NativeGuard({
      appId: this.appId,
      config: this.config,
      tenantId: this.tenantId,
      authClient: this.authClient,
    });

    this.guard.on('load', (...rest) => this.onLoad.emit(rest));
    this.guard.on('load-error', (...rest) => this.onLoadError.emit(rest));
    this.guard.on('login', (...rest) => this.onLogin.emit(rest));
    this.guard.on('login-error', (...rest) => this.onLoginError.emit(rest));
    this.guard.on('register', (...rest) => this.onRegister.emit(rest));
    this.guard.on('register-error', (...rest) =>
      this.onRegisterError.emit(rest)
    );
    this.guard.on('close', (...rest) => this.onClose.emit(rest));
    this.guard.on('lang-change', (...rest) => this.onLangChange.emit(rest));

    if (this.visible === true) {
      this.guard.show();
    }
  }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.visible !== undefined && this.guard) {
      if (this.visible) {
        this.guard?.show();
      } else {
        this.guard?.hide();
      }
    }
  }
}
