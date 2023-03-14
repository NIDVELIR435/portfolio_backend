import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { get, isNil, isObject } from 'lodash';
import { AppConfigService } from '../../config/app-config.service';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private readonly backendName: string;
  private readonly nodeEnv: string;
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    private readonly appConfigService: AppConfigService, // private readonly telegramService: telegramService,
  ) {
    super(context, options);

    this.backendName = this.appConfigService.backendName;
    this.nodeEnv = appConfigService.nodeEnv;
  }

  override log(message: string, context?: { isHandler: boolean } | string) {
    super.log.apply(this, [message, context]);
  }
  override error(message: string, stack?: string, context?: string) {
    this.sendNotification(message, 'Error while working');

    const args = [];

    if (!isNil(stack)) args.push(stack);
    if (!isNil(context)) args.push(context);

    super.error.apply(this, [message, ...args]);
  }
  override warn(message: string, context?: string) {
    if (isObject(context) && get(context, 'triggeredFromHandler', false))
      return;

    super.warn.apply(this, [message, context]);
  }
  override debug(message: string, context?: string) {
    if (isObject(context) && get(context, 'triggeredFromHandler', false))
      return;

    super.debug.apply(this, [message, context]);
  }
  override verbose(message: string, context?: string) {
    if (isObject(context) && get(context, 'triggeredFromHandler', false))
      return;

    super.debug.apply(this, [message, context]);
  }

  private async sendNotification(message: string, statusMessage: string) {
    //sent alert
    if (!isNil(message)) {
      const context = `[${this.backendName}][${this.nodeEnv}] ${statusMessage}`;
      const text = `Server Logger sent:\n \`\`\`${message}\`\`\``;

      //todo implement telegram serrice
      console.log(context, text);
      // await this.telegramService
      //   .sendTemplateToChat({
      //     blocks: [
      //       {
      //         type: 'header',
      //         text: {
      //           type: 'plain_text',
      //           text: context,
      //           emoji: false,
      //         },
      //       },
      //       {
      //         type: 'section',
      //         fields: [
      //           {
      //             text,
      //             type: 'mrkdwn',
      //           },
      //         ],
      //       },
      //     ],
      //   })
      //   .finally(() => {
      //     super.debug.apply(this, [
      //       'Error Message was sent',
      //       simple context
      // 'ExceptionsHandler',
      // ]);
      // });
    }
  }
}
