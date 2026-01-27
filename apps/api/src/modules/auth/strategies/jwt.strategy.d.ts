import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map