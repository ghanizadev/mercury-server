import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { UserId } from '../decorators/user.decorator';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //TODO Move to Chat Module
  @UseGuards(AuthGuard)
  @Post('/by-chat/:chatId/ack')
  private async registerAck(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @UserId() userId: string,
  ) {
    return this.messageService.registerAck(chatId, userId);
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Post('/by-chat/:chatId')
  private async registerMessage(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body('message') message: string,
    @UserId() userId: string,
  ) {
    return this.messageService.registerMessage(chatId, message, userId);
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get('/by-chat/:chatId')
  private async getChatMessages(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Query('cursor') cursor: number,
  ) {
    return this.messageService.getChatMessages(chatId, cursor);
  }
}
