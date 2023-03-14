import { Injectable } from '@nestjs/common';
import { PortfolioIdParamDto } from '../common/dtos/portfolio-id-param.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../db/entities';
import { EntityManager, Repository } from 'typeorm';
import { ImageIdParamDto } from '../common/dtos/image-id-param.dto';

@Injectable()
export class ImageService {
  private readonly manager: EntityManager;
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    this.manager = this.imageRepository.manager;
  }

  public findAllByPortfolioId({
    portfolioId,
  }: PortfolioIdParamDto): Promise<Image[]> {
    return this.imageRepository.find({
      where: { portfolio: { id: portfolioId } },
    });
  }

  public findById({ imageId }: ImageIdParamDto): Promise<Image | null> {
    return this.imageRepository.findOne({
      where: { id: imageId },
    });
  }
}
