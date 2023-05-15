import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../db/entities';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { SignInDto } from '../../auth/dto/sign-in.dto';
import { AppConfigService } from '../../config/app-config.service';
import { hash } from 'bcrypt';
import { PureUserDto } from '../dtos/pure-user.dto';
import { UpdateUserUiThemeBodyDto } from '../dtos/update-user-ui-theme.body.dto';

@Injectable()
export class UserService {
  private readonly manager: EntityManager;
  private readonly bcryptSaltRound: number;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly appConfigService: AppConfigService,
  ) {
    this.manager = this.userRepository.manager;
    this.bcryptSaltRound = this.appConfigService.bcryptSalt;
  }

  public async createUser(body: CreateUserDto): Promise<PureUserDto> {
    return this.manager.transaction(async (entityManager) => {
      const transactionalUserRepo = await entityManager.getRepository(User);
      const { email, password, ...rest } = body;

      const existUser = (await transactionalUserRepo.findOne({
        select: { id: true },
        where: { email },
      })) as unknown as Promise<Pick<User, 'id'>>;

      if (!isNil(existUser))
        throw new ConflictException(`User with email: ${email} already exist`);

      const hashedPassword = await hash(password, this.bcryptSaltRound);

      return transactionalUserRepo.save({
        email,
        password: hashedPassword,
        ...rest,
      });
    });
  }

  public async findOneByEmail(email: string): Promise<PureUserDto | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async findOneById(id: number): Promise<PureUserDto | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  updateUserUiTheme(
    userId: number,
    body: UpdateUserUiThemeBodyDto,
  ): Promise<boolean> {
    return this.userRepository
      .update({ id: userId }, { uiTheme: body.uiTheme })
      .then(() => true);
  }

  public async removeUser(id: number): Promise<boolean> {
    return this.manager.transaction(async (entityManager) => {
      const transactionalUserRepo = await entityManager.getRepository(User);

      const existUser = (await transactionalUserRepo.findOne({
        select: { id: true },
        where: { id },
      })) as unknown as Promise<Pick<User, 'id'>>;

      if (isNil(existUser))
        throw new NotFoundException(`Cannot found user where id: ${id}.`);

      return transactionalUserRepo
        .delete({ id })
        .then(() => true)
        .catch((reason) => {
          throw new ConflictException(reason);
        });
    });
  }
}
