// Registry to map URLs to DTO classes
export const dtoRegistry = new Map<string, any>()

// Register a DTO for a URL
export function registerDto(url: string, dtoClass: any) {
    dtoRegistry.set(url, dtoClass)
}

// Get DTO class for a URL
export function getDtoClass(url: string): any | undefined {
    return dtoRegistry.get(url)
}
