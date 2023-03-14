import { Injectable, NotFoundException } from '@nestjs/common';
import { PortfolioIdParamDto } from '../../common/dtos/portfolio-id-param.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image, Portfolio } from '../../db/entities';
import { EntityManager, Repository } from 'typeorm';
import { ImageIdParamDto } from '../../common/dtos/image-id-param.dto';
import { CreateImageDto } from '../dtos/create-image.dto';
import { isNil } from 'lodash';

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

  public uploadImage(body: CreateImageDto): Promise<Image> {
    const { portfolioId, id, description, url } = body;

    return this.manager.transaction(async (entityManager) => {
      const transactionalImageRepository = entityManager.getRepository(Image);
      const transactionalPortfolioRepository =
        entityManager.getRepository(Portfolio);

      const portfolio = !isNil(portfolioId)
        ? await transactionalPortfolioRepository.findOne({
            select: { id: true },
            where: { id: portfolioId },
          })
        : null;

      if (!isNil(portfolioId) && isNil(portfolio))
        throw new NotFoundException(
          `Cannot found portfolio where id: ${portfolioId}`,
        );

      const newImage: Partial<Image> = { id, description, url };

      if (!isNil(portfolioId)) newImage.portfolio = portfolio;

      return transactionalImageRepository.save(newImage);
    });
  }
}
