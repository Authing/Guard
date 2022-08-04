import { InjectionToken } from '@angular/core';
import { GuardOptions } from '@authing/guard';
export declare const GuardConfigService: InjectionToken<GuardOptions>;
export declare class GuardClientConfig {
    private options?;
    constructor(options?: GuardOptions);
    set(options: GuardOptions): void;
    get(): GuardOptions;
}
