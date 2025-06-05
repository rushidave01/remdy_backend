import { IsArray, ArrayNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ForwardPatientRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  patientIds!: number[];

  @IsOptional()
  @IsNumber()
  doctorId?: number;
}
