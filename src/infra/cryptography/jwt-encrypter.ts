import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwt.signAsync(payload)
  }
}
