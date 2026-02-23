import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'branch'],
    });

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Retornar usuario completo con rol
    return {
      id: user.id,
      email: user.email,
      role: user.role, // 👈 IMPORTANTE: Incluir rol
      full_name: user.full_name,
      company_id: user.company_id,
      branch_id: user.branch_id,
    };
  }
}
