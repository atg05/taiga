import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContextNotificationModule } from '@taiga/ui/context-notification/context-notification.module';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TuiLinkModule } from '@taiga-ui/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'tg-undo',
  standalone: true,
  imports: [CommonModule, ContextNotificationModule, TuiLinkModule],
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('undoDone', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)',
        }),
        animate(
          '400ms 1s ease-out',
          style({
            opacity: 1,
            transform: 'translateX(0%)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-out',
          style({
            opacity: 0,
            transform: 'translateX(100%)',
          })
        ),
      ]),
    ]),
    trigger('showUndo', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(100%)',
        }),
        animate(
          '400ms 0.5s ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0%)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-out',
          style({
            opacity: 0,
            transform: 'translateX(0%)',
          })
        ),
      ]),
    ]),
    trigger('undoSteps', [
      state(
        'none',
        style({
          opacity: 1,
          transform: 'translateY(0%)',
        })
      ),
      state(
        'undone',
        style({
          opacity: 1,
          transform: 'translateY(0%)',
        })
      ),
      state(
        'waitUndo',
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
        })
      ),
      transition('none => waitUndo', [
        style({ opacity: 0.7 }),
        animate('0.3s 0.5s'),
      ]),
      transition('waitUndo => undone', [
        style({ opacity: 1 }),
        animate('0.3s'),
      ]),
      transition('waitUndo => none', [animate('0.3s')]),
    ]),
  ],
})
export class UndoComponent implements OnInit, OnDestroy {
  private t = inject(TranslocoService);
  private takeUntilDestroyed = takeUntilDestroyed();

  @Input({ required: true })
  public initUndo!: Observable<void>;

  @Input({ required: true })
  public msg!: string;

  @Input()
  public msgActionUndon = this.t.translate('ui_components.undo.action_undone');

  @Input()
  public msgActionUndo = this.t.translate('ui_components.undo.action_undo');

  @Output()
  public confirm = new EventEmitter<void>();

  @HostListener('window:beforeunload')
  public beforeUnload() {
    if (this.state() === 'waitUndo') {
      this.confirm.next();
    }
  }

  public state = signal('none');
  public el = inject<ElementRef<HTMLElement>>(ElementRef);
  public confirmTimeout: ReturnType<typeof setTimeout> | null = null;
  public undoneTimeout: ReturnType<typeof setTimeout> | null = null;

  public undo() {
    if (this.confirmTimeout) {
      clearTimeout(this.confirmTimeout);
    }

    this.state.set('undone');

    this.undoneTimeout = setTimeout(() => {
      this.state.set('none');
      this.confirm.emit();
    }, 4000);
  }

  public ngOnInit() {
    this.initUndo.pipe(this.takeUntilDestroyed).subscribe(() => {
      this.el.nativeElement.style.setProperty(
        '--row-height',
        `${this.el.nativeElement.offsetHeight}px`
      );

      this.state.set('waitUndo');

      this.confirmTimeout = setTimeout(() => {
        this.state.set('none');
      }, 5000);
    });
  }

  public ngOnDestroy() {
    if (this.undoneTimeout) {
      clearTimeout(this.undoneTimeout);
    }
  }
}
