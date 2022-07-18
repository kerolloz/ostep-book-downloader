import cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import got from 'got';
import stream from 'stream';
import { promisify } from 'util';

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
  const downloadStream = got.stream(url);
  const fileWriterStream = createWriteStream(fileName);
  try {
    await pipeline(downloadStream, fileWriterStream);
    console.log(`File downloaded to ${fileName}`);
  } catch (error) {
    console.error('Something went wrong.');
    console.error(error);
  }
}
