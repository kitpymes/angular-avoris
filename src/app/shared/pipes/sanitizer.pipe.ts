import { Pipe, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: "safeHtml", standalone: true })
  export class SafeHtmlPipe {
	private sanitizer: DomSanitizer = inject(DomSanitizer);
	transform = (html: string) => this.sanitizer.bypassSecurityTrustHtml(html);
  }