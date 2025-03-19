import { apiServices } from '../services/ApiService.js';

export async function renderEnum(blockId: number, renderEnumData: string, env: any, page?: number, limit?: number) {

  const response = await apiServices.get(`blocks/${blockId}/renderEnumData?page=${page || 1}&limit=${limit || 50}`);

  const enumParser = await Function(`"use strict"; return (${renderEnumData})`)()

  let htmlEnum = null;

  if (typeof enumParser === 'function') {
    htmlEnum = await enumParser({ parameters: { chainId: env.parameters.chainId } }, response.renderEnumData) || []
  }

  return htmlEnum;
}