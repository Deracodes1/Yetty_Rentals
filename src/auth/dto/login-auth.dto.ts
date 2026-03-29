import { PartialType } from '@nestjs/mapped-types';
import { registerDto } from './register-auth.dto';

export class loginDto extends PartialType(registerDto) {}
