import { ArticleService } from './../service/article.service';

import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, Validators } from '@angular/forms';
import { IArticle } from './article';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public articles = [] as any;

  modalRef?: BsModalRef;

  public titleModale = 'Modifier un Article';

  public btnTitle = 'Modifier';

  public selectedArticle = <IArticle>{};

  public title = new FormControl('',Validators.required);
  public description = new FormControl('', Validators.required);

  public showError = false;

  public totalItems = 0;

  public itemsPerPage = 0;

  public currentPage = 1;
  public page?: number;

  constructor(private service:ArticleService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getList();
  }

  openModal(template: TemplateRef<any>, article: IArticle) {
    this.modalRef = this.modalService.show(template);
    this.selectedArticle = article;
    this.title.setValue(article.title);
    this.description.setValue(article.description);
  }

  getList() {
    this.service.list()
      .subscribe((response) => {
        this.articles = response
        this.currentPage = this.articles.meta.current_page;
        this.totalItems = this.articles.meta.total;
        this.itemsPerPage = this.articles.meta.per_page;
      } );
  }

  updateArticle(article: IArticle) {
    this.service.update(article).
    subscribe(response => this.getList());
  }
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.paginate(this.page);

  }

  paginate(page: number) {
    this.service.paginate(page).subscribe(response => {
       this.articles = response;
       this.currentPage = this.articles.meta.current_page;
      })
  }

  save() {
     if(!this.title.value || !this.description.value) {
      this.showError = true;
      return;
    }
    this.selectedArticle.title = this.title.value;
    this.selectedArticle.description = this.description.value;
    console.log(this.selectedArticle);

    this.service.update(this.selectedArticle).
    subscribe((response ) => {
      this.reset();
      this.getList();
      this.showError = false;
      this.modalRef?.hide();
    });
  }

  reset() {
    this.title.reset();
    this.description.reset();
  }

}
