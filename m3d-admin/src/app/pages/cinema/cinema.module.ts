import { NgModule } from '@angular/core';
import { VideoPlayerComponent } from '../../@theme/components/video-player/video-player.component';

import { ThemeModule } from '../../@theme/theme.module';
import { PlayerComponent } from '../../@theme/components/player/player.component';
import { CinemaRoutingModule } from './cinema-routing.module';
import { CinemaComponent } from './cinema.component';
import { NotFoundComponent } from './not-found/not-found.component';

import {
  NbSidebarModule,
  NbLayoutModule,
  NbActionsModule,
  NbUserModule,
  NbIconModule,
  NbButtonModule,
  NbCardModule

  // NbIconLibraries,
} from '@nebular/theme';

@NgModule({
  imports: [
    NbIconModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,

    // NbIconLibraries,

    ThemeModule,
    NbCardModule,
    NbButtonModule,
    CinemaRoutingModule,
  ],
  declarations: [
    PlayerComponent,
    CinemaComponent,
    NotFoundComponent,
    VideoPlayerComponent,
  ],
})
export class CinemaModule { }
