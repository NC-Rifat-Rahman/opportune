import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    console.log("ctx",ctx);
    console.log("req",req);
    
    
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];

    console.log("email",email);
    console.log("password",password);

    if (!email || !password) {
      throw new UnauthorizedException('Missing credentials');
    }

    // Find user and verify password
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Attach user to context
    ctx.getContext().user = user;

    return true;
  }
}