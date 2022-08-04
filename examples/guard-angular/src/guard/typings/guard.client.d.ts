import { InjectionToken } from '@angular/core';
import { Guard } from '@authing/guard';
import { GuardClientConfig } from './guard.config';
export declare const GuardClientService: InjectionToken<Guard>;
export declare class GuardClientFactory {
    static createClient(configFactory: GuardClientConfig): Guard;
}
