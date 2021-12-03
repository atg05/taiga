/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { animate, query, state, style, transition, trigger, group, AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Project, Milestone } from '@taiga/data';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

const collapseMenuAnimation = '200ms ease-out';
const openMenuAnimation = '200ms ease-in';
const menuWidth = '200px';
const collapseMenuWidth = '48px';
const settingsMenuAnimation = '300ms ease-in-out';
const translateMenuSelector = '.main-nav-container-inner';

interface ProjectMenuDialog {
  hover: boolean;
  open: boolean;
  link: string;
  type: string;
  top: number;
  left: number;
  text: string;
  height: number;
  mainLinkHeight: number;
  children: {
    text: string;
    link: string[];
  }[];
}

@Component({
  selector: 'tg-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
  animations: [
    trigger('openCollapse', [
      state('collapsed', style({
        inlineSize: collapseMenuWidth,
      })),
      state('open, open-settings', style({
        inlineSize: menuWidth,
      })),
      transition('open => collapsed', [
        query('[data-animation="text"]', style({ opacity: 1 })),
        query('[data-animation="text"]', animate(100, style({ opacity: 0 }))),
        animate(collapseMenuAnimation),
      ]),
      transition('collapsed => open', [
        query(':self', animate(openMenuAnimation)),
      ]),
      transition('open <=> open-settings', [
        query(translateMenuSelector, [
          animate(settingsMenuAnimation, style({
            transform: 'translateX({{ horizontalTranslate }})',
          })),
        ]),
      ]),
      transition('collapsed => open-settings', [
        group([
          animate(settingsMenuAnimation, style({ inlineSize: menuWidth })),
          query(translateMenuSelector, [
            animate(settingsMenuAnimation, style({
              transform: 'translateX({{ horizontalTranslate }})',
            })),
          ]),
        ])
      ]),
      transition('open-settings => collapsed', [
        group([
          query(translateMenuSelector, [
            style({
              transform: `translateX(-${collapseMenuWidth})`,
            }),
          ]),
          animate(settingsMenuAnimation, style({ inlineSize: collapseMenuWidth })),
          query(translateMenuSelector, [
            animate(settingsMenuAnimation, style({
              transform: 'translateX({{ horizontalTranslate }})',
            })),
          ]),
        ])
      ]),
    ]),
    trigger('mainNavContainer', [
      state('open', style({
        transform: 'translateX(0)',
      })),
      state('closed', style({
        transform: 'translateX(0)',
      })),
      state('open-settings', style({
        transform: 'translateX({{ horizontalTranslate }})',
      }), {
        params: {
          horizontalTranslate: '0%',
        }
      }),
    ])
  ],
})
export class ProjectNavigationComponent implements OnInit {

  public collapseText = true;
  public scrumChildMenuVisible = false;

  @Input()
  public project!: Project;

  @HostBinding('class.collapsed')
  public collapsed = false;

  @HostBinding('@openCollapse') public get menuState() {
    let value: string;
    let horizontalTranslate = '0%';

    if (this.showProjectSettings) {
      value = 'open-settings';
      horizontalTranslate = this.collapsed ? `-${collapseMenuWidth}` : '-50%';
    } else {
      value = this.collapsed ? 'collapsed' : 'open';
    }

    return {
      value,
      params: {
        horizontalTranslate
      }
    };
  }

  @ViewChild('backlogSubmenu', { static: false }) public backlogSubmenuEl!: ElementRef;

  @ViewChild('backlogButton', { static: false }) public backlogButtonElement!: ElementRef;

  @ViewChild('projectSettingButton', { static: false }) public  projectSettingButton!: ElementRef;

  public backlogHTMLElement!: HTMLElement;

  public dialog: ProjectMenuDialog = {
    open: false,
    hover: false,
    mainLinkHeight: 0,
    type: '',
    link: '',
    top: 0,
    left: 0,
    text: '',
    height: 0,
    children: [],
  };

  public showProjectSettings = false;
  public settingsAnimationInProgress = false;
  public animationEvents$ = new Subject<AnimationEvent>();

  private dialogCloseTimeout?: ReturnType<typeof setTimeout>;

  @HostListener('@openCollapse.start', ['$event'])
  public captureStartEvent($event: AnimationEvent) {
    this.animationEvents$.next($event);
    this.settingsAnimationInProgress = true;
  }

  @HostListener('@openCollapse.done', [ '$event' ])
  public captureDoneEvent($event: AnimationEvent) {
    this.animationEvents$.next($event);

    this.settingsAnimationInProgress = false;

    if ($event.fromState === 'open-settings') {
      (this.projectSettingButton.nativeElement as HTMLElement).focus();
    }
  }

  constructor(
    private localStorage: LocalStorageService,
    private readonly cd: ChangeDetectorRef,
    private router: Router
  ) {}

  public ngOnInit() {
    this.collapsed = !!this.localStorage.get('projectnav-collapsed');
    this.showProjectSettings = this.router.isActive(
      this.router.createUrlTree(['project', this.project.slug, 'settings']),
      {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      }
    );
  }

  public get milestones(): Milestone[] {
    return this.project.milestones.filter((milestone) => !milestone.closed).reverse().slice(0, 7);
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.localStorage.set('projectnav-collapsed', this.collapsed);

    if (this.collapsed) {
      this.scrumChildMenuVisible = false;
    }
  }

  public getCollapseIcon() {
    const url = 'assets/icons/sprite.svg';
    const icon = this.collapsed ? 'collapse-right' : 'collapse-left';
    return `${url}#${icon}`;
  }

  public toggleScrumChildMenu() {
    if(this.collapsed) {
      (this.backlogSubmenuEl.nativeElement as HTMLElement).focus();
    } else {
      this.scrumChildMenuVisible = !this.scrumChildMenuVisible;
    }
  }

  public popup(event: MouseEvent | FocusEvent, type: string) {
    if (!this.collapsed) {
      return;
    }

    this.dialog.type = type;
    this.initDialog(event.target as HTMLElement, type);
  }

  public popupScrum(event: MouseEvent | FocusEvent) {
    if (!this.collapsed) {
      return;
    }

    // TODO WHEN REAL DATA
    // const children: ProjectMenuDialog['children'] = this.milestones.map((milestone) => {
    //   return {
    //     text: milestone.name,
    //     link: ['http://taiga.io']
    //   };
    // });

    // children.unshift({
    //   text: this.translocoService.translate('common.backlog'),
    //   link: ['http://taiga.io']
    // });

    this.initDialog(event.target as HTMLElement, 'scrum', /* children */);
  }

  public initDialog(el: HTMLElement, type: string, children: ProjectMenuDialog['children'] = []) {

    if (this.dialogCloseTimeout) {
      clearTimeout(this.dialogCloseTimeout);
    }

    const text = el.getAttribute('data-text');

    if (text) {
      const navigationBarWidth = 48;

      if (type !== 'scrum' && el.querySelector('a')) {
        this.dialog.link = el.querySelector('a')!.getAttribute('href') ?? '';
      }
      this.dialog.hover = false;
      this.dialog.mainLinkHeight = type === 'project' ? (el.closest('.workspace') as HTMLElement).offsetHeight : el.offsetHeight;
      this.dialog.top = type === 'project' ? (el.closest('.workspace') as HTMLElement).offsetTop : el.offsetTop;
      this.dialog.open = true;
      this.dialog.text = text;
      this.dialog.children = children;
      this.dialog.type = type;
      this.dialog.left = navigationBarWidth;
    }
  }

  public enterDialog() {
    this.dialog.open = true;
    this.dialog.hover = true;
  }

  public out() {
    this.dialogCloseTimeout = setTimeout(() => {
      if (!this.dialog.hover) {
        this.dialog.open = false;
        this.dialog.type = '';
        this.cd.detectChanges();
      }
    }, 100);
  }

  public outDialog(focus?: string) {
    this.dialog.hover = false;
    if (focus === 'backlog') {
      (this.backlogButtonElement.nativeElement as HTMLElement).focus();
    }
    this.out();
  }

  public openSettings() {
    this.showProjectSettings = true;
    this.dialog.open = false;
    this.dialog.type = '';
    void this.router.navigate(['project', this.project.slug, 'settings', 'project']);
  }

  public closeMenu() {
    this.showProjectSettings = false;
  }
}
