import { Controller, Get } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagEntity } from './tag.entity'

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    async findAll(): Promise<TagEntity[] | null> {
        return await this.tagService.findAll()
    }
}
