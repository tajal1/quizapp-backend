// call-hook.decorator.ts
export function CallHook() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        console.log('========8')
        const originalMethod = descriptor.value;


        descriptor.value = async function (...args: any[]) {
            const req = this?.request;
            console.log('🎯 request in decorator:', req?.url, req?.body);

            console.log('=============', target, propertyKey, ...args)
            console.log(`[CallHook] Before ${propertyKey}`);
            // const result = await originalMethod.apply(this, args);
            console.log(`[CallHook] After ${propertyKey}`);
            // return result;
        };

        return descriptor;
    };
}
