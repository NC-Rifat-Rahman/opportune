import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const email = req.headers['email'];
    const password = req.headers['password'];

    console.log("email",email);
    console.log("password",password);

    if (!email || !password) {
      throw new UnauthorizedException('Missing credentials');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    ctx.getContext().user = user;

    return true;
  }
}