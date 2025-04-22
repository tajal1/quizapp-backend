import { Users } from "src/domain/v1/users";
import { join } from 'path';

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



            const url = req.url; // e.g., /api/v1/users
            const pathModule = url.replace('/api', 'domain') + '.ts';
            const newUsers = new Users()

            const modulePath = pathModule.replace(/\//g, '/'); // normalize slashes
            const pathToModule = join(__dirname, '../../domain/v1/users');
            // Dynamically import the module
            const logic = await import(pathToModule);

            // Access the exported class
            const UsersClass = logic.Users;

            // Create an instance and call method
            const instance = new UsersClass();
            const result = instance.neame();
            return { result }

            console.log(result); // 👉 'My name is tajal'

            // console.log('=============', target, propertyKey, ...args)
            // console.log(`[CallHook] Before ${propertyKey}`);
            // const result = await originalMethod.apply(this, args);
            // console.log(`[CallHook] After ${propertyKey}`);
            // return result;
        };

        return descriptor;
    };
}
