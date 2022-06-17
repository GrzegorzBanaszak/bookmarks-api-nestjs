import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthService {
    singin() {
        return { msg: "i am singin" };
    }
    singup() {
        return { msg: "i am singup" };
    }
}