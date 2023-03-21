import { PickType } from '@nestjs/swagger';
import { User } from '../../db/entities';

export class UpdateUserUiThemeBodyDto extends PickType(User, ['uiTheme']) {}
