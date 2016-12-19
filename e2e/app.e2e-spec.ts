import { BrowserTranscribePage } from './app.po';

describe('browser-transcribe App', function() {
  let page: BrowserTranscribePage;

  beforeEach(() => {
    page = new BrowserTranscribePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
