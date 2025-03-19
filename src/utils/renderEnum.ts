import { apiServices } from '../services/ApiService.js';

export async function renderEnum(blockId: number, renderEnumData: string, env: any) {

  const response = await apiServices.get(`blocks/${blockId}/renderEnumData?page=1&limit=3`);

  const enumParser = await Function(`"use strict"; return (${renderEnumData})`)()

  let htmlEnum = null;

  if (typeof enumParser === 'function') {
    htmlEnum = await enumParser({ parameters: { chainId: env.parameters.chainId } }, response.renderEnumData) || []
  }

  return htmlEnum;
}