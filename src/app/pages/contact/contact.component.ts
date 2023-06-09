import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { contact, cruzLogosBlack } from "src/app/shared/ImageReferences";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { selectPageStatus } from "src/app/store/shared/loading/loading.selector";
import { ContactService } from "src/app/shared/services/contact.service";
import { BehaviorSubject, debounceTime, fromEvent, Observable } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { HeaderService } from "src/app/shared/services/header.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit, AfterViewInit {
  constructor(
    private store: Store,
    private contactService: ContactService,
    private fb: FormBuilder
  ) {}

  faLinkedin: IconDefinition = faLinkedin;
  faGithub: IconDefinition = faGithub;
  faMessage: IconDefinition = faMessage;

  backgroundColor: string = "white";
  imageSrc: string = cruzLogosBlack;
  linkColor: string = "black";
  menu: string = "black";
  boxShadow: boolean = true;
  contactImage: string = contact;

  loading$ = this.store.select(selectPageStatus);

  formSent: boolean = false;

  emailIcon: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild("header") header: ElementRef;
  @ViewChild("inboxIcon") inboxIcon: ElementRef;

  inboxReturn(inboxIcon: ElementRef) {
    return fromEvent(inboxIcon.nativeElement, "click");
  }

  sendEmail(event: Event): void {}
  delay: any;

  activeMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  contactForm = this.fb.group({
    name: ["", Validators.required],
    email: [
      "",
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ],
    ],
    subject: ["", Validators.required],
    inquiry: ["", Validators.required],
  });

  //getting the values from the form for form controls

  get name() {
    return this.contactForm.get("name");
  }

  get email() {
    return this.contactForm.get("email");
  }

  get subject() {
    return this.contactForm.get("subject");
  }

  get inquiry() {
    return this.contactForm.get("inquiry");
  }

  submitForm(event: Event): void {
    if (this.contactForm.status === "INVALID")
      return alert("Fields are empty, please try again");
    this.contactService.submitContactForm(event);
    this.contactForm.reset();
    this.formSent = true;
  }

  ngAfterViewInit() {
    const obs: Observable<any> = this.inboxReturn(this.inboxIcon);
    this.delay = obs.pipe(debounceTime(250)).subscribe(() => {
      this.activeMail.next(true);
      setTimeout(() => {
        this.activeMail.next(false);
      }, 1000);
    });
  }

  ngOnInit(): void {}
}
