import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio, User } from '../../db/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreatePortfolioDto } from '../dtos/create-portfolio.dto';
import { isNil } from 'lodash';
import { PortfolioIdParamDto } from '../../common/dtos/portfolio-id-param.dto';

@Injectable()
export class PortfolioService {
  private readonly manager: EntityManager;
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {
    this.manager = this.portfolioRepository.manager;
  }

  findOne(
    userId: number,
    { portfolioId }: PortfolioIdParamDto,
  ): Promise<Portfolio> {
    return this.portfolioRepository.findOne({
      where: { owner: { id: userId }, id: portfolioId },
    });
  }

  findAll(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.find({ where: { owner: { id: userId } } });
  }

  createPortfolio(user: User, body: CreatePortfolioDto): Promise<Portfolio> {
    const { name } = body;
    const { id: userId } = user;

    return this.manager.transaction(async (entityManager) => {
      const transactionalPortfolioRepo = await entityManager.getRepository(
        Portfolio,
      );

      const existPortfolio = await transactionalPortfolioRepo
        .createQueryBuilder('portfolio')
        .select('portfolio.id')
        .where('LOWER(portfolio.name)  = :name and portfolio.owner = :userId', {
          name: name.toLowerCase(),
          userId,
        })
        .getOne();

      if (!isNil(existPortfolio))
        throw new ConflictException(
          `Portfolio with name: ${name} already exist`,
        );

      return transactionalPortfolioRepo.save({ ...body, owner: user });
    });
  }

  removePortfolio(user: User, param: PortfolioIdParamDto): Promise<boolean> {
    const { portfolioId } = param;
    const { id: userId } = user;

    return this.manager.transaction(async (entityManager) => {
      const transactionalPortfolioRepo = await entityManager.getRepository(
        Portfolio,
      );

      const existPortfolio = await transactionalPortfolioRepo.findOne({
        select: {
          id: true,
          owner: { id: true },
        },
        relations: { owner: true },
        where: { id: portfolioId },
      });

      if (isNil(existPortfolio))
        throw new NotFoundException(
          `Cannot found portfolio where id: ${portfolioId}`,
        );

      if (existPortfolio.owner.id !== userId)
        throw new ForbiddenException(
          `You can remove portfolio only where you are owner.`,
        );

      return transactionalPortfolioRepo
        .delete({ id: portfolioId })
        .then(() => true)
        .catch((reason) => {
          throw new ConflictException(reason);
        });
    });
  }
}
