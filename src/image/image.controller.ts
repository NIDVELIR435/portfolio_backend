import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { JWTAuth } from '../auth/decorators/auth.decorator';
import { StatusCodes } from 'http-status-codes';
import { Image, User } from '../db/entities';
import { PortfolioIdParamDto } from '../common/dtos/portfolio-id-param.dto';
import { ImageService } from './services/image.service';
import { ImageIdParamDto } from '../common/dtos/image-id-param.dto';
import { CreateImageDto } from './dtos/create-image.dto';
import { Request } from 'express';

@ApiTags('image')
@Controller('image')
@DecorateAll([JWTAuth()])
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('all/by-portfolio/:portfolioId')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return all images by portfolio',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Image,
        isArray: true,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  getAllImages(@Param() param: PortfolioIdParamDto): Promise<Image[]> {
    return this.imageService.findAllByPortfolioId(param);
  }

  @Get(':imageId')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return particular images',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Image,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  getImage(@Param() param: ImageIdParamDto): Promise<Image | null> {
    return this.imageService.findById(param);
  }

  @Get('upload')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return upload new image',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: Image,
      },
    },
  })
  @HttpCode(StatusCodes.CREATED)
  uploadImage(@Body() body: CreateImageDto): Promise<Image> {
    return this.imageService.uploadImage(body);
  }

  @Delete(':imageId')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful remove image',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Boolean,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  removePortfolio(
    @Req() { user }: Request & { user: User },
    @Param() param: ImageIdParamDto,
  ): Promise<boolean> {
    return this.imageService.removeImage(user, param);
  }
}
