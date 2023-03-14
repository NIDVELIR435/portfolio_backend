import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio, User } from '../../db/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreatePortfolioDto } from '../dtos/create-portfolio.dto';
import { isNil } from 'lodash';

@Injectable()
export class PortfolioService {
  private readonly manager: EntityManager;
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {
    this.manager = this.portfolioRepository.manager;
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
        throw new BadRequestException(
          `Portfolio with name: ${name} already exist`,
        );

      return transactionalPortfolioRepo.save({ ...body, owner: user });
    });
  }
}
