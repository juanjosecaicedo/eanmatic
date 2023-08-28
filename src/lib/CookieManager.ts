export default class CookieManager {

  static createCookie(name: string, value: string, days: number) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const expires = expirationDate.toUTCString();

    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  static getCookie(name: string): string | null {
    const decodedName = encodeURIComponent(name);
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === decodedName) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  }

  static deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

