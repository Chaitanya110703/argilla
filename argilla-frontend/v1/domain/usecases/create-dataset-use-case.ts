import { DatasetCreation } from "../entities/hub/DatasetCreation";
import { IDatasetRepository } from "../services/IDatasetRepository";
import {
  FieldRepository,
  QuestionRepository,
  WorkspaceRepository,
} from "~/v1/infrastructure/repositories";

export class CreateDatasetUseCase {
  constructor(
    private readonly datasetRepository: IDatasetRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly fieldRepository: FieldRepository
  ) {}

  async execute(dataset: DatasetCreation) {
    if (!dataset.workspace.id) {
      const workspace = await this.workspaceRepository.create(
        dataset.workspace.name
      );

      dataset.workspace.id = workspace.id;
    }

    const datasetCreated = await this.datasetRepository.create({
      name: dataset.name,
      workspaceId: dataset.workspace.id,
    });

    for (const field of dataset.mappedFields) {
      await this.fieldRepository.create(datasetCreated, field);
    }

    for (const question of dataset.questions) {
      await this.questionRepository.create(datasetCreated, question);
    }

    await this.datasetRepository.publish(datasetCreated);

    await this.datasetRepository.import({
      datasetId: datasetCreated,
      name: dataset.name,
      subset: dataset.selectedSubset.name,
      split: dataset.selectedSubset.selectedSplit.name,
    });

    return datasetCreated;
  }
}
