// call-hook.decorator.ts
export function CallHook() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            console.log(`[CallHook] Before ${propertyKey}`);
            const result = await originalMethod.apply(this, args);
            console.log(`[CallHook] After ${propertyKey}`);
            return result;
        };

        return descriptor;
    };
}
