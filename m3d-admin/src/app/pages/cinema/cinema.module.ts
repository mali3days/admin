import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { VideoPlayerComponent } from '../../@theme/components/video-player/video-player.component';

import { ThemeModule } from '../../@theme/theme.module';
import { CinemaRoutingModule } from './cinema-routing.module';
import { CinemaComponent } from './cinema.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    CinemaRoutingModule,
  ],
  declarations: [
    CinemaComponent,
    NotFoundComponent,
    VideoPlayerComponent,
  ],
})
export class CinemaModule { }
