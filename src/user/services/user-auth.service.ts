import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from '../../db/entities';
import { AppConfigService } from '../../config/app-config.service';
import { hash } from 'bcrypt';
import { isNil } from 'lodash';

@Injectable()
export class UserAuthService {
  private readonly manager: EntityManager;
  private readonly bcryptSaltRound: number;

  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    private readonly appConfigService: AppConfigService,
  ) {
    this.manager = this.userAuthRepository.manager;
    this.bcryptSaltRound = this.appConfigService.bcryptSalt;
  }

  async setCurrentRefreshToken({
    refreshToken,
    userId,
    salt,
  }: {
    refreshToken: string;
    userId: number;
    salt: number;
  }): Promise<boolean> {
    return this.manager
      .transaction('SERIALIZABLE', async (entityManager) => {
        const userAuthTransactional = entityManager.getRepository(UserAuth);

        const userCondition = { user: { id: userId } };
        const hashCondition = { refreshToken: await hash(refreshToken, salt) };

        const userAuth = (await userAuthTransactional.findOne({
          select: { id: true },
          where: userCondition,
        })) as Pick<UserAuth, 'id'>;

        if (isNil(userAuth)) {
          return await userAuthTransactional.save({
            ...userCondition,
            ...hashCondition,
          });
        }

        return await userAuthTransactional.update(userCondition, hashCondition);
      })
      .then(() => true);
  }

  public async findOneByUserId(
    userId: number,
  ): Promise<Omit<UserAuth, 'user'> | null> {
    return await this.userAuthRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  public async removeRefreshToken(email: string): Promise<boolean> {
    return this.manager
      .transaction(async (entityManager) =>
        entityManager.getRepository(UserAuth).delete({ user: { email } }),
      )
      .then(() => true);
  }
}
