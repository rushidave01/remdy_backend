import { getDataSource } from "../config/database";
import { CreateEditorContentRequestDto } from "../dtos/admin/EditorContent/req/create.editor.content.request.dto";
import { User } from "../entities";
import { EditorContent } from "../entities/EditorContent";
import { ContentType } from "../enums";

export class EditorContentService {
  private getEditorContentRepository() {
    return getDataSource().getRepository(EditorContent);
  }

  async createContent(
    contentDto: CreateEditorContentRequestDto
  ): Promise<EditorContent | null> {
    const contentRepository = getDataSource().getRepository(EditorContent);
    const userRepository = getDataSource().getRepository(User);

    try {
      // Validate user exists
      const user = await userRepository.findOne({
        where: { id: contentDto.created_by },
      });
      if (!user) {
        throw new Error("Invalid user ID");
      }

      const newContent = contentRepository.create({
        title: contentDto.title,
        type: contentDto.type,
        html_content: contentDto.html_content,
        status: contentDto.status,
        created_by: user,
        updated_by: user,
      });

      return await contentRepository.save(newContent);
    } catch (error) {
      console.error("Error saving content:", error);
      return null;
    }
  }

  async getContentByType(type: string) {
    try {
      const content = await this.getEditorContentRepository().find({
        where: { type: type as ContentType }, // Cast to enum
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
