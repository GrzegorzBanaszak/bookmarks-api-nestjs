import { AuthDto } from "./dto";
import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("singup")
  singup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.singup(dto);
  }
  @Post("singin")
  singin(@Body() dto: AuthDto) {
    return this.authService.singin(dto);
  }
}
