import fs from 'fs';
import PDFMerger from 'pdf-merger-js';
import { crawl, downloadFile } from './utils';

(async () => {
  const MAX_NUM = 1000;
  const OSTEP_ROOT = 'http://pages.cs.wisc.edu/~remzi/OSTEP/';
  const bookTableSelector = 'html body center table tbody tr td center p table tbody';

  console.log('Scraping OSTEP page...');
  const $ = await crawl(OSTEP_ROOT);
  const chapters = $(bookTableSelector)
    .find('td')
    .map((_, e) => ({ num: parseInt($(e).find('small').text()) || MAX_NUM, href: $(e).find('a').attr('href') }))
    .get()
    .filter((obj) => obj.href)
    .sort((a, b) => a.num - b.num);
  const prefaceIdx = chapters.findIndex((e) => e.href.startsWith('preface'));
  const initialChapters = chapters.splice(prefaceIdx, 2); // preface && TOC
  chapters.unshift(...initialChapters); // move (preface && TOC) chapters to the beginning

  console.log('Downloading PDF chapters...');
  // wait until all the chapters have been downloaded
  await Promise.all(chapters.map((obj, i) => downloadFile(OSTEP_ROOT + obj.href, `${i}.pdf`)));

  console.log('Merging chapters...');
  const merger = new PDFMerger();
  chapters.forEach((_, i) => merger.add(`${i}.pdf`));
  await merger.save('OSTEP.pdf');

  console.log('Cleanup...');
  chapters.forEach((_, i) => fs.unlinkSync(`${i}.pdf`));

  console.log('Done!');
})();
