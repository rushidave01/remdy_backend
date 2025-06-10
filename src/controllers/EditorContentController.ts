import { Request, Response } from "express";
import { ApiResponseDto } from "../dto/res";
import { CreateEditorContentRequestDto } from "../dtos/admin/EditorContent/req/create.editor.content.request.dto";
import { getUserIdFromToken } from "../middleware";
import { EditorContentService } from "../services";

const editorContentService = new EditorContentService();

export class EditorContentController {
  async addOrUpdateContent(req: Request, res: Response): Promise<Response> {
    try {
      const contentDto: CreateEditorContentRequestDto = req.body;

      const result = await editorContentService.addOrUpdateContent(contentDto);

      if (!result) {
        return res
          .status(400)
          .json(new ApiResponseDto(false, "Failed to add or update content"));
      }

      return res
        .status(200)
        .json(
          new ApiResponseDto(
            true,
            result.updated
              ? "Content updated successfully"
              : "Content created successfully",
            result.content
          )
        );
    } catch (error) {
      console.error("Error adding/updating content:", error);
      return res
        .status(500)
        .json(new ApiResponseDto(false, "Internal server error", error));
    }
  }

  async getContentByType(req: Request, res: Response): Promise<Response> {
    try {
      const userId = getUserIdFromToken(req);
      if (userId === null) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
      }
      const { type } = req.query;

      const contentData = await editorContentService.getContentByType(
        userId,
        type as string
      );

      return res
        .status(200)
        .json(
          new ApiResponseDto(true, "Content fetched successfully", contentData)
        );
    } catch (error) {
      console.error("Error fetching content:", error);
      return res
        .status(500)
        .json(
          new ApiResponseDto(
            false,
            "Error while fetching content.",
            undefined,
            error
          )
        );
    }
  }
}
