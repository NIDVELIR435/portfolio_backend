import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PortfolioIdParamDto } from '../../common/dtos/portfolio-id-param.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image, Portfolio, User } from '../../db/entities';
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

      if (isNil(portfolio))
        throw new NotFoundException(
          `Cannot found portfolio where id: ${portfolioId}`,
        );

      const newImage: Partial<Image> = { id, description, url, portfolio };

      return transactionalImageRepository.save(newImage);
    });
  }

  removeImage(user: User, param: ImageIdParamDto): Promise<boolean> {
    const { imageId } = param;
    const { id: userId } = user;

    return this.manager.transaction(async (entityManager) => {
      const transactionalImageRepo = await entityManager.getRepository(Image);

      const existImage = await transactionalImageRepo
        .createQueryBuilder('image')
        .select('image.id')
        .leftJoin('image.portfolio', 'portfolio')
        .addSelect('portfolio.id')
        .leftJoin('portfolio.owner', 'owner')
        .addSelect('owner.id')
        .where('image.id = :imageId', { imageId })
        .getOne();

      if (isNil(existImage))
        throw new NotFoundException(`Cannot found image where id: ${imageId}`);

      if (existImage.portfolio.owner.id !== userId)
        throw new ForbiddenException(
          `You can remove image only where you are owner.`,
        );

      return transactionalImageRepo
        .delete({ id: imageId })
        .then(() => true)
        .catch((reason) => {
          throw new ConflictException(reason);
        });
    });
  }
}
