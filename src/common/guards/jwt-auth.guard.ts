import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])


        // const rolesForRequest = this.reflector.getAllAndOverride('roles', [
        //     context.getHandler(),
        //     context.getClass(),
        // ])

        // console.log(rolesForRequest)
        if(isPublic) {
            return true;
        }
        return super.canActivate(context)
    }

    // rolesAuth(rolesForRequest, context) {

    // }
}