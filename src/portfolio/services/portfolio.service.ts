import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../../db/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  findAll(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.find({ where: { owner: { id: userId } } });
  }
}
