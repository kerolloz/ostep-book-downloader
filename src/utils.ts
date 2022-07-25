import cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import got from 'got';
import stream from 'stream';
import { promisify } from 'util';
import Logger from './Logger';

const pipeline = promisify(stream.pipeline);

/**
 * @returns Cheerio to query the html response of the url
 * @param url the url of the page you want to crawl
 */
export async function crawl(url: string): Promise<cheerio.Root> {
  try {
    const response = await got(url);
    return cheerio.load(response.body);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

export async function downloadFile(url: string, fileName: string): Promise<void> {
  Logger.log(fileName, `Downloading ${fileName}...`);
  const downloadStream = got.stream(url);
  const fileWriterStream = createWriteStream(fileName);
  try {
    await pipeline(downloadStream, fileWriterStream);
    Logger.success(fileName, `File "${fileName}" downloaded successfully!`);
  } catch (error) {
    Logger.fail(fileName, `Failed to download "${fileName}"`);
    console.error(error);
  }
}
