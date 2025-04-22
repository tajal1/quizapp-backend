import { join } from 'path'

// call-hook.decorator.ts
export function CallHook() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('========8')
        const originalMethod = descriptor.value

        descriptor.value = async function (...args: any[]) {
            const pathToModule = join(__dirname, `../../${this?.request.url.replace('/api', 'domain')}`)

            // Dynamically import the module
            const imports = await import(pathToModule)

            if (imports?.Logics) {
                const LogicClass = imports.Logics
                const instance = new LogicClass()

                // check if execute method exists
                if (typeof instance.execute === 'function') {
                    const result = await instance.execute('Hello what??')

                    if (result) {
                        return { result }
                    }
                }
            }
            return await originalMethod.apply(this, args)
        }

        // Create an instance and call method

        //     try {
        //         const instance = new LogicClass()
        //         const result = instance?.execute('Hello what??')
        //         if (result) return { result }
        //         await originalMethod.apply(this, args)
        //     } catch (error) {}
        // }

        return descriptor
    }
}
