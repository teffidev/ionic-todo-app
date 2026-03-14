import { Injectable } from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getValue,
} from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  // Valores por defecto (se usan si Firebase no está disponible)
  private defaults: Record<string, boolean | string | number> = {
    show_category_filter: true, // Feature flag principal
    max_tasks_per_category: 50, // Límite de tareas por categoría
  };

  constructor(private remoteConfig: RemoteConfig) {
    // Configura el tiempo mínimo entre fetches (8h en producción, 0 en dev)
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0, // 0 para desarrollo; usar 28800000 (8h) en prod
      fetchTimeoutMillis: 10000,
    };

    // Establece los valores por defecto en Firebase
    this.remoteConfig.defaultConfig = this.defaults as Record<
      string,
      string | number | boolean
    >;
  }

  // Obtiene el config más reciente de Firebase
  async initialize(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      console.log('[RemoteConfig] Config actualizado desde Firebase');
    } catch (err) {
      console.warn('[RemoteConfig] Usando valores por defecto:', err);
    }
  }

  // Obtiene un valor booleano del Remote Config
  getBoolean(key: string): boolean {
    try {
      return getValue(this.remoteConfig, key).asBoolean();
    } catch {
      return (this.defaults[key] as boolean) ?? false;
    }
  }

  // Obtiene un valor numérico
  getNumber(key: string): number {
    try {
      return getValue(this.remoteConfig, key).asNumber();
    } catch {
      return (this.defaults[key] as number) ?? 0;
    }
  }

  // Obtiene un valor string
  getString(key: string): string {
    try {
      return getValue(this.remoteConfig, key).asString();
    } catch {
      return (this.defaults[key] as string) ?? '';
    }
  }
}
