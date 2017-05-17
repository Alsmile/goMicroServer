import {Component, AfterViewChecked, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router, ActivatedRoute} from "@angular/router";
import {StoreService} from 'le5le-store';
import {NoticeService} from "le5le-components";

import {SitesService} from "../sites.service";

@Component({
  selector: 'sites-apis-list',
  templateUrl: "list.component.html"
})
export class SitesApisListComponent{
  loading: boolean = true;
  id: string;
  user: any;
  site: any = {};
  treeStyle: any = {};
  tree: any = {
    edited: [],
    found: [],
    showEdited: true,
    showFound: false,
    activeEdited: true,
    activeFound: false,
    selected: {}
  };
  pageIndex: number = 1;
  pageCount: number = 100;
  saving: boolean;
  constructor(private _sitesService: SitesService, private _storeService: StoreService,
              private _router: Router, private _activateRoute: ActivatedRoute) {
    this.user = _storeService.get('user');

    this.treeStyle = {
      overflow: 'auto',
      height: (document.documentElement.clientHeight - 159) + 'px'
    };
  }

  async ngOnInit(): Promise<any> {
    this.loading = true;
    this.id = this._activateRoute.snapshot.queryParams['id'];
    if (!this.id) return this.loading = false;

    this.site = await this._sitesService.GetSite({id: this.id});
    this.tree.edited = await this._sitesService.GetApiList({siteId: this.id, pageIndex: this.pageIndex, pageCount: this.pageCount});
    if (this.tree.edited.length > 0) {
      await this.onSelectEdited(this.tree.edited[0]);
    }
    this.loading = false;
  }

  async onSelectEdited(item: any): Promise<any> {
    this.tree.selected = await this._sitesService.GetApi({id: item.id});
  }

  onTreeShowEdited(item: any) {
    this.tree.showEdited = !this.tree.showEdited;
    this.tree.activeEdited = true;
    this.tree.activeFound = false;
  }

  onTreeShowFound(item: any) {
    this.tree.showFound = !this.tree.showFound;
    this.tree.activeEdited = false;
    this.tree.activeFound = true;
  }

  onAdd() {
    let _noticeService: NoticeService = new NoticeService();
    _noticeService.input({
      title: '添加自定义API',
      text: '',
      placeholder: '请输入名称',
      required: true,
      callback: async (retText: any): Promise<void> => {
        let api: any = {
          owner: this.user,
          editor: this.user,
          site: {
            id: this.site.id,
            proxyKey: this.site.proxyKey
          },
          name: retText
        };
        let ret = await this._sitesService.SaveApi(api);
        if (!ret.id) return;

        api.id = ret.id;
        api.active = true;
        this.tree.selected = api;
        this.tree.edited.push(api);
      }
    });
  }

  onSaveMock(item) {
    if (item.isEdit) return;
    this.onSaveApi();
  }

  async onSaveApi(): Promise<any> {
    this.saving = true;
    this.tree.selected.editor = this.user;
    let ret = await this._sitesService.SaveApi(this.tree.selected);
    this.saving = false;
    if (!ret.id) return;
    this.tree.selected.isEdit=false;
  }
}
