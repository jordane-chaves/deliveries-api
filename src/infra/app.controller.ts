import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  async handle() {
    return 'Hello World!'
  }
}
