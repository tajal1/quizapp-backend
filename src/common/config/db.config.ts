import mongoose, { Connection } from 'mongoose';
import {ConfigService} from "@nestjs/config";
class DBConnection {
    private static instance: DBConnection;
    public referenceConnection: Connection;
    public posConnection: Connection;
    public testConnection: Connection;

    private constructor(configService:ConfigService) {
        this.referenceConnection = mongoose.createConnection(configService.get<string>('db.connection.reference.url'),);
        this.posConnection = mongoose.createConnection(configService.get<string>('db.connection.pos.url'),);
        this.testConnection = mongoose.createConnection(configService.get<string>('db.connection.pos.url'),);
    }

    public static getInstance(configService:ConfigService): DBConnection {
        if (!DBConnection.instance) DBConnection.instance = new DBConnection(configService);
        return DBConnection.instance;
    }
}

export { DBConnection };
