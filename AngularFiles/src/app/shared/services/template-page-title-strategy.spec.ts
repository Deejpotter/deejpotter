import {Title} from '@angular/platform-browser';
import {TemplatePageTitleStrategy} from './template-page-title-strategy';

// Create a mock for the Title service from Angular
class MockTitle extends Title {
  override getTitle(): string {
    return '';
  }
}

describe('TemplatePageTitleStrategy', () => {
  it('should create an instance', () => {
    // Create a mock Document object
    const mockDocument = document.implementation.createHTMLDocument('Mock Document');

    // Instantiate the mock Title service with the mock Document object
    const mockTitleService = new MockTitle(mockDocument);

    // Provide the mock Title service when creating a new instance of TemplatePageTitleStrategy
    expect(new TemplatePageTitleStrategy(mockTitleService)).toBeTruthy();
  });
});
