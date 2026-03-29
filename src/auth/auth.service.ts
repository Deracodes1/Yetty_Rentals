import { UsersService } from './../users/users.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { registerDto } from './dto/register-auth.dto';
import { loginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async register(dto: registerDto) {
    const { password, email, ...otherData } = dto;

    // check if user with this email already exists in the db
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      // if there is a user that the email matches the oen in the payload
      throw new ConflictException(
        'this Email is a already registered by a user',
      );
    }

    //hashing of password with bycrypt(using 10 salt rounds)
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...otherData,
      email,
      password: hashedPassword,
    });
    return this.login({ email: user.email, password: password }); //this auto logs in the user after account creation
  }

  async login(dto: loginDto) {
    const { email, password } = dto;

    // find user in postgres
    const user = await this.usersService.findByEmail(email as string);
    if (!user) throw new UnauthorizedException('incorrect email or password');

    // compare hashed password with user password
    const isMatch = await bcrypt.compare(password as string, user.password);
    if (!isMatch)
      throw new UnauthorizedException('incorrect email or password');

    // create ticket payload with user details taht wull be used to sign the jwt
    const payload = { sub: user.id, email: user.email, role: user.role };

    // return the jwt token
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
