import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Services } from '../../components/landing/services/services';
import { SystemsCarousel } from '../../components/landing/systems-carousel/systems-carousel';
import { Technology } from '../../components/landing/technology/technology';
import { Contact } from '../../components/landing/contact/contact';
import { WhyAbtech } from '../../components/landing/why-abtech/why-abtech';
import { Chatbot } from '../../components/landing/chatbot/chatbot';
import { InteractiveGrid } from '../../components/landing/interactive-grid/interactive-grid';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Services, SystemsCarousel, Technology, Contact, WhyAbtech, Chatbot, InteractiveGrid, TranslateModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
