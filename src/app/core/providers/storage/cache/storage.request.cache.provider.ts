import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const MAX_CACHE_AGE = 30000; // in milliseconds
type CacheEntry = { url: string, response: HttpResponse<any>, lastRead: number };

@Injectable({providedIn: "root"})
export class StorageRequestCacheProvider {
   cacheMap = new Map<string, CacheEntry>();

   getCache(httpRequest: HttpRequest<any>): HttpResponse<any> | null {
      const cacheEntry: CacheEntry | undefined = this.cacheMap.get(httpRequest.urlWithParams);
      return !cacheEntry || this.isExpired(cacheEntry) ? null : cacheEntry.response;
   }

   updateCache(httpRequest: HttpRequest<any>, httpResponse: HttpResponse<any>): void {
      const url = httpRequest.urlWithParams;
      const cacheEntry: CacheEntry = { url, response: httpResponse, lastRead: Date.now() };
      this.cacheMap.set(url, cacheEntry);

      if(this.isExpired(cacheEntry)){
         this.deleteExpiredCache();
      }
   }

   isRequestCachable(httpRequest: HttpRequest<any>) {
      return (httpRequest.method.toLowerCase() === 'get'); // && httpRequest.url.includes('');
   }

   private isExpired(cacheEntry: CacheEntry): boolean {
      const expired = Date.now() - cacheEntry.lastRead;
      return expired > MAX_CACHE_AGE;
   }

   private deleteExpiredCache(): void {
      this.cacheMap.forEach((cacheEntry: CacheEntry) => this.cacheMap.delete(cacheEntry.url));
   }
}
