import { ContentType } from "../../../../enums";

export class CreateEditorContentRequestDto {
  title!: string;
  type!: ContentType;
  html_content!: string;
  status!: boolean;
  created_by!: number; // User ID
}
