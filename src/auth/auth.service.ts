import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async singup(dto: AuthDto) {
    //Generate hash password
    const hash = await argon2.hash(dto.password);
    //Save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken");
        }
      }
      throw error;
    }
  }
  async singin(dto: AuthDto) {
    //Find the user be email

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    //If user not found throw error

    if (!user) throw new ForbiddenException("Credentials invalid");

    const pwMatches = await argon2.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException("Credentials invalid");

    delete user.hash;

    return user;
  }
}
