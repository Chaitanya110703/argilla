/* eslint-disable camelcase */
import { type NuxtAxiosInstance } from "@nuxtjs/axios";

export class HubRepository {
  constructor(private axios: NuxtAxiosInstance) {}

  async getDatasetCreation(repoId: string): Promise<any> {
    const { data } = await this.axios.get(
      `https://datasets-server.huggingface.co/info?dataset=${repoId}`
    );

    const { dataset_info } = data;

    if ("datasets" in dataset_info) return dataset_info.datasets;

    return dataset_info;
  }
}
