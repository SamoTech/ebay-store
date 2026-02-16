/**
 * Image Optimization Utilities
 * 
 * Helpers for image optimization, blur placeholders, and responsive images.
 */

/**
 * Generate blur data URL for image placeholder
 * 
 * @param width - Image width
 * @param height - Image height
 * @param color - Base color (hex)
 * @returns Base64 encoded SVG blur placeholder
 */
export function generateBlurDataURL(
  width: number = 400,
  height: number = 300,
  color: string = '#E5E7EB'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <rect x="${width * 0.3}" y="${height * 0.4}" width="${width * 0.4}" height="${height * 0.2}" fill="#D1D5DB" rx="4"/>
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate srcSet for responsive images
 * 
 * @param baseUrl - Base image URL
 * @param sizes - Array of widths
 * @returns srcSet string
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map(size => {
      // For eBay images, use their image resizing service
      if (baseUrl.includes('ebayimg.com')) {
        return `${baseUrl}?w=${size} ${size}w`
      }
      return `${baseUrl} ${size}w`
    })
    .join(', ')
}

/**
 * Get optimized image URL for eBay images
 * 
 * @param url - Original image URL
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function optimizeEbayImage(
  url: string,
  width: number = 800,
  quality: number = 85
): string {
  if (!url) return ''
  
  // eBay images support URL parameters for resizing
  if (url.includes('ebayimg.com') || url.includes('ebaystatic.com')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}w=${width}&q=${quality}`
  }
  
  return url
}

/**
 * Extract dominant color from image URL (stub for future implementation)
 * 
 * In production, you might want to use a service or library like:
 * - node-vibrant
 * - color-thief
 * - Cloudinary's auto-color feature
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  // TODO: Implement actual color extraction
  // For now, return a default gray
  return '#E5E7EB'
}

/**
 * Check if image URL is valid and accessible
 */
export async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('image/')
  } catch {
    return false
  }
}

/**
 * Get fallback image URL
 */
export function getFallbackImage(
  width: number = 400,
  height: number = 300,
  text: string = 'No Image'
): string {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`
}
