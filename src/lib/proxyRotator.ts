import { ProxyAgent } from "undici";

/**
 * A simple utility to rotate IP proxies for web scraping.
 * Proxies should be provided as a comma-separated string in the PROXY_LIST env variable.
 * Example: PROXY_LIST="http://user:pass@proxy1.com:8080,http://user:pass@proxy2.com:8080"
 */
export class ProxyRotator {
  private proxies: string[];
  private currentIndex: number;

  constructor() {
    const rawList = process.env.PROXY_LIST || "";
    this.proxies = rawList.split(",").map(p => p.trim()).filter(p => p.length > 0);
    this.currentIndex = 0;
  }

  /**
   * Returns a random ProxyAgent if proxies are configured, otherwise undefined.
   */
  getRandomAgent(): ProxyAgent | undefined {
    if (this.proxies.length === 0) return undefined;
    
    // Pick a random proxy
    const proxyUrl = this.proxies[Math.floor(Math.random() * this.proxies.length)];
    return new ProxyAgent(proxyUrl);
  }

  /**
   * Returns the next ProxyAgent in a round-robin fashion.
   */
  getRoundRobinAgent(): ProxyAgent | undefined {
    if (this.proxies.length === 0) return undefined;

    const proxyUrl = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return new ProxyAgent(proxyUrl);
  }

  /**
   * Get the number of loaded proxies.
   */
  getProxyCount(): number {
    return this.proxies.length;
  }
}

// Export a singleton instance for global use
export const proxyRotator = new ProxyRotator();
