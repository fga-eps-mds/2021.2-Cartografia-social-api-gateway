import { Controller, Get, Res } from '@nestjs/common';

@Controller('/')
export class GatewayController {
  @Get('selecionarUsuarios')
  async selecionarUsuarios(@Res() res) {
    return res.redirect('users/selecionarUsuarios');
  }
  @Get('cadastrarComunidade')
  async cadastrarComunidade(@Res() res) {
    return res.redirect('community/cadastrarComunidade');
  }
}
