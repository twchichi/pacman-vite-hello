/**
 * Placeholder for the services layer.
 *
 * ServiceLocator provides a simple IoC container so that
 * services can be registered and resolved by type.
 */

type ServiceKey = string | symbol;

export class ServiceLocator {
  private static instance: ServiceLocator | null = null;
  private services = new Map<ServiceKey, unknown>();

  static get(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  register<T>(key: ServiceKey, service: T): void {
    this.services.set(key, service);
  }

  resolve<T>(key: ServiceKey): T | undefined {
    return this.services.get(key) as T | undefined;
  }

  clear(): void {
    this.services.clear();
  }
}
