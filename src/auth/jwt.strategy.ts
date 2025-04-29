import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';  // We'll define the JwtPayload interface next
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract JWT from the 'Authorization' header
            ignoreExpiration: false,
            secretOrKey: 'hamada1234',  // Secret to validate the token (environment variable recommended)
        });
    }

    async validate(payload: JwtPayload) {
        console.log('✅ validate() called. Payload:', payload);

        const user = await this.userRepository.findOne({ where: { id: payload.sub } });

        if (!user) {
            console.log('❌ No user found with ID:', payload.sub);
            throw new UnauthorizedException('Invalid token');
        }

        console.log('✅ User found:', user);
        return user;
    }


}
