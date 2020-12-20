//https://gist.github.com/the-vampiire/a564af41ed0ce8eb7c30dbe6c0f627d8

export interface CookieFlags {
  Path?: string;
  Expires?: Date;
  HttpOnly?: boolean;
  SameSite?: 'Strict' | 'Lax' | 'None';
}

export interface ExtractedCookie {
  value: string;
  flags: CookieFlags;
}
export type ExtractedCookies = Record<string, ExtractedCookie>;

export const shapeFlags: (flags) => CookieFlags = (flags) =>
  flags.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=');
    // edge case where a cookie has a single flag and "; " split results in trailing ";"
    const value = rawValue ? rawValue.replace(';', '') : true;
    return { ...shapedFlags, [flagName]: value };
  }, {});

export const extractCookies: (headers) => ExtractedCookies = (headers) => {
  const cookies = headers['set-cookie']; // Cookie[]

  return cookies.reduce((shapedCookies, cookieString) => {
    const [rawCookie, ...flags] = cookieString.split('; ');
    const [cookieName, value] = rawCookie.split('=');
    return { ...shapedCookies, [cookieName]: { value, flags: shapeFlags(flags) } };
  }, {});
};
