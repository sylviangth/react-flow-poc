export function hasUrls(text: string): boolean {
  // Regular expression for detecting URLs
  const urlRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;
  // Check if the text contains any URLs
  return urlRegex.test(text);
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function extractDomain(url: string): string {
  // Remove protocol (https:// or http://) and slashes
  const withoutProtocol = url.replace(/(^\w+:|^)\/\//, '');
  // Remove query parameters and fragments
  const cleanUrl = withoutProtocol.split(/[?#]/)[0];
  // Extract domain
  const domain = cleanUrl?.split('/')[0];
  return domain || '';
}

export function getDomainFromSubdomain(subdomain: string): string {
  // Split the subdomain into parts using dots
  const subdomainParts = subdomain.split('.');

  // Check if the subdomain has at least one part
  if (subdomainParts.length >= 1) {
    // If it has only one part, it is considered a domain without a subdomain
    // Return the input as the domain
    if (subdomainParts.length === 1) {
      return subdomain;
    }

    // Extract the domain by taking the last two parts
    const domain = subdomainParts.slice(-2).join('.');
    return domain;
  }

  // Return null if the subdomain does not have any parts
  return '';
}

export function hasDatePassed(dateString: Date): boolean {
  const givenDate: Date = new Date(dateString);
  const currentDate: Date = new Date();
  return givenDate.getTime() > currentDate.getTime();
}
