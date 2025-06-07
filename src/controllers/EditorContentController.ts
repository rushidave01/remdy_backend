import { Request, Response } from "express";
import { ApiResponseDto } from "../dto/res";
import { CreateEditorContentRequestDto } from "../dtos/admin/EditorContent/req/create.editor.content.request.dto";
import { EditorContentService } from "../services";
import { getUserIdFromToken } from "../middleware";

const editorContentService = new EditorContentService();

export class EditorContentController {
  async createContent(req: Request, res: Response): Promise<Response> {
    try {
      const contentDto: CreateEditorContentRequestDto = req.body;

      const savedContent = await editorContentService.createContent(contentDto);

      if (!savedContent) {
        return res
          .status(400)
          .json(new ApiResponseDto(false, "Failed to create content"));
      }

      return res
        .status(201)
        .json(
          new ApiResponseDto(true, "Content created successfully", savedContent)
        );
    } catch (error) {
      console.error("Error creating content:", error);
      return res
        .status(500)
        .json(new ApiResponseDto(false, "Error while saving content", error));
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
