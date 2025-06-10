import { getDataSource } from "../config/database";
import { CreateEditorContentRequestDto } from "../dtos/admin/EditorContent/req/create.editor.content.request.dto";
import { User } from "../entities";
import { EditorContent } from "../entities/EditorContent";
import { ContentType } from "../enums";

export class EditorContentService {
  private getEditorContentRepository() {
    return getDataSource().getRepository(EditorContent);
  }

  async addOrUpdateContent(
    contentDto: CreateEditorContentRequestDto
  ): Promise<{ content: EditorContent; updated: boolean } | null> {
    const contentRepo = getDataSource().getRepository(EditorContent);
    const userRepo = getDataSource().getRepository(User);

    try {
      const user = await userRepo.findOne({
        where: { id: contentDto.created_by },
      });
      if (!user) throw new Error("Invalid user ID");

      // Check if content already exists for this admin
      let existingContent = await contentRepo.findOne({
        where: { created_by: { id: user.id } },
        relations: ["created_by"],
      });

      if (existingContent) {
        // Update existing
        existingContent.title = contentDto.title;
        existingContent.type = contentDto.type;
        existingContent.html_content = contentDto.html_content;
        existingContent.status = contentDto.status;
        existingContent.updated_by = user;
        existingContent.updated_at = new Date();

        const updated = await contentRepo.save(existingContent);
        return { content: updated, updated: true };
      } else {
        // Create new
        const newContent = contentRepo.create({
          title: contentDto.title,
          type: contentDto.type,
          html_content: contentDto.html_content,
          status: contentDto.status,
          created_by: user,
          updated_by: user,
        });

        const created = await contentRepo.save(newContent);
        return { content: created, updated: false };
      }
    } catch (error) {
      console.error("Error addOrUpdateContent:", error);
      return null;
    }
  }

  async getContentByType(userId: number, type: string) {
    try {
      const content = await this.getEditorContentRepository().find({
        where: { created_by: { id: userId }, type: type as ContentType }, // Cast to enum
        order: { created_at: "DESC" },
      });

      return {
        total_content: content.length,
        all_content: content,
      };
    } catch (error) {
      console.error("Error fetching content by type:", error);
      throw new Error("Failed to fetch content by type");
    }
  }
}
